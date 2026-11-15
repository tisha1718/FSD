# PARKIFY Production Cloud Deployment Guide

This guide details how to deploy PARKIFY (Program 5) with the backend on Render / Railway with managed PostgreSQL, and the frontend on Vercel.

---

## 1. Backend Deployment (Render + Managed PostgreSQL)

### Step 1.1: Create a PostgreSQL Database on Render
1. Log in to [Render](https://render.com/).
2. Click **New +** and select **PostgreSQL**.
3. Set Name to `parkify-db`.
4. Region: Choose the closest region (e.g. Oregon, Frankfurt, Singapore).
5. Plan: Free Tier.
6. Click **Create Database**.
7. Once created, copy the **Internal Database URL** (or External if hosting backend elsewhere).

### Step 1.2: Deploy Express Backend Web Service
1. In Render Dashboard, click **New +** -> **Web Service**.
2. Connect your GitHub repository containing PARKIFY.
3. Set the following configuration:
   - **Root Directory:** `program-5-fullstack/backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
4. Add **Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `DB_DIALECT`: `postgres`
   - `DATABASE_URL`: `postgres://<username>:<password>@<host>/<dbname>` *(from Step 1.1)*
   - `JWT_SECRET`: `your_random_secure_secret_key_here`
   - `JWT_EXPIRES_IN`: `7d`
5. Click **Create Web Service**.
6. The service will build, synchronize PostgreSQL tables, run seed data, and expose your backend URL (e.g. `https://parkify-backend.onrender.com`).

---

## 2. Frontend Deployment (Vercel)

### Step 2.1: Deploy Vite React Frontend
1. Log in to [Vercel](https://vercel.com/).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository.
4. Set **Root Directory** to `program-5-fullstack/frontend`.
5. Framework Preset: **Vite**.
6. Build Command: `npm run build`.
7. Output Directory: `dist`.
8. Add Environment Variable:
   - `VITE_API_URL`: `https://parkify-backend.onrender.com/api`
9. Click **Deploy**.
10. Your frontend is live with automatic SSL!

---

## 3. Production Health Check
1. Open the deployed Vercel frontend URL.
2. Sign in with pre-seeded credentials:
   - Admin: `admin@parkify.com` / `admin123`
3. Verify that locations load from PostgreSQL.
4. Test booking creation and cancellation in production.
