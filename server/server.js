const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const multer = require('multer');
const PDFParser = require('pdf2json');
const mammoth = require('mammoth');
const Groq = require('groq-sdk');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

app.use('/api/auth', require('./routes/authRoutes'));

// Root route - for Vercel deployment
app.get('/', (req, res) => {
  res.status(200).send('Server is running');
});

// Helper function to extract PDF text using pdf2json
const extractPdfText = (buffer) => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(null, 1);

    pdfParser.on("pdfParser_dataError", errData => {
      reject(errData.parserError);
    });

    pdfParser.on("pdfParser_dataReady", () => {
      try {
        const rawText = pdfParser.getRawTextContent();
        resolve(rawText);
      } catch (error) {
        reject(error);
      }
    });

    pdfParser.parseBuffer(buffer);
  });
};

app.post('/api/analyze', upload.single('resume'), async (req, res) => {
  try {
    // Check uploaded file
    if (!req.file) {
      return res.status(400).json({
        error: 'المرجو اختيار ملف CV أولاً.'
      });
    }

    // Check Groq API key
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.error('GROQ_API_KEY is missing from .env');

      return res.status(500).json({
        error: 'حدث خطأ فني أثناء التحليل. المرجو المحاولة لاحقاً.'
      });
    }

    const { jobDescription } = req.body;

    let cvText = '';

    // ================================
    // Extract CV text
    // ================================
    try {
      if (req.file.mimetype === 'application/pdf') {
        cvText = await extractPdfText(req.file.buffer);

      } else if (
        req.file.mimetype.includes('wordprocessingml') ||
        req.file.mimetype.includes('msword')
      ) {
        const result = await mammoth.extractRawText({
          buffer: req.file.buffer
        });

        cvText = result.value;

      } else {
        return res.status(400).json({
          error: 'صيغة الملف غير مدعومة. المرجو رفع PDF أو DOCX.'
        });
      }

    } catch (parseError) {
      console.error('File Parsing Error:', parseError);

      return res.status(400).json({
        error: 'تعذر قراءة الملف. المرجو التأكد من رفع ملف PDF أو Word صحيح.'
      });
    }

    // ================================
    // Validate extracted text
    // ================================
    if (!cvText || cvText.trim().length < 10) {
      return res.status(400).json({
        error: 'لم نتمكن من استخراج النص من هذا الـCV. المرجو رفع CV واضح بصيغة PDF أو DOCX.'
      });
    }

    console.log('CV text extracted successfully.');
    console.log('CV text length:', cvText.length);

    // ================================
    // Initialize Groq
    // ================================
    const groq = new Groq({
      apiKey: apiKey
    });

    // ================================
    // Prompt
    // ================================
    const prompt = `
You are an expert ATS Resume Analyzer and Career Coach.

Analyze the provided CV and compare it with the target Job Description.

IMPORTANT:
- Base your analysis ONLY on the CV content provided.
- Do not invent experience, education, skills, or achievements.
- If information is missing from the CV, mention that it is missing.
- Return a professional and useful analysis.
- Return ONLY valid JSON (no markdown, no explanation) matching EXACTLY this structure:

{
  "overallScore": <number 0-100>,
  "scoreReason": "<string>",
  "atsScore": <number 0-100>,
  "atsDetails": {
    "good": ["<string>"],
    "issues": ["<string>"],
    "recommendations": ["<string>"]
  },
  "sectionAnalysis": {
    "personalInfo": { "status": "<string>", "feedback": "<string>" },
    "summary": { "status": "<string>", "feedback": "<string>" },
    "experience": { "status": "<string>", "feedback": "<string>" },
    "education": { "status": "<string>", "feedback": "<string>" },
    "skills": { "status": "<string>", "feedback": "<string>" }
  },
  "errorsDetected": [
    { "type": "<string>", "issue": "<string>", "fix": "<string>" }
  ],
  "skillsExtracted": {
    "technical": ["<string>"],
    "soft": ["<string>"]
  },
  "recommendedServices": ["<string>"],
  "jobMatch": {
    "percentage": <number 0-100>,
    "matchedSkills": ["<string>"],
    "missingSkills": ["<string>"],
    "recommendations": ["<string>"]
  }
}

CV TEXT:
"""
${cvText}
"""

TARGET JOB DESCRIPTION:
"""
${jobDescription || 'Web Development'}
"""
`;

    // ================================
    // Groq Analysis
    // ================================
    const response = await groq.chat.completions.create({
      model: 'openai/gpt-oss-120b',

      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],

      response_format: { type: 'json_object' },
      temperature: 0.3
    });

    // ================================
    // Get response text
    // ================================
    const rawText = response.choices[0]?.message?.content;

    if (!rawText) {
      throw new Error('Groq returned an empty response.');
    }

    console.log('Groq analysis completed successfully.');

    // ================================
    // Parse JSON
    // ================================
    let analysisData;

    try {
      analysisData = JSON.parse(rawText);
    } catch (jsonError) {
      console.error('JSON Parse Error:', jsonError);
      console.error('Groq Raw Response:', rawText);

      return res.status(500).json({
        error: 'تعذر معالجة نتيجة تحليل الـCV.'
      });
    }

    // ================================
    // Return result
    // ================================
    return res.json(analysisData);

  } catch (error) {
    console.error('Groq AI Processing Error:', error);

    return res.status(500).json({
      error: 'حدث خطأ أثناء تحليل الـ CV. المرجو المحاولة مرة أخرى.'
    });
  }
});

// ================================
// Start Server
// ================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});