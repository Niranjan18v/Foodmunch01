# FoodMunch Full-Stack Deployment Guide

This guide details how to deploy the **FoodMunch** full-stack application (Vite React frontend, Express backend, and MongoDB database) using free hosting platforms.

---

## Part 1: Set Up MongoDB Atlas (Database)
Since the app currently runs on a local JSON file database fallback, you need a cloud-hosted MongoDB instance for production.

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.
2. Create a new project and build a **Shared Cluster (Free Tier)**.
3. Choose your provider (e.g., AWS) and region, then click **Create Cluster**.
4. In the **Security Quickstart**:
   - Create a database user (remember the username and password).
   - Under **IP Access List**, add `0.0.0.0/0` (allows connection from your hosting platform).
5. Once the cluster is ready, click **Connect** -> **Connect your application**.
6. Copy the **Connection String (SRV)**. It will look like this:
   `mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority`
   *(Replace `<username>` and `<password>` with the database user details you created).*

---

## Part 2: Deploy the Backend (on Render)
[Render](https://render.com) is a great free hosting provider for Node.js backend services.

1. Create a free account on [Render](https://render.com) and link your GitHub account.
2. Click **New +** and select **Web Service**.
3. Choose the repository `Foodmunch01` from the list.
4. Set the following service details:
   - **Name**: `foodmunch-backend`
   - **Environment**: `Node`
   - **Region**: Choose one closest to you (e.g., Singapore or US East)
   - **Root Directory**: `backend` (Important! This directs Render to run inside the backend folder)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start` (or `node server.js` depending on your `package.json` script)
5. Scroll down to **Advanced** -> **Environment Variables** and add:
   - `PORT`: `5000`
   - `MONGO_URI`: *Your MongoDB Atlas Connection String from Part 1*
   - `JWT_SECRET`: *A secure random string (e.g., `myfoodmunchsecretkey12345`)*
6. Click **Create Web Service**.
7. Once successfully deployed, Render will provide you with a live URL (e.g., `https://foodmunch-backend.onrender.com`). **Copy this URL**.

---

## Part 3: Deploy the Frontend (on Vercel)
[Vercel](https://vercel.com) is the best platform to host Vite React frontends.

1. Sign up/Log in to [Vercel](https://vercel.com) using your GitHub account.
2. Click **Add New** -> **Project**.
3. Import the `Foodmunch01` repository.
4. Configure the Project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend` (Important! This directs Vercel to build the frontend folder)
5. Expand **Environment Variables** and add:
   - `VITE_API_URL`: *Your Render Backend URL from Part 2 + `/api`* (e.g., `https://foodmunch-backend.onrender.com/api`)
6. Click **Deploy**.
7. In a few seconds, your frontend will be live and Vercel will give you a domain link!

---

## Local Verification
Your local code has been configured to dynamically point to the correct URLs. 
- In development, it automatically uses `http://localhost:5000/api`.
- In production (Vercel), it will read `VITE_API_URL` and connect to the deployed Render backend.
