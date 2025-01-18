'use client'

import { useState } from 'react'
import { Bell } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"

type Notification = {
    id: string
    title: string
    description: string
    isUnread: boolean
}

const dummyNotifications: Notification[] = [
    { id: '1', title: 'New Message', description: 'You have a new message from John.', isUnread: true },
    { id: '2', title: 'Task Deadline', description: 'The deadline for Project X is approaching.', isUnread: true },
    { id: '3', title: 'System Update', description: 'The system has been successfully updated.', isUnread: false },
    { id: '4', title: 'Meeting Reminder', description: 'Team meeting tomorrow at 10 AM.', isUnread: false },
    { id: '5', title: 'New Feature Announcement', description: 'A new feature has been released. Check it out!', isUnread: true },
]

export function NotificationNav() {
    const [notifications, setNotifications] = useState<Notification[]>(dummyNotifications)
    const [isOpen, setIsOpen] = useState(false)

    const unreadCount = notifications.filter(n => n.isUnread).length

    const markAsRead = (id: string) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, isUnread: false } : n
        ))
    }

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-[1.2rem] w-[1.2rem]" />
                    {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                    <SheetTitle>Notifications</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-80px)] mt-6 rounded-md">
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`mb-4 p-4 rounded-lg ${notification.isUnread
                                ? 'bg-blue-50 dark:bg-blue-900/20'
                                : 'bg-gray-50 dark:bg-gray-800/50'
                                }`}
                            onClick={() => markAsRead(notification.id)}
                        >
                            <h3 className={`text-sm font-semibold ${notification.isUnread ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                                }`}>
                                {notification.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {notification.description}
                            </p>
                        </div>
                    ))}
                </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}
