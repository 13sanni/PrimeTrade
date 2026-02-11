# PrimeTrade

A full-stack task management app with secure authentication, profile management, and task tracking.
##Note to scale 
This app is a good MVP and can scale with a few production upgrades:

Keep backend stateless and run multiple instances behind a load balancer.
Move JWT/session handling to secure practices (short-lived access token, refresh token flow).
Add Redis for caching hot reads (profile/tasks list) and rate limiting.
Add DB indexes for frequent queries (userId, createdAt, title, status).
Use cursor-based pagination for large task datasets.
Add async job processing (emails, heavy tasks) with a queue (BullMQ/SQS).
Add structured logging + monitoring (Winston/Pino + Grafana/Datadog/Sentry).
Add API versioning and request validation to avoid breaking clients.
Harden security: CORS allowlist, helmet, input sanitization, brute-force protection.
Add CI/CD with automated tests and staged deploys (dev/staging/prod).

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

`
