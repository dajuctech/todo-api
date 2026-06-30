import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app

TEST_DATABASE_URL = "sqlite://"

engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(autouse=True)
def setup_test_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client():
    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()


def test_root_route(client):
    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {"message": "To-Do List API is running"}


def test_create_task(client):
    response = client.post(
        "/tasks",
        json={"title": "Buy milk", "description": "From the store"},
    )

    assert response.status_code == 201

    data = response.json()
    assert data["title"] == "Buy milk"
    assert data["description"] == "From the store"
    assert data["completed"] is False
    assert "id" in data
    assert "created_at" in data


def test_create_task_rejects_empty_title(client):
    response = client.post("/tasks", json={"title": ""})

    assert response.status_code == 422


def test_get_all_tasks(client):
    client.post("/tasks", json={"title": "Task 1"})
    client.post("/tasks", json={"title": "Task 2"})

    response = client.get("/tasks")

    assert response.status_code == 200
    assert len(response.json()) == 2


def test_get_one_task(client):
    created = client.post("/tasks", json={"title": "Single task"}).json()

    response = client.get(f"/tasks/{created['id']}")

    assert response.status_code == 200
    assert response.json()["title"] == "Single task"


def test_get_nonexistent_task(client):
    response = client.get("/tasks/9999")

    assert response.status_code == 404
    assert response.json()["detail"] == "Task not found"


def test_update_task(client):
    created = client.post("/tasks", json={"title": "Old title"}).json()

    response = client.put(
        f"/tasks/{created['id']}",
        json={"title": "New title", "description": "Updated description"},
    )

    assert response.status_code == 200

    data = response.json()
    assert data["title"] == "New title"
    assert data["description"] == "Updated description"


def test_update_nonexistent_task(client):
    response = client.put("/tasks/9999", json={"title": "Missing task"})

    assert response.status_code == 404
    assert response.json()["detail"] == "Task not found"


def test_complete_task(client):
    created = client.post("/tasks", json={"title": "Finish me"}).json()

    response = client.patch(f"/tasks/{created['id']}/complete")

    assert response.status_code == 200
    assert response.json()["completed"] is True


def test_complete_nonexistent_task(client):
    response = client.patch("/tasks/9999/complete")

    assert response.status_code == 404
    assert response.json()["detail"] == "Task not found"


def test_delete_task(client):
    created = client.post("/tasks", json={"title": "Delete me"}).json()

    response = client.delete(f"/tasks/{created['id']}")

    assert response.status_code == 204
    assert client.get(f"/tasks/{created['id']}").status_code == 404


def test_delete_nonexistent_task(client):
    response = client.delete("/tasks/9999")

    assert response.status_code == 404
    assert response.json()["detail"] == "Task not found"
