# AI Portfolio — Backend & LLM Inference Service

A high-throughput backend architecture and grounded AI inference service built with **Python 3.12**, **FastAPI**, **PostgreSQL**, **SQLAlchemy 2.0**, and **Groq LLM Orchestration**.

This repository powers a dynamic portfolio state engine coupled with a real-time conversational AI copilot capable of contextual candidate reasoning, token-by-token streaming inference, and automated Job Description (JD) suitability evaluation across multi-page `.pdf`, `.docx`, and `.txt` documents.

---

    
## Core Backend & AI Engineering Highlights

### 1. Grounded LLM Orchestration & Streaming Engine
- **Sub-100ms Inference via Groq**: Powered by Groq's high-throughput LPU inference engine (`groq>=1.7.0`) running **Llama 3.3 70B Versatile** and **GPT-OSS 120B**.
- **Real-Time Token Streaming**: The `/api/chat/stream` route utilizes `StreamingResponse(stream_ai_generator(...), media_type="text/plain; charset=utf-8")` to yield generation chunks directly to client listeners without buffer delays.
- **Relational Context Grounding (Vector-Free RAG)**: Rather than maintaining complex vector databases that risk stale retrieval and hallucination, the service aggregates candidate data directly from PostgreSQL relational models (`Profile`, `Project`, `Skill`, `Experience`, `Education`). This deterministic context is injected into system prompt templates, ensuring 100% grounded facts.
- **Anti-Hallucination Guardrails**: The system prompt strictly limits inference to the candidate's verified background and technical domain knowledge, preventing factual fabrication while allowing technical reasoning across candidate competencies.

### 2. Multi-Format Job Description Ingestion Pipeline
Located in `backend/utils/file_extractor.py`, this module handles asynchronous document parsing for candidate-to-role matching:
- **PDF Extraction**: Multi-page text extraction via `pypdf.PdfReader`.
- **DOCX Extraction**: Structural paragraph parsing via `python-docx`.
- **Plain Text Processing**: Direct UTF-8 decoding for `.txt` inputs.
- **Multipart Form Handling**: Accepts simultaneous text queries and document binaries via FastAPI's `UploadFile` and `Form` dependencies.

### 3. Asynchronous RESTful API Design (FastAPI + Pydantic v2)
- **Dependency Injection**: Session lifecycle management handled with `Depends(get_db)`, ensuring thread-safe database queries and automated teardown.
- **Data Serialization**: Strict schema contracts using Pydantic v2 (`ChatRequest`, `ChatMessage`, `ProjectSchema`, `SkillSchema`, `ExperienceSchema`, `EducationSchema`) guarantee automatic request validation, type casting, and OpenAPI documentation generation.
- **CORS Middleware**: Flexible origin, method, and header configuration in `main.py` allowing decoupled consumer clients.

### 4. Relational State Modeling & Schema Migrations
- **SQLAlchemy 2.0 Declarative ORM**:
  - `Profile`: Canonical biography, contact channels, and social references.
  - `Project`: Architecture descriptions, technology tags, live demo links, and GitHub repositories.
  - `Skill`: Categorized competencies (Backend, Databases, Languages, AI, Infrastructure).
  - `Experience`: Company roles, employment spans, and responsibility bullets.
  - `Education`: Academic training, degrees, institutions, and core coursework.
- **Alembic Version Control**: Database evolutions and migrations are tracked and reproducible across local and production environments.
- **Driver Performance**: Backed by `psycopg` binary drivers for robust PostgreSQL connection management.

---

## API Reference

### AI Copilot & Document Evaluation

#### `POST /api/chat/stream`
Streams token-by-token LLM completions grounded in database context and optional Job Description file.
- **Content-Type**: `multipart/form-data`
- **Parameters**:
  - `query` (string, optional): Prompt or question text.
  - `conversation` (JSON string, optional): List of preceding `[{"role": "user"|"assistant", "content": "..."}]` messages.
  - `file` (binary, optional): Multi-page `.pdf`, `.docx`, or `.txt` file containing the Job Description.
- **Response**: `text/plain; charset=utf-8` chunked streaming output.

#### `POST /api/chat/`
Synchronous completion endpoint returning the entire response in a single JSON payload.
- **Body**: `{"query": string, "conversation": list, "file": optional}`
- **Response**: `{"role": "assistant", "content": string}`

---

### Portfolio State Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/profile/` | Returns canonical profile metadata (name, title, bio, contact, social links). |
| `GET` | `/api/projects/` | Retrieves engineered systems with tech stacks, demo links, and GitHub repositories. |
| `GET` | `/api/skills/` | Returns technical competencies grouped by category (Backend, Databases, Languages, AI, Cloud). |
| `GET` | `/api/experiences/` | Returns employment history, accomplishments, and responsibilities. |
| `GET` | `/api/education/` | Returns academic training, degree, institution, and core coursework. |

---

## Local Development & Setup

### Prerequisites
- **Python >= 3.12**
- **uv** (recommended for package management) or standard `pip`
- **PostgreSQL** database instance
- **Groq API Key** (from [console.groq.com](https://console.groq.com))

### Backend Configuration

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Configure Environment Variables**:
   Create a `.env` file in `backend/`:
   ```env
   DATABASE_URL=postgresql://<user>:<password>@localhost:5432/<dbname>
   GROQ_API_KEY=gsk_your_groq_api_key_here
   ```

3. **Install Dependencies**:
   Using `uv`:
   ```bash
   uv sync
   ```
   Or using standard `pip`:
   ```bash
   pip install -r <(uv pip compile pyproject.toml)
   ```

4. **Apply Database Migrations**:
   ```bash
   uv run alembic upgrade head
   ```

5. **Start the FastAPI Development Server**:
   ```bash
   uv run fastapi dev main.py
   ```
   The backend will start at `http://localhost:8000` with interactive Swagger docs at `http://localhost:8000/docs`.

---

## Automated Testing

Run the backend test suite verifying schemas, models, and endpoint contracts:
```bash
cd backend
uv run pytest
```

All 7 test suites validate:
- Chat request and response schema serialization
- Profile, education, and skill model integrity
- Multi-format file extraction edge cases
- Async endpoint status codes

---

## Repository Structure

```
portfolio/
├── backend/                       # Python Backend Core & AI Inference Service
│   ├── alembic/                   # Database migration scripts and versions
│   ├── models/                    # SQLAlchemy 2.0 ORM Declarative Models
│   │   ├── profile.py             # Profile schema
│   │   ├── project.py             # Project schema
│   │   ├── skills.py              # Skill categories and items
│   │   ├── experience.py          # Career timeline models
│   │   └── education.py           # Academic training models
│   ├── routes/                    # Modular FastAPI Route Controllers
│   │   ├── chat.py                # LLM streaming & JD evaluation endpoint
│   │   ├── projects.py            # Project CRUD & listing
│   │   ├── skills.py              # Technical skills matrix endpoint
│   │   ├── experience.py          # Career experience endpoint
│   │   └── education.py           # Education credentials endpoint
│   ├── schemas/                   # Pydantic v2 Request/Response validation models
│   ├── utils/                     # Utility modules (pypdf & docx text extractors)
│   ├── tests/                     # Pytest automated test suite
│   ├── database.py                # Engine initialization & session dependency
│   ├── main.py                    # FastAPI application factory & CORS configuration
│   └── pyproject.toml             # Python 3.12 dependencies and tools
│
├── frontend/                      # Consumer Client Interface (React + Tailwind)
│   ├── src/                       # Vite application consuming backend REST & SSE stream
│   └── package.json
│
└── README.md                      # Repository & Backend Systems Documentation
```

---

## License & Author

- **Author**: Shubham Bhatt ([GitHub](https://github.com/code-shubhambhatt) • [LinkedIn](https://linkedin.com/in/shubham-bhatt-09096720b))
- **Role**: Software Engineer & AI Systems Developer
