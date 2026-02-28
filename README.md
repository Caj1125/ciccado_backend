# Ciccado Bug Tracker — Backend API

REST API for a bug tracking system built with **Node.js**, **Express**, and **MongoDB**.

---

## Prerequisites

- [Node.js](https://nodejs.org/) v16+
- [MongoDB](https://www.mongodb.com/) (local install **or** a MongoDB Atlas connection string)

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the `Backend/` root (one is already provided as a template):

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/bug-tracker
JWT_SECRET=your_jwt_secret_here_change_me
JWT_EXPIRE=30d
```

| Variable | Description |
|---|---|
| `NODE_ENV` | `development` or `production` |
| `PORT` | Port the server listens on (default `5000`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key used to sign JSON Web Tokens — **change this** |
| `JWT_EXPIRE` | Token expiry duration (e.g. `30d`, `7d`, `1h`) |

### 3. Start the server

```bash
# Development (auto-restarts on file changes)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:5000`.

---

## API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Login & receive JWT | Public |
| GET | `/api/auth/me` | Get current user profile | Private |

#### Register — `POST /api/auth/register`

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "role": "tester"
}
```

#### Login — `POST /api/auth/login`

```json
{
  "email": "jane@example.com",
  "password": "password123"
}
```

Both endpoints return a JWT token in the response. Include it in subsequent requests:

```
Authorization: Bearer <token>
```

---

### Bugs

| Method | Endpoint | Description | Allowed Roles |
|--------|----------|-------------|---------------|
| POST | `/api/bugs` | Create a bug | Tester |
| GET | `/api/bugs` | List all bugs (supports filters) | Any authenticated |
| GET | `/api/bugs/:id` | Get a single bug | Any authenticated |
| PUT | `/api/bugs/:id` | Update a bug | Any authenticated |
| DELETE | `/api/bugs/:id` | Delete a bug | Admin |
| PATCH | `/api/bugs/:id/status` | Change bug status | Any authenticated |
| PATCH | `/api/bugs/:id/assign` | Assign bug to developer | Manager |
| POST | `/api/bugs/:id/comments` | Add a comment | Any authenticated |

#### Query filters for `GET /api/bugs`

| Param | Example |
|-------|---------|
| `project` | `?project=<projectId>` |
| `status` | `?status=New` |
| `severity` | `?severity=Critical` |
| `priority` | `?priority=High` |
| `assignedTo` | `?assignedTo=<userId>` |

#### Create Bug — `POST /api/bugs`

```json
{
  "title": "Login page crash",
  "description": "App crashes when clicking login with empty fields",
  "severity": "High",
  "priority": "High",
  "project": "<projectId>"
}
```

#### Change Status — `PATCH /api/bugs/:id/status`

```json
{
  "status": "In Progress"
}
```

Valid statuses: `New`, `Assigned`, `In Progress`, `Fixed`, `Testing`, `Closed`, `Reopened`

#### Assign Bug — `PATCH /api/bugs/:id/assign`

```json
{
  "assignedTo": "<userId>"
}
```

---

### Projects

| Method | Endpoint | Description | Allowed Roles |
|--------|----------|-------------|---------------|
| POST | `/api/projects` | Create a project | Admin, Manager |
| GET | `/api/projects` | List all projects | Any authenticated |
| GET | `/api/projects/:id` | Get a single project | Any authenticated |
| PUT | `/api/projects/:id` | Update a project | Admin, Manager |

#### Create Project — `POST /api/projects`

```json
{
  "name": "Ciccado Frontend",
  "description": "React frontend for the bug tracker",
  "members": ["<userId1>", "<userId2>"]
}
```

---

### Users (Admin only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List all users |
| GET | `/api/users/:id` | Get user by ID |
| PUT | `/api/users/:id/role` | Update user role |
| DELETE | `/api/users/:id` | Delete a user |

#### Update Role — `PUT /api/users/:id/role`

```json
{
  "role": "developer"
}
```

Valid roles: `admin`, `manager`, `developer`, `tester`

---

## Role-Based Access Control

| Action | Allowed Role(s) |
|--------|-----------------|
| Create Bug | Tester |
| Assign Bug | Manager |
| Change Status to Fixed | Developer* |
| Close Bug | Tester* |
| Delete Bug | Admin |
| Create / Update Project | Admin, Manager |
| Manage Users | Admin |

*Status change enforcement can be extended in the controller logic.

---

## Project Structure

```
Backend/
├── server.js                    # Entry point
├── .env                         # Environment variables
├── package.json
│
└── src/
    ├── app.js                   # Express app config & route mounting
    ├── config/
    │   └── db.js                # MongoDB connection
    ├── models/
    │   ├── User.js
    │   ├── Project.js
    │   ├── Bug.js
    │   └── Comment.js
    ├── controllers/
    │   ├── authController.js
    │   ├── bugController.js
    │   ├── projectController.js
    │   └── userController.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── bugRoutes.js
    │   ├── projectRoutes.js
    │   └── userRoutes.js
    ├── middlewares/
    │   ├── authMiddleware.js    # JWT verification
    │   ├── roleMiddleware.js    # Role-based authorization
    │   └── errorMiddleware.js   # 404 & global error handler
    ├── services/
    │   └── notificationService.js
    └── utils/
        └── constants.js         # Enums for roles, severity, priority, status
```

---

## License

ISC
