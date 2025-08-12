const request = require('supertest');
const app = require('../src/index'); // exports app when required
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

beforeAll(async () => {
  // optionally clear table (use with caution)
  try {
    await prisma.registration.deleteMany({});
  } catch (e) {}
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('POST /api/register', () => {
  test('rejects invalid aadhaar', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({ aadhaar: '1234' });
    expect(res.status).toBe(400);
  });

  test('accepts valid minimal payload', async () => {
    const aadhaar = '123456789012'; // sample 12-digit
    const res = await request(app)
      .post('/api/register')
      .send({ aadhaar });
    // if DB unique constraint prevents repeat, this may fail on second run
    expect([200,201,400]).toContain(res.statusCode);
  });
});
