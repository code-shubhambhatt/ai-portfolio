from fastapi import APIRouter, Depends, File, Form, UploadFile
import json
from schemas.chat import ChatMessage
from utils.file_extractor import extract_text

from sqlalchemy import select
from sqlalchemy.orm import Session

import os
from groq import Groq
from dotenv import load_dotenv

from schemas.chat import ChatRequest
from database import get_db

from models.profile import Profile
from models.experience import Experience
from models.project import Project
from models.skills import Skill
from models.education import Education

load_dotenv()

groq_api_key = os.getenv("GROQ_API_KEY")

if not groq_api_key:
    raise ValueError("API key missing!")

model = "openai/gpt-oss-120b"

client = Groq(
    api_key=groq_api_key,
)


def ask_ai(query, portfolio_context, conversation, jd_text=None):
    user_message = {"role": "user", "content": query}

    system_message = {
        "role": "system",
        "content": f"""
        Use the portfolio context as the source of truth.

        When evaluating a job description, use your reasoning to identify semantic
        matches between the job requirements and the candidate's skills, experience,
        projects, and education.

        Reasonable inferences based on relevant technical experience are allowed.
        However, do not invent factual details about the candidate or their work.

        If there is insufficient evidence for a requirement, clearly say so.

        Portfolio Context:
        {portfolio_context}

        {"Job Description:" if jd_text else ""}
        {jd_text or ""}
        """,
    }

    messages = [system_message, *conversation, user_message]

    response = client.chat.completions.create(
        model=model,
        messages=messages
    )

    return response.choices[0].message.content

def retrieve_profile(profile):
    return f"""
    Name: {profile.name}
    Role: {profile.role}
    Bio: {profile.bio}
    About: {profile.about}
    Email: {profile.email}
    Phone: {profile.phone}
    Location: {profile.location}
    GitHub: {profile.github}
    LinkedIn: {profile.linkedin}
    Resume URL: {profile.resume_url}
    """


def retrieve_experience(experiences):
    experiences_context = ""

    for experience in experiences:
        experiences_context += f"""
        Company: {experience.company}
        Role: {experience.role}
        Location: {experience.location}
        Employment Type: {experience.employment_type}
        Start Date: {experience.start_date}
        End Date: {experience.end_date}
        Current: {experience.current}
        Description: {experience.description}
        Responsibilities: {experience.responsibilities}
        Technologies: {experience.technologies}

        """

    return experiences_context


def retrieve_projects(projects):
    projects_context = ""

    for project in projects:
        projects_context += f"""
        Name: {project.name}
        Short Description: {project.short_description}
        Full Description: {project.description}
        GitHub Repository URL: {project.github_url}
        Live Deployed URL: {project.demo_url}
        Featured: {project.featured}
        Technologies: {project.technologies}

        """

    return projects_context


def retrieve_skills(skills):
    skills_context = ""

    for skill in skills:
        skills_context += f"""
    Skill: {skill.name}
    Category: {skill.category}

    """

    return skills_context


def retrieve_education(educations):
    education_context = ""

    for education in educations:
        education_context += f"""
        Title: {education.title}
        Institution: {education.institution}
        Location: {education.location}
        Specialization: {education.specialization}
        Start Date: {education.start_date}
        Completion Date: {education.completion_date}
        Subjects: {education.subjects}
        Score: {education.score}
        Score Type: {education.score_type}

        """

    return education_context


def get_portfolio_context(db):
    profile_result = db.execute(select(Profile))
    experience_result = db.execute(select(Experience))
    project_result = db.execute(select(Project))
    skill_result = db.execute(select(Skill))
    education_result = db.execute(select(Education))

    profile = profile_result.scalar_one_or_none()
    experiences = experience_result.scalars().all()
    projects = project_result.scalars().all()
    skills = skill_result.scalars().all()
    educations = education_result.scalars().all()

    portfolio_context = f"""
    ===== PROFILE =====
    {retrieve_profile(profile)}

    ===== EXPERIENCE =====
    {retrieve_experience(experiences)}

    ===== PROJECTS =====
    {retrieve_projects(projects)}

    ===== SKILLS =====
    {retrieve_skills(skills)}

    ===== EDUCATION =====
    {retrieve_education(educations)}
    """

    return portfolio_context


router = APIRouter(prefix="/api/chat", tags=["ai"])


@router.post("/")
async def chat(
    message: str = Form(...),
    conversation: str = Form("[]"),
    file: UploadFile | None = File(None),
    db: Session = Depends(get_db),
):
    conversation_data = json.loads(conversation)

    jd_text = None

    if file:
        jd_text = await extract_text(file)

    portfolio_context = get_portfolio_context(db)

    answer = ask_ai(
        message,
        portfolio_context,
        conversation_data,
        jd_text,
    )

    return {
        "question": message,
        "answer": answer,
    }