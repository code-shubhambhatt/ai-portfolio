from io import BytesIO
from pathlib import Path

from fastapi import UploadFile
from pypdf import PdfReader
from docx import Document


async def extract_text(file: UploadFile) -> str:
    extension = Path(file.filename or "").suffix.lower()
    content = await file.read()

    if extension == ".txt":
        return content.decode("utf-8")

    if extension == ".pdf":
        reader = PdfReader(BytesIO(content))

        return "\n".join(
            page.extract_text() or ""
            for page in reader.pages
        )

    if extension == ".docx":
        document = Document(BytesIO(content))

        return "\n".join(
            paragraph.text
            for paragraph in document.paragraphs
        )

    raise ValueError("Unsupported file type")