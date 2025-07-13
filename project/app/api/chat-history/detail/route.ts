import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const chat_id = searchParams.get("chat_id");
  const aiUrl = `http://localhost:1000/history/detail/${chat_id}`;
  try {
    const response = await fetch(aiUrl);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil detail chat." }, { status: 500 });
  }
} 