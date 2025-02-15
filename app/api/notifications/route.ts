// app/api/notifications/route.ts
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// GET: ユーザー自身の通知一覧を取得
export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ notifications: data });
  } catch (error) {
    console.error("[Notifications GET Error]", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// POST: 通知を作成(システムから送る用途) / Webhook等で呼ぶ想定
export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, message, type } = await request.json();

    const { error } = await supabase.from("notifications").insert({
      user_id: session.user.id,
      title,
      message,
      type: type || "info",
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Notifications POST Error]", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
