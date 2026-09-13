from pydantic import BaseModel
from datetime import date
from enum import Enum


class ScoreType(str, Enum):
    CGPA = "cgpa"
    PERCENTAGE = "percentage"

    @classmethod
    def _missing_(cls, value: object):
        if isinstance(value, str):
            for member in cls:
                if member.value == value.lower():
                    return member
        return None


class EducationResponse(BaseModel):

    id: int
    title: str
    institution: str
    specialization: str | None = None
    location: str
    start_date: date | None = None
    completion_date: date | None = None
    subjects: list[str] | None = None
    score: float | None = None
    score_type: ScoreType | None = None
