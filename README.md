# AccessHub — Role-Based Access Management

AccessHub is a full-stack web application for authenticated access to user accounts and records. It demonstrates JWT-based authentication, role-based authorization, record ownership checks, and a responsive Angular interface.

## Features

### Authentication and authorization
- Login using a user ID, password, and role.
- JWT bearer-token authentication for protected API endpoints.
- Angular route guards to protect pages based on authentication state and role.
- Backend authorization is enforced independently of frontend route guards.
- Invalid or missing tokens are rejected.
- The requested role during login is checked against the user's stored role; a client cannot gain administrator access merely by changing the role in the request.

### Roles and permissions

| Capability | Administrator (`ADMIN`) | General user (`GENERAL_USER`) |
|---|---:|---:|
| Sign in | Yes | Yes |
| View users | Yes | No |
| View all records | Yes | No |
| View own active records | Yes | Yes |
| Access administrator users page | Yes | No |

General users can only access their own active records. Administrators can view all records. Protected API routes enforce these rules on the server.

### User interface
- Responsive Angular single-page application.
- Login page.
- General-user dashboard with authorized records.
- Administrator users page with user listing and search/filter controls.
- Shared authentication service and HTTP interceptor for attaching bearer tokens.

### Backend and data
- REST API built with Express and TypeScript.
- MongoDB persistence through Mongoose.
- JWT token generation and verification.
- Centralized API routes and authentication/role middleware.
- Health endpoint for basic API availability checks.

## Technology Stack

- **Frontend:** Angular, TypeScript, HTML, SCSS
- **Backend:** Node.js, Express, TypeScript
- **Database:** MongoDB / MongoDB Atlas
- **Authentication:** JSON Web Tokens (JWT)
- **Testing:** Vitest, Supertest
- **Version control:** Git and GitHub

## Project Structure

```text
accesshub/
├── README.md
├── .gitignore
├── package.json
├── client/
│   ├── public/
│   └── src/
│       ├── app/
│       │   ├── core/
│       │   │   ├── guards/
│       │   │   ├── interceptors/
│       │   │   └── services/
│       │   └── features/
│       │       ├── auth/login/
│       │       ├── dashboard/
│       │       └── admin/users/
│       └── styles.scss
└── server/
    ├── .env.example
    └── src/
        ├── app.ts
        ├── server.ts
        ├── config/
        ├── controllers/
        ├── middleware/
        ├── models/
        ├── routes/
        ├── services/
        └── tests/
```

> The exact subfolders may differ slightly as the implementation evolves.

## Prerequisites

Install:
- Node.js and npm
- A MongoDB instance, such as MongoDB Atlas
- Git

## Setup and Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/DarshanPawar07/MPloyCheck-Assignment-Accesshub.git
cd MPloyCheck-Assignment-Accesshub
```

### 2. Configure the backend

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory using `.env.example` as a template. Set your own MongoDB connection string, JWT secret, and other required environment values. Do not commit `.env` or share its secrets.

Example configuration keys (use the exact keys in `server/.env.example`):

```env
PORT=5000
CLIENT_URL=http://localhost:4200
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
```

If the example file uses a different MongoDB variable name, use the name defined there.

Start the backend in development mode:

```bash
npm run dev
```

The API is expected at `http://localhost:5000`. Health check:

```text
GET http://localhost:5000/api/health
```

### 3. Configure and run the frontend

Open another terminal:

```bash
cd client
npm install
ng serve
```

Open `http://localhost:4200`.

If Angular CLI is not installed globally, run the project's local CLI if available:

```bash
npx ng serve
```

The frontend API base URL is configured in `client/src/environments/environment.ts` (or the environment file used by this project). Ensure it points to the backend URL.

## Live Deployment

- **Frontend (Vercel):** https://m-ploy-check-assignment-accesshub.vercel.app/
- **Login page:** https://m-ploy-check-assignment-accesshub.vercel.app/login
- **Backend (Render):** https://mploycheck-assignment-accesshub.onrender.com
- **Health check:** https://mploycheck-assignment-accesshub.onrender.com/api/health

The Angular frontend is hosted on Vercel and calls the Express API hosted on Render. The backend's `CLIENT_URL` environment variable should be set to:

```text
https://m-ploy-check-assignment-accesshub.vercel.app
```

Do not include `/login` or a trailing slash in `CLIENT_URL`. The backend also requires its MongoDB connection string and a strong, private `JWT_SECRET` to be configured in Render's environment settings. Never commit production secrets to the repository.

Render free-tier services may take a short time to wake after inactivity. If the first API request is slow, wait briefly and retry.

## Seed / Demo Accounts

The development seed data used during testing included these accounts:

| User ID | Password | Role |
|---|---|---|
| `admin01` | `Admin@123` | `ADMIN` |
| `user01` | `User@123` | `GENERAL_USER` |
| `user02` | `User@123` | `GENERAL_USER` |
| `user03` | `User@123` | `GENERAL_USER` |

These are development/demo credentials only. Use them only if the corresponding seed data is present in your database. Do not use these passwords for a production deployment.

## API Overview

All routes are prefixed with `/api`.

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/health` | Public | Check API health |
| `POST` | `/auth/login` | Public | Authenticate a user and receive a JWT |
| `GET` | `/auth/me` | Authenticated | Retrieve the current authenticated user's details |
| `GET` | `/users` | `ADMIN` | List users |
| `GET` | `/users/:id` | `ADMIN` | Retrieve a user by ID |
| `POST` | `/users` | `ADMIN` | Create a user |
| `PUT` | `/users/:id` | `ADMIN` | Update a user |
| `DELETE` | `/users/:id` | `ADMIN` | Delete a user |
| `PATCH` | `/users/:id/status` | `ADMIN` | Update a user's status |
| `GET` | `/records` | Authenticated | List records permitted for the current user |
| `GET` | `/records/:id` | Authenticated | Retrieve a record only if the current user is authorized to access it |

Send the JWT with protected requests using:

```http
Authorization: Bearer <token>
```

The exact request body fields for user-management and login endpoints are defined by the implementation in the source code.

## Authorization and Security Design

- **Authentication:** the server verifies JWTs for protected endpoints.
- **Role-based access control:** administrator-only routes require the `ADMIN` role.
- **Ownership checks:** general users receive only their own active records.
- **Defense in depth:** frontend guards improve navigation, but the backend remains responsible for access decisions.
- **Role spoofing protection:** the role requested at login must match the stored user's role.
- **Secret handling:** environment secrets are kept in `.env`, which should be excluded from version control.
- **HTTP status codes:** missing/invalid authentication returns `401`; authenticated users without the required role receive `403`.

## Tests and Build Checks

Run these commands from the `server/` directory:

```bash
npm test
npm run typecheck
npm run build
```

The backend test suite was run successfully during development:

```text
Test Files  3 passed (3)
Tests       12 passed (12)
```

The Angular production build was also run successfully from `client/`:

```bash
ng build
```

Build and test results can change after code edits; rerun these checks before submitting changes.

## Assignment Requirements Checklist

| Requirement / behavior | Implementation / verification |
|---|---|
| Login and JWT-based authentication | Implemented; login and token validation manually tested |
| Protected backend endpoints | Implemented |
| Role-based access to administrator user management | Implemented; unauthenticated, general-user, and administrator cases tested |
| Record access restricted by user ownership | Implemented; general users receive their own active records |
| Administrator can view all records | Implemented |
| Client-side route protection | Implemented using Angular guards |
| Database persistence | MongoDB connection and record persistence tested |
| Error responses for missing/invalid token and insufficient role | Manually tested |
| Automated backend tests | 12 tests passed in the recorded test run |
| Backend TypeScript check and build | Passed in the recorded run |
| Frontend production build | Passed in the recorded run |
| Responsive frontend pages | Login, dashboard, and administrator users page implemented |

## Assumptions and Scope

- The app uses the role names `ADMIN` and `GENERAL_USER`.
- General users are limited to records they own and that are marked `ACTIVE`.
- Administrators can list all users and records through the protected APIs.
- The demo credentials are for local development only.
- This README documents the implemented behavior and tests performed during development. Any additional requirements in the original assignment brief should be checked against the code before final evaluation.

## Possible Future Improvements

- Add pagination and server-side search for larger user and record collections.
- Add rate limiting, audit logging, and security monitoring.
- Add automated frontend tests and end-to-end tests.
- Keep production environment variables configured in Vercel and Render, and verify the live deployment after each release.
- Add password reset and account lifecycle workflows if required by the product.

## Repository

GitHub: https://github.com/DarshanPawar07/MPloyCheck-Assignment-Accesshub
