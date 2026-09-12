from pydantic import BaseModel

class MatchItem(BaseModel):
    requirement: str
    status: str
    evidence: str | None = None
    
class JDEvaluationResponse(BaseModel):
    overall_fit: str
    summary: str
    skills: list[MatchItem]
    responsibilities: list[MatchItem]
    experience_assessment: str