'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/hooks/use-toast"
import { useTranslation } from 'react-i18next'
import { logger } from '@/lib/logger'
import { useRouter } from 'next/navigation'
import { getPrivacySettings, updatePrivacySettings } from './actions'
import { PrivacySettingsFormData, ProfileVisibility } from '@/types/privacy'

export default function PrivacyPage() {
    const { t } = useTranslation()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [settings, setSettings] = useState<PrivacySettingsFormData>({
        profile_visibility: 'public',
        activity_tracking: true,
        data_sharing: false,
    })

    useEffect(() => {
        const loadSettings = async () => {
            const result = await getPrivacySettings()
            if (!result.success) {
                if (result.error === 'unauthorized') {
                    toast({
                        title: t('toast.error'),
                        description: t('common.errors.unauthorized'),
                        variant: 'destructive',
                    })
                    router.push('/login')
                    return
                }
                toast({
                    title: t('toast.error'),
                    description: t('privacy_settings.load_error'),
                    variant: 'destructive',
                })
                return
            }
            if (result.data) {
                setSettings(result.data)
            }
            setIsLoading(false)
        }

        loadSettings()
    }, [router, t])

    const handleSave = async () => {
        setIsSubmitting(true)
        try {
            const result = await updatePrivacySettings(settings)
            if (!result.success) {
                if (result.error === 'unauthorized') {
                    toast({
                        title: t('toast.error'),
                        description: t('common.errors.unauthorized'),
                        variant: 'destructive',
                    })
                    router.push('/login')
                    return
                }
                toast({
                    title: t('toast.error'),
                    description: t('privacy_settings.save_error'),
                    variant: 'destructive',
                })
                return
            }
            toast({
                title: t('toast.privacy_settings_saved.title'),
                description: t('toast.privacy_settings_saved.description'),
                variant: 'success'
            })
        } catch (error) {
            logger.error('Error saving privacy settings', error instanceof Error ? error : new Error('Unknown error'))
            toast({
                title: t('toast.error'),
                description: t('privacy_settings.save_error'),
                variant: 'destructive',
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return <div>{t('common.loading')}</div>
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
                    <RadioGroup
                        value={settings.profile_visibility}
                        onValueChange={(value: ProfileVisibility) =>
                            setSettings({ ...settings, profile_visibility: value })
                        }
                    >
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
                            checked={settings.activity_tracking}
                            onCheckedChange={(checked) =>
                                setSettings({ ...settings, activity_tracking: checked })
                            }
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
                            checked={settings.data_sharing}
                            onCheckedChange={(checked) =>
                                setSettings({ ...settings, data_sharing: checked })
                            }
                        />
                    </div>
                </CardContent>
            </Card>
            <Button onClick={handleSave} disabled={isSubmitting}>
                {isSubmitting ? t('common.saving') : t('common.save_changes')}
            </Button>
        </div>
    )
}
