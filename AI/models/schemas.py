from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ChatRequest(BaseModel):
    user_id: str
    question: str

class ChatResponse(BaseModel):
    reply: str

class ChatHistoryItem(BaseModel):
    id: int
    user_id: str
    title: str
    last_message: str
    messages: List[dict]
    created_at: datetime 