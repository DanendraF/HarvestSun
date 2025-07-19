"use client";

import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MessageCircle, Send, User, Bot, History, X } from "lucide-react";
import { Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function ChatbotPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { role: "ai", text: "👋 Halo! Saya siap membantu pertanyaan seputar pertanian digital. Silakan tanya apa saja." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [historyError, setHistoryError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  // Tambahkan state untuk deteksi desktop
  const [isDesktop, setIsDesktop] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const suggestionsList = [
    "Apa tanaman terbaik untuk musim hujan?",
    "Bagaimana cara mengatasi hama pada padi?",
    "Kapan waktu panen terbaik untuk tomat?",
    "Apa pupuk organik yang disarankan?",
    "Bagaimana sistem irigasi tetes bekerja?",
    "Cuaca minggu ini cocok untuk menanam apa?",
    "Bagaimana mendeteksi penyakit pada daun?",
    "Apa strategi pemasaran hasil panen?",
    "Bagaimana membuat kompos alami sendiri?"
  ];

  useEffect(() => {
    showRandomSuggestions();
  }, []);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (user && user.id) fetchHistory();
  }, [user]);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 640);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  async function fetchHistory() {
    if (!user || !user.id) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat-history?user_id=${user.id}`);
    const data = await res.json();
    if (Array.isArray(data.history)) {
      setHistory(data.history);
      setHistoryError("");
    } else {
      setHistory([]);
      setHistoryError(data.error || "Gagal mengambil riwayat chat.");
    }
  }

  async function fetchHistoryDetail(chat_id: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat-history/detail?chat_id=${chat_id}`);
    const data = await res.json();
    if (data && data.messages) {
      // Mapping messages dari Supabase ke format state messages FE
      const mapped = data.messages.map((msg: any) => ({
        role: msg.role,
        text: msg.content
      }));
      setMessages(mapped);
      setActiveChatId(chat_id);
    }
    setSidebarOpen(false);
  }

  function showRandomSuggestions() {
    const shuffled = [...suggestionsList].sort(() => 0.5 - Math.random());
    setSuggestions(shuffled.slice(0, 3));
  }

  function addMessage(role: string, text: string) {
    setMessages((prev) => [...prev, { role, text }]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const question = input.trim();
    if (!question || !user) return;
    addMessage("user", question);
    setInput("");
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chatbot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, question, chat_id: activeChatId }),
      });
      const data = await response.json();
      const reply = data.reply || "Tidak ada respons dari AI.";
      addMessage("ai", reply);
      // Update activeChatId jika dapat chat_id baru
      if (data.chat_id && data.chat_id !== activeChatId) {
        setActiveChatId(data.chat_id);
        // Tambahkan ke history hanya jika chat_id baru
        if (!history.some((h) => h.id === data.chat_id)) {
          setHistory((prev) => [
            {
              id: data.chat_id,
              user_id: user.id,
              title: question.slice(0, 30),
              last_message: reply,
              messages: [
                { role: "user", content: question },
                { role: "ai", content: reply }
              ],
              created_at: new Date()
            },
            ...prev
          ]);
        }
      }
      showRandomSuggestions();
    } catch (err) {
      addMessage("ai", "Terjadi kesalahan saat mengambil respons dari AI.");
      showRandomSuggestions();
    } finally {
      setLoading(false);
    }
  }

  function handleSuggestionClick(q: string) {
    setInput(q);
  }

  // Fungsi hapus history
  async function handleDeleteHistory(chat_id: string) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat-history/${chat_id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setHistory((prev) => prev.filter((item) => item.id !== chat_id));
        if (activeChatId === chat_id) {
          setActiveChatId(null);
          setMessages([{ role: "ai", text: "👋 Halo! Saya siap membantu pertanyaan seputar pertanian digital. Silakan tanya apa saja." }]);
        }
      }
    } catch (e) {
      // Optional: tampilkan error
    }
  }

  return (
    <DashboardLayout>
      <div className="relative w-full min-h-screen h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="max-w-4xl mx-auto flex flex-col min-h-screen h-full p-0 sm:p-6 relative">
          <div className="w-full mt-8 mb-4 flex items-center justify-between px-2 sm:px-0 relative">
            <h1 className="text-2xl font-bold flex items-center gap-2 text-earth-green-700 mb-2">
              <MessageCircle className="h-6 w-6 text-earth-green-600" /> Chatbot
            </h1>
            <div className="flex gap-2 absolute right-0 top-0 mt-1 mr-2 z-10">
              <button
                className="flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded-lg text-sm border border-blue-200 shadow-sm"
                onClick={() => {
                  setMessages([{ role: "ai", text: "👋 Halo! Saya siap membantu pertanyaan seputar pertanian digital. Silakan tanya apa saja." }]);
                  setSidebarOpen(false);
                  setActiveChatId(null);
                }}
              >
                <Bot className="h-5 w-5" /> New Chat
              </button>
              <button
                className="flex items-center gap-1 bg-green-100 hover:bg-green-200 text-green-800 px-3 py-1 rounded-lg text-sm border border-green-200 shadow-sm"
                onClick={() => setSidebarOpen(true)}
              >
                <History className="h-5 w-5" /> Riwayat
              </button>
            </div>
          </div>
          <div className="w-full flex-1 flex flex-col rounded-2xl bg-white/80 shadow-xl border border-green-100 h-full min-h-[400px] max-h-full" style={{ minHeight: 420 }}>
            <div
              className="flex-1 overflow-y-auto p-4 space-y-3 pb-32 sm:pb-4"
              ref={chatBoxRef}
              id="chatBox"
              style={{ scrollBehavior: 'smooth', minHeight: 0 }}
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-end gap-2 animate-fade-in ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "ai" && (
                    <div className="flex-shrink-0 bg-green-100 rounded-full p-1">
                      <Bot className="h-6 w-6 text-green-600" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-md whitespace-pre-line text-base transition-all duration-200 leading-relaxed break-words
                      ${msg.role === "user"
                        ? "bg-green-500 text-white rounded-br-md ml-2"
                        : "bg-white text-green-900 rounded-bl-md border border-green-100 mr-2"
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.role === "user" && (
                    <div className="flex-shrink-0 bg-green-500 rounded-full p-1">
                      <User className="h-6 w-6 text-white" />
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex items-end gap-2 animate-fade-in justify-start">
                  <div className="flex-shrink-0 bg-green-100 rounded-full p-1">
                    <Bot className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="max-w-[80%] px-4 py-2 rounded-2xl shadow-md bg-white text-green-900 border border-green-100 opacity-70 flex items-center gap-2">
                    <span className="dot-flashing"></span>
                    <span>Mengetik...</span>
                  </div>
                </div>
              )}
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t bg-white/90 rounded-b-2xl shadow-inner flex-wrap fixed bottom-0 left-0 right-0 sm:static z-20 max-w-4xl mx-auto w-full" id="chatForm">
              <input
                id="userInput"
                className="flex-1 border border-green-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-200 bg-green-50 text-green-900 min-w-0 w-full sm:w-auto max-w-full"
                placeholder="Tulis pertanyaan..."
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={loading}
                autoComplete="off"
                style={{ minHeight: 44 }}
              />
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-1 disabled:opacity-60 shadow w-full sm:w-auto justify-center mt-2 sm:mt-0"
                disabled={loading || !input.trim()}
                style={{ minHeight: 44 }}
              >
                <Send className="h-5 w-5" />
                Kirim
              </button>
            </form>
          </div>
          <div className="w-full mt-4 px-2 sm:px-0">
            <div className="suggestions flex flex-wrap gap-2 justify-start">
              <span className="w-full text-sm text-green-700 mb-1">Pertanyaan cepat:</span>
              {suggestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="bg-green-100 hover:bg-green-200 text-green-800 px-3 py-1 rounded-lg text-sm border border-green-200 shadow-sm"
                  onClick={() => handleSuggestionClick(q)}
                  disabled={loading}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
          <style jsx global>{`
            @keyframes fade-in {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in {
              animation: fade-in 0.4s;
            }
            .dot-flashing {
              position: relative;
              width: 1.2em;
              height: 1em;
              margin-right: 0.5em;
            }
            .dot-flashing:before, .dot-flashing:after, .dot-flashing {
              content: '';
              display: inline-block;
              position: absolute;
              top: 0.4em;
              width: 0.3em;
              height: 0.3em;
              border-radius: 50%;
              background: #22c55e;
              animation: dotFlashing 1s infinite linear alternate;
            }
            .dot-flashing:before {
              left: 0;
              animation-delay: 0s;
            }
            .dot-flashing {
              left: 0.45em;
              animation-delay: 0.3s;
            }
            .dot-flashing:after {
              left: 0.9em;
              animation-delay: 0.6s;
            }
            @keyframes dotFlashing {
              0% { opacity: 0.2; }
              50%, 100% { opacity: 1; }
            }
            body { overflow-x: hidden; }
          `}</style>
        </div>
        {/* Sidebar Riwayat Chat (overlay, sama di desktop & mobile) */}
        {sidebarOpen && (
          <div className="w-72 max-w-full bg-white/90 border-l border-green-100 shadow-lg p-4 flex flex-col min-h-screen h-full fixed right-0 top-0 z-30 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-bold text-green-700">Riwayat Chat</h2>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="h-5 w-5 text-green-700" />
              </button>
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto">
              {historyError && <div className="text-red-600 text-sm">{historyError}</div>}
              {history.length === 0 && !historyError && <div className="text-green-600 text-sm">Belum ada riwayat chat.</div>}
              {history.map((item) => (
                <div key={item.id} className="p-3 rounded-lg bg-green-50 hover:bg-green-100 cursor-pointer shadow-sm flex items-center justify-between group" onClick={e => { if ((e.target as HTMLElement).closest('.delete-btn')) return; fetchHistoryDetail(item.id); }}>
                  <div>
                    <div className="font-semibold text-green-800 truncate">{item.title}</div>
                    <div className="text-xs text-green-600 truncate">{item.last_message}</div>
                  </div>
                  <button className="delete-btn ml-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => { e.stopPropagation(); handleDeleteHistory(item.id); }} title="Hapus history">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 