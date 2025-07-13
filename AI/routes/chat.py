from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import os
import openai
# from services.history_service import save_chat_history
import asyncio
from concurrent.futures import ThreadPoolExecutor

load_dotenv()

router = APIRouter()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = openai.OpenAI(api_key=OPENAI_API_KEY)
executor = ThreadPoolExecutor()

async def openai_chat_completion_async(**kwargs):
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(executor, lambda: client.chat.completions.create(**kwargs))

@router.post("/chat")
async def chat_legacy(request: Request):
    data = await request.json()
    question = data.get("message") or data.get("question") or ""
    # user_id = data.get("user_id")
    if not question:
        return JSONResponse(content={"reply": "Pertanyaan tidak boleh kosong."})

    system_prompt = "Kamu adalah asisten digital yang ahli di bidang pertanian Indonesia. Jawab dengan bahasa Indonesia yang sopan dan mudah dipahami."

    try:
        response = await openai_chat_completion_async(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": question}
            ],
            max_tokens=512,
            temperature=0.7
        )
        reply = response.choices[0].message.content
        return JSONResponse(content={"reply": reply})
    except Exception as e:
        print("OpenAI error:", e)
        return JSONResponse(content={"reply": "Maaf, terjadi kesalahan pada AI OpenAI."}, status_code=500)

# Endpoint /api/chatbot tetap dummy/optional
@router.post("/api/chatbot")
async def chatbot_endpoint(request: Request):
    data = await request.json()
    question = data.get("message") or data.get("question") or ""
    if not question:
        return JSONResponse(content={"reply": "Pertanyaan tidak boleh kosong."})
    return JSONResponse(content={"reply": "Gunakan endpoint /chat untuk jawaban AI OpenAI."}) 

