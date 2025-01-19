'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"
import { useTranslation } from 'react-i18next'

export default function SecurityPage() {
    const { t } = useTranslation()
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [twoFactor, setTwoFactor] = useState(false)

    const handlePasswordChange = (e: React.FormEvent) => {
        e.preventDefault()
        // Here you would typically update the password in your backend
        console.log({ currentPassword, newPassword, confirmPassword })
        toast({
            title: t('toast.password_changed.title'),
            description: t('toast.password_changed.description'),
        })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
    }

    const handleTwoFactorToggle = () => {
        setTwoFactor(!twoFactor)
        // Here you would typically enable/disable two-factor authentication in your backend
        toast({
            title: t('toast.two_factor_toggled.title', { status: t(`toast.two_factor_toggled.${twoFactor ? 'disabled' : 'enabled'}`) }),
            description: t('toast.two_factor_toggled.description', { status: t(`toast.two_factor_toggled.${twoFactor ? 'disabled' : 'enabled'}`) }),
        })
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{t('security.title')}</h1>
            <Card>
                <CardHeader>
                    <CardTitle>{t('security.password.title')}</CardTitle>
                    <CardDescription>{t('security.password.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="current-password">{t('security.password.current')}</Label>
                            <Input
                                id="current-password"
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-password">{t('security.password.new')}</Label>
                            <Input
                                id="new-password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">{t('security.password.confirm')}</Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <Button type="submit">{t('security.password.change')}</Button>
                    </form>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>{t('security.two_factor.title')}</CardTitle>
                    <CardDescription>{t('security.two_factor.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="two-factor">{t('security.two_factor.enable')}</Label>
                        <Switch
                            id="two-factor"
                            checked={twoFactor}
                            onCheckedChange={handleTwoFactorToggle}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
