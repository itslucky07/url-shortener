# URL Shortener (MERN) — Project ZIP

This archive contains a MERN (MongoDB, Express, React, Node) URL shortener.

## Steps to run locally

1. Unzip the folder.
2. Backend:
   - cd backend
   - copy `.env.example` to `.env` and update if needed
   - npm install
   - ensure MongoDB is running locally (mongod)
   - npm run dev
3. Frontend:
   - cd frontend
   - npm install
   - npm start
4. Open http://localhost:3000

Notes:
- Backend default port: 5000
- Frontend default port: 3000
- API base can be changed via REACT_APP_API_BASE environment variable if needed.
