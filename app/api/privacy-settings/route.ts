// app/api/privacy-settings/route.ts
import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

/**
 * GET: ログインユーザーのプライバシー設定を取得
 */
export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // user_settings から privacy_preferences を取得
    const { data, error } = await supabase
      .from("user_settings")
      .select("privacy_preferences")
      .eq("user_id", session.user.id)
      .single()

    if (error) {
      console.error("[PrivacySettings GET Error]", error)
      return NextResponse.json({ error: "DB Error" }, { status: 500 })
    }

    // まだレコードが無い場合の考慮
    if (!data) {
      // デフォルト値を返す
      return NextResponse.json({
        privacy_preferences: {
          profile_visibility: "public",
          activity_tracking: true,
          data_sharing: false,
        },
      })
    }

    // レスポンス
    return NextResponse.json({ privacy_preferences: data.privacy_preferences })
  } catch (error) {
    console.error("[PrivacySettings GET Error]", error)
    return NextResponse.json({ error: "Server Error" }, { status: 500 })
  }
}

/**
 * POST: ログインユーザーのプライバシー設定を更新 (アップサート)
 */
export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { profileVisibility, activityTracking, dataSharing } = await request.json()

    // user_settings にアップサート
    const { error } = await supabase
      .from("user_settings")
      .upsert({
        user_id: session.user.id,
        // JSONB カラムにまとめて保存
        privacy_preferences: {
          profile_visibility: profileVisibility,
          activity_tracking: activityTracking,
          data_sharing: dataSharing,
        },
        updated_at: new Date().toISOString(),
      })

    if (error) {
      console.error("[PrivacySettings POST Error]", error)
      return NextResponse.json({ error: "DB Error" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[PrivacySettings POST Error]", error)
    return NextResponse.json({ error: "Server Error" }, { status: 500 })
  }
}
