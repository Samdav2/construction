# Railway Deployment Guide for Cpro Hub / BuildHub

This repository is configured for automated, zero-downtime deployment on [Railway](https://railway.app).

---

## 🎯 Choose Your Deployment Architecture

You can deploy this platform on Railway using either of two architectures:

| Feature | Option 1: Dual-Service (Recommended) | Option 2: Unified Single Service |
| :--- | :--- | :--- |
| **Setup** | 2 Railway services (API + Web) | 1 Railway service (API serves Web) |
| **Scaling** | Scale frontend and backend independently | Low cost (single container RAM & CPU) |
| **Domain** | 2 URLs (e.g. `api.yoursite.com` & `yoursite.com`) | 1 URL (e.g. `yoursite.com`) |
| **CORS** | Configured via `CLIENT_URL` | Zero CORS issues (same origin) |

---

## 🚀 Option 1: Dual-Service Deployment (Recommended)

### Step 1: Create a New Project on Railway
1. Go to [railway.app](https://railway.app) and log in.
2. Click **"+ New Project"** → **"Deploy from GitHub repo"**.
3. Select your repository.

---

### Step 2: Add Database (MongoDB)
You have two choices for MongoDB:
- **Option A (MongoDB Atlas - Recommended for Production)**:
  - Create a cluster on [MongoDB Atlas](https://cloud.mongodb.com).
  - Get your connection string (e.g., `mongodb+srv://user:pass@cluster.mongodb.net/buildhub?retryWrites=true&w=majority`).
- **Option B (Railway MongoDB Plugin)**:
  - In your Railway project canvas, click **"+ Create"** → **"Database"** → **"Add MongoDB"**.
  - Railway will create a MongoDB instance and provide a `MONGO_URL` variable.

---

### Step 3: Configure Service 1 (API Backend)
1. In your Railway project, click on the deployed service (or click **"+ Create"** → **"GitHub Repo"**).
2. Go to **Settings**:
   - **Service Name**: `cprohub-api`
   - **Root Directory**: `/apps/api`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start`
   - **Healthcheck Path**: `/health`
3. Go to **Variables** tab and add the following:
   ```env
   PORT=5000
   NODE_ENV=production
   MONGO_URI=<your-mongodb-connection-string>
   JWT_SECRET=<strong-random-secret-min-32-chars>
   JWT_EXPIRES_IN=7d
   CLIENT_URL=https://<your-web-service>.up.railway.app
   FRONTEND_URL=https://<your-web-service>.up.railway.app
   BACKEND_URL=https://<your-api-service>.up.railway.app
   CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
   CLOUDINARY_API_KEY=<your-cloudinary-key>
   CLOUDINARY_API_SECRET=<your-cloudinary-secret>
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=<your-email@gmail.com>
   EMAIL_PASS=<your-app-password>
   EMAIL_FROM="Cpro Hub" <noreply@cprohub.com>
   EMAIL_SECURE=false
   GEMINI_API_KEY=<optional-gemini-key>
   SWYCHR_EMAIL=<your-swychr-merchant-email>
   SWYCHR_PASSWORD=<your-swychr-merchant-password>
   SWYCHR_WEBHOOK_SECRET=<your-swychr-secret>
   SWYCHR_ALLOW_INSECURE_TLS=false
   ```
4. Go to **Settings** → **Networking** → Click **"Generate Domain"** (e.g. `cprohub-api-production.up.railway.app`).

---

### Step 4: Configure Service 2 (Web Frontend)
1. In the same Railway project canvas, click **"+ Create"** → **"GitHub Repo"** → Select the same repository again.
2. Go to **Settings**:
   - **Service Name**: `cprohub-web`
   - **Root Directory**: `/apps/web`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start`
3. Go to **Variables** tab and add:
   ```env
   VITE_API_URL=https://<your-api-service>.up.railway.app/api/v1
   VITE_SOCKET_URL=https://<your-api-service>.up.railway.app
   ```
   *(Replace with the actual public URL generated for your API service in Step 3)*.
4. Go to **Settings** → **Networking** → Click **"Generate Domain"** (e.g. `cprohub-web-production.up.railway.app`).
5. **Important**: Copy this web domain and ensure it matches the `CLIENT_URL` variable in your API service!

---

## ⚡ Option 2: Single-Service Deployment (Unified Monorepo)

If you prefer to run both the frontend and backend inside a single Railway service:

1. Create a project from your GitHub repo.
2. Leave **Root Directory** as `/` (repository root).
3. The root `railway.json` and `package.json` will automatically build both `web` and `api`.
4. In **Variables**, add your database and backend variables (`MONGO_URI`, `JWT_SECRET`, etc.).
5. Set `CLIENT_URL` to your Railway generated domain.
6. The Express server automatically serves the compiled React SPA static assets for all non-API paths.

---

## 🔍 Verification & Health Checks

1. **API Health**:
   Open `https://<your-api-domain>/health` in your browser. You should see:
   ```json
   {
     "status": "BuildHub API Engine is healthy",
     "timestamp": "2026-09-13T..."
   }
   ```
2. **Web Application**:
   Open `https://<your-web-domain>/` in your browser.
   - Verify that the homepage and navigation render cleanly.
   - Test navigating directly to `/login`, `/dashboard`, or `/directory` (client-side routing will resolve properly without 404s).
3. **Database Connectivity**:
   - Log into the app or register an account to confirm MongoDB reads and writes succeed.

---

## 🛠️ Troubleshooting

- **CORS error in browser console**:
  Verify that `CLIENT_URL` on the API service matches the exact origin of your web service (including `https://` without a trailing slash). All `*.railway.app` domains are automatically supported by default.
- **WebSocket connection failed**:
  Make sure `VITE_SOCKET_URL` is set to the root URL of the API service (e.g. `https://your-api.up.railway.app`), NOT with `/api/v1`.
- **JWT_SECRET error on startup**:
  The API requires `JWT_SECRET` to be at least 16 characters long. Generate a strong key (e.g. `openssl rand -hex 32`).

