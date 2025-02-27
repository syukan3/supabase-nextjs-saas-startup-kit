'use client'

import Link from 'next/link'
import { Menu, ChevronsLeft, Layout } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { UserNav } from './user-nav'
import { NotificationNav } from './notification-nav'

export default function Header({ isNavOpen, onMenuClick }: { isNavOpen: boolean; onMenuClick: () => void }) {
    return (
        <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-sm h-16 z-20">
            <nav className="h-full mx-auto px-1 sm:px-2 lg:px-4" aria-label="Top">
                <div className="flex h-full w-full items-center">
                    <Button variant="ghost" size="icon" className="mr-2" onClick={onMenuClick}>
                        {isNavOpen ? <ChevronsLeft className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>
                    <Link href="/dashboard" className="mr-auto font-bold flex items-center">
                        <span className="text-lg">Logo</span>
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
