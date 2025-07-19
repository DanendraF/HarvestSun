import os
from fastapi import FastAPI
from routes import chat, history, cuaca
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://harvestsun.vercel.app"],  # Ganti dengan domain frontend Anda
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router)
app.include_router(history.router)
app.include_router(cuaca.router)


@app.get("/")
def read_root():
    print("OPENAI_API_KEY:", os.getenv("OPENAI_API_KEY"))
    return {"message": "API aktif"} 

