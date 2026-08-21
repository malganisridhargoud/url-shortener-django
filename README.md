# TaskFlow — Full-Stack Task Management System

TaskFlow is a responsive task-management SaaS application. Authenticated users can create, prioritise, search, filter, update, complete, delete, and analyse their own tasks. It is built as a production-style React, Express, and MongoDB application.

## Contents

- [Features](#features)
- [Technology stack](#technology-stack)
- [Project structure](#project-structure)
- [Local setup](#local-setup)
- [Environment variables](#environment-variables)
- [Run the app](#run-the-app)
- [API reference](#api-reference)
- [Data model and security](#data-model-and-security)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Design decisions](#design-decisions)

## Features

- Account registration and sign-in using JWT authentication
- Password hashing with bcrypt before database storage
- Private user workspaces: accounts can never read or modify another account's tasks
- Full task CRUD and one-click completion
- Task title, description, status, priority, and due-date support
- Case-insensitive title search
- Status and priority filters
- Sort by due date or logical priority order
- Pagination (up to 50 tasks per page)
- Dashboard totals, completion percentage, status breakdown, and upcoming tasks
- Responsive desktop and mobile UI
- Persisted light/dark theme
- Loading, validation, empty, network, and server error states
- Centralized JSON error handling

## Technology stack

| Area | Tools |
| --- | --- |
| Frontend | React 18, Vite, CSS |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Authentication | JSON Web Tokens (JWT) |
| Password protection | bcryptjs |
| Development | Nodemon, Concurrently |
| Hosting targets | MongoDB Atlas, Render, Netlify |

## Project structure

```text
simple-crud/
├── backend/
│   ├── config/db.js                 # Database connection
│   ├── controllers/                 # Auth, tasks, analytics
│   ├── middleware/                  # JWT guard and error handling
│   ├── models/                      # User and Task schemas
│   ├── routes/                      # REST routes
│   ├── utils/token.js               # JWT generation
│   ├── app.js                       # Express configuration
│   ├── server.js                    # Server entry point
│   └── .env.example                 # Safe config template
├── frontend/
│   ├── src/services/api.js           # Centralized API client
│   ├── src/App.jsx                   # Auth, dashboard, task UI
│   ├── src/index.css                 # Responsive styles
│   ├── .env.example                 # Production frontend config template
│   └── vite.config.js               # Local API proxy configuration
├── netlify.toml                     # Netlify frontend settings
├── render.yaml                      # Render backend blueprint
└── README.md
```

## Local setup

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- npm 9+
- MongoDB Atlas account/cluster or a locally running MongoDB server

### Install dependencies

From the project root:

```bash
npm install
npm run install:all
```

### Create backend configuration

```bash
cp backend/.env.example backend/.env
```

Open `backend/.env` and set actual values. This file is ignored by Git and must never be committed.

## Environment variables

### Backend: `backend/.env`

```env
PORT=5000
MONGODB_URI=mongodb+srv://DATABASE_USER:DATABASE_PASSWORD@cluster0.example.mongodb.net/taskflow?retryWrites=true&w=majority
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:5173
```

| Name | Required | Description |
| --- | --- | --- |
| `PORT` | No | API port; `5000` is the default. |
| `MONGODB_URI` | Yes | Atlas or local MongoDB connection URI. |
| `JWT_SECRET` | Yes | Long random string for signing access tokens. |
| `CLIENT_URL` | Yes | Allowed browser origin for CORS. Multiple URLs may be comma-separated. |

For local MongoDB:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/taskflow
```

### Frontend: `frontend/.env`

No frontend environment file is required locally: Vite proxies `/api` calls to port 5000. A deployed frontend needs the following setting:

```env
VITE_API_URL=https://your-api-host.example.com
```

Only `VITE_` variables are exposed to browser code. Never include passwords, JWT secrets, or database URLs here.

## Run the app

Start both services together:

```bash
npm run dev
```

Or use separate terminals:

```bash
# Terminal 1
npm run dev --prefix backend

# Terminal 2
npm run dev --prefix frontend
```

Open [http://localhost:5173](http://localhost:5173). Check the API at [http://localhost:5000/api/health](http://localhost:5000/api/health).

The backend must print the following before the UI can load task data:

```text
MongoDB connected: ...
API listening on port 5000
```

## API reference

Protected endpoints require:

```http
Authorization: Bearer <JWT_TOKEN>
```

### Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Create an account and return a token |
| `POST` | `/api/auth/login` | Sign in and return a token |

Register request:

```json
{
  "name": "Sridhar",
  "email": "sridhar@example.com",
  "password": "password123"
}
```

Successful auth response:

```json
{
  "success": true,
  "token": "eyJ...",
  "user": { "id": "...", "name": "Sridhar", "email": "sridhar@example.com", "role": "user" }
}
```

### Tasks

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/tasks` | List the signed-in user's tasks |
| `POST` | `/api/tasks` | Create a task |
| `GET` | `/api/tasks/:id` | Read one owned task |
| `PUT` | `/api/tasks/:id` | Update one owned task |
| `DELETE` | `/api/tasks/:id` | Delete one owned task |
| `PATCH` | `/api/tasks/:id/complete` | Mark one owned task as `Done` |

Create/update body example:

```json
{
  "title": "Deploy TaskFlow",
  "description": "Deploy frontend and backend",
  "status": "In Progress",
  "priority": "High",
  "dueDate": "2026-08-30"
}
```

Allowed field values:

| Field | Accepted values |
| --- | --- |
| `status` | `Todo`, `In Progress`, `Done` |
| `priority` | `Low`, `Medium`, `High` |

### Task listing query options

```text
GET /api/tasks?search=deploy&status=Todo&priority=High&sort=dueDate&order=asc&page=1&limit=10
```

| Parameter | Description |
| --- | --- |
| `search` | Case-insensitive title search |
| `status` | Todo, In Progress, or Done |
| `priority` | Low, Medium, or High |
| `sort` | `dueDate` or `priority` |
| `order` | `asc` or `desc` |
| `page` | Page number, starts at 1 |
| `limit` | Results per page; maximum 50 |

Responses include `tasks`, `page`, `limit`, `totalPages`, and `totalTasks`. Priority ordering has an explicit rank, preventing incorrect alphabetical sorting.

### Analytics

`GET /api/analytics`

```json
{
  "success": true,
  "totalTasks": 24,
  "completedTasks": 14,
  "pendingTasks": 10,
  "completionPercentage": 58.3,
  "byStatus": { "Todo": 5, "In Progress": 5, "Done": 14 }
}
```

### Error format

```json
{ "success": false, "message": "Task not found" }
```

The API uses `400` for invalid input, `401` for unauthenticated requests, `404` for absent routes/resources, `409` for an already-registered email, and `500` for unexpected errors.

## Data model and security

### User

| Field | Details |
| --- | --- |
| `name` | Required, trimmed, max 60 characters |
| `email` | Required, unique, lowercased |
| `password` | bcrypt hash; omitted from responses |
| `role` | `user` by default; reserved for future admin features |
| timestamps | Automatically managed by Mongoose |

### Task

| Field | Details |
| --- | --- |
| `title` | Required, max 120 characters |
| `description` | Optional, max 1000 characters |
| `status` | Todo, In Progress, or Done |
| `priority` | Low, Medium, or High |
| `dueDate` | Required date |
| `user` | Required owner reference |
| timestamps | Automatically managed by Mongoose |

Security measures:

- Passwords are hashed with bcrypt using 12 salt rounds.
- JWT tokens expire after seven days.
- Authentication middleware verifies tokens and attaches the account to `req.user`.
- Every task database query scopes results to `req.user._id`; an ID alone cannot expose another user's task.
- CORS accepts only origins in `CLIENT_URL`.
- MongoDB indexes cover frequent user/filter/due-date queries.
- Secrets are not versioned; production values belong in the hosting provider's environment settings.

## Deployment

The repository includes `render.yaml` for the Express API and `netlify.toml` for the Vite build.

### MongoDB Atlas

1. Create a MongoDB Atlas cluster.
2. Add a database user under **Database Access**.
3. Add allowed network access under **Network Access**. `0.0.0.0/0` can be used temporarily for initial deployment testing.
4. Copy the Driver connection URI.

### Backend on Render

1. Push this project to GitHub.
2. In Render select **New → Blueprint**, then select the repository.
3. Render reads `render.yaml`. Set these environment variables:

   ```env
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=a-long-random-secret
   CLIENT_URL=https://your-site.netlify.app
   ```

4. Deploy, then visit `https://your-render-service.onrender.com/api/health`.

### Frontend on Netlify

1. In Netlify choose **Add new site → Import an existing project**.
2. Select the GitHub repository; `netlify.toml` provides the build configuration.
3. Set this environment variable before deploying:

   ```env
   VITE_API_URL=https://your-render-service.onrender.com
   ```

4. Deploy the site.
5. Copy the Netlify URL and set it as the backend's `CLIENT_URL` in Render. Redeploy the API after making this change.

For a Netlify URL plus a custom domain:

```env
CLIENT_URL=https://your-site.netlify.app,https://tasks.example.com
```

## Troubleshooting

### Vite proxy error: `ECONNREFUSED 127.0.0.1:5000`

The React app is running but the API is not. Start it in another terminal:

```bash
npm run dev --prefix backend
```

### `MONGODB_URI is missing`

`backend/.env` is absent or lacks the variable. Recreate it:

```bash
cp backend/.env.example backend/.env
```

### MongoDB error: `querySrv ECONNREFUSED`

Atlas cannot be reached or its SRV DNS record cannot be resolved. Confirm the cluster is running, the URI hostname is correct, and Atlas Network Access allows your IP/host. A restricted corporate or school network can also block SRV DNS; try a different network or use a standard MongoDB connection URI from Atlas.

### Atlas authentication failure

Check the database user and password in the URI. URL-encode special password characters such as `@`, `:`, `/`, `?`, and `#`. Reset any password that was exposed in a chat or commit.

### Deployed browser reports CORS errors

Set `CLIENT_URL` to the exact frontend origin, including `https://` and no trailing slash. Redeploy Render afterward.

### Deployed UI cannot reach API

Set `VITE_API_URL` on Netlify to the backend base URL, without `/api` at the end, and redeploy the frontend.

## Design decisions

- **Backend analytics:** MongoDB calculates counts, avoiding inaccurate statistics based on only the current task page in the browser.
- **Ownership in database queries:** requested task ID and user ID are always combined, which prevents accidental cross-account access.
- **Explicit priority ranking:** High/Medium/Low is used rather than alphabetical order.
- **Local proxy, deployed API URL:** Vite's proxy makes local development simple, while `VITE_API_URL` enables separate production hosting.
- **Committed configuration, private secrets:** deployment manifests are versioned for repeatable hosting; sensitive values are configured in provider dashboards.

## Scripts

| Command | Description |
| --- | --- |
| `npm run install:all` | Install frontend and backend packages |
| `npm run dev` | Start both applications |
| `npm run dev --prefix frontend` | Start only Vite frontend |
| `npm run dev --prefix backend` | Start only Express backend with Nodemon |
| `npm run build --prefix frontend` | Build optimized frontend files |
| `npm start --prefix backend` | Start backend in production mode |
