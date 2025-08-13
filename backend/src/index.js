require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { registrationSchema } = require('./validators');

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

const path = require('path');

app.get('/api/schema', (req, res) => {
  res.sendFile(path.join(__dirname, '../schema/udyam_schema.json'));
});

// simple API route for health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Serve schema (if you want to serve a static schema for frontend)
app.get('/api/schema', (req, res) => {
  // Optionally, serve a cleaned schema file located in backend/schema/
  res.sendFile(require('path').resolve(__dirname, '../schema/udyam_schema.json'));
});

// Register endpoint
app.post('/api/register', async (req, res) => {
  try {
    const data = registrationSchema.parse(req.body);
    const created = await prisma.registration.create({ data });
    res.json({ success: true, id: created.id });
  } catch (err) {
    if (err?.issues) {
      // zod error
      return res.status(400).json({ errors: err.issues });
    }
    // Prisma unique constraint? etc
    return res.status(400).json({ error: err.message || String(err) });
  }
});

// Export app for tests
if (require.main === module) {
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`Backend running on port ${port}`));
} else {
  module.exports = app;
}
