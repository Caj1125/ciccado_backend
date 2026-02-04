# Bug Management System API

A simple REST API for managing bugs/issues built with Express.js and MongoDB.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bug_management
```

3. Start the server:
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

## API Endpoints

### Health Check
- `GET /api/health` - Check if API is running

### Bugs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bugs` | Get all bugs |
| GET | `/api/bugs/:id` | Get a single bug |
| POST | `/api/bugs` | Create a new bug |
| PUT | `/api/bugs/:id` | Update a bug |
| PATCH | `/api/bugs/:id/status` | Update bug status only |
| DELETE | `/api/bugs/:id` | Delete a bug |
| GET | `/api/bugs/stats/summary` | Get bug statistics |

### Query Parameters (GET /api/bugs)
- `status` - Filter by status (open, in-progress, resolved, closed)
- `priority` - Filter by priority (low, medium, high, critical)
- `project` - Filter by project name

## Bug Schema

```json
{
  "title": "string (required)",
  "description": "string (required)",
  "status": "open | in-progress | resolved | closed",
  "priority": "low | medium | high | critical",
  "assignedTo": "string",
  "reportedBy": "string (required)",
  "project": "string",
  "tags": ["array of strings"]
}
```

## Example Requests

### Create a Bug
```bash
curl -X POST http://localhost:5000/api/bugs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Login button not working",
    "description": "Users cannot click the login button on mobile devices",
    "priority": "high",
    "reportedBy": "John Doe",
    "project": "Mobile App"
  }'
```

### Update Bug Status
```bash
curl -X PATCH http://localhost:5000/api/bugs/:id/status \
  -H "Content-Type: application/json" \
  -d '{"status": "in-progress"}'
```

### Get Bugs by Status
```bash
curl http://localhost:5000/api/bugs?status=open&priority=high
```
