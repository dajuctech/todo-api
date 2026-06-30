# To-Do List API

A REST API built with FastAPI, SQLAlchemy, and SQLite. Users register, authenticate with JWT, and manage their own tasks through protected endpoints. Includes a lightweight browser frontend.

## What This Project Does

The application allows a user to:

- Register an account
- Login with email and password
- Receive a JWT access token
- Create tasks
- View all their own tasks
- View one task
- Update a task
- Mark a task as completed
- Delete a task
- Search tasks by title
- Filter tasks by completed status
- Paginate task results
- Use a simple browser dashboard at `/app`

## Tech Stack

- Python
- FastAPI
- SQLAlchemy
- SQLite
- Pydantic
- Python JOSE for JWT tokens
- Passlib for password hashing
- Pytest for testing
- uv for dependency and environment management
- HTML, CSS, and JavaScript for the simple frontend

## Authentication Flow

The frontend and backend follow this flow:

```text
Register or login
      ↓
Receive JWT access token
      ↓
Frontend stores the token
      ↓
Task dashboard sends the token with API requests
      ↓
Authenticated user can manage their own tasks
```

Task routes are protected. A user must login before creating, reading, updating, completing, or deleting tasks.

## Project Structure

```text
todo-api/
  app/
    __init__.py
    auth.py
    crud.py
    database.py
    main.py
    models.py
    schemas.py
    security.py
  static/
    app.js
    index.html
    styles.css
  tests/
    conftest.py
    test_auth.py
    test_security.py
    test_tasks.py
  .gitignore
  README.md
  note.md
  prd.md
  pyproject.toml
```

## Setup

```bash
cd todo-api
uv sync
```

## Run the API

From the `todo-api` folder:

```bash
uv run uvicorn app.main:app --reload
```

Open the API root:

```text
http://127.0.0.1:8000
```

Open the interactive API documentation:

```text
http://127.0.0.1:8000/docs
```

Open the frontend dashboard:

```text
http://127.0.0.1:8000/app
```

## Run Tests

From the `todo-api` folder:

```bash
uv run pytest -v
```

Expected result:

```text
36 passed
```

## API Endpoints

| Method | Endpoint | Auth Required | Purpose |
| --- | --- | --- | --- |
| `GET` | `/` | No | Check that the API is running |
| `GET` | `/app` | No | Open the frontend dashboard |
| `POST` | `/auth/register` | No | Register a new user |
| `POST` | `/auth/login` | No | Login and receive a JWT token |
| `POST` | `/tasks` | Yes | Create a task |
| `GET` | `/tasks` | Yes | Get all tasks for the logged-in user |
| `GET` | `/tasks/{task_id}` | Yes | Get one task |
| `PUT` | `/tasks/{task_id}` | Yes | Update one task |
| `PATCH` | `/tasks/{task_id}/complete` | Yes | Mark one task as completed |
| `DELETE` | `/tasks/{task_id}` | Yes | Delete one task |

## Example Register Request

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Successful response:

```json
{
  "id": 1,
  "email": "user@example.com",
  "created_at": "2026-06-30T19:00:00"
}
```

## Example Login Request

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Successful response:

```json
{
  "access_token": "jwt-token-here",
  "token_type": "bearer"
}
```

## Example Task Request

```json
{
  "title": "Learn FastAPI",
  "description": "Build a To-Do List API with Python",
  "priority": "high",
  "due_date": "2026-07-05T18:00:00"
}
```

Allowed priority values:

```text
low
medium
high
```

If `priority` is not provided, it defaults to `medium`.

## Testing Protected Endpoints in Swagger Docs

1. Start the server.
2. Go to `http://127.0.0.1:8000/docs`.
3. Use `POST /auth/register` to create a user.
4. Use `POST /auth/login` to login.
5. Copy the `access_token` value from the login response.
6. Click the `Authorize` button in Swagger.
7. Enter the token like this:

```text
Bearer your-access-token-here
```

8. Test the `/tasks` endpoints.

## Filtering, Search, and Pagination

Get only completed tasks:

```text
GET /tasks?completed=true
```

Get only incomplete tasks:

```text
GET /tasks?completed=false
```

Search tasks by title:

```text
GET /tasks?search=python
```

Paginate tasks:

```text
GET /tasks?skip=0&limit=10
```

Combine query parameters:

```text
GET /tasks?completed=false&search=python&skip=0&limit=10
```

## Notes

- `todos.db` is the local SQLite database file — not committed to Git.
- Tests use an in-memory SQLite database so they leave no files on disk.
- `SECRET_KEY` in `security.py` must be replaced with a strong random value before any production deployment.
