"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { createClient } from "@/utils/supabase/client"; // ★ Supabaseクライアント

export default function NotificationsPage() {
  const { t } = useTranslation();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [notificationFrequency, setNotificationFrequency] = useState("daily");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 画面初回表示時に、user_settings から既存の通知設定を取得
    fetchUserNotificationSettings();
  }, []);

  async function fetchUserNotificationSettings() {
    try {
      const supabase = createClient();
      // 認証中ユーザーを取得
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // user_settings テーブルから該当ユーザーの設定を取得
      const { data, error } = await supabase
        .from("user_settings")
        .select("email_notifications, notification_preferences")
        .eq("user_id", user.id)
        .single();

      if (error || !data) {
        // 未作成の場合やエラーの場合、デフォルトのまま使う
        console.log("No existing notification settings found.");
        return;
      }

      // 取得したデータを state に反映
      setEmailNotifications(data.email_notifications ?? true);

      const prefs = data.notification_preferences || {};
      setPushNotifications(prefs.push ?? true);
      setSmsNotifications(prefs.sms ?? false);
      setNotificationFrequency(prefs.frequency ?? "daily");
    } catch (err) {
      console.error("Failed to fetch notification settings:", err);
    }
  }

  async function handleSave() {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "No user is logged in",
          variant: "destructive"
        });
        return;
      }

      // user_settings テーブルに Upsert
      // (既に存在すれば更新・無ければ挿入)
      const { error } = await supabase
        .from("user_settings")
        .upsert({
          user_id: user.id,
          email_notifications: emailNotifications,
          // notification_preferences カラムにまとめて保存
          notification_preferences: {
            push: pushNotifications,
            sms: smsNotifications,
            frequency: notificationFrequency,
            // その他 in_app 等を使うならここに追記
          },
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: t("toast.notification_saved.title"),
        description: t("toast.notification_saved.description"),
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to save notification settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
        {t("notifications.title")}
      </h1>
      
      {/* 通知チャンネルの設定 */}
      <Card>
        <CardHeader>
          <CardTitle>{t("notifications.channels.title")}</CardTitle>
          <CardDescription>{t("notifications.channels.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications">{t("notifications.channels.email")}</Label>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="push-notifications">{t("notifications.channels.push")}</Label>
            <Switch
              id="push-notifications"
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="sms-notifications">{t("notifications.channels.sms")}</Label>
            <Switch
              id="sms-notifications"
              checked={smsNotifications}
              onCheckedChange={setSmsNotifications}
            />
          </div>
        </CardContent>
      </Card>

      {/* 通知頻度の設定 */}
      <Card>
        <CardHeader>
          <CardTitle>{t("notifications.frequency.title")}</CardTitle>
          <CardDescription>{t("notifications.frequency.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={notificationFrequency} onValueChange={setNotificationFrequency}>
            <SelectTrigger>
              <SelectValue placeholder={t("notifications.frequency.select")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="realtime">{t("notifications.frequency.realtime")}</SelectItem>
              <SelectItem value="daily">{t("notifications.frequency.daily")}</SelectItem>
              <SelectItem value="weekly">{t("notifications.frequency.weekly")}</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={loading}>
        {loading ? "Saving..." : t("notifications.save")}
      </Button>
    </div>
  );
}
