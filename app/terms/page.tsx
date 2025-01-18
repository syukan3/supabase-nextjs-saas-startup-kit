export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Terms of Service</h1>
                <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6 text-gray-700 dark:text-gray-300 text-sm">
                        <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
                        <p className="mb-4">
                            By accessing or using our service, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our service.
                        </p>

                        <h2 className="text-xl font-semibold mb-4">2. Use of Service</h2>
                        <p className="mb-4">
                            You agree to use our service only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the service.
                        </p>

                        {/* Add more sections as needed */}

                    </div>
                </div>
            </div>
        </div>
    )
}
