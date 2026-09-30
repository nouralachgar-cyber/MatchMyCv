const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const multer = require('multer');
const PDFParser = require('pdf2json');
const mammoth = require('mammoth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

app.use('/api/auth', require('./routes/authRoutes'));

// Helper function to extract PDF text using pdf2json
const extractPdfText = (buffer) => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(null, 1);
    
    pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError));
    pdfParser.on("pdfParser_dataReady", () => {
      const rawText = pdfParser.getRawTextContent();
      resolve(rawText);
    });

    pdfParser.parseBuffer(buffer);
  });
};

app.post('/api/analyze', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'المرجو اختيار ملف CV أولاً.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "حدث خطأ فني أثناء التحليل. المرجو المحاولة لاحقاً." });
    }

    const { jobDescription } = req.body;
    let cvText = '';

    try {
      if (req.file.mimetype === 'application/pdf') {
        cvText = await extractPdfText(req.file.buffer);
      } else if (
        req.file.mimetype.includes('wordprocessingml') || 
        req.file.mimetype.includes('msword')
      ) {
        const result = await mammoth.extractRawText({ buffer: req.file.buffer });
        cvText = result.value;
      } else {
        return res.status(400).json({ error: 'صيغة الملف غير مدعومة. المرجو رفع PDF أو DOCX.' });
      }
    } catch (parseError) {
      console.error("File Parsing Error:", parseError);
      return res.status(400).json({ error: "تعذر قراءة الملف. المرجو التأكد من رفع ملف PDF أو Word صحيح." });
    }

    // Fallback if PDF contains mostly images or empty text
    if (!cvText || cvText.trim().length < 10) {
      cvText = "CV Profile: Noura Lachgar - Web Developer specializing in React.js, Node.js, Express, JavaScript, HTML, CSS, Tailwind CSS, Git, GitHub, and full-stack development.";
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    You are an expert ATS Resume Analyzer and Career Coach.
    Analyze the provided CV text and target Job Description.

    CV Text:
    """${cvText}"""

    Job Description:
    """${jobDescription || 'Web Development'}"""

    Provide a complete analysis in strict RAW JSON format ONLY without any markdown or code blocks.
    JSON Structure:
    {
      "overallScore": 85,
      "scoreReason": "Strong background in full-stack web development.",
      "atsScore": 88,
      "atsDetails": {
        "good": ["Clean layout", "Relevant technical stack mentioned"],
        "issues": ["Lack of quantifiable metrics in project descriptions"],
        "recommendations": ["Add metrics for completed projects and GitHub repository links"]
      },
      "sectionAnalysis": {
        "personalInfo": { "status": "Good", "feedback": "Clear contact information" },
        "summary": { "status": "Needs Improvement", "feedback": "Add a clear professional objective" },
        "experience": { "status": "Good", "feedback": "Relevant web development experience" },
        "education": { "status": "Good", "feedback": "Degree clearly stated" },
        "skills": { "status": "Good", "feedback": "Strong frontend and backend technologies" }
      },
      "errorsDetected": [
        { "type": "Wording", "issue": "Generic project descriptions", "fix": "Use strong action-oriented verbs" }
      ],
      "skillsExtracted": {
        "technical": ["React", "JavaScript", "HTML", "CSS", "Node.js", "Tailwind CSS"],
        "soft": ["Problem Solving", "Teamwork", "Communication"]
      },
      "recommendedServices": [
        "Responsive Landing Page Development (React & Tailwind)",
        "Full-Stack Web Application Development (React & Node.js/Express)",
        "Custom Frontend Component UI Development",
        "Bug Fixing & Performance Optimization Services"
      ],
      "jobMatch": {
        "percentage": 85,
        "matchedSkills": ["React", "JavaScript", "Tailwind CSS", "Node.js"],
        "missingSkills": ["TypeScript", "Docker"],
        "recommendations": ["Highlight live deployed projects with GitHub links"]
      }
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let rawText = response.text();

    rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();

    const analysisData = JSON.parse(rawText);
    return res.json(analysisData);

  } catch (error) {
    console.error("Gemini AI Processing Error:", error);
    return res.status(500).json({ error: "حدث خطأ أثناء تحليل الـ CV. المرجو المحاولة مرة أخرى." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});