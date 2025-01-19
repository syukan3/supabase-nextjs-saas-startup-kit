'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { useTranslation } from 'next-i18next'

const faqs = [
    'cancel_subscription',
    'payment_method',
    'add_users',
    'export_data',
    'two_factor'
]

export default function HelpPage() {
    const { t } = useTranslation('common')

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{t('help.title')}</h1>
            <Card>
                <CardHeader>
                    <CardTitle>{t('help.faq.title')}</CardTitle>
                    <CardDescription>{t('help.faq.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                            <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger>{t(`help.faq.questions.${faq}.question`)}</AccordionTrigger>
                                <AccordionContent>{t(`help.faq.questions.${faq}.answer`)}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>{t('help.support.title')}</CardTitle>
                    <CardDescription>{t('help.support.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <p>{t('help.support.hours')}</p>
                        <div className="flex space-x-4">
                            <Button asChild>
                                <Link href="/dashboard/help/contact">{t('help.support.contact_button')}</Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/dashboard/docs">{t('help.support.docs_button')}</Link>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
