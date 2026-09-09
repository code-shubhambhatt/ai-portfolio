from fastapi.testclient import TestClient

from main import app


client = TestClient(app)


def test_get_profile():
    response = client.get("/api/profile")

    assert response.status_code == 200

    data = response.json()

    assert data["name"] == "Shubham Bhatt"
    assert isinstance(data["role"], str)
    assert isinstance(data["bio"], str)
    assert "github" in data
    assert "linkedin" in data


def test_get_education():
    response = client.get("/api/education")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)
    assert len(data) > 0

    education = data[0]

    assert "id" in education
    assert "institution" in education
    assert "title" in education
    assert "specialization" in education


def test_get_experiences():
    response = client.get("/api/experiences")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)
    assert len(data) > 0

    experience = data[0]

    assert "id" in experience
    assert "company" in experience
    assert "role" in experience
    assert "technologies" in experience


def test_get_skills():
    response = client.get("/api/skills")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)
    assert len(data) > 0

    skill = data[0]

    assert "id" in skill
    assert "name" in skill
    assert "category" in skill