from pydantic import BaseModel, AnyUrl

class Project_Response(BaseModel):
    id: int
    name: str
    short_description: str
    description: str
    github_url: AnyUrl
    demo_url: AnyUrl | None=None
    featured: bool
    technologies: list[str]
    display_order: int
    