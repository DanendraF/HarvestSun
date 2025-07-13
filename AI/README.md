# Backend AI Chatbot (FastAPI)

## Struktur Folder

```
AI/
├── main.py                # Entry point FastAPI
├── routes/                # Endpoint API (chat, history)
│   ├── chat.py
│   └── history.py
├── services/              # Logic utama (proses chat, riwayat)
│   ├── chat_service.py
│   └── history_service.py
├── models/                # Pydantic models (request/response)
│   └── schemas.py
```

## Penjelasan File
- **main.py**: Inisialisasi FastAPI, include router dari folder `routes`.
- **routes/chat.py**: Endpoint `/chat` untuk menerima pertanyaan user dan mengembalikan jawaban AI (Gemini).
- **routes/history.py**: Endpoint `/history/{user_id}` dan `/history/detail/{chat_id}` untuk riwayat chat.
- **services/chat_service.py**: Logic utama proses chat (dummy, bisa diisi call ke LLM/Gemini).
- **services/history_service.py**: Logic ambil/simpan riwayat chat (dummy, bisa dihubungkan ke database).
- **models/schemas.py**: Pydantic model untuk request/response API.

## Cara Menjalankan
1. Masuk ke folder AI:
   ```bash
   cd AI
   ```
2. Install dependensi:
   ```bash
   pip install fastapi uvicorn requests python-dotenv google-generativeai
   ```
3. Buat file `.env` dan isi dengan:
   ```
   GOOGLE_API_KEY=isi_api_key_gemini_anda
   ```
4. Jalankan server:
   ```bash
   uvicorn main:app --reload
   ```
5. Endpoint utama:
   - `POST /chat` — kirim pertanyaan ke AI
   - `GET /history/{user_id}` — ambil daftar riwayat chat user
   - `GET /history/detail/{chat_id}` — ambil detail chat tertentu

## Contoh Prompt Engineering untuk Gemini

**Prompt System Sederhana:**
```
Kamu adalah asisten cerdas yang membantu petani Indonesia. Jawablah setiap pertanyaan dengan bahasa Indonesia yang sopan, mudah dipahami, dan berikan solusi praktis sesuai konteks pertanian di Indonesia.
```

**Prompt dengan Few-shot (contoh tanya-jawab):**
```
Kamu adalah asisten pertanian digital. Berikut beberapa contoh tanya-jawab:

User: Apa pupuk organik terbaik untuk padi?
AI: Beberapa pupuk organik yang baik untuk padi antara lain kompos, pupuk kandang, dan pupuk hijau. Pastikan aplikasi pupuk sesuai dosis dan kondisi lahan.

User: Bagaimana cara mengatasi hama wereng?
AI: Untuk mengatasi hama wereng, lakukan rotasi tanaman, gunakan varietas tahan wereng, dan semprot pestisida nabati jika diperlukan.

Sekarang, jawab pertanyaan berikut dengan pola yang sama:
User: {pertanyaan user}
```

**Prompt RAG (Retrieval Augmented Generation):**
```
Berikut referensi dari database pertanian:
[isi referensi hasil pencarian]

Jawab pertanyaan user berikut berdasarkan referensi di atas:
User: {pertanyaan user}
```

## Catatan
- Untuk hasil AI yang lebih relevan, gunakan prompt system yang spesifik dan tambahkan contoh tanya-jawab.
- Untuk integrasi database atau logic LLM, modifikasi file di folder `services/`.
- Untuk produksi, ganti dummy data dengan database (misal: Supabase/Postgres). 