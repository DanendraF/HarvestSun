from sqlalchemy.orm import Session
from models.db_models import ChatHistory
from db import SessionLocal

# Simpan chat baru ke database
def save_chat_history(user_id, title, last_message, messages):
    db: Session = SessionLocal()
    chat = ChatHistory(
        user_id=user_id,
        title=title,
        last_message=last_message,
        messages=messages
    )
    db.add(chat)
    db.commit()
    db.refresh(chat)
    db.close()
    return chat

# Ambil semua riwayat chat user
def get_history(user_id: str):
    db: Session = SessionLocal()
    history = db.query(ChatHistory).filter(ChatHistory.user_id == user_id).order_by(ChatHistory.created_at.desc()).all()
    db.close()
    return history

# Ambil detail chat by id
def get_history_detail(chat_id):
    db: Session = SessionLocal()
    chat = db.query(ChatHistory).filter(ChatHistory.id == chat_id).first()
    db.close()
    return chat

# Hapus chat history by id
def delete_history(chat_id):
    db: Session = SessionLocal()
    chat = db.query(ChatHistory).filter(ChatHistory.id == chat_id).first()
    if chat:
        db.delete(chat)
        db.commit()
    db.close()
    return True 