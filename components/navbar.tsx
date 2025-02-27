'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { LayoutDashboard, User, Settings, ChevronRight, ChevronDown, FileText, BarChart, Users, Home, Briefcase, HelpCircle, Bell } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { logger } from '@/lib/logger'

const navigation = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        name: 'Projects',
        href: '/dashboard/projects',
        icon: Briefcase,
        subItems: [
            { name: 'All Projects', href: '/dashboard/projects', icon: Briefcase },
            { name: 'Create New', href: '/dashboard/projects/new', icon: FileText },
        ],
    },
]

export function Navbar({ isOpen, isMinimized, onToggle, isInitialRender }: { isOpen: boolean; isMinimized: boolean; onToggle: () => void; isInitialRender: boolean }) {
    const pathname = usePathname()
    const [openItems, setOpenItems] = useState<string[]>([])

    useEffect(() => {
        const currentSection = navigation.find(item =>
            item.subItems?.some(subItem => pathname === subItem.href) || pathname === item.href
        )
        if (currentSection?.name && !openItems.includes(currentSection.name)) {
            setOpenItems(prev => [...prev, currentSection.name])
        }
    }, [pathname])

    useEffect(() => {
        logger.debug('Currently open items', { openItems })
    }, [openItems])

    const toggleItem = (name: string) => {
        logger.debug('Toggling item', { name })
        setOpenItems(prev =>
            prev.includes(name) ? prev.filter(item => item !== name) : [...prev, name]
        )
    }

    const NavItem = ({ item, depth = 0 }: { item: any; depth?: number }) => {
        const isActive = pathname === item.href
        const showTooltip = isMinimized && depth === 0
        const isItemOpen = openItems.includes(item.name)

        logger.debug('Rendering NavItem', {
            name: item.name,
            isOpen: isItemOpen,
            hasSubItems: !!item.subItems
        })

        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div>
                            {item.subItems ? (
                                <Collapsible open={isItemOpen} onOpenChange={() => toggleItem(item.name)}>
                                    <CollapsibleTrigger asChild>
                                        <div
                                            className={`flex items-center justify-between w-full px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200 ${depth > 0 ? 'pl-10' : ''}`}
                                        >
                                            <div className="flex items-center">
                                                <item.icon className={`h-5 w-5 ${isMinimized && depth === 0 ? 'mr-0' : 'mr-4'}`} />
                                                {(!isMinimized || depth > 0) && <span>{item.name}</span>}
                                            </div>
                                            {(!isMinimized || depth > 0) && (
                                                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isItemOpen ? 'rotate-180' : ''}`} />
                                            )}
                                        </div>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="transition-all duration-200">
                                        {item.subItems.map((subItem: any) => (
                                            <NavItem key={subItem.name} item={subItem} depth={depth + 1} />
                                        ))}
                                    </CollapsibleContent>
                                </Collapsible>
                            ) : (
                                <Link
                                    href={item.href}
                                    className={`flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 cursor-pointer ${isActive
                                        ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                        } ${depth > 0 ? 'pl-10' : ''}`}
                                >
                                    <item.icon className={`h-5 w-5 ${isMinimized && depth === 0 ? 'mr-0' : 'mr-4'}`} />
                                    {(!isMinimized || depth > 0) && <span>{item.name}</span>}
                                </Link>
                            )}
                        </div>
                    </TooltipTrigger>
                    {showTooltip && (
                        <TooltipContent side="right">
                            <p>{item.name}</p>
                        </TooltipContent>
                    )}
                </Tooltip>
            </TooltipProvider>
        )
    }

    return (
        <nav className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 shadow-sm ${!isInitialRender ? 'transition-all duration-300' : ''} ${isOpen ? (isMinimized ? 'w-16' : 'w-60') : 'w-0'} lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <ScrollArea className="h-full">
                <div className="space-y-4 py-4">
                    {navigation.map((item) => (
                        <NavItem key={item.name} item={item} />
                    ))}
                </div>
            </ScrollArea>
        </nav>
    )
}
