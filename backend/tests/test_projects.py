from fastapi.testclient import TestClient

from main import app


client = TestClient(app)


def test_get_projects():
    response = client.get("/api/projects")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)
    assert len(data) > 0

    project = data[0]

    assert "id" in project
    assert "name" in project
    assert "description" in project
    assert "technologies" in project


def test_get_project():
    response = client.get("/api/projects/1")

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == 1
    assert isinstance(data["name"], str)
    assert isinstance(data["technologies"], list)


def test_get_project_not_found():
    response = client.get("/api/projects/99999")

    assert response.status_code == 404
    assert response.json()["detail"] == "Project not found!"