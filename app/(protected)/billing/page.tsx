'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { isStripeEnabled } from '@/utils/stripe'

export default function BillingPage() {
    const { t } = useTranslation()

    if (!isStripeEnabled()) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">{t('stripe.disabled.title')}</h1>
                    <p>{t('stripe.disabled.message')}</p>
                </div>
            </div>
        );
    }

    const invoices = [
        { id: 'INV-001', date: '2023-05-01', amount: '¥5,000' },
        { id: 'INV-002', date: '2023-06-01', amount: '¥5,000' },
        { id: 'INV-003', date: '2023-07-01', amount: '¥5,000' },
    ]

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{t('billing.title')}</h1>
            <Card>
                <CardHeader>
                    <CardTitle>{t('billing.payment_method.title')}</CardTitle>
                    <CardDescription>{t('billing.payment_method.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-4">
                        <CreditCard className="h-6 w-6" />
                        <div>
                            <p className="font-medium">{t('billing.payment_method.card_info')}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('billing.payment_method.expiry')}</p>
                        </div>
                    </div>
                    <Button className="mt-4">{t('billing.payment_method.change_button')}</Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>{t('billing.history.title')}</CardTitle>
                    <CardDescription>{t('billing.history.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {invoices.map((invoice) => (
                            <div key={invoice.id} className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">{invoice.id}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{invoice.date}</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <p>{invoice.amount}</p>
                                    <Button variant="outline" size="icon">
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
