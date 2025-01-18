'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function ForgotPasswordForm() {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setMessage('')

        // Here you would typically call your API to handle the password reset request
        // For this example, we'll simulate an API call with a timeout
        setTimeout(() => {
            setIsLoading(false)
            setMessage('If an account exists for ' + email + ', you will receive password reset instructions.')
            setEmail('')
        }, 2000)
    }

    return (
        <div className="w-full min-h-screen flex items-center justify-center px-4 sm:px-6 sm:min-h-0">
            <div className="w-full max-w-[480px] bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl sm:shadow-lg">
                <div className="flex justify-end mb-4">
                    <ThemeToggle />
                </div>
                <div className="text-center mb-8">
                    <svg
                        className="mx-auto w-16 h-16 mb-4"
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
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Forgot Password</h1>
                    <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                        Enter your email address to reset your password
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email address"
                            required
                            className="w-full h-11 px-3 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                    </div>
                    <div>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-11 bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 rounded-lg text-sm font-medium transition-colors duration-200"
                        >
                            {isLoading ? 'Sending...' : 'Reset Password'}
                        </Button>
                    </div>
                </form>
                {message && (
                    <div className="mt-4 p-4 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 rounded-md text-sm">
                        {message}
                    </div>
                )}
                <div className="mt-6 text-center text-sm">
                    <Link href="/login" className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200 font-semibold">
                        Back to Sign In
                    </Link>
                </div>
            </div>
        </div>
    )
}
