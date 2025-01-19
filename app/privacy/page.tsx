'use client'

import { useTranslation } from 'react-i18next'

export default function PrivacyPolicy() {
    const { t } = useTranslation()

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{t('privacy.title')}</h1>
                <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6 text-gray-700 dark:text-gray-300 text-sm">
                        <h2 className="text-xl font-semibold mb-4">{t('privacy.sections.collect.title')}</h2>
                        <p className="mb-4">
                            {t('privacy.sections.collect.content')}
                        </p>

                        <h2 className="text-xl font-semibold mb-4">{t('privacy.sections.use.title')}</h2>
                        <p className="mb-4">
                            {t('privacy.sections.use.content')}
                        </p>

                        {/* Add more sections as needed */}

                    </div>
                </div>
            </div>
        </div>
    )
}
