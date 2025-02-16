'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { useTranslation } from 'react-i18next'
import { logger } from '@/lib/logger'
import { saveNotificationSettings } from './actions'

export default function NotificationsPage() {
    const { t } = useTranslation()
    // 通知設定の状態を管理
    const [emailNotifications, setEmailNotifications] = useState(true)
    const [pushNotifications, setPushNotifications] = useState(true)
    const [smsNotifications, setSmsNotifications] = useState(false)
    const [marketingEmails, setMarketingEmails] = useState(false)
    const [notificationFrequency, setNotificationFrequency] = useState('daily')

    // 通知設定を保存する関数
    const handleSave = async () => {
        try {
            const result = await saveNotificationSettings({
                email_notifications: emailNotifications,
                push_notifications: pushNotifications,
                sms_notifications: smsNotifications,
                marketing_emails: marketingEmails,
                notification_frequency: notificationFrequency as 'realtime' | 'daily' | 'weekly'
            });

            if (!result.success) {
                toast({
                    title: t('toast.error'),
                    description: t('toast.notification_save_error') || (Array.isArray(result.details) ? result.details.join(', ') : result.details),
                    variant: 'destructive',
                });
            } else {
                toast({
                    title: t('toast.notification_saved.title'),
                    description: t('toast.notification_saved.description'),
                });
            }
        } catch (err) {
            logger.error('Error saving notification settings', err instanceof Error ? err : new Error('Unknown error'));
            toast({
                title: t('toast.error'),
                description: t('toast.notification_save_error'),
                variant: 'destructive',
            });
        }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{t('notifications.title')}</h1>
            {/* 通知チャンネル設定 */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('notifications.channels.title')}</CardTitle>
                    <CardDescription>{t('notifications.channels.description')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="email-notifications">{t('notifications.channels.email')}</Label>
                        <Switch
                            id="email-notifications"
                            checked={emailNotifications}
                            onCheckedChange={setEmailNotifications}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="push-notifications">{t('notifications.channels.push')}</Label>
                        <Switch
                            id="push-notifications"
                            checked={pushNotifications}
                            onCheckedChange={setPushNotifications}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="sms-notifications">{t('notifications.channels.sms')}</Label>
                        <Switch
                            id="sms-notifications"
                            checked={smsNotifications}
                            onCheckedChange={setSmsNotifications}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="marketing-emails">{t('notifications.channels.marketing')}</Label>
                        <Switch
                            id="marketing-emails"
                            checked={marketingEmails}
                            onCheckedChange={setMarketingEmails}
                        />
                    </div>
                </CardContent>
            </Card>
            {/* 通知頻度設定 */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('notifications.frequency.title')}</CardTitle>
                    <CardDescription>{t('notifications.frequency.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Select value={notificationFrequency} onValueChange={setNotificationFrequency}>
                        <SelectTrigger>
                            <SelectValue placeholder={t('notifications.frequency.select')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="realtime">{t('notifications.frequency.realtime')}</SelectItem>
                            <SelectItem value="daily">{t('notifications.frequency.daily')}</SelectItem>
                            <SelectItem value="weekly">{t('notifications.frequency.weekly')}</SelectItem>
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>
            {/* 保存ボタン */}
            <Button onClick={handleSave}>{t('notifications.save')}</Button>
        </div>
    )
}
