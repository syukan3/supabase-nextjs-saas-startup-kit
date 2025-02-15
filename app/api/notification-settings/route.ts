// app/api/notification-settings/route.ts
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { emailNotifications, pushNotifications, smsNotifications, notificationFrequency } = body;

    // upsert 例
    const { error } = await supabase
      .from("user_settings")
      .upsert({
        user_id: session.user.id,
        email_notifications: emailNotifications,
        notification_preferences: {
          push: pushNotifications,
          sms: smsNotifications,
          in_app: true,
          frequency: notificationFrequency,
        },
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error(error);
      return NextResponse.json({ error: "DB Error" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
