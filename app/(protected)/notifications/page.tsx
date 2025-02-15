// app/(protected)/notifications/page.tsx
"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

type Notification = {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
};

export default function NotificationsPage() {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    const res = await fetch("/api/notifications");
    if (res.ok) {
      const data = await res.json();
      setNotifications(data.notifications || []);
    }
  }

  async function markAllAsRead() {
    for (const n of notifications.filter((x) => !x.is_read)) {
      await fetch(`/api/notifications/${n.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_read: true }),
      });
    }
    toast({
      title: t("notifications.mark_all_as_read"),
      description: t("notifications.no_notifications"),
    });
    fetchNotifications();
    setSelectedNotification(null);
  }

  async function markOneAsRead(n: Notification) {
    await fetch(`/api/notifications/${n.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_read: true }),
    });
    toast({
      title: t("notifications.mark_as_read"),
      description: t("toast.notification_marked_as_read.description"),
    });
    fetchNotifications();
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {t("notifications.notifications_title")}
        </h1>
        <Button onClick={markAllAsRead} variant="outline">
          {t("notifications.mark_all_as_read")}
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("notifications.notifications_title")}</CardTitle>
            <CardDescription>{t("notifications.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div key={notif.id} className="mb-4">
                    <button
                      className={`flex items-start space-x-4 w-full text-left p-2 rounded-lg transition-colors ${
                        notif.is_read
                          ? "bg-gray-50 dark:bg-gray-800"
                          : "bg-blue-50 dark:bg-blue-900"
                      } hover:bg-gray-100 dark:hover:bg-gray-700`}
                      onClick={() => setSelectedNotification(notif)}
                    >
                      <div className="flex-grow">
                        <p
                          className={`font-medium ${
                            notif.is_read
                              ? "text-gray-700 dark:text-gray-300"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {notif.title}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {notif.message}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {notif.created_at}
                        </p>
                      </div>
                    </button>
                    <Separator className="my-2" />
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                  {t("notifications.no_notifications")}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("notifications.detail_title")}</CardTitle>
            <CardDescription>{t("notifications.detail_description")}</CardDescription>
          </CardHeader>
          <CardContent>
            {selectedNotification ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{selectedNotification.title}</h3>
                <p className="text-gray-700 dark:text-gray-300">{selectedNotification.message}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedNotification.created_at}
                </p>
                <Button
                  onClick={() => markOneAsRead(selectedNotification)}
                  disabled={selectedNotification.is_read}
                >
                  <Check className="mr-2 h-4 w-4" /> {t("notifications.mark_as_read")}
                </Button>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                {t("notifications.select_notification")}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
