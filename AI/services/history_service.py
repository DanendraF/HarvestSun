from supabase import create_client, Client
import os
from dotenv import load_dotenv
load_dotenv()

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

# Simpan atau update chat history di database
# Jika chat_id diberikan, update row dan append messages, jika tidak insert baru

def save_chat_history(user_id, title, last_message, messages, chat_id=None):
    if chat_id:
        # Ambil data lama
        old = supabase.table("chat_history").select("messages").eq("id", chat_id).single().execute()
        if old.data and isinstance(old.data.get("messages"), list):
            all_messages = old.data["messages"] + messages
        else:
            all_messages = messages
        res = supabase.table("chat_history").update({
            "last_message": last_message,
            "messages": all_messages
        }).eq("id", chat_id).execute()
        return res.data[0] if res.data else None
    else:
        data = {
            "user_id": user_id,
            "title": title,
            "last_message": last_message,
            "messages": messages
        }
        res = supabase.table("chat_history").insert(data).execute()
        return res.data[0] if res.data else None

# Ambil semua riwayat chat user
def get_history(user_id: str):
    res = supabase.table("chat_history").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
    return res.data

# Ambil detail chat by id
def get_history_detail(chat_id):
    res = supabase.table("chat_history").select("*").eq("id", chat_id).single().execute()
    return res.data

# Hapus chat history by id
def delete_history(chat_id):
    res = supabase.table("chat_history").delete().eq("id", chat_id).execute()
    return True 