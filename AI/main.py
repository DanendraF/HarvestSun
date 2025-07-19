import os
from fastapi import FastAPI
from routes import chat, history, cuaca
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.include_router(chat.router)
app.include_router(history.router)
app.include_router(cuaca.router)


@app.get("/")
def read_root():
    print("OPENAI_API_KEY:", os.getenv("OPENAI_API_KEY"))
    return {"message": "API aktif"} 

