"use client";

import { useState, useEffect } from "react";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "react-i18next";
import { toast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client"; // ★ Supabaseクライアント

/**
 * 通知テーブルのレコード例
 */
type Notification = {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
};

export function NotificationNav() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Sheet が開いたタイミングで通知一覧を取得したい場合は useEffect で監視
  useEffect(() => {
    if (isOpen) {
      void fetchNotifications();
    }
  }, [isOpen]);

  // 未読数をバッジ表示
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // 通知一覧取得
  async function fetchNotifications() {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // notifications テーブルから取得。RLS ポリシーで user_id が絞られるようにする
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to fetch notifications:", error);
        return;
      }
      setNotifications(data || []);
    } catch (err) {
      console.error(err);
    }
  }

  // 1件を既読にする
  async function markOneAsRead(id: string) {
    try {
      const supabase = createClient();
      // 更新
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id);

      if (error) throw error;

      // ローカル state を更新 (画面の即時反映)
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, is_read: true } : notif
        )
      );

      toast({
        title: t("notifications.mark_as_read"),
        description: t("toast.notification_marked_as_read.description"),
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
    }
  }

  // 全件既読
  async function markAllAsRead() {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false);

      if (error) throw error;

      // state も一括更新
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));

      toast({
        title: t("notifications.mark_all_as_read"),
        description: t("notifications.no_notifications"),
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to mark all as read",
        variant: "destructive",
      });
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {/* トリガーボタン */}
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>

      {/* 通知一覧用の Sheet */}
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>{t("notifications.notifications_title")}</SheetTitle>
            <Button variant="outline" onClick={markAllAsRead}>
              {t("notifications.mark_all_as_read")}
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-80px)] mt-4 rounded-md">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 mb-2 rounded-lg cursor-pointer ${
                  notif.is_read
                    ? "bg-gray-50 dark:bg-gray-800"
                    : "bg-blue-50 dark:bg-blue-900"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="pr-4">
                    <h3
                      className={`text-sm font-semibold ${
                        notif.is_read
                          ? "text-gray-700 dark:text-gray-300"
                          : "text-blue-600 dark:text-blue-400"
                      }`}
                    >
                      {notif.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {notif.message}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {notif.created_at}
                    </p>
                  </div>
                  {!notif.is_read && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => markOneAsRead(notif.id)}
                    >
                      <Check className="mr-1 h-4 w-4" />
                      {t("notifications.mark_as_read")}
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 py-4">
              {t("notifications.no_notifications")}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
