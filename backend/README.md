# AgriTech — Backend Architecture & MongoDB Atlas Setup

This directory contains the standalone Node.js and Express.js REST API for the **AgriTech Smart Farming Management System**.

## 1. Environment Setup

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Configure your variables:

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/agritech?retryWrites=true&w=majority
JWT_SECRET=your_jwt_super_secret_key_here
CLIENT_URL=http://localhost:3000
```

## 2. Installation & Running

```bash
npm install
npm run dev   # for development with nodemon
npm start     # for production
```

## 3. MongoDB Atlas Configuration

1. Create a free M0 cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Under **Database Access**, create a database user with read/write permissions.
3. Under **Network Access**, whitelist `0.0.0.0/0` (or your cloud host IP).
4. Click **Connect** > **Drivers** > **Node.js** and copy the connection string into `MONGODB_URI`.

## 4. Default Accounts for Evaluation

- **Farmer Role:** `ramesh.farmer@agritech.in` (Password: `Farmer@123`)
- **Admin Role:** `admin@agritech.in` (Password: `Admin@1234`)
