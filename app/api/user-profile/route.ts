// app/api/user-profile/route.ts
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * GET: ログイン中ユーザー自身のプロフィールを取得
 */
export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // user_profiles から自分のレコードを取得
    const { data: profile, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      // "PGRST116" => row not found なら後で upsert できるので無視
      console.error(error);
      return NextResponse.json({ error: "Failed to get profile" }, { status: 500 });
    }

    // プロフィールが存在しない場合は、新規に作って返す（初期値）
    if (!profile) {
      const now = new Date().toISOString();
      const { error: insertError } = await supabase
        .from("user_profiles")
        .insert({
          id: session.user.id,
          full_name: "",
          display_name: "",
          bio: "",
          website: "",
          created_at: now,
          updated_at: now
        });

      if (insertError) {
        console.error(insertError);
        return NextResponse.json({ error: "Failed to insert new profile" }, { status: 500 });
      }

      // 挿入直後のレコードを再取得
      const { data: newProfile } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      return NextResponse.json({ profile: newProfile });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/**
 * PATCH: プロフィールの更新
 */
export async function PATCH(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // リクエストボディから更新内容を取得
    const body = await request.json();
    const { full_name, display_name, bio, website } = body;

    // user_profiles を upsert
    const { error } = await supabase
      .from("user_profiles")
      .upsert({
        id: session.user.id,
        full_name,
        display_name,
        bio,
        website,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error(error);
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
