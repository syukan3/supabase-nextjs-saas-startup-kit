'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { useTranslation } from 'react-i18next'

export default function SettingsPage() {
    const { t } = useTranslation()
    const [emailNotifications, setEmailNotifications] = useState(true)
    const [marketingEmails, setMarketingEmails] = useState(false)
    const [language, setLanguage] = useState('ja')
    const [timezone, setTimezone] = useState('Asia/Tokyo')

    const handleSave = () => {
        // Here you would typically save the settings to your backend
        console.log({ emailNotifications, marketingEmails, language, timezone })
        toast({
            title: t('toast.user_settings_saved.title'),
            description: t('toast.user_settings_saved.description'),
        })
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{t('user-settings.title')}</h1>
            <Card>
                <CardHeader>
                    <CardTitle>{t('user-settings.general.title')}</CardTitle>
                    <CardDescription>{t('user-settings.general.description')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="email-notifications">{t('user-settings.general.email_notifications')}</Label>
                        <Switch
                            id="email-notifications"
                            checked={emailNotifications}
                            onCheckedChange={setEmailNotifications}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="marketing-emails">{t('user-settings.general.marketing_emails')}</Label>
                        <Switch
                            id="marketing-emails"
                            checked={marketingEmails}
                            onCheckedChange={setMarketingEmails}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="language">{t('user-settings.general.language')}</Label>
                        <Select value={language} onValueChange={setLanguage}>
                            <SelectTrigger id="language">
                                <SelectValue placeholder={t('user-settings.general.language')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ja">{t('header.languages.ja')}</SelectItem>
                                <SelectItem value="en">{t('header.languages.en')}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="timezone">{t('user-settings.general.timezone')}</Label>
                        <Select value={timezone} onValueChange={setTimezone}>
                            <SelectTrigger id="timezone">
                                <SelectValue placeholder={t('user-settings.general.timezone')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                                <SelectItem value="America/New_York">America/New_York</SelectItem>
                                <SelectItem value="Europe/London">Europe/London</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={handleSave}>{t('user-settings.general.save')}</Button>
                </CardContent>
            </Card>
        </div>
    )
}
