def test_root_route(client):
    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {"message": "To-Do List API is running"}


def test_frontend_route(client):
    response = client.get("/app")

    assert response.status_code == 200
    assert "text/html" in response.headers["content-type"]


def test_tasks_require_authentication(client):
    response = client.get("/tasks")

    assert response.status_code == 401


def test_create_task(client, auth_headers):
    response = client.post(
        "/tasks",
        json={"title": "Buy milk", "description": "From the store"},
        headers=auth_headers,
    )

    assert response.status_code == 201

    data = response.json()
    assert data["title"] == "Buy milk"
    assert data["description"] == "From the store"
    assert data["completed"] is False
    assert data["priority"] == "medium"
    assert data["due_date"] is None
    assert data["owner_id"] > 0
    assert "id" in data
    assert "created_at" in data


def test_create_task_with_priority_and_due_date(client, auth_headers):
    response = client.post(
        "/tasks",
        json={
            "title": "Study SQLAlchemy",
            "description": "Practice model updates",
            "priority": "high",
            "due_date": "2026-07-05T18:00:00",
        },
        headers=auth_headers,
    )

    assert response.status_code == 201

    data = response.json()
    assert data["title"] == "Study SQLAlchemy"
    assert data["priority"] == "high"
    assert data["due_date"] == "2026-07-05T18:00:00"


def test_create_task_rejects_empty_title(client, auth_headers):
    response = client.post("/tasks", json={"title": ""}, headers=auth_headers)

    assert response.status_code == 422


def test_create_task_rejects_invalid_priority(client, auth_headers):
    response = client.post(
        "/tasks",
        json={"title": "Invalid priority task", "priority": "urgent"},
        headers=auth_headers,
    )

    assert response.status_code == 422


def test_get_all_tasks(client, auth_headers):
    client.post("/tasks", json={"title": "Task 1"}, headers=auth_headers)
    client.post("/tasks", json={"title": "Task 2"}, headers=auth_headers)

    response = client.get("/tasks", headers=auth_headers)

    assert response.status_code == 200
    assert len(response.json()) == 2


def test_get_one_task(client, auth_headers):
    created = client.post(
        "/tasks",
        json={"title": "Single task"},
        headers=auth_headers,
    ).json()

    response = client.get(f"/tasks/{created['id']}", headers=auth_headers)

    assert response.status_code == 200
    assert response.json()["title"] == "Single task"


def test_get_nonexistent_task(client, auth_headers):
    response = client.get("/tasks/9999", headers=auth_headers)

    assert response.status_code == 404
    assert response.json()["detail"] == "Task not found"


def test_user_cannot_get_another_users_task(client, auth_headers, second_auth_headers):
    created = client.post(
        "/tasks",
        json={"title": "Private task"},
        headers=auth_headers,
    ).json()

    response = client.get(f"/tasks/{created['id']}", headers=second_auth_headers)

    assert response.status_code == 404
    assert response.json()["detail"] == "Task not found"


def test_update_task(client, auth_headers):
    created = client.post(
        "/tasks",
        json={"title": "Old title"},
        headers=auth_headers,
    ).json()

    response = client.put(
        f"/tasks/{created['id']}",
        json={
            "title": "New title",
            "description": "Updated description",
            "priority": "low",
            "due_date": "2026-07-10T09:30:00",
        },
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.json()
    assert data["title"] == "New title"
    assert data["description"] == "Updated description"
    assert data["priority"] == "low"
    assert data["due_date"] == "2026-07-10T09:30:00"


def test_update_nonexistent_task(client, auth_headers):
    response = client.put(
        "/tasks/9999",
        json={"title": "Missing task"},
        headers=auth_headers,
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Task not found"


def test_user_cannot_update_another_users_task(client, auth_headers, second_auth_headers):
    created = client.post(
        "/tasks",
        json={"title": "Private task"},
        headers=auth_headers,
    ).json()

    response = client.put(
        f"/tasks/{created['id']}",
        json={"title": "Changed by someone else"},
        headers=second_auth_headers,
    )

    assert response.status_code == 404


def test_complete_task(client, auth_headers):
    created = client.post(
        "/tasks",
        json={"title": "Finish me"},
        headers=auth_headers,
    ).json()

    response = client.patch(f"/tasks/{created['id']}/complete", headers=auth_headers)

    assert response.status_code == 200
    assert response.json()["completed"] is True


def test_complete_nonexistent_task(client, auth_headers):
    response = client.patch("/tasks/9999/complete", headers=auth_headers)

    assert response.status_code == 404
    assert response.json()["detail"] == "Task not found"


def test_delete_task(client, auth_headers):
    created = client.post(
        "/tasks",
        json={"title": "Delete me"},
        headers=auth_headers,
    ).json()

    response = client.delete(f"/tasks/{created['id']}", headers=auth_headers)

    assert response.status_code == 204
    assert client.get(f"/tasks/{created['id']}", headers=auth_headers).status_code == 404


def test_delete_nonexistent_task(client, auth_headers):
    response = client.delete("/tasks/9999", headers=auth_headers)

    assert response.status_code == 404
    assert response.json()["detail"] == "Task not found"


def test_user_cannot_delete_another_users_task(client, auth_headers, second_auth_headers):
    created = client.post(
        "/tasks",
        json={"title": "Private task"},
        headers=auth_headers,
    ).json()

    response = client.delete(f"/tasks/{created['id']}", headers=second_auth_headers)

    assert response.status_code == 404


def test_filter_tasks_by_completed_status(client, auth_headers):
    incomplete = client.post(
        "/tasks",
        json={"title": "Incomplete task"},
        headers=auth_headers,
    ).json()
    completed = client.post(
        "/tasks",
        json={"title": "Completed task"},
        headers=auth_headers,
    ).json()
    client.patch(f"/tasks/{completed['id']}/complete", headers=auth_headers)

    incomplete_response = client.get("/tasks?completed=false", headers=auth_headers)
    completed_response = client.get("/tasks?completed=true", headers=auth_headers)

    assert incomplete_response.status_code == 200
    assert completed_response.status_code == 200
    assert [task["id"] for task in incomplete_response.json()] == [incomplete["id"]]
    assert [task["id"] for task in completed_response.json()] == [completed["id"]]


def test_search_tasks_by_title(client, auth_headers):
    client.post("/tasks", json={"title": "Learn Python"}, headers=auth_headers)
    client.post("/tasks", json={"title": "Buy groceries"}, headers=auth_headers)
    client.post("/tasks", json={"title": "Practice FastAPI"}, headers=auth_headers)

    response = client.get("/tasks?search=python", headers=auth_headers)

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["title"] == "Learn Python"


def test_paginate_tasks(client, auth_headers):
    client.post("/tasks", json={"title": "Task 1"}, headers=auth_headers)
    client.post("/tasks", json={"title": "Task 2"}, headers=auth_headers)
    client.post("/tasks", json={"title": "Task 3"}, headers=auth_headers)

    response = client.get("/tasks?skip=1&limit=1", headers=auth_headers)

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["title"] == "Task 2"


def test_reject_invalid_pagination(client, auth_headers):
    response = client.get("/tasks?skip=-1&limit=0", headers=auth_headers)

    assert response.status_code == 422
