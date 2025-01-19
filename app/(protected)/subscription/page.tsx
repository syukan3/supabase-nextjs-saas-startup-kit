'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const plans = [
    {
        key: 'basic',
        price: "¥1,000",
    },
    {
        key: 'pro',
        price: "¥5,000",
    },
    {
        key: 'enterprise',
        price: "Custom",
    },
]

export default function SubscriptionPage() {
    const { t } = useTranslation()

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{t('subscription.title')}</h1>
            <div className="grid gap-6 md:grid-cols-3">
                {plans.map((plan) => (
                    <Card key={plan.key} className="flex flex-col">
                        <CardHeader>
                            <CardTitle>{t(`subscription.plans.${plan.key}.name`)}</CardTitle>
                            <CardDescription>{t(`subscription.plans.${plan.key}.description`)}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-3xl font-bold mb-4">{plan.price}</p>
                            <ul className="space-y-2">
                                {t(`subscription.plans.${plan.key}.features`, { returnObjects: true }).map((feature: string) => (
                                    <li key={feature} className="flex items-center">
                                        <Check className="h-5 w-5 text-green-500 mr-2" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardContent className="pt-0">
                            <Button className="w-full">{t('subscription.select_plan')}</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
