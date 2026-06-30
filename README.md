# To-Do List API

A beginner Python backend project built with FastAPI, SQLAlchemy, SQLite, and Pydantic.

The API lets you create, read, update, complete, and delete to-do tasks.

## Project Structure

```text
todo-api/
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

## Run the API

From the `todo-api` folder:

```bash
uv run uvicorn app.main:app --reload
```

Open the API:

```text
http://127.0.0.1:8000
```

Open the interactive API docs:

```text
http://127.0.0.1:8000/docs
```

## Run Tests

From the `todo-api` folder:

```bash
uv run pytest -v
```

## Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/` | Check that the API is running |
| `POST` | `/tasks` | Create a task |
| `GET` | `/tasks` | Get all tasks |
| `GET` | `/tasks/{task_id}` | Get one task |
| `PUT` | `/tasks/{task_id}` | Update one task |
| `PATCH` | `/tasks/{task_id}/complete` | Mark one task as completed |
| `DELETE` | `/tasks/{task_id}` | Delete one task |

## Example Task JSON

```json
{
  "title": "Learn FastAPI",
  "description": "Build a simple To-Do List API"
}
```

## Notes

- The local development database is `todos.db`.
- Test data uses an in-memory SQLite database.
- Generated files such as `*.db`, `__pycache__/`, and `.pytest_cache/` are ignored by Git.
