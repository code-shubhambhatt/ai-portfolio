from fastapi import APIRouter, Depends, File, Form, UploadFile
from fastapi.responses import StreamingResponse
import json
from collections import defaultdict
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


def build_system_prompt(portfolio_context: str, jd_text: str | None = None) -> str:
    jd_section = f"""
### JOB DESCRIPTION FOR CANDIDATE EVALUATION:
\"\"\"
{jd_text}
\"\"\"
""" if jd_text else ""

    return f"""You are the AI Technical Copilot for Shubham Bhatt's engineering portfolio.
Your mission is to represent Shubham's software engineering expertise, backend systems architecture, and AI development capabilities authoritatively, objectively, and concisely to recruiters, engineering managers, and technical peers.

### 1. CORE OPERATING PRINCIPLES
- ABSOLUTE GROUND TRUTH: The provided Portfolio Context is the single authoritative source of truth. Never invent, extrapolate, or fabricate companies, degrees, titles, dates, metrics, or certifications not explicitly documented.
- ZERO CONVERSATIONAL FLUFF: Never begin with generic AI pleasantries ("Certainly!", "I'd be glad to help with that", "Hello! As an AI...", "Sure thing!"). Jump immediately into direct, high-signal technical content.
- CONCISE & DIGESTIBLE (NO WALLS OF TEXT): Recruiters and engineering managers have limited time. Deliver punchy, scannable answers in 2-3 concise sentences or 3-4 clean bullet points (strictly under 120 words). Never dump walls of text, bloated guides, or exhaustive checklists unless explicitly commanded.
- STRICT RELEVANCE & NO GENERIC TUTORIALS: You are NOT a general-purpose AI chatbot or software tutorial engine. Your sole scope is representing Shubham Bhatt's portfolio, engineering decisions, and role suitability. Never answer general programming or DevOps questions as a textbook consultant. If a query is open-ended or unrelated (e.g., "we have deployed the application"), anchor it directly to Shubham's concrete stack in 1-2 sentences or ask how you can help evaluate Shubham for an engineering opportunity.
- ENGINEERING DEPTH & SPECIFICITY: Communicate with the technical density of an experienced software engineer. Name specific tools, frameworks (FastAPI, Flask, Django, React), databases & ORMs (PostgreSQL, MongoDB, SQLAlchemy 2.0, Alembic), infra (AWS EC2, Docker, Nginx, Gunicorn), and measurable achievements (e.g., ~30% API response time optimization, 15,000+ record Databricks/PostgreSQL reconciliations, PyCasbin capability-based RBAC across 15+ endpoints, rate-limited and token-budgeted LLM workflows).
- TRANSPARENT & STRATEGIC GAP HANDLING: If asked about an unverified or missing technology (e.g., Kubernetes, Golang, Rust), clearly and straightforwardly state that it is not in his primary stack, then highlight strong adjacent foundations (e.g., Docker containerization, strong Linux systems knowledge, and rapid ramp-up in modern backend ecosystems).
- RECRUITING & CONTACT: When asked how to contact, interview, or hire Shubham, provide his verified direct channels cleanly (Email: shubhambhatt1000@gmail.com, Phone: +91-7310944262, LinkedIn: https://linkedin.com/in/codingshubham, GitHub: https://github.com/code-shubhambhatt).
- CLEAN FORMATTING & NO RAW HTML: Use clean GitHub-Flavored Markdown. Employ bold technical terms and structured bullet points. NEVER output raw HTML tags (such as <br> or <br/>); use standard Markdown line breaks and bullet lists.

### 2. DUAL EXECUTION MODES

MODE A: TECHNICAL & PORTFOLIO INQUIRIES (Default)
- Deliver concise, authoritative answers detailing his engineering decisions, stack trade-offs, and tangible contributions across his industry experience (Madatcloud, Unified Mentor) and flagship projects (AI Portfolio, Astro, MyBlogApp, WatchMate API).
- Prioritize concrete implementation details over abstract textbook definitions.

MODE B: JOB DESCRIPTION (JD) EVALUATION (Active when JD text is provided)
Deliver an executive-level, 5-part candidate evaluation scorecard:
1. Alignment Summary: 2-3 sentence overview assessing candidate fit level (e.g., Strong Backend Fit, High Synergy, Specialized Alignment) and key role suitability factors.
2. Direct Technical Matches (Markdown Table):
   | Role Requirement | Shubham's Verified Experience | Relevance Level |
3. Transferable & Adjacent Strengths: Key areas where his foundational backend engineering, distributed DB workflows, or AI orchestration directly transfer to role requirements.
4. Gaps & Unverified Requirements: Transparent, objective enumeration of JD requirements not evidenced in the context (stated neutrally without apology or hesitation).
5. Targeted Interview Topics: 2-3 specific technical deep-dive topics or architectural scenarios an interviewer should discuss with him.

### 3. PORTFOLIO CONTEXT (SOURCE OF TRUTH)
{portfolio_context}
{jd_section}"""


def ask_ai(query, portfolio_context, conversation, jd_text=None):
    user_message = {"role": "user", "content": query}
    system_message = {
        "role": "system",
        "content": build_system_prompt(portfolio_context, jd_text),
    }

    messages = [system_message, *conversation, user_message]

    response = client.chat.completions.create(
        model=model,
        messages=messages,
    )

    return response.choices[0].message.content


def stream_ai_generator(query, portfolio_context, conversation, jd_text=None):
    user_message = {"role": "user", "content": query}
    system_message = {
        "role": "system",
        "content": build_system_prompt(portfolio_context, jd_text),
    }

    messages = [system_message, *conversation, user_message]

    completion = client.chat.completions.create(
        model=model,
        messages=messages,
        stream=True,
    )

    for chunk in completion:
        if chunk.choices and chunk.choices[0].delta and chunk.choices[0].delta.content:
            yield chunk.choices[0].delta.content


def retrieve_profile(profile):
    if not profile:
        return "Profile data unavailable."
    return (
        f"- Name: {profile.name}\n"
        f"- Role: {profile.role}\n"
        f"- Bio: {profile.bio}\n"
        f"- About: {profile.about}\n"
        f"- Email: {profile.email}\n"
        f"- Phone: {profile.phone}\n"
        f"- GitHub: {profile.github}\n"
        f"- LinkedIn: {profile.linkedin}\n"
        f"- Resume: {profile.resume_url or 'Available upon request'}"
    )


def retrieve_experience(experiences):
    if not experiences:
        return "No experience records found."
    lines = []
    for exp in experiences:
        span = f"{exp.start_date} to {'Present' if exp.current else exp.end_date or 'N/A'}"
        tech = ", ".join(exp.technologies) if isinstance(exp.technologies, list) else exp.technologies
        responsibilities = (
            "\n".join(f"  * {r}" for r in exp.responsibilities)
            if isinstance(exp.responsibilities, list)
            else f"  * {exp.responsibilities}"
        )
        lines.append(
            f"### {exp.role} at {exp.company} ({span})\n"
            f"- Employment: {exp.employment_type or 'Full-time'} | Location: {exp.location or 'Remote'}\n"
            f"- Overview: {exp.description}\n"
            f"- Responsibilities & Impact:\n{responsibilities}\n"
            f"- Technologies: {tech}"
        )
    return "\n\n".join(lines)


def retrieve_projects(projects):
    if not projects:
        return "No project records found."
    lines = []
    for p in projects:
        tech = ", ".join(p.technologies) if isinstance(p.technologies, list) else p.technologies
        links = []
        if p.github_url:
            links.append(f"GitHub: {p.github_url}")
        if p.demo_url:
            links.append(f"Live Demo: {p.demo_url}")
        links_str = " | ".join(links) if links else "Internal / In Progress"
        lines.append(
            f"### {p.name}{' (Featured)' if p.featured else ''}\n"
            f"- Summary: {p.short_description}\n"
            f"- Architecture & Details: {p.description}\n"
            f"- Tech Stack: {tech}\n"
            f"- Links: {links_str}"
        )
    return "\n\n".join(lines)


def retrieve_skills(skills):
    if not skills:
        return "No skills records found."
    by_cat = defaultdict(list)
    for s in skills:
        by_cat[s.category].append(s.name)
    return "\n".join(f"- **{cat}**: {', '.join(items)}" for cat, items in by_cat.items())


def retrieve_education(educations):
    if not educations:
        return "No education records found."
    lines = []
    for edu in educations:
        period = f"{edu.start_date or ''} - {edu.completion_date or ''}".strip(" -")
        score_str = f" | Score: {edu.score} {edu.score_type}" if edu.score else ""
        lines.append(
            f"- **{edu.title} in {edu.specialization or 'General'}** at {edu.institution} ({period}{score_str})"
        )
    return "\n".join(lines)


def get_portfolio_context(db):
    profile = db.execute(select(Profile)).scalar_one_or_none()
    experiences = db.execute(select(Experience)).scalars().all()
    projects = db.execute(select(Project)).scalars().all()
    skills = db.execute(select(Skill)).scalars().all()
    educations = db.execute(select(Education)).scalars().all()

    return f"""===== PROFILE =====
{retrieve_profile(profile)}

===== EXPERIENCE =====
{retrieve_experience(experiences)}

===== PROJECTS =====
{retrieve_projects(projects)}

===== SKILLS =====
{retrieve_skills(skills)}

===== EDUCATION =====
{retrieve_education(educations)}"""


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


@router.post("/stream")
async def chat_stream(
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

    return StreamingResponse(
        stream_ai_generator(
            message,
            portfolio_context,
            conversation_data,
            jd_text,
        ),
        media_type="text/plain; charset=utf-8",
    )