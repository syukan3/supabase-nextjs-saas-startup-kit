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
import { useState } from 'react'
import { User, UserCog, Shield, Eye, Bell, CreditCard, Receipt, BarChart3, HelpCircle, MessageSquare, Languages, Palette, LogOut, Sun, Moon, Laptop, Check } from 'lucide-react'
import { logout } from '@/app/login/actions'

export function UserNav() {
    const router = useRouter()
    const { setTheme, theme } = useTheme()
    const email = "user@example.com" // Replace with actual user email
    const [language, setLanguage] = useState('日本語')

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
                    <DropdownMenuItem className="py-3">
                        <User className="mr-2 h-4 w-4" />
                        <span>プロフィール</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="py-3">
                        <UserCog className="mr-2 h-4 w-4" />
                        <span>アカウント設定変更</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="py-3">
                        <Shield className="mr-2 h-4 w-4" />
                        <span>セキュリティ設定</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="py-3">
                        <Eye className="mr-2 h-4 w-4" />
                        <span>プライバシー設定</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="py-3">
                        <Bell className="mr-2 h-4 w-4" />
                        <span>通知設定</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem className="py-3">
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span>契約プラン</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="py-3">
                        <Receipt className="mr-2 h-4 w-4" />
                        <span>請求情報の確認</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="py-3">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        <span>使用量の確認</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem className="py-3">
                        <HelpCircle className="mr-2 h-4 w-4" />
                        <span>ヘルプとサポート</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="py-3">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        <span>フィードバック</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="py-3">
                            <Languages className="mr-2 h-4 w-4" />
                            <span>言語</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem onClick={() => setLanguage('English')}>
                                <div className="w-4 h-4 mr-2 inline-flex items-center justify-center">
                                    {language === 'English' && <Check className="h-4 w-4" />}
                                </div>
                                <span>English</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setLanguage('日本語')}>
                                <div className="w-4 h-4 mr-2 inline-flex items-center justify-center">
                                    {language === '日本語' && <Check className="h-4 w-4" />}
                                </div>
                                <span>日本語</span>
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="py-3">
                            <Palette className="mr-2 h-4 w-4" />
                            <span>テーマ</span>
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
                    <span>ログアウト</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
