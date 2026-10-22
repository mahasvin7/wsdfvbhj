# Deploying SOUL Radiology ERP to Render

This project is pre-configured for **Render** (both as a **Node.js Web Service** and as a **Static Site**).

---

## Method 1: Deploy as a Web Service (Recommended)

1. Push this folder to a repository on **GitHub** or **GitLab**.
2. Go to [dashboard.render.com](https://dashboard.render.com/) and click **New +** -> **Web Service**.
3. Select your repository.
4. Render will automatically detect the settings from [`render.yaml`](./render.yaml) or you can fill them in:
   - **Name:** `soul-radiology-erp`
   - **Region:** Any (e.g. *Oregon*, *Frankfurt*, *Singapore*)
   - **Branch:** `main` (or `master`)
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Health Check Path:** `/healthz`
5. Click **Create Web Service**.
6. Render will build and deploy your app. Your live URL will look like `https://soul-radiology-erp.onrender.com`.

---

## Method 2: Deploy as a Static Site (Free Forever)

Because the client application runs directly in the browser:
1. In the Render Dashboard, click **New +** -> **Static Site**.
2. Connect your repository.
3. Configure:
   - **Build Command:** *(leave empty)*
   - **Publish Directory:** `.`
4. Click **Create Static Site**.

---

## Pre-configured Files Included
- **[`server.js`](./server.js)**: Configured with `0.0.0.0` host binding, dynamic `process.env.PORT`, `/healthz` uptime endpoint, and security headers.
- **[`package.json`](./package.json)**: Contains standard `start` and `build` scripts with Node `>=18.0.0`.
- **[`render.yaml`](./render.yaml)**: Blueprint configuration for automated infrastructure setup.
- **[`.node-version`](./.node-version)**: Pins Node 20 LTS.
- **[`.gitignore`](./.gitignore)**: Prevents accidental commits of temporary logs and files.
