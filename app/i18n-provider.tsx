'use client'

import i18next from 'i18next'
import { I18nextProvider } from 'react-i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'
import { useEffect, useState } from 'react'
import { i18n } from '@/i18n.config'

const i18nInstance = i18next
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)

// 初期化は一度だけ行う
if (!i18next.isInitialized) {
    i18nInstance.init({
        debug: process.env.NODE_ENV === 'development',
        fallbackLng: i18n.defaultLocale,
        supportedLngs: i18n.locales,
        ns: ['common'],
        defaultNS: 'common',
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json'
        },
        interpolation: {
            escapeValue: false,
        },
    })
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>
} 