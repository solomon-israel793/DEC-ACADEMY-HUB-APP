# Setup Guide — Dec Academic CBT Hub

This guide takes you from zero to a live, working app — including a path that lets you manage the whole thing from your phone afterward. No coding experience assumed.

---

## Part A — Get a free database (MongoDB Atlas)

You need somewhere for courses, questions, and results to live. MongoDB Atlas has a free tier that's more than enough to start.

1. Go to https://www.mongodb.com/cloud/atlas/register and create a free account.
2. Create a new **free (M0) cluster** — any cloud provider/region is fine.
3. Under **Database Access**, create a database user with a username and password (save these).
4. Under **Network Access**, click **Add IP Address** → **Allow Access From Anywhere** (`0.0.0.0/0`). This is what makes it manageable from your phone or any deploy platform later.
5. Click **Connect** → **Drivers** → copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/dec_cbt_hub
   ```
   Replace `<username>` and `<password>` with what you set in step 3, and make sure `dec_cbt_hub` is the database name at the end.

Keep this connection string — you'll paste it into `.env` and again wherever you deploy.

---

## Part B — Run it locally on a computer (to test first)

You need [Node.js](https://nodejs.org) (version 18 or later) installed.

1. Unzip the project. Open a terminal in the `backend` folder:
   ```bash
   cd dec-cbt-hub/backend
   npm install
   ```
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` in any text editor and fill in:
   - `MONGO_URI` — the Atlas connection string from Part A
   - `JWT_SECRET` — any long random string (mash your keyboard)
   - `MASTER_ADMIN_EMAIL` / `MASTER_ADMIN_PASSWORD` — the login for your one Master Admin account
4. Create the Master Admin account (one-time):
   ```bash
   npm run seed:masteradmin
   ```
5. Start the server:
   ```bash
   npm start
   ```
   You should see `🚀 Dec Academic CBT Hub API running on port 5000`.
6. Open a browser to `http://localhost:5000` — you'll see the app. Log in with the Master Admin email/password from your `.env`.

That's your whole system running locally: backend + web/mobile frontend together, since the backend serves the frontend files directly.

---

## Part C — Deploy it so it's live on the internet (manage it from your phone)

The simplest free/cheap option is **Render** (render.com) — it deploys straight from a GitHub repo and needs no server management.

1. Put the `dec-cbt-hub` folder in a GitHub repository (GitHub has a mobile app and a web uploader if you don't want to use git commands — you can literally drag-and-drop the folder into a new repo on github.com from your phone's browser).
2. Go to https://render.com, sign up, and click **New → Web Service**.
3. Connect your GitHub repo.
4. Set:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Under **Environment**, add every variable from your `.env` file (same names, same values — use your real Atlas URI, JWT secret, and Master Admin credentials).
6. Click **Create Web Service**. Render gives you a live URL like `https://dec-cbt-hub.onrender.com` — that's your whole app, backend and frontend together.
7. Open that URL in your phone's browser once, then tap your browser's **"Add to Home Screen"** option — this installs it like a native app icon on your phone, launching full-screen without browser bars.
8. Run the Master Admin seed once against your live database — the easiest way is to temporarily set the same `.env` values locally (pointing at the same Atlas URI) and run `npm run seed:masteradmin` once from your computer. After that, everything else (creating Admins, Staff, courses, questions) can be done from the app itself, on your phone, forever.

**Managing it day-to-day from your phone after this:**
- Add/edit courses, topics, questions, and PDFs: all built into the app under each role's dashboard — no code required.
- Create Admin/Staff accounts: also built into the app (Master Admin → Create Admin; Admin → Create Staff).
- Only things that need touching outside the app: updating environment variables (rare) or checking Render/Atlas dashboards, both of which work fine in a phone browser.

---

## Part D — Adding your first content

Once logged in as Master Admin:
1. Go to **Dashboard → Courses, topics & questions**.
2. Add a course (e.g. "Mathematics"), then a topic under it (e.g. "Algebra").
3. Add questions one at a time using the form, or use **Bulk-add questions** and paste a JSON array (see `API_DOCUMENTATION.md` §5 for the exact format) — much faster for loading many questions at once.
4. Go to **Dashboard → Library uploads** to add PDF study materials per course.
5. Create Admin accounts (Master Admin only) or Staff accounts (Admin/Master Admin) from the dashboard as needed.
6. Students register themselves from the login screen — no invite needed.

---

## Troubleshooting

| Problem | Likely cause |
|---|---|
| "MongoDB connection error" on startup | `MONGO_URI` is wrong, or your Atlas Network Access doesn't allow the server's IP (use "Allow from anywhere" while testing) |
| Can't log in as Master Admin | Did you run `npm run seed:masteradmin`? It only creates the account, it doesn't happen automatically |
| Image/PDF uploads disappear after redeploying on Render | Render's free tier has an ephemeral filesystem — uploaded files don't survive a redeploy. For production, swap local disk storage for a persistent option (e.g. Cloudinary for images, or an S3-compatible bucket) — flag this to a developer when you're ready to go fully live |
| "Not authorized" errors in the app | Your login token expired (default 7 days) — just log in again |

---

## What to hand a developer later, if you ever need one

- This whole `dec-cbt-hub` folder
- Your Atlas connection string and Render (or other host) dashboard access
- `API_DOCUMENTATION.md` — everything they need to extend the backend
- The one known scaling gap: move file uploads (question images, library PDFs) from local disk to persistent cloud storage before heavy production use
