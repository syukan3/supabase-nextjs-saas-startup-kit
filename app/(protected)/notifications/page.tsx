'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, MessageSquare, CreditCard, AlertTriangle, Check } from 'lucide-react'
import { toast } from "@/hooks/use-toast"
import { useTranslation } from 'react-i18next'

// 通知データの型定義
type Notification = {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'message' | 'payment' | 'alert';
    isRead: boolean;
    date: string;
}

// サンプル通知データ
const sampleNotifications: Notification[] = [
    { id: '1', title: 'システムメンテナンス', message: '明日の午前2時からシステムメンテナンスを行います。', type: 'info', isRead: false, date: '2023-07-01 10:00' },
    { id: '2', title: '新しいメッセージ', message: 'サポートチームからの新しいメッセージがあります。', type: 'message', isRead: false, date: '2023-07-02 14:30' },
    { id: '3', title: '支払い完了', message: '先月分の支払いが完了しました。', type: 'payment', isRead: true, date: '2023-07-03 09:15' },
    { id: '4', title: 'セキュリティ警告', message: '不審なログイン試行がありました。確認してください。', type: 'alert', isRead: false, date: '2023-07-04 22:45' },
    // 追加の通知をここに記述...
]

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications)
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
    const { t } = useTranslation()

    const markAllAsRead = () => {
        setNotifications(notifications.map(notif => ({ ...notif, isRead: true })))
        toast({
            title: t('notifications.mark_all_as_read'),
            description: t('notifications.no_notifications'),
        })
    }

    const getIconForType = (type: Notification['type']) => {
        switch (type) {
            case 'info': return <Bell className="h-5 w-5 text-blue-500" />
            case 'message': return <MessageSquare className="h-5 w-5 text-green-500" />
            case 'payment': return <CreditCard className="h-5 w-5 text-purple-500" />
            case 'alert': return <AlertTriangle className="h-5 w-5 text-red-500" />
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{t('notifications.notifications_title')}</h1>
                <Button onClick={markAllAsRead} variant="outline">{t('notifications.mark_all_as_read')}</Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('notifications.notifications_title')}</CardTitle>
                        <CardDescription>{t('notifications.description')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[400px]">
                            {notifications.length > 0 ? (
                                notifications.map((notif) => (
                                    <div key={notif.id} className="mb-4">
                                        <button
                                            className={`flex items-start space-x-4 w-full text-left p-2 rounded-lg transition-colors ${notif.isRead ? 'bg-gray-50 dark:bg-gray-800' : 'bg-blue-50 dark:bg-blue-900'
                                                } hover:bg-gray-100 dark:hover:bg-gray-700`}
                                            onClick={() => setSelectedNotification(notif)}
                                        >
                                            <div className="flex-shrink-0 mt-1">
                                                {getIconForType(notif.type)}
                                            </div>
                                            <div className="flex-grow">
                                                <p className={`font-medium ${notif.isRead ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>
                                                    {notif.title}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                    {notif.message}
                                                </p>
                                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                    {notif.date}
                                                </p>
                                            </div>
                                            {!notif.isRead && (
                                                <div className="flex-shrink-0">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                </div>
                                            )}
                                        </button>
                                        <Separator className="my-2" />
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                                    {t('notifications.no_notifications')}
                                </div>
                            )}
                        </ScrollArea>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>{t('notifications.detail_title')}</CardTitle>
                        <CardDescription>{t('notifications.detail_description')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {selectedNotification ? (
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    {getIconForType(selectedNotification.type)}
                                    <h3 className="text-lg font-semibold">{selectedNotification.title}</h3>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300">{selectedNotification.message}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{selectedNotification.date}</p>
                                <Button
                                    onClick={() => {
                                        setNotifications(notifications.map(n =>
                                            n.id === selectedNotification.id ? { ...n, isRead: true } : n
                                        ))
                                        toast({
                                            title: t('notifications.mark_as_read'),
                                            description: t('toast.notification_marked_as_read.description'),
                                        })
                                    }}
                                    disabled={selectedNotification.isRead}
                                >
                                    <Check className="mr-2 h-4 w-4" /> {t('notifications.mark_as_read')}
                                </Button>
                            </div>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">{t('notifications.select_notification')}</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
