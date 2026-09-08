from fastapi import APIRouter
from schemas.projects import Project_Response

router = APIRouter(
    prefix="/api",
    tags=["portfolio"]
)

projects = [
    {
        "id": 1,
        "name": "Astro",
        "short_description": "...",
        "description": "...",
        "github_url": "https://github.com/code-shubhambhatt/astro",
        "demo_url": "https://astro-39u.pages.dev/",
        "featured": True,
        "technologies": ["Python", "FastAPI"],
        "display_order": 1
    },
    {
        "id": 2,
        "name": "My Blog Application",
        "short_description": "...",
        "description": "...",
        "github_url": "https://github.com/code-shubhambhatt/myblogapp",
        "demo_url": None,
        "featured": False,
        "technologies": ["Python", "Flask", "MongoDB"],
        "display_order": 2
    },
    {
        "id": 3,
        "name": "Watchmate API",
        "short_description": "...",
        "description": "...",
        "github_url": "https://github.com/code-shubhambhatt/drf",
        "demo_url": None,
        "featured": False,
        "technologies": ["Python", "Django", "DRF"],
        "display_order": 3
    }
]

@router.get("/projects", response_model= list[Project_Response])
def get_projects():
    return projects