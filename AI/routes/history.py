from fastapi import APIRouter, Query, HTTPException
from fastapi.responses import JSONResponse
from fastapi import Request
from fastapi.responses import JSONResponse
from services.history_service import delete_history

router = APIRouter()

# Endpoint baru: /api/chat-history?user_id=xxx
@router.get("/api/chat-history")
async def chat_history_endpoint(user_id: str = Query(...)):
    # TODO: Ambil history dari database/service
    return JSONResponse(content={"history": [], "user_id": user_id})

# Endpoint lama: /history/{user_id} (untuk kompatibilitas)
@router.get("/history/{user_id}")
async def history_legacy(user_id: str):
    # TODO: Ambil history dari database/service
    return JSONResponse(content={"history": [], "user_id": user_id})

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