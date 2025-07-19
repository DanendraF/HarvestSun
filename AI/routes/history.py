from fastapi import APIRouter, Query, HTTPException
from fastapi.responses import JSONResponse
from fastapi import Request
from fastapi.responses import JSONResponse
from services.history_service import get_history, delete_history, get_history_detail

router = APIRouter(prefix="/api")

# Endpoint baru: /api/chat-history?user_id=xxx
@router.get("/api/chat-history")
async def chat_history_endpoint(user_id: str = Query(...)):
    try:
        print("Ambil history untuk user_id:", user_id)
        history = get_history(user_id)
        print("Hasil dari Supabase:", history)
        return JSONResponse(content={"history": history, "user_id": user_id})
    except Exception as e:
        print("Error get_history:", str(e))
        return JSONResponse(content={"history": [], "user_id": user_id, "error": str(e)}, status_code=500)

# Endpoint lama: /history/{user_id} (untuk kompatibilitas)
@router.get("/history/{user_id}")
async def history_legacy(user_id: str):
    try:
        history = get_history(user_id)
        return JSONResponse(content={"history": history, "user_id": user_id})
    except Exception as e:
        return JSONResponse(content={"history": [], "user_id": user_id, "error": str(e)}, status_code=500)

@router.post("/chat")
async def chat_legacy(request: Request):
    data = await request.json()
    question = data.get("message") or data.get("question") or ""
    if "hama" in question.lower():
        reply = "Untuk mengatasi hama pada padi, gunakan pestisida alami dan lakukan rotasi tanaman."
    elif "panen" in question.lower():
        reply = "Waktu panen terbaik untuk tomat adalah saat buah berwarna merah merata."
    else:
        reply = "Maaf, saya belum bisa menjawab pertanyaan tersebut."
    return JSONResponse(content={"reply": reply})

# Endpoint untuk hapus history
@router.delete("/api/chat-history/{chat_id}")
async def delete_history_endpoint(chat_id: str):
    try:
        delete_history(chat_id)
        return JSONResponse(content={"success": True})
    except Exception as e:
        return JSONResponse(content={"success": False, "error": str(e)}, status_code=500)

@router.get("/history/detail/{chat_id}")
async def history_detail(chat_id: str):
    try:
        detail = get_history_detail(chat_id)
        return JSONResponse(content=detail)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500) 