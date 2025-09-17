from typing import Optional
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os, io
import json
import pdfplumber
from openai import OpenAI

from app.preprocessor import preprocess_text

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(
    base_url="https://router.huggingface.co/v1",
    api_key=os.getenv("HF_TOKEN"),
)


class ResponseOut(BaseModel):
    category: str
    suggested_reply: str


def extract_text_from_pdf(file_bytes: bytes) -> str:
    text = ""
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            text += "\\n" + (page.extract_text() or "")
    return text


async def extract_text(file, text) -> str:
    if file and file.filename:
        data = await file.read()
        if file.filename.lower().endswith(".pdf"):
            return extract_text_from_pdf(data)
        return data.decode(errors="ignore")
    if text:
        return text
    return {
        "category": "Improdutivo",
        "suggested_reply": "Nenhum conteúdo recebido.",
    }


@app.post("/process", response_model=ResponseOut)
async def process(
    file: Optional[UploadFile] = File(None), text: Optional[str] = Form(None)
):
    content = await extract_text(file, text)
    preprocessed = preprocess_text(content)

    content = f"""
    Você é um assistente que analisa emails, que estão em pt_BR.
    - O formato do e-mail enviado será o conteúdo do e-mail.
    - O e-mail está lematizado e pré-processado, não está no texto original.
    - Retorne no seguinte formato JSON **válido**.:
    {{
        "category": "Produtivo" ou "Improdutivo",
        "suggested_reply": "Texto da resposta sugerida aqui"
    }}
    - Retorne apenas no formato especificado, não retorne de outra forma.
    - Não retorne texto fora do formato especificado.

    Conteúdo do email:
    {preprocessed}
    """

    completion = client.chat.completions.create(
        model="meta-llama/Llama-3.1-8B-Instruct:cerebras",
        messages=[{"role": "user", "content": content}],
    )
    output = json.loads(completion.choices[0].message.content)

    return {
        "category": output["category"],
        "suggested_reply": output["suggested_reply"],
    }
