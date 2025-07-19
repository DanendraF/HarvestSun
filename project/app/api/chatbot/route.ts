export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { user_id, question, chat_id } = await req.json();
  const aiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/chatbot`;
  try {
    const response = await fetch(aiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, question, chat_id }),
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghubungi AI Service." }, { status: 500 });
  }
} 