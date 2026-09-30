const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const multer = require('multer');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cors());

// إعداد multer لتلقي الملفات
const upload = multer({ dest: 'uploads/' });

// Routes
app.use('/api/auth', require('./routes/authRoutes'));

// 🚀 Route تحليل الـ CV الجديد
app.post('/api/analyze', upload.single('resume'), (req, res) => {
  try {
    console.log("File received:", req.file);
    console.log("Job Description:", req.body.jobDescription);

    res.json({
      matchScore: 85,
      feedback: "Your CV matches well with the Web Developer position! Strong React and Node.js background."
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to analyze CV" });
  }
});

app.get('/', (req, res) => {
  res.send('MatchMyCV API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});