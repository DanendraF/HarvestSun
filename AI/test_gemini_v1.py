import google.generativeai as genai
import os
from dotenv import load_dotenv

# Pastikan .env sudah termuat jika pakai .env
load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Pilih model Gemini terbaru
model = genai.GenerativeModel("models/gemini-1.5-pro-latest")

# Prompt sederhana
prompt = "Jelaskan cara kerja AI dalam beberapa kalimat singkat."

# Generate response
response = model.generate_content(prompt)
print(response.text)