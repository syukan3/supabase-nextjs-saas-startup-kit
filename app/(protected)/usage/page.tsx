'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useTranslation } from 'react-i18next'

export default function UsagePage() {
    const { t } = useTranslation()
    const data = [
        { name: t('usage.monthly.months.1'), usage: 4000 },
        { name: t('usage.monthly.months.2'), usage: 3000 },
        { name: t('usage.monthly.months.3'), usage: 2000 },
        { name: t('usage.monthly.months.4'), usage: 2780 },
        { name: t('usage.monthly.months.5'), usage: 1890 },
        { name: t('usage.monthly.months.6'), usage: 2390 },
        { name: t('usage.monthly.months.7'), usage: 3490 },
    ]

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{t('usage.title')}</h1>
            <Card>
                <CardHeader>
                    <CardTitle>{t('usage.monthly.title')}</CardTitle>
                    <CardDescription>{t('usage.monthly.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="usage" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>{t('usage.summary.title')}</CardTitle>
                    <CardDescription>{t('usage.summary.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm font-medium">{t('usage.summary.storage.title')}</p>
                            <p className="text-2xl font-bold">{t('usage.summary.storage.value')}</p>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '45.5%' }}></div>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium">{t('usage.summary.api.title')}</p>
                            <p className="text-2xl font-bold">{t('usage.summary.api.value')}</p>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
                                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '87.4%' }}></div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
