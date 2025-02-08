'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"
import { login, signup } from '@/app/login/actions'
import { useTranslation } from 'react-i18next'
import { i18n } from '@/i18n.config'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(true)
    const router = useRouter()
    const { t, i18n: i18nInstance } = useTranslation()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        // クライアントサイドでマウント時に実行
        setMounted(true)
        // Cookieから言語設定を読み込む
        const locale = document.cookie.split('; ').find(row => row.startsWith('NEXT_LOCALE='))
        if (locale) {
            const lang = locale.split('=')[1]
            i18nInstance.changeLanguage(lang)
        }
    }, [i18nInstance])

    const handleLanguageChange = (locale: string) => {
        document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`
        i18nInstance.changeLanguage(locale)
    }

    if (!mounted) {
        return null // マウント前は何も表示しない
    }

    return (
        <div className="w-full min-h-screen flex items-center justify-center px-4 sm:px-6 sm:min-h-0">
            <div className="w-full max-w-[480px] bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl sm:shadow-lg">
                <div className="text-center mb-12">
                    <svg
                        className="mx-auto w-20 h-20 mb-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M12 2L2 7L12 12L22 7L12 2Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M2 17L12 22L22 17"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M2 12L12 17L22 12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                        {isLogin ? t('auth.welcomeBack') : t('auth.createAccount')}
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                        {isLogin ? t('auth.signInMessage') : t('auth.signUpMessage')}
                    </p>
                </div>
                <form className="space-y-4">
                    <div>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder={t('auth.email')}
                            className="w-full h-11 px-3 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            required
                        />
                    </div>
                    <div>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder={t('auth.password')}
                            className="w-full h-11 px-3 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            required
                        />
                    </div>
                    <div>
                        <Button formAction={isLogin ? login : signup} type="submit" className="w-full h-11 bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 rounded-lg text-sm font-medium transition-colors duration-200">
                            {isLogin ? t('auth.loginButton') : t('auth.signupButton')}
                        </Button>
                    </div>
                </form>
                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <Separator className="w-full border-t border-gray-300 dark:border-gray-600" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">{t('auth.continueWith')}</span>
                        </div>
                    </div>
                    <div className="mt-6">
                        <Button variant="outline" className="w-full h-11 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400">
                            <svg className="mr-2 h-4 w-4" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                            </svg>
                            {isLogin ? t('auth.signInWithGoogle') : t('auth.signUpWithGoogle')}
                        </Button>
                    </div>
                </div>
                <div className="mt-6 text-center text-sm">
                    {isLogin ? (
                        <>
                            <Link href="/forgot-password" className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200 font-semibold">{t('auth.forgotPassword')}</Link>
                            <div className="mt-4">
                                <span className="text-gray-600 dark:text-gray-400">{t('auth.noAccount')}</span>{' '}
                                <button onClick={() => setIsLogin(false)} className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200 font-semibold">{t('auth.signupButton')}</button>
                            </div>
                        </>
                    ) : (
                        <div>
                            <span className="text-gray-600 dark:text-gray-400">{t('auth.haveAccount')}</span>{' '}
                            <button onClick={() => setIsLogin(true)} className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200 font-semibold">{t('auth.loginButton')}</button>
                        </div>
                    )}
                </div>
                <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
                    {t('auth.termsMessage')}{' '}
                    <Link href="/terms" className="underline hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200">{t('auth.termsLink')}</Link>{' '}
                    {t('auth.andText')}{' '}
                    <Link href="/privacy" className="underline hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200">{t('auth.privacyLink')}</Link>
                </div>
                <div className="mt-6 flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Select defaultValue={i18nInstance.language} onValueChange={handleLanguageChange}>
                        <SelectTrigger className="w-[100px] text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600">
                            <SelectValue placeholder={t('header.language')} />
                        </SelectTrigger>
                        <SelectContent>
                            {i18n.locales.map((locale) => (
                                <SelectItem 
                                    key={locale} 
                                    value={locale}
                                    className="text-gray-500 dark:text-gray-400"
                                >
                                    {t(`header.languages.${locale}`)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <ThemeToggle className="text-gray-500 dark:text-gray-400" />
                </div>
            </div>
        </div>
    )
}
