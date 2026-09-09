from sqlalchemy import ARRAY, String, Integer, Float, Date
from sqlalchemy.orm import Mapped, mapped_column

from datetime import date
from database import Base


class Education(Base):
    __tablename__ = "education"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String, nullable=False)
    institution: Mapped[str] = mapped_column(String, nullable=False)
    location: Mapped[str] = mapped_column(String, nullable=False)
    specialization: Mapped[str | None] = mapped_column(String, nullable=True)
    start_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    completion_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    subjects: Mapped[list[str] | None] = mapped_column(ARRAY(String), nullable=True)
    score: Mapped[float | None] = mapped_column(Float, nullable=True) 
    score_type: Mapped[str | None] = mapped_column(String, nullable=True)
