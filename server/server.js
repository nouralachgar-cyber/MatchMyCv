const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const multer = require('multer');
const PDFParser = require('pdf2json');
const mammoth = require('mammoth');
const { GoogleGenAI, Type } = require('@google/genai');

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

    // Check Gemini API key
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error('GEMINI_API_KEY is missing from .env');

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
    // Initialize Gemini
    // ================================
    const ai = new GoogleGenAI({
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
- Return ONLY valid JSON matching the provided schema.

CV TEXT:
"""
${cvText}
"""

TARGET JOB DESCRIPTION:
"""
${jobDescription || 'Web Development'}
"""

Analyze:
1. Overall CV quality
2. ATS compatibility
3. Personal information
4. Professional summary
5. Experience
6. Education
7. Skills
8. Errors and improvements
9. Technical and soft skills
10. Recommended services
11. Job match percentage
12. Matched and missing skills
13. Recommendations
`;

    // ================================
    // Gemini Analysis
    // ================================
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',

      contents: prompt,

      config: {
        responseMimeType: 'application/json',

        responseSchema: {
          type: Type.OBJECT,

          properties: {
            overallScore: {
              type: Type.NUMBER
            },

            scoreReason: {
              type: Type.STRING
            },

            atsScore: {
              type: Type.NUMBER
            },

            atsDetails: {
              type: Type.OBJECT,

              properties: {
                good: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.STRING
                  }
                },

                issues: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.STRING
                  }
                },

                recommendations: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.STRING
                  }
                }
              },

              required: [
                'good',
                'issues',
                'recommendations'
              ]
            },

            sectionAnalysis: {
              type: Type.OBJECT,

              properties: {
                personalInfo: {
                  type: Type.OBJECT,
                  properties: {
                    status: {
                      type: Type.STRING
                    },
                    feedback: {
                      type: Type.STRING
                    }
                  },
                  required: ['status', 'feedback']
                },

                summary: {
                  type: Type.OBJECT,
                  properties: {
                    status: {
                      type: Type.STRING
                    },
                    feedback: {
                      type: Type.STRING
                    }
                  },
                  required: ['status', 'feedback']
                },

                experience: {
                  type: Type.OBJECT,
                  properties: {
                    status: {
                      type: Type.STRING
                    },
                    feedback: {
                      type: Type.STRING
                    }
                  },
                  required: ['status', 'feedback']
                },

                education: {
                  type: Type.OBJECT,
                  properties: {
                    status: {
                      type: Type.STRING
                    },
                    feedback: {
                      type: Type.STRING
                    }
                  },
                  required: ['status', 'feedback']
                },

                skills: {
                  type: Type.OBJECT,
                  properties: {
                    status: {
                      type: Type.STRING
                    },
                    feedback: {
                      type: Type.STRING
                    }
                  },
                  required: ['status', 'feedback']
                }
              },

              required: [
                'personalInfo',
                'summary',
                'experience',
                'education',
                'skills'
              ]
            },

            errorsDetected: {
              type: Type.ARRAY,

              items: {
                type: Type.OBJECT,

                properties: {
                  type: {
                    type: Type.STRING
                  },

                  issue: {
                    type: Type.STRING
                  },

                  fix: {
                    type: Type.STRING
                  }
                },

                required: [
                  'type',
                  'issue',
                  'fix'
                ]
              }
            },

            skillsExtracted: {
              type: Type.OBJECT,

              properties: {
                technical: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.STRING
                  }
                },

                soft: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.STRING
                  }
                }
              },

              required: [
                'technical',
                'soft'
              ]
            },

            recommendedServices: {
              type: Type.ARRAY,

              items: {
                type: Type.STRING
              }
            },

            jobMatch: {
              type: Type.OBJECT,

              properties: {
                percentage: {
                  type: Type.NUMBER
                },

                matchedSkills: {
                  type: Type.ARRAY,

                  items: {
                    type: Type.STRING
                  }
                },

                missingSkills: {
                  type: Type.ARRAY,

                  items: {
                    type: Type.STRING
                  }
                },

                recommendations: {
                  type: Type.ARRAY,

                  items: {
                    type: Type.STRING
                  }
                }
              },

              required: [
                'percentage',
                'matchedSkills',
                'missingSkills',
                'recommendations'
              ]
            }
          },

          required: [
            'overallScore',
            'scoreReason',
            'atsScore',
            'atsDetails',
            'sectionAnalysis',
            'errorsDetected',
            'skillsExtracted',
            'recommendedServices',
            'jobMatch'
          ]
        }
      }
    });

    // ================================
    // Get response text
    // ================================
    const rawText = response.text;

    if (!rawText) {
      throw new Error('Gemini returned an empty response.');
    }

    console.log('Gemini analysis completed successfully.');

    // ================================
    // Parse JSON
    // ================================
    let analysisData;

    try {
      analysisData = JSON.parse(rawText);
    } catch (jsonError) {
      console.error('JSON Parse Error:', jsonError);
      console.error('Gemini Raw Response:', rawText);

      return res.status(500).json({
        error: 'تعذر معالجة نتيجة تحليل الـCV.'
      });
    }

    // ================================
    // Return result
    // ================================
    return res.json(analysisData);

  } catch (error) {
    console.error('Gemini AI Processing Error:', error);

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