# PRD: Build Your Own To-Do List API with Python

## 1. Project Summary

### Project Name

Build Your Own To-Do List API

### Project Goal

Build a beginner-friendly backend API using Python that allows a user to create, view, update, complete, and delete to-do tasks.

This project is designed for a learner who wants to understand Python backend development by building a real API step by step.

### Main Learning Outcome

By the end of this project, you should understand how Python can be used to:

- Receive HTTP requests
- Validate user input
- Store data in a database
- Read data from a database
- Return JSON responses
- Organize backend code into multiple Python files
- Test API endpoints

## 2. Target Learner

This PRD is for a beginner Python learner who already knows basic Python syntax such as:

- Variables
- Strings
- Lists
- Dictionaries
- Functions
- Classes
- Imports
- Basic command line usage
- Basic `uv` usage

You do not need to be an advanced backend developer to follow this project.

## 3. Problem Statement

People need a simple way to manage tasks they want to complete.

The API should allow a user to:

- Add a new task
- View all tasks
- View one specific task
- Update a task
- Mark a task as completed
- Delete a task

The focus of this project is not the user interface. The focus is learning how a Python backend API works.

## 4. Recommended Python Technology Stack

Use Python for the backend project.

| Tool | Purpose |
| --- | --- |
| Python 3.11+ | Main programming language |
| uv | Manages the shared Python environment, dependencies, and lock file from the main `projects/` folder |
| FastAPI | Python web framework for building APIs |
| Uvicorn | Runs the FastAPI server |
| SQLite | Simple beginner-friendly database |
| SQLAlchemy | Allows Python code to work with the database |
| Pydantic | Validates request and response data |
| Pytest | Runs automated tests |
| HTTPX | Helps test FastAPI endpoints |

## 5. Project Scope

### Version 1 Must Include

- A Python FastAPI application
- A SQLite database
- A `Task` database table
- CRUD endpoints for tasks
- Input validation
- Error handling for missing tasks
- JSON responses
- Simple automated tests
- A clear `README.md`

### Version 1 Must Not Include

- Frontend website
- User login
- User registration
- Authentication
- Task sharing
- Email reminders
- Deployment
- Docker

These can be added after the beginner version is working.

## 6. User Stories

### User Story 1: Create a Task

As a user, I want to create a task so that I can remember something I need to do.

Acceptance criteria:

- The user can send a task title
- The user can optionally send a task description
- The API creates the task
- The API returns the newly created task

### User Story 2: View All Tasks

As a user, I want to view all tasks so that I can see everything I need to do.

Acceptance criteria:

- The API returns a list of tasks
- If there are no tasks, the API returns an empty list

### User Story 3: View One Task

As a user, I want to view one task by ID so that I can see its details.

Acceptance criteria:

- If the task exists, the API returns it
- If the task does not exist, the API returns a `404` error

### User Story 4: Update a Task

As a user, I want to update a task so that I can fix or change its details.

Acceptance criteria:

- The user can update the title
- The user can update the description
- The user can update the completed status
- If the task does not exist, the API returns a `404` error

### User Story 5: Complete a Task

As a user, I want to mark a task as completed so that I know it is finished.

Acceptance criteria:

- The API changes `completed` to `true`
- The API returns the updated task

### User Story 6: Delete a Task

As a user, I want to delete a task so that I can remove tasks I no longer need.

Acceptance criteria:

- The API deletes the task
- The API returns a success message
- If the task does not exist, the API returns a `404` error

## 7. Data Model

### Task

Each task should have the following fields:

| Field | Python Type | Database Type | Required | Description |
| --- | --- | --- | --- | --- |
| `id` | `int` | Integer | Yes | Unique task ID |
| `title` | `str` | String | Yes | Task name |
| `description` | `str` | Text/String | No | Optional task details |
| `completed` | `bool` | Boolean | Yes | Shows whether the task is done |
| `created_at` | `datetime` | DateTime | Yes | When the task was created |

Example task response:

```json
{
  "id": 1,
  "title": "Learn Python FastAPI",
  "description": "Build a simple To-Do List API",
  "completed": false,
  "created_at": "2026-06-30T18:30:00"
}
```

## 8. API Requirements

### Endpoint Summary

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/` | Check that the API is running |
| `POST` | `/tasks` | Create a task |
| `GET` | `/tasks` | Get all tasks |
| `GET` | `/tasks/{task_id}` | Get one task |
| `PUT` | `/tasks/{task_id}` | Update one task |
| `PATCH` | `/tasks/{task_id}/complete` | Mark one task as completed |
| `DELETE` | `/tasks/{task_id}` | Delete one task |

### `GET /`

Purpose:

Check that the API server is running.

Expected response:

```json
{
  "message": "To-Do List API is running"
}
```

### `POST /tasks`

Purpose:

Create a new task.

Request body:

```json
{
  "title": "Study Python functions",
  "description": "Practice writing reusable functions"
}
```

Expected response:

```json
{
  "id": 1,
  "title": "Study Python functions",
  "description": "Practice writing reusable functions",
  "completed": false,
  "created_at": "2026-06-30T18:30:00"
}
```

### `GET /tasks`

Purpose:

Return all tasks.

Expected response:

```json
[
  {
    "id": 1,
    "title": "Study Python functions",
    "description": "Practice writing reusable functions",
    "completed": false,
    "created_at": "2026-06-30T18:30:00"
  }
]
```

### `GET /tasks/{task_id}`

Purpose:

Return one task by ID.

Success response:

```json
{
  "id": 1,
  "title": "Study Python functions",
  "description": "Practice writing reusable functions",
  "completed": false,
  "created_at": "2026-06-30T18:30:00"
}
```

Error response:

```json
{
  "detail": "Task not found"
}
```

### `PUT /tasks/{task_id}`

Purpose:

Update a task.

Request body:

```json
{
  "title": "Study Python classes",
  "description": "Practice creating classes and objects",
  "completed": false
}
```

Expected response:

```json
{
  "id": 1,
  "title": "Study Python classes",
  "description": "Practice creating classes and objects",
  "completed": false,
  "created_at": "2026-06-30T18:30:00"
}
```

### `PATCH /tasks/{task_id}/complete`

Purpose:

Mark a task as completed.

Expected response:

```json
{
  "id": 1,
  "title": "Study Python classes",
  "description": "Practice creating classes and objects",
  "completed": true,
  "created_at": "2026-06-30T18:30:00"
}
```

### `DELETE /tasks/{task_id}`

Purpose:

Delete a task.

Expected response:

```json
{
  "message": "Task deleted successfully"
}
```

## 9. Validation Rules

The API must validate incoming data before saving it.

Rules:

- `title` is required
- `title` must be a string
- `title` must not be empty
- `description` is optional
- `description` must be a string if provided
- `completed` must be a boolean
- A missing task must return a `404` error
- Invalid request data must return a validation error

## 10. Beginner-Friendly Project Structure

Use the main `projects/` folder as the shared Python workspace.

Main workspace path:

```text
/Users/daniel/Documents/Projects/software-engineer/masteringbackend/Become A Python Backend Engineer/projects
```

This folder should contain the shared Python environment files and all beginner backend project folders.

Create this structure:

```text
projects/
  .python-version
  .venv/
  pyproject.toml
  uv.lock
  README.md
  todo-api/
    prd.md
    app/
      __init__.py
      main.py
      database.py
      models.py
      schemas.py
      crud.py
    tests/
      test_tasks.py
    README.md
```

### File Responsibilities

| File | Purpose |
| --- | --- |
| `projects/.python-version` | Stores the Python version pinned by `uv` |
| `projects/.venv/` | Stores the shared virtual environment created by `uv` |
| `projects/pyproject.toml` | Stores shared Python dependencies managed by `uv` |
| `projects/uv.lock` | Locks exact shared dependency versions for repeatable installs |
| `projects/README.md` | Explains the shared workspace setup |
| `projects/todo-api/prd.md` | Contains this project plan |
| `projects/todo-api/app/__init__.py` | Marks `app` as a Python package |
| `projects/todo-api/app/main.py` | Creates the FastAPI app and API routes |
| `projects/todo-api/app/database.py` | Creates the SQLite database connection |
| `projects/todo-api/app/models.py` | Defines the SQLAlchemy database model |
| `projects/todo-api/app/schemas.py` | Defines Pydantic request and response schemas |
| `projects/todo-api/app/crud.py` | Contains database create, read, update, and delete functions |
| `projects/todo-api/tests/test_tasks.py` | Contains beginner API tests |
| `projects/todo-api/README.md` | Explains how to run this specific API project |

## 11. Step-by-Step Build Plan

### Step 1: Go to the Main Projects Folder

```bash
cd "/Users/daniel/Documents/Projects/software-engineer/masteringbackend/Become A Python Backend Engineer/projects"
```

Goal:

Use `projects/` as the main Python learning workspace. All Python libraries and shared environment files should live here.

### Step 2: Initialize the Shared Python Workspace with uv

```bash
uv init --bare --no-workspace
```

Goal:

Create a shared `pyproject.toml` without creating an unnecessary starter Python app in the parent folder.

After this step, your project should include:

- `pyproject.toml`

Important:

Do this in the main `projects/` folder, not inside `todo-api/`.

The `--no-workspace` flag tells `uv` to make this folder independent. Use it when `uv` reports a parent workspace discovery error.

### Step 3: Choose the Python Version

```bash
uv python pin 3.11
```

Goal:

Tell `uv` which Python version this project should use.

After this step, your project should include:

- `.python-version`

If Python 3.11 is not installed, `uv` can install it:

```bash
uv python install 3.11
```

### Step 4: Install Python Dependencies with uv

```bash
uv add fastapi uvicorn sqlalchemy pydantic
```

Install test dependencies:

```bash
uv add --dev pytest httpx
```

Goal:

Install the Python tools needed to build and test the API.

After this step, `uv` will manage:

- The shared virtual environment in the main `projects/` folder
- The shared dependencies in `projects/pyproject.toml`
- The exact locked versions in `projects/uv.lock`

The installed Python libraries will live in:

```text
projects/.venv/
```

### Step 5: Create the To-Do API Subfolder

```bash
mkdir todo-api
cd todo-api
mkdir app tests
touch app/__init__.py
touch app/main.py app/database.py app/models.py app/schemas.py app/crud.py
touch tests/test_tasks.py
touch README.md
```

Goal:

Create the `todo-api` project as a subfolder inside the shared `projects/` workspace.

### Step 6: Create a Basic FastAPI App

In `app/main.py`, create a simple FastAPI app with one route:

```text
GET /
```

Goal:

Confirm that the Python API server can start successfully.

Success check:

```bash
uv run uvicorn app.main:app --reload
```

Run this command from inside `projects/todo-api`. `uv` will use the shared project settings from the parent `projects/` folder.

Open:

```text
http://127.0.0.1:8000
```

### Step 7: Set Up the SQLite Database

In `app/database.py`, write Python code to:

- Create a SQLite database URL
- Create a SQLAlchemy engine
- Create a database session
- Create a base class for models

Goal:

Allow Python to connect to a local SQLite database file.

### Step 8: Create the Task Model

In `app/models.py`, create a SQLAlchemy `Task` model.

The model should include:

- `id`
- `title`
- `description`
- `completed`
- `created_at`

Goal:

Describe the database table using Python code.

### Step 9: Create Pydantic Schemas

In `app/schemas.py`, create:

- `TaskCreate`
- `TaskUpdate`
- `TaskResponse`

Goal:

Use Python classes to define what data the API accepts and returns.

### Step 10: Create CRUD Functions

In `app/crud.py`, create functions for:

- `create_task`
- `get_tasks`
- `get_task`
- `update_task`
- `complete_task`
- `delete_task`

Goal:

Keep database logic separate from API route logic.

### Step 11: Connect CRUD Functions to API Routes

In `app/main.py`, create the API routes and call the CRUD functions.

Routes to build:

- `GET /`
- `POST /tasks`
- `GET /tasks`
- `GET /tasks/{task_id}`
- `PUT /tasks/{task_id}`
- `PATCH /tasks/{task_id}/complete`
- `DELETE /tasks/{task_id}`

Goal:

Allow users to interact with the database through API endpoints.

### Step 12: Test the API Manually

Run the server:

```bash
uv run uvicorn app.main:app --reload
```

Run this command from inside `projects/todo-api`.

Open the FastAPI docs:

```text
http://127.0.0.1:8000/docs
```

Test each endpoint in this order:

1. `GET /`
2. `POST /tasks`
3. `GET /tasks`
4. `GET /tasks/{task_id}`
5. `PUT /tasks/{task_id}`
6. `PATCH /tasks/{task_id}/complete`
7. `DELETE /tasks/{task_id}`

Goal:

Confirm that every endpoint works before writing tests.

### Step 13: Add Automated Tests

In `tests/test_tasks.py`, write tests for:

- Creating a task
- Getting all tasks
- Getting one task
- Updating a task
- Completing a task
- Deleting a task
- Requesting a task that does not exist

Run tests:

```bash
uv run pytest
```

Goal:

Use Python tests to confirm that the API behaves correctly.

### Step 14: Write the README

In `projects/todo-api/README.md`, explain:

- What the project does
- That dependencies are managed from the parent `projects/` folder
- How to install `uv` if it is missing
- How to install dependencies from the parent `projects/` folder with `uv add`
- How to run the server from inside `todo-api` with `uv run`
- How to open the API docs
- How to run tests with `uv run pytest`

In `projects/README.md`, explain:

- This is the main Python learning workspace
- Shared dependencies live in `projects/pyproject.toml`
- The shared lock file is `projects/uv.lock`
- Installed libraries live in `projects/.venv/`
- Individual project folders, such as `todo-api/`, should be created inside this folder

Goal:

Make the project easy for another beginner to understand and run.

## 12. Python Concepts Practiced

This project should help you practice:

- Python modules and packages
- Python imports
- Functions
- Classes
- Type hints
- Dictionaries and JSON-like data
- Working with dates using `datetime`
- Error handling
- Managing Python projects with `uv`
- Installing packages with `uv add`
- Running commands with `uv run`
- Writing tests with `pytest`

## 13. Development Milestones

### Milestone 1: Server Runs

Complete when:

- `uv run uvicorn app.main:app --reload` starts successfully
- `GET /` returns a JSON message

### Milestone 2: Database Works

Complete when:

- SQLite database file is created
- `Task` table exists
- Python can create a database session

### Milestone 3: Create and Read Tasks

Complete when:

- `POST /tasks` creates a task
- `GET /tasks` returns all tasks
- `GET /tasks/{task_id}` returns one task

### Milestone 4: Update and Complete Tasks

Complete when:

- `PUT /tasks/{task_id}` updates a task
- `PATCH /tasks/{task_id}/complete` marks a task as completed

### Milestone 5: Delete Tasks

Complete when:

- `DELETE /tasks/{task_id}` deletes a task
- Missing task IDs return `404`

### Milestone 6: Tests and Documentation

Complete when:

- Basic tests pass with `uv run pytest`
- `README.md` explains how to run the project

## 14. Success Criteria

The project is successful when:

- The API runs locally
- The API is built with Python
- The project uses FastAPI
- The project stores tasks in SQLite
- The user can create a task
- The user can view all tasks
- The user can view one task
- The user can update a task
- The user can complete a task
- The user can delete a task
- The API returns useful error messages
- The code is separated into clear Python files
- The project includes beginner-friendly setup instructions

## 15. Learner Checklist

Use this checklist while building:

- [ ] I opened the main `projects/` folder
- [ ] I initialized the shared workspace with `uv init --bare --no-workspace`
- [ ] I pinned the Python version with `uv python pin 3.11`
- [ ] I installed FastAPI, Uvicorn, SQLAlchemy, and Pydantic with `uv add`
- [ ] I installed Pytest and HTTPX with `uv add --dev`
- [ ] I confirmed `projects/pyproject.toml`, `projects/uv.lock`, and `projects/.venv/` exist
- [ ] I created the `todo-api` subfolder
- [ ] I created the `todo-api` project file structure
- [ ] I created a basic FastAPI app
- [ ] I ran the API server
- [ ] I opened the API in the browser
- [ ] I connected Python to SQLite
- [ ] I created the SQLAlchemy `Task` model
- [ ] I created the Pydantic schemas
- [ ] I created the CRUD functions
- [ ] I created all API routes
- [ ] I tested the routes in Swagger UI
- [ ] I added basic automated tests
- [ ] I wrote setup instructions in `README.md`

## 16. Optional Version 2 Features

After completing Version 1, improve the project with:

- Task due dates
- Task priority: low, medium, high
- Filter tasks by completed status
- Search tasks by title
- Pagination
- User registration
- User login
- JWT authentication
- PostgreSQL database
- Docker setup
- Deployment

## 17. Final Deliverable

The final deliverable is a working Python backend API project.

The learner should be able to:

- Explain what each Python file does
- Start the server locally
- Open the API documentation
- Create and manage tasks
- Understand how FastAPI receives requests
- Understand how Python sends data to SQLite
- Understand how the API returns JSON responses
- Run basic tests using `uv run pytest`
