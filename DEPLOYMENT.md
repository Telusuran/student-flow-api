# Deployment Guide (Free Tier - Vercel Only)

This guide walks you through deploying the **Student Flow** application for free using:
- **Frontend**: [Vercel](https://vercel.com)
- **Backend**: [Vercel](https://vercel.com) (Serverless Function)
- **Database**: [Neon](https://neon.tech) (Free Serverless Postgres)

## Prerequisites
1.  [GitHub Account](https://github.com)
2.  [Neon Account](https://neon.tech)
3.  [Vercel Account](https://vercel.com)

---

## Step 0: Push Code to GitHub
**Crucial Step**: Vercel needs your code to be on GitHub.
1.  Create a **new empty repository** on [GitHub](https://github.com/new).
2.  Run these commands in your project terminal:
    ```powershell
    git init
    git add .
    git commit -m "Initial commit"
    # Replace URL below with YOUR new GitHub repo URL
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
    git push -u origin main
    ```

---

## Step 1: Set up the Database (Neon)
1.  Log in to **Neon Console**.
2.  Create a **New Project** (e.g., `student-flow`).
3.  Copy the **Connection String** (Postgres URL).
    > Keep this safe! It looks like: `postgres://user:pass@ep-xyz.aws.neon.tech/neondb?sslmode=require`

### Initialize the Database
1.  In your local VS Code terminal, push the schema to the live database:
    ```powershell
    # Windows PowerShell
    $env:DATABASE_URL="your_neon_connection_string_here"
    cd apps/api
    npm run db:push
    ```

---

## Step 2: Deploy Backend (Vercel)
1.  Log in to **Vercel Dashboard**.
2.  Click **Add New...** -> **Project**.
3.  Import your **GitHub Repository**.
4.  **Configure Project**:
    *   **Root Directory**: Click "Edit" and select `apps/api`.
    *   **Framework Preset**: Other (or Node.js)
    *   **Build Command**: `npm run build`
    *   **Output Directory**: `dist`
5.  **Environment Variables** (Expand the section):
    *   `DATABASE_URL`: (Your Neon Connection String)
    *   `BETTER_AUTH_SECRET`: (A random string, e.g., `supersecretkey12345678901234567890`)
    *   `GEMINI_API_KEY`: (Your Google Gemini API Key)
    *   `BETTER_AUTH_URL`: `https://your-project-name.vercel.app` (You might need to deploy once to get the URL, then update this and redeploy).
    *   `FRONTEND_URL`: (Leave empty for now)
6.  Click **Deploy**.
    > **Note on File Uploads**: Vercel Serverless functions are read-only. File uploads to the local `uploads/` folder **WILL NOT WORK** on Vercel. You will need to implement cloud storage (like S3 or UploadThing) later for files to work.

---

## Step 3: Deploy Frontend (Vercel)
1.  Go back to **Vercel Dashboard**.
2.  Click **Add New...** -> **Project** (Again!).
3.  Import the **SAME GitHub Repository**.
4.  **Configure Project**:
    *   **Root Directory**: Click "Edit" and select `apps/web`.
    *   **Framework Preset**: Vite (should auto-detect).
    *   **Build Command**: `npm run build`
    *   **Output Directory**: `dist`
5.  **Environment Variables**:
    *   `VITE_API_URL`: (Paste the URL of your **Backend** project from Step 2, e.g., `https://student-flow-api.vercel.app`)
        *   *Important: No trailing slash!*
6.  Click **Deploy**.

---

## Step 4: Link Operations
1.  Get your **Frontend URL** (e.g., `https://student-flow-web.vercel.app`).
2.  Go to your **Backend Project** settings in Vercel.
3.  Update Environment Variables:
    *   `FRONTEND_URL`: `https://student-flow-web.vercel.app`
    *   `BETTER_AUTH_URL`: Ensure this matches the backend URL exactly.
4.  **Redeploy** the Backend (Deployments -> Redeploy) to apply changes.

**Done! Your app is fully deployed on Vercel.**
