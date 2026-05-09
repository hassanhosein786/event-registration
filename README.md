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

## Default Admin

Seeded automatically on server start using:

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
- Recommended Gmail settings:
  - `SMTP_HOST=smtp.gmail.com`
  - `SMTP_PORT=587`
  - `SMTP_USER=yourgmail@gmail.com`
  - `SMTP_PASS=your_google_app_password`
  - `SMTP_FROM="Event Registration <yourgmail@gmail.com>"`

## Recommended Next Step

After installing dependencies, add sample uploads and seed data if you want a demo environment.
