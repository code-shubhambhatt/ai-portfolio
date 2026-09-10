from sqlalchemy import ARRAY, String, Boolean, Integer
from sqlalchemy.orm import Mapped, mapped_column

from database import Base

class Project(Base):
    __tablename__ = "projects"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    short_description: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(String, nullable=False)
    github_url: Mapped[str] = mapped_column(String, nullable=False)
    demo_url: Mapped[str] = mapped_column(String, nullable=True)
    featured: Mapped[bool] = mapped_column(Boolean, nullable=False)
    technologies: Mapped[list[str]] = mapped_column(ARRAY(String), nullable=False)
    display_order: Mapped[int] = mapped_column(Integer, nullable=False)
