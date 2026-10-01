# Installation Guide

## Prerequisites

- Node.js and npm
- MySQL (for Prisma `DATABASE_URL` and `SHADOW_DATABASE_URL`)

---

## 1. Clone

```bash
git clone https://github.com/aju-alen/React_Journal.git
cd React_Journal
```

---

## 2. API (`api/`)

```bash
cd api
npm install
```

Copy the sample env and fill in your values:

```bash
cp sample.env .env
```

This API uses Prisma with MySQL. Ensure `DATABASE_URL` and `SHADOW_DATABASE_URL` are set in `.env`, then generate the Prisma client:

```bash
npx prisma generate
```

If you need a fresh database schema, run migrations as appropriate for your environment (`npx prisma migrate deploy` or `npx prisma migrate dev`).

Start the server with:

```bash
npm run dev
```

The API defaults to port `3001` unless `PORT` is set in `.env`.

---

## 3. Client (`client/`)

```bash
cd client
npm install
```

Copy the sample env and fill in your values:

```bash
cp sample.env .env
```

For local development, set `VITE_REACT_APP_BACKEND_URL` to your local API (for example `http://localhost:3001`).

Start the Vite dev server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

Optional production-like local serve:

```bash
npm run build
npm run preview
```

---

## 4. Typical local start order

1. Start the API (`api/` → `npm run dev`)
2. Start the client (`client/` → `npm run dev`)
