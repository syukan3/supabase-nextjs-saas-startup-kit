// app/api/notifications/[id]/route.ts
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { is_read = true } = await request.json();

    const { error } = await supabase
      .from("notifications")
      .update({ is_read })
      .eq("user_id", session.user.id)
      .eq("id", id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Notifications PATCH Error]", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
