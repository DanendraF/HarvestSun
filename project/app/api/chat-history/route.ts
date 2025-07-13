import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get("user_id");
  const aiUrl = `http://localhost:1000/history/${user_id}`;
  try {
    const response = await fetch(aiUrl);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil riwayat chat." }, { status: 500 });
  }
} 