'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/hooks/use-toast"
import { useTranslation } from 'react-i18next'

export default function ProfilePage() {
    const { t } = useTranslation()
    const [name, setName] = useState('John Doe')
    const [email, setEmail] = useState('john.doe@example.com')
    const [bio, setBio] = useState('Web developer and tech enthusiast.')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Here you would typically update the profile information in your backend
        console.log({ name, email, bio })
        toast({
            title: t('toast.profile_updated.title'),
            description: t('toast.profile_updated.description'),
        })
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{t('profile.title')}</h1>
            <Card>
                <CardHeader>
                    <CardTitle>{t('profile.info.title')}</CardTitle>
                    <CardDescription>{t('profile.info.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src="/placeholder.svg" alt={name} />
                                <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <Button variant="outline">{t('profile.info.upload_image')}</Button>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">{t('profile.info.name')}</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">{t('profile.info.email')}</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bio">{t('profile.info.bio')}</Label>
                            <Textarea
                                id="bio"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                rows={4}
                            />
                        </div>
                        <Button type="submit">{t('profile.info.save')}</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
