from jose import jwt

from app import crud
from app.database import Base, get_db
from app.security import ALGORITHM, SECRET_KEY


def test_register_user(client):
    response = client.post(
        "/auth/register",
        json={"email": "user@example.com", "password": "password123"},
    )

    assert response.status_code == 201

    data = response.json()
    assert data["email"] == "user@example.com"
    assert "id" in data
    assert "created_at" in data
    assert "password" not in data
    assert "hashed_password" not in data


def test_register_user_stores_hashed_password(client, db_session):
    payload = {"email": "user@example.com", "password": "password123"}

    response = client.post("/auth/register", json=payload)
    db_user = crud.get_user_by_email(db_session, payload["email"])

    assert response.status_code == 201
    assert db_user is not None
    assert db_user.hashed_password != payload["password"]


def test_reject_duplicate_email(client):
    payload = {"email": "user@example.com", "password": "password123"}

    first_response = client.post("/auth/register", json=payload)
    second_response = client.post("/auth/register", json=payload)

    assert first_response.status_code == 201
    assert second_response.status_code == 400
    assert second_response.json()["detail"] == "Email already registered"


def test_reject_short_password_on_register(client):
    response = client.post(
        "/auth/register",
        json={"email": "user@example.com", "password": "short"},
    )

    assert response.status_code == 422


def test_login_user(client):
    payload = {"email": "user@example.com", "password": "password123"}
    client.post("/auth/register", json=payload)

    response = client.post("/auth/login", json=payload)

    assert response.status_code == 200

    data = response.json()
    assert data["token_type"] == "bearer"
    assert data["access_token"]


def test_reject_unknown_email_on_login(client):
    response = client.post(
        "/auth/login",
        json={"email": "missing@example.com", "password": "password123"},
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"


def test_reject_wrong_password(client):
    client.post(
        "/auth/register",
        json={"email": "user@example.com", "password": "password123"},
    )

    response = client.post(
        "/auth/login",
        json={"email": "user@example.com", "password": "wrongpass123"},
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"


def test_reject_short_password_on_login(client):
    response = client.post(
        "/auth/login",
        json={"email": "user@example.com", "password": "short"},
    )

    assert response.status_code == 422


def test_login_returns_access_token(client):
    payload = {"email": "user@example.com", "password": "password123"}
    client.post("/auth/register", json=payload)

    response = client.post("/auth/login", json=payload)

    token = response.json()["access_token"]
    decoded_token = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

    assert decoded_token["sub"] == "user@example.com"
    assert "exp" in decoded_token
