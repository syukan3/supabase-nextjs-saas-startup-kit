'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/hooks/use-toast"
import { useTranslation } from 'react-i18next'
import { logger } from '@/lib/logger'

export default function PrivacyPage() {
    const { t } = useTranslation()
    const [profileVisibility, setProfileVisibility] = useState('public')
    const [activityTracking, setActivityTracking] = useState(true)
    const [dataSharing, setDataSharing] = useState(false)

    const handleSave = () => {
        // Here you would typically save the privacy settings to your backend
        logger.debug('Privacy settings changed', { profileVisibility, activityTracking, dataSharing })
        toast({
            title: t('toast.privacy_settings_saved.title'),
            description: t('toast.privacy_settings_saved.description'),
        })
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{t('privacy_settings.title')}</h1>
            <Card>
                <CardHeader>
                    <CardTitle>{t('privacy_settings.profile_visibility.title')}</CardTitle>
                    <CardDescription>{t('privacy_settings.profile_visibility.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <RadioGroup value={profileVisibility} onValueChange={setProfileVisibility}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="public" id="public" />
                            <Label htmlFor="public">{t('privacy_settings.profile_visibility.options.public')}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="private" id="private" />
                            <Label htmlFor="private">{t('privacy_settings.profile_visibility.options.private')}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="friends" id="friends" />
                            <Label htmlFor="friends">{t('privacy_settings.profile_visibility.options.friends')}</Label>
                        </div>
                    </RadioGroup>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>{t('privacy_settings.activity_tracking.title')}</CardTitle>
                    <CardDescription>{t('privacy_settings.activity_tracking.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="activity-tracking">{t('privacy_settings.activity_tracking.enable')}</Label>
                        <Switch
                            id="activity-tracking"
                            checked={activityTracking}
                            onCheckedChange={setActivityTracking}
                        />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>{t('privacy_settings.data_sharing.title')}</CardTitle>
                    <CardDescription>{t('privacy_settings.data_sharing.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="data-sharing">{t('privacy_settings.data_sharing.enable')}</Label>
                        <Switch
                            id="data-sharing"
                            checked={dataSharing}
                            onCheckedChange={setDataSharing}
                        />
                    </div>
                </CardContent>
            </Card>
            <Button onClick={handleSave}>{t('privacy_settings.save')}</Button>
        </div>
    )
}
