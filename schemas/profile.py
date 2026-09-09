from pydantic import BaseModel


class ProfileResponse(BaseModel):
    id: int
    name: str
    role: str
    bio: str
    about: str | None = None
    email: str | None = None
    phone: str | None = None
    location: str | None = None
    github: str | None = None
    linkedin: str | None = None
    resume_url: str | None = None
    profile_image_url: str | None = None