'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from 'react-i18next'
import type { UserProfile } from '@/types/user'
import { logger } from '@/lib/logger'

export default function ProfilePage() {
    const { t } = useTranslation()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [profile, setProfile] = useState<UserProfile>({
        id: '',
        email: '',
        full_name: '',
        avatar_url: '',
        display_name: '',
        bio: '',
        website: '',
        created_at: '',
        updated_at: ''
    })

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                const { data: profileData, error: profileError } = await supabase
                    .from('user_profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()

                if (profileError && profileError.code !== 'PGRST116') {
                    throw profileError
                }

                const now = new Date().toISOString()

                if (!profileData) {
                    const { error: insertError } = await supabase
                        .from('user_profiles')
                        .insert({
                            id: user.id,
                            full_name: '',
                            display_name: '',
                            bio: '',
                            website: '',
                            created_at: now,
                            updated_at: now
                        })

                    if (insertError) throw insertError
                }

                setProfile({
                    id: user.id,
                    email: user.email || '',
                    full_name: profileData?.full_name || '',
                    avatar_url: profileData?.avatar_url || '',
                    display_name: profileData?.display_name || '',
                    bio: profileData?.bio || '',
                    website: profileData?.website || '',
                    created_at: profileData?.created_at || now,
                    updated_at: profileData?.updated_at || now
                })
            }
        } catch (error) {
            logger.error('Error fetching profile:', error)
            toast({
                title: t('toast.error'),
                description: t('profile.fetch_error'),
                variant: "destructive",
            })
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const supabase = createClient()
            const { error } = await supabase
                .from('user_profiles')
                .upsert({
                    id: profile.id,
                    full_name: profile.full_name,
                    display_name: profile.display_name,
                    bio: profile.bio,
                    website: profile.website,
                    updated_at: new Date().toISOString()
                })

            if (error) throw error

            toast({
                title: t('toast.success'),
                description: t('profile.update_success'),
            })
        } catch (error) {
            logger.error('Error updating profile:', error)
            toast({
                title: t('toast.error'),
                description: t('profile.update_error'),
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = e.target.files?.[0]
            if (!file) return

            const supabase = createClient()
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${profile.id}/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath)

            const { error: updateError } = await supabase
                .from('user_profiles')
                .upsert({
                    id: profile.id,
                    avatar_url: publicUrl,
                    updated_at: new Date().toISOString()
                })

            if (updateError) throw updateError

            setProfile({ ...profile, avatar_url: publicUrl })
            toast({
                title: t('toast.success'),
                description: t('profile.avatar_update_success'),
            })
        } catch (error) {
            logger.error('Error uploading avatar:', error)
            toast({
                title: t('toast.error'),
                description: t('profile.avatar_update_error'),
                variant: "destructive",
            })
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {t('profile.title')}
            </h1>

            <Card>
                <CardHeader>
                    <CardTitle>{t('profile.basic_info')}</CardTitle>
                    <CardDescription>{t('profile.basic_info_desc')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src={profile.avatar_url || '/placeholder.svg'} alt={profile.full_name} />
                                    <AvatarFallback>{profile.full_name?.charAt(0) || 'U'}</AvatarFallback>
                                </Avatar>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleAvatarChange}
                                />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium">{t('profile.avatar')}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {t('profile.avatar_desc')}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="email">{t('profile.email')}</Label>
                                <Input
                                    id="email"
                                    value={profile.email}
                                    disabled
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="full_name">{t('profile.full_name')}</Label>
                                <Input
                                    id="full_name"
                                    value={profile.full_name}
                                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="display_name">{t('profile.display_name')}</Label>
                                <Input
                                    id="display_name"
                                    value={profile.display_name}
                                    onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="website">{t('profile.website')}</Label>
                                <Input
                                    id="website"
                                    value={profile.website}
                                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="bio">{t('profile.bio')}</Label>
                                <Input
                                    id="bio"
                                    value={profile.bio}
                                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                />
                            </div>
                        </div>

                        <Button type="submit" disabled={loading}>
                            {loading ? t('common.saving') : t('common.save_changes')}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
