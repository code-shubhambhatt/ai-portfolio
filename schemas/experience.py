from datetime import date

from pydantic import BaseModel


class ExperienceResponse(BaseModel):
    id: int
    company: str
    role: str
    location: str | None = None
    employment_type: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    current: bool
    description: str | None = None
    responsibilities: list[str] | None = None
    technologies: list[str] | None = None