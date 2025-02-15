"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/hooks/use-toast"
import { useTranslation } from 'react-i18next'

type PrivacySettings = {
  profile_visibility: "public" | "private" | "friends"
  activity_tracking: boolean
  data_sharing: boolean
}

export default function PrivacyPage() {
  const { t } = useTranslation()

  // State
  const [profileVisibility, setProfileVisibility] = useState<PrivacySettings["profile_visibility"]>("public")
  const [activityTracking, setActivityTracking] = useState(true)
  const [dataSharing, setDataSharing] = useState(false)
  const [loading, setLoading] = useState(false)

  // マウント時にAPIから現在のプライバシー設定を取得
  useEffect(() => {
    fetchPrivacySettings()
  }, [])

  async function fetchPrivacySettings() {
    try {
      const res = await fetch("/api/privacy-settings")
      if (!res.ok) {
        throw new Error("Failed to fetch privacy settings")
      }
      const data = await res.json()
      if (data.privacy_preferences) {
        setProfileVisibility(data.privacy_preferences.profile_visibility)
        setActivityTracking(data.privacy_preferences.activity_tracking)
        setDataSharing(data.privacy_preferences.data_sharing)
      }
    } catch (error) {
      console.error("fetchPrivacySettings error:", error)
    }
  }

  async function handleSave() {
    setLoading(true)
    try {
      const res = await fetch("/api/privacy-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileVisibility,
          activityTracking,
          dataSharing,
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to save privacy settings")
      }

      toast({
        title: t('toast.privacy_settings_saved.title'),
        description: t('toast.privacy_settings_saved.description'),
      })
    } catch (err) {
      console.error(err)
      toast({
        title: t('toast.error'),
        description: "Failed to save privacy settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
        {t('privacy_settings.title')}
      </h1>

      {/* 1) プロフィール可視化 */}
      <Card>
        <CardHeader>
          <CardTitle>{t('privacy_settings.profile_visibility.title')}</CardTitle>
          <CardDescription>{t('privacy_settings.profile_visibility.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={profileVisibility}
            onValueChange={(val) => setProfileVisibility(val as PrivacySettings["profile_visibility"])}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="public" id="public" />
              <Label htmlFor="public">
                {t('privacy_settings.profile_visibility.options.public')}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="private" id="private" />
              <Label htmlFor="private">
                {t('privacy_settings.profile_visibility.options.private')}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="friends" id="friends" />
              <Label htmlFor="friends">
                {t('privacy_settings.profile_visibility.options.friends')}
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* 2) アクティビティトラッキング */}
      <Card>
        <CardHeader>
          <CardTitle>{t('privacy_settings.activity_tracking.title')}</CardTitle>
          <CardDescription>{t('privacy_settings.activity_tracking.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label htmlFor="activity-tracking">
              {t('privacy_settings.activity_tracking.enable')}
            </Label>
            <Switch
              id="activity-tracking"
              checked={activityTracking}
              onCheckedChange={setActivityTracking}
            />
          </div>
        </CardContent>
      </Card>

      {/* 3) データ共有 */}
      <Card>
        <CardHeader>
          <CardTitle>{t('privacy_settings.data_sharing.title')}</CardTitle>
          <CardDescription>{t('privacy_settings.data_sharing.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label htmlFor="data-sharing">
              {t('privacy_settings.data_sharing.enable')}
            </Label>
            <Switch
              id="data-sharing"
              checked={dataSharing}
              onCheckedChange={setDataSharing}
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={loading}>
        {loading ? "Saving..." : t('privacy_settings.save')}
      </Button>
    </div>
  )
}
