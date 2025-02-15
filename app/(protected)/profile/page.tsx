"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from "react-i18next"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { createClient } from "@/utils/supabase/client"

type UserProfile = {
  id: string
  email?: string
  full_name: string
  display_name: string
  avatar_url: string
  bio: string
  website: string
  created_at?: string
  updated_at?: string
}

export default function ProfilePage() {
  const { t } = useTranslation()
  const { toast } = useToast()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  // ① 初回マウント時にプロフィール取得
  useEffect(() => {
    fetchProfile()
      .catch((err) => {
        console.error("fetchProfile failed:", err)
      })
  }, [])

  // APIを使ってプロフィール取得
  async function fetchProfile() {
    setLoading(true)
    try {
      const res = await fetch("/api/user-profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
      })
      if (!res.ok) {
        throw new Error("Failed to fetch profile")
      }
      const data = await res.json()
      setProfile(data.profile)
    } catch (err) {
      console.error(err)
      toast({
        title: t("toast.error"),
        description: t("profile.fetch_error"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // APIを使ってプロフィール更新
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!profile) return

    setLoading(true)
    try {
      const body = {
        full_name: profile.full_name,
        display_name: profile.display_name,
        bio: profile.bio,
        website: profile.website,
      }
      const res = await fetch("/api/user-profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        throw new Error("Failed to update profile")
      }

      toast({
        title: t("toast.success"),
        description: t("profile.update_success"),
      })
    } catch (err) {
      console.error(err)
      toast({
        title: t("toast.error"),
        description: t("profile.update_error"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // アバターアップロードは、フロントから直接 supabase.storage を呼ぶ例
  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      const file = e.target.files?.[0]
      if (!file || !profile) return

      // ファイル拡張子
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${profile.id}/${fileName}`

      // ①アップロード
      const { error: uploadError } = await supabase
        .storage
        .from("avatars")
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // ② publicURL取得
      const { data: { publicUrl } } = supabase
        .storage
        .from("avatars")
        .getPublicUrl(filePath)

      // ③ user_profiles.avatar_url を更新（APIではなく直接 upsert でもOK）
      const { error: updateError } = await supabase
        .from("user_profiles")
        .upsert({
          id: profile.id,
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
      if (updateError) throw updateError

      // ローカルstate反映
      setProfile({ ...profile, avatar_url: publicUrl })

      toast({
        title: t("toast.success"),
        description: t("profile.avatar_update_success"),
      })
    } catch (err) {
      console.error(err)
      toast({
        title: t("toast.error"),
        description: t("profile.avatar_update_error"),
        variant: "destructive",
      })
    }
  }

  if (!profile) {
    return (
      <div className="p-4">
        {loading ? "Loading..." : <Button onClick={() => fetchProfile()}>Reload</Button>}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
        {t("profile.title")}
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>{t("profile.basic_info")}</CardTitle>
          <CardDescription>{t("profile.basic_info_desc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* アバター */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={profile.avatar_url || "/placeholder.svg"}
                    alt={profile.full_name}
                  />
                  <AvatarFallback>
                    {profile.full_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleAvatarChange}
                />
              </div>
              <div>
                <h3 className="text-lg font-medium">{t("profile.avatar")}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t("profile.avatar_desc")}
                </p>
              </div>
            </div>

            {/* 氏名・表示名 */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="full_name">{t("profile.full_name")}</Label>
                <Input
                  id="full_name"
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="display_name">{t("profile.display_name")}</Label>
                <Input
                  id="display_name"
                  value={profile.display_name}
                  onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                />
              </div>
            </div>

            {/* Website / Bio */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="website">{t("profile.website")}</Label>
                <Input
                  id="website"
                  value={profile.website}
                  onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">{t("profile.bio")}</Label>
                <Input
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                />
              </div>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? t("common.saving") : t("common.save_changes")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
