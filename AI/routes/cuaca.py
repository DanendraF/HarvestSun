import os
import requests
from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/api")
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")

@router.get("/api/cuaca")
def get_cuaca(kota: str = Query(...)):
    url = f"https://api.openweathermap.org/data/2.5/weather?q={kota},ID&appid={OPENWEATHER_API_KEY}&units=metric"
    try:
        resp = requests.get(url)
        data = resp.json()
        return JSONResponse(content=data)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500) 