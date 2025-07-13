import openai
import os
from dotenv import load_dotenv

load_dotenv()
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

prompt = "Jelaskan cara kerja AI dalam beberapa kalimat singkat."

try:
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Kamu adalah asisten digital pertanian Indonesia."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=512,
        temperature=0.7
    )
    print(response.choices[0].message.content)
except Exception as e:
    print("OpenAI error:", e) 