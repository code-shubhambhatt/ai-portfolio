from datetime import date

from sqlalchemy import ARRAY, Boolean, Date, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class Experience(Base):
    __tablename__ = "experience"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    company: Mapped[str] = mapped_column(String, nullable=False)
    role: Mapped[str] = mapped_column(String, nullable=False)
    location: Mapped[str | None] = mapped_column(String, nullable=True)
    employment_type: Mapped[str | None] = mapped_column(String, nullable=True)
    start_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    end_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    current: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    responsibilities: Mapped[list[str] | None] = mapped_column(
        ARRAY(String), nullable=True
    )
    technologies: Mapped[list[str] | None] = mapped_column(
        ARRAY(String), nullable=True
    )