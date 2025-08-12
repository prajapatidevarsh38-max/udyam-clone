# Udyam Registration Clone

Stack
- Frontend: React (Vite)
- Backend: Node.js + Express + Prisma (Postgres)
- Scraper: Puppeteer
- Tests: Jest + Supertest
- Docker: docker-compose (Postgres + backend + optional frontend)

## Quick setup (local)

Prereqs: Node 18+, npm, Docker (optional)

1. Clone repo locally (you already have files)

2. Start Postgres (Docker recommended)
   - `docker compose -f docker/docker-compose.yml up -d`
   This starts a postgres DB at `postgres://postgres:postgres@localhost:5432/udyam`

3. Backend
   ```
   cd backend
   npm install
   cp .env.example .env
   # update .env if needed (DATABASE_URL)
   npx prisma generate
   npx prisma migrate dev --name init
   npm run dev
   ```
   Backend runs at http://localhost:5000

4. Frontend
   ```
   cd frontend
   npm install
   npm run dev
   ```
   Frontend runs at http://localhost:5173 (Vite default)

5. Scraper (optional)
   ```
   cd scraper
   npm install
   node index.js
   ```
   Output schema => `scraper/schema/udyam_fields.json`

6. Tests
   - Backend tests:
     ```
     cd backend
     npm test
     ```

## Deploy
- Frontend: Vercel/Netlify (set VITE_API_URL env to backend)
- Backend: Railway/Heroku (set DATABASE_URL env, run migrations)

## Notes
- Use dummy Aadhaar/PAN values for testing. Do not store real sensitive data.
- OTP flow simulated locally — this scaffold does not call any external OTP provider.
