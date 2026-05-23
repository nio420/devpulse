# DevPulse — Issue Tracking API

> A backend REST API for internal issue tracking with role-based access control, built with Node.js, Express, TypeScript, and PostgreSQL.

---

## Live URL

```
https://localhost:5000
```

---

## Tech Stack

| Category | Technology |
|---|---|
| Runtime | Node.js (LTS) |
| Framework | Express.js |
| Language | TypeScript (strict mode) |
| Database | PostgreSQL (NeonDB / Supabase) |
| Query Method | Raw SQL via `pg` library |
| Auth | JSON Web Token (JWT) |
| Security | bcrypt (password hashing) |
| Config | dotenv, cors |

---

## Features

- User authentication — Signup & Login
- JWT-based authorization
- Role-based access control (Contributor / Maintainer)
- Create, view, update, and delete issues
- Filter & sort issues by type and status
- Reporter data attached without SQL JOIN
- Secure password hashing with bcrypt
- Strict TypeScript throughout

---

## User Roles

### Contributor
- Register and log in
- Create issues
- View all issues
- Update own issues (only when status is `open`)

### Maintainer
- Full access to all issues
- Update any issue regardless of owner
- Delete issues
- Change issue status

---

## Database Schema

### Users Table

| Field | Type | Description |
|---|---|---|
| `id` | SERIAL | Primary key |
| `name` | VARCHAR | Full name |
| `email` | VARCHAR | Unique email address |
| `password` | VARCHAR | Hashed password |
| `role` | VARCHAR | `contributor` or `maintainer` |
| `created_at` | TIMESTAMP | Auto-generated |
| `updated_at` | TIMESTAMP | Auto-updated |

### Issues Table

| Field | Type | Description |
|---|---|---|
| `id` | SERIAL | Primary key |
| `title` | VARCHAR(150) | Issue title |
| `description` | TEXT | Detailed description |
| `type` | VARCHAR | `bug` or `feature_request` |
| `status` | VARCHAR | `open`, `in_progress`, or `resolved` |
| `reporter_id` | INTEGER | Foreign key → `users.id` |
| `created_at` | TIMESTAMP | Auto-generated |
| `updated_at` | TIMESTAMP | Auto-updated |

---

## API Endpoints

### Auth Routes

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/signup` | Register a new user | Public |
| POST | `/api/auth/login` | Login and receive JWT | Public |

### Issue Routes

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/issues` | Create a new issue | Authenticated |
| GET | `/api/issues?sort=newest&type=bug&status=open` | Get all issues with filters | Authenticated |
| GET | `/api/issues/:id` | Get a single issue | Authenticated |
| PATCH | `/api/issues/:id` | Update an issue | Role-based |
| DELETE | `/api/issues/:id` | Delete an issue | Maintainer only |

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/nio420/devpulse.git
cd devpulse
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
DATABASE_URL=postgres_connection_url
JWT_SECRET=secret_key
```

### 4. Run in Development

```bash
npm run dev
```

### 5. Build for Production

```bash
npm run build
```

### 6. Start Production Server

```bash
npm start
```

---

## Authentication Flow

1. User registers via `POST /api/auth/signup`
2. User logs in via `POST /api/auth/login`
3. Server validates credentials and returns a JWT
4. Client includes the token in all subsequent requests:

```http
Authorization: <JWT_TOKEN>
```

5. Auth middleware verifies the token before granting access to protected routes

---

## Design Decisions

- **No ORM** — Raw SQL only using the `pg` library
- **No SQL JOIN** — Reporter data is attached programmatically
- **Strict TypeScript** — `any` type is not used anywhere
- **Passwords always hashed** — bcrypt used for all password storage
- **Role-based authorization** — Enforced at the middleware level

---

## Author

**DevPulse Backend System**
Built for assignment submission 🎯