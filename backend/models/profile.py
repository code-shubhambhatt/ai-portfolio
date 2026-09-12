from sqlalchemy import String, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class Profile(Base):
    __tablename__ = "profile"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    role: Mapped[str] = mapped_column(String, nullable=False)
    bio: Mapped[str] = mapped_column(Text, nullable=False)
    about: Mapped[str | None] = mapped_column(Text, nullable=True)
    email: Mapped[str | None] = mapped_column(String, nullable=True)
    phone: Mapped[str | None] = mapped_column(String, nullable=True)
    location: Mapped[str | None] = mapped_column(String, nullable=True)
    github: Mapped[str | None] = mapped_column(String, nullable=True)
    linkedin: Mapped[str | None] = mapped_column(String, nullable=True)
    resume_url: Mapped[str | None] = mapped_column(String, nullable=True)
    profile_image_url: Mapped[str | None] = mapped_column(String, nullable=True)