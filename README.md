# PrimeTrade

A full-stack task management app with secure authentication, profile management, and task tracking.

## Live Demo

- Frontend (Vercel): `https://your-frontend-url.vercel.app`
- Backend API (Render/Railway): `https://your-backend-url.com`

Update the links above with your deployed URLs.

## Features

- User registration and login with JWT authentication
- Protected routes on frontend and backend
- Profile page to update name, email, and password
- Create, read, update, and delete tasks
- Task status toggling (`pending` / `completed`)
- Task priority support (`low` / `medium` / `high`)
- Task search with debounced input
- Pagination for task list

## Tech Stack

- Frontend: React, React Router, Vite, Tailwind CSS
- Backend: Node.js, Express, MongoDB, Mongoose
- Auth: JWT + bcrypt
- Deployment: Vercel (frontend), Render/Railway (backend)

## Project Structure

```text
PrimeTrade/
|-- backend/
|   |-- src/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- middleware/
|   |   |-- models/
|   |   `-- routes/
|   |-- server.js
|   `-- package.json
|-- frontend/
|   |-- src/
|   |   |-- api/
|   |   |-- components/
|   |   |-- context/
|   |   |-- hooks/
|   |   `-- pages/
|   |-- vercel.json
|   `-- package.json
`-- README.md
```

## Local Setup

### 1. Clone and install dependencies

```bash
git clone <your-repo-url>
cd PrimeTrade

cd backend
npm install

cd ../frontend
npm install
```

### 2. Configure backend environment

Create `backend/.env`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/primetrade?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=your_super_secret_key
CORS_ORIGIN=http://localhost:5173
```

### 3. Configure frontend environment

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

### 4. Run the app

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

Then open `http://localhost:5173`.

## API Endpoints

### Auth routes

- `POST /api/user/signup`
- `POST /api/user/login`
- `GET /api/user/profile` (protected)
- `PUT /api/user/profile` (protected)
- `POST /api/user/logout` (protected)

### Task routes (all protected)

- `POST /api/tasks`
- `GET /api/tasks?page=1&limit=10&search=keyword`
- `GET /api/tasks/:id`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

### Health check

- `GET /health`

## Deployment Notes

- Frontend should set `VITE_API_URL` to your deployed backend URL.
- Backend should set:
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `CORS_ORIGIN` (your frontend deployed URL)

## Author

`Your Name`
