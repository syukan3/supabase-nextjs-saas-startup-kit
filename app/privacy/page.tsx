export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Privacy Policy</h1>
                <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6 text-gray-700 dark:text-gray-300 text-sm">
                        <h2 className="text-xl font-semibold mb-4">1. Information We Collect</h2>
                        <p className="mb-4">
                            We collect information you provide directly to us, such as when you create or modify your account, request services, contact customer support, or otherwise communicate with us.
                        </p>

                        <h2 className="text-xl font-semibold mb-4">2. How We Use Your Information</h2>
                        <p className="mb-4">
                            We use the information we collect to provide, maintain, and improve our services, to develop new ones, and to protect our company and our users.
                        </p>

                        {/* Add more sections as needed */}

                    </div>
                </div>
            </div>
        </div>
    )
}
