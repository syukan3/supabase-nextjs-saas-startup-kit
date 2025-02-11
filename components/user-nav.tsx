'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { User, UserCog, Shield, Eye, Bell, CreditCard, Receipt, BarChart3, HelpCircle, MessageSquare, Languages, Palette, LogOut, Sun, Moon, Laptop, Check } from 'lucide-react'
import { logout } from '@/app/login/actions'
import { useTranslation } from 'react-i18next'
import { i18n } from '@/i18n.config'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { isStripeEnabled } from '@/utils/stripe'

export function UserNav() {
    const router = useRouter()
    const { setTheme, theme } = useTheme()
    const { t, i18n: i18nInstance } = useTranslation()
    const [email, setEmail] = useState<string>('')

    useEffect(() => {
        const fetchUserEmail = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setEmail(user.email || '')
            }
        }
        fetchUserEmail()
    }, [])

    const handleLanguageChange = (locale: string) => {
        document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`
        i18nInstance.changeLanguage(locale)
        router.refresh()
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder.svg" alt={email} />
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 mt-2 user-nav-dropdown" align="end">
                <DropdownMenuLabel className="font-normal py-3">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem className="py-3" onClick={() => router.push('/profile')}>
                        <User className="mr-2 h-4 w-4" />
                        <span>{t('header.profile')}</span>
                    </DropdownMenuItem >
                    <DropdownMenuItem className="py-3" onClick={() => router.push('/user-settings')}>
                        <UserCog className="mr-2 h-4 w-4" />
                        <span>{t('header.user-settings')}</span>
                    </DropdownMenuItem >
                    <DropdownMenuItem className="py-3" onClick={() => router.push('/security')}>
                        <Shield className="mr-2 h-4 w-4" />
                        <span>{t('header.security')}</span>
                    </DropdownMenuItem >
                    <DropdownMenuItem className="py-3" onClick={() => router.push('/privacy-settings')}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>{t('header.privacy-settings')}</span>
                    </DropdownMenuItem >
                    <DropdownMenuItem className="py-3" onClick={() => router.push('/notification-settings')}>
                        <Bell className="mr-2 h-4 w-4" />
                        <span>{t('header.notification-settings')}</span>
                    </DropdownMenuItem >
                </DropdownMenuGroup>
                <DropdownMenuSeparator/>
                <DropdownMenuGroup>
                    {isStripeEnabled() && (
                        <>
                            <DropdownMenuItem className="py-3" onClick={() => router.push('/subscription')}>
                                <CreditCard className="mr-2 h-4 w-4" />
                                <span>{t('header.subscription')}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="py-3" onClick={() => router.push('/billing')}>
                                <Receipt className="mr-2 h-4 w-4" />
                                <span>{t('header.billing')}</span>
                            </DropdownMenuItem>
                        </>
                    )}
                    <DropdownMenuItem className="py-3" onClick={() => router.push('/usage')}>
                        <BarChart3 className="mr-2 h-4 w-4" />
                        <span>{t('header.usage')}</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem className="py-3" onClick={() => router.push('/help')}>
                        <HelpCircle className="mr-2 h-4 w-4" />
                        <span>{t('header.help')}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="py-3" onClick={() => router.push('/feedback')}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        <span>{t('header.feedback')}</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="py-3">
                            <Languages className="mr-2 h-4 w-4" />
                            <span>{t('header.language')}</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                            {i18n.locales.map((locale) => (
                                <DropdownMenuItem
                                    key={locale}
                                    onClick={() => handleLanguageChange(locale)}
                                    className="justify-between"
                                >
                                    <span>{t(`header.languages.${locale}`)}</span>
                                    {i18nInstance.language === locale && (
                                        <Check className="h-4 w-4 ml-2" />
                                    )}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="py-3">
                            <Palette className="mr-2 h-4 w-4" />
                            <span>{t('header.theme')}</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem onClick={() => setTheme("light")}>
                                <div className="w-4 h-4 mr-2 inline-flex items-center justify-center">
                                    {theme === 'light' && <Check className="h-4 w-4" />}
                                </div>
                                <Sun className="mr-2 h-4 w-4" />
                                <span>Light</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("dark")}>
                                <div className="w-4 h-4 mr-2 inline-flex items-center justify-center">
                                    {theme === 'dark' && <Check className="h-4 w-4" />}
                                </div>
                                <Moon className="mr-2 h-4 w-4" />
                                <span>Dark</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("system")}>
                                <div className="w-4 h-4 mr-2 inline-flex items-center justify-center">
                                    {theme === 'system' && <Check className="h-4 w-4" />}
                                </div>
                                <Laptop className="mr-2 h-4 w-4" />
                                <span>System</span>
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="py-3" onClick={() => logout()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('header.logout')}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
