from datetime import timedelta

from jose import jwt

from app.security import (
    ALGORITHM,
    SECRET_KEY,
    create_access_token,
    get_password_hash,
    verify_password,
)


def test_password_hash_is_not_plain_text():
    password = "password123"

    hashed_password = get_password_hash(password)

    assert hashed_password != password


def test_verify_password_accepts_correct_password():
    password = "password123"
    hashed_password = get_password_hash(password)

    assert verify_password(password, hashed_password) is True


def test_verify_password_rejects_wrong_password():
    hashed_password = get_password_hash("password123")

    assert verify_password("wrongpass123", hashed_password) is False


def test_create_access_token_contains_subject_and_expiration():
    token = create_access_token(
        data={"sub": "user@example.com"},
        expires_delta=timedelta(minutes=5),
    )

    decoded_token = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

    assert decoded_token["sub"] == "user@example.com"
    assert "exp" in decoded_token
