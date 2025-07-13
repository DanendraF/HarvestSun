from models.schemas import ChatRequest, ChatResponse
from services.history_service import save_chat_history

def process_chat(req: ChatRequest) -> ChatResponse:
    # Dummy logic, nanti bisa diisi call ke LLM
    reply = f"Jawaban AI untuk: {req.question}"
    messages = [
        {"role": "user", "content": req.question},
        {"role": "ai", "content": reply}
    ]
    save_chat_history(
        user_id=req.user_id,
        title=req.question[:30],
        last_message=reply,
        messages=messages
    )
    return ChatResponse(reply=reply) 