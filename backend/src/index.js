require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { registrationSchema } = require('./validators');

const prisma = new PrismaClient();
const app = express();
app.use(cors({
  origin: '*', // for testing; restrict later to your Vercel URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// simple API route for health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Serve schema (if you want to serve a static schema for frontend)
const udyamSchema = [
  { id: "aadhaar", label: "Aadhaar Number", type: "text", required: true, pattern: "^\\d{12}$" },
  { id: "aadhaar_otp", label: "OTP", type: "text", required: true, pattern: "^\\d{6}$" },
  { id: "pan", label: "PAN", type: "text", required: true, pattern: "^[A-Za-z]{5}[0-9]{4}[A-Za-z]$" },
  { id: "name", label: "Name of Entrepreneur", type: "text", required: true },
  { id: "email", label: "Email Address", type: "email", required: true },
  { id: "mobile", label: "Mobile Number", type: "text", required: true, pattern: "^\\d{10}$" },
  // Add any additional fields needed for Step 1 & 2
];

app.get('/api/schema', (req, res) => {
  res.json(udyamSchema);
});

// Register endpoint
app.post('/api/register', (req, res) => {
  const requiredFields = [
    'aadhaar',
    'aadhaar_otp',
    'pan',
    'name',
    'email',
    'mobile',
    'pin',
    'city',
    'state'
  ];

  // Find missing fields
  const missing = requiredFields.filter(field => !req.body[field] || req.body[field].toString().trim() === '');

  if (missing.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Missing required field(s): ${missing.join(', ')}`
    });
  }

  // Basic format checks
  if (!/^\d{12}$/.test(req.body.aadhaar)) {
    return res.status(400).json({ success: false, message: "Invalid Aadhaar format" });
  }
  if (!/^\d{6}$/.test(req.body.aadhaar_otp)) {
    return res.status(400).json({ success: false, message: "Invalid OTP format" });
  }
  if (!/^[A-Za-z]{5}[0-9]{4}[A-Za-z]$/.test(req.body.pan)) {
    return res.status(400).json({ success: false, message: "Invalid PAN format" });
  }

  // If all validations pass, save to DB (your logic here)
  // Example: 
  // db.saveRegistration(req.body).then(id => res.json({ success: true, id }));

  res.json({ success: true, id: Date.now() });
});

// Export app for tests
if (require.main === module) {
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`Backend running on port ${port}`));
} else {
  module.exports = app;
}
