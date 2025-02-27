'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/header'
import { Navbar } from '@/components/navbar'
import { Toaster } from '@/components/ui/toaster'

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isNavOpen, setIsNavOpen] = useState(false)
    const [isNavMinimized, setIsNavMinimized] = useState(false)
    const [isSmallScreen, setIsSmallScreen] = useState(false)
    const [isInitialRender, setIsInitialRender] = useState(true)

    const toggleNav = () => {
        setIsInitialRender(false)
        setIsNavOpen(!isNavOpen)
    }

    const toggleNavMinimized = () => {
        setIsInitialRender(false)
        setIsNavMinimized(!isNavMinimized)
    }

    useEffect(() => {
        const handleResize = () => {
            const smallScreen = window.innerWidth < 1024
            setIsSmallScreen(smallScreen)
            if (!smallScreen) {
                setIsNavOpen(true)
            } else {
                setIsNavOpen(false)
            }
        }

        window.addEventListener('resize', handleResize)
        handleResize()

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <div className="min-h-screen flex flex-col">
            <Header isNavOpen={isNavOpen} onMenuClick={toggleNav} />
            <div className="flex flex-1 pt-16">
                <Navbar isOpen={isNavOpen} isMinimized={isNavMinimized} onToggle={toggleNavMinimized} isInitialRender={isInitialRender} />
                <main className={`flex-grow p-8 ${!isInitialRender ? 'transition-all duration-300' : ''} ${isNavOpen ? (isNavMinimized ? 'lg:ml-16' : 'lg:ml-60') : ''}`}>
                    {children}
                </main>
            </div>
            {isNavOpen && isSmallScreen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-10"
                    onClick={toggleNav}
                    style={{ marginLeft: '224px' }}
                />
            )}
            <Toaster />
        </div>
    )
}
