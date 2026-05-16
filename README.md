# Event Registration Management System

Full-stack MERN application for public event registrations and protected admin management.

## Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB with Mongoose
- Authentication: JWT for admins only
- PDF generation: `pdf-lib`
- Digital signatures: `react-signature-canvas`
- Tables: `@tanstack/react-table`
- Icons: `lucide-react`

## Features

- Public registration portal with no user login
- Digital signature capture
- Optional file uploads
- MongoDB persistence
- PDF generation per registration
- Optional confirmation email with PDF attachment
- Admin login and protected dashboard
- Search, filter, sort, pagination
- CSV export
- Merge PDFs export
- Print views
- QR generation for registrations
- Public verification route
- Dark mode toggle

## Folder Structure

```text
client/
  src/
    components/
    pages/
    layouts/
    hooks/
    services/
    utils/

server/
  controllers/
  routes/
  models/
  middleware/
  services/
  utils/
```

## Setup

### 1. Configure environment variables

Copy the example env files:

- `server/.env.example` to `server/.env`
- `client/.env.example` to `client/.env`

### 2. Install dependencies

```bash
cd server
npm install

cd ../client
npm install
```

### 3. Run the backend

```bash
cd server
npm run dev
```

### 4. Run the frontend

```bash
cd client
npm run dev
```

## Deploying With Vercel And Render

This app works well as a split deployment:

- Frontend: Vercel static site from `client/`
- Backend: Render web service from `server/`
- Database: MongoDB Atlas

### Frontend on Vercel

1. Import the `client` folder as a Vercel project.
2. Set the build command to `npm run build`.
3. Set the output directory to `dist`.
4. Add `client/vercel.json` is already included to support React Router routes.
5. Set `VITE_API_URL` in Vercel to your Render backend URL, for example `https://your-backend.onrender.com`.

### Backend on Render

1. Create a new Render Web Service from the `server` folder.
2. Set the start command to `npm start`.
3. Add the same environment variables used locally.
4. Set `CLIENT_URL` to your Vercel URL.
   - You can also allow local development and Vercel together with a comma-separated list:
   - `CLIENT_URL=http://localhost:5173,https://your-vercel-app.vercel.app`
5. Make sure `MONGODB_URI` points to MongoDB Atlas.

### Important deployment notes

- Render free web services spin down after 15 minutes of inactivity.
- Vercel is a good fit for the frontend, but the backend should be on a host that can keep running your Express app.
- Your backend stores generated PDFs and uploads on disk, so keep using Render or another persistent host unless you refactor file storage to an object store.

### Optional keep-awake ping

If you want to reduce cold starts on a free Render service, this repo includes a GitHub Action that pings the backend every 5 minutes.

1. Add a GitHub secret named `BACKEND_URL`.
2. Set it to your backend URL, for example `https://your-backend.onrender.com`.
3. The workflow calls `${BACKEND_URL}/api/health` on a 5-minute schedule.

File:
- [.github/workflows/ping-backend.yml](./.github/workflows/ping-backend.yml)

## Default Admin

Seeded automatically on server start using:

- Username: `admin`
- Email: `admin@admin.com`
- Password: `admin123`

## Sample Data

To load demo registrations and generate preview assets:

```bash
cd server
npm run seed:samples
```

## API Documentation

Base URL: `/api`

### Auth

- `POST /api/auth/login`
- `GET /api/auth/me`

### Registrations

- `POST /api/registrations`
- `GET /api/registrations`
- `GET /api/registrations/:id`
- `GET /api/registrations/public/:registrationId`
- `GET /api/registrations/verify/:registrationId`
- `DELETE /api/registrations/:id`

### Exports

- `GET /api/export/csv`
- `GET /api/export/pdf/merge`
- `GET /api/export/print`
- `GET /api/export/analytics`

## Notes

- Public registration does not require authentication.
- Admin endpoints are protected with JWT.
- Turnstile verification is optional and only enforced when `TURNSTILE_SECRET` is set.
- Generated files are stored under `server/public/uploads`.
- Gmail SMTP works with this app, but you must use a Google App Password instead of your normal Gmail password.
- Recommended free email option:
  - `BREVO_API_KEY=your_brevo_api_key`
  - `SMTP_FROM=Event Registration <your_verified_sender_email>`
- If you prefer SMTP fallback:
  - `SMTP_HOST=smtp-relay.brevo.com`
  - `SMTP_PORT=587`
  - `SMTP_USER=your_brevo_smtp_login`
  - `SMTP_PASS=your_brevo_smtp_password`
  - `SMTP_FROM=Event Registration <your_verified_sender_email>`

## Recommended Next Step

After installing dependencies, add sample uploads and seed data if you want a demo environment.
