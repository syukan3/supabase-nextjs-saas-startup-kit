'use client'

import Link from 'next/link'
import { Menu, ChevronsLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { UserNav } from './user-nav'
import { NotificationNav } from './notification-nav'
import { useTranslation } from 'react-i18next'

export default function Header({ isNavOpen, onMenuClick }: { isNavOpen: boolean; onMenuClick: () => void }) {
    const { t } = useTranslation()

    return (
        <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-sm h-16 z-20">
            <nav className="h-full mx-auto px-1 sm:px-2 lg:px-4" aria-label="Top">
                <div className="flex h-full w-full items-center">
                    <Button variant="ghost" size="icon" className="mr-2" onClick={onMenuClick}>
                        {isNavOpen ? <ChevronsLeft className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>
                    <Link href="/dashboard" className="text-xl font-bold text-gray-900 dark:text-white mr-auto">
                        {t('header.home')}
                    </Link>
                    <div className="flex items-center space-x-4">
                        <NotificationNav />
                        <UserNav />
                    </div>
                </div>
            </nav>
        </header>
    )
}
