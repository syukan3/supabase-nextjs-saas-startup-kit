'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { useTranslation } from 'next-i18next'

export default function FeedbackPage() {
    const { t } = useTranslation('common')
    const [feedbackType, setFeedbackType] = useState('general')
    const [feedbackText, setFeedbackText] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Here you would typically send the feedback to your backend
        console.log({ feedbackType, feedbackText })
        toast({
            title: t('feedback.form.success.title'),
            description: t('feedback.form.success.description'),
        })
        setFeedbackText('')
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{t('feedback.title')}</h1>
            <Card>
                <CardHeader>
                    <CardTitle>{t('feedback.form.title')}</CardTitle>
                    <CardDescription>{t('feedback.form.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>{t('feedback.form.type.label')}</Label>
                            <RadioGroup defaultValue="general" onValueChange={setFeedbackType}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="general" id="general" />
                                    <Label htmlFor="general">{t('feedback.form.type.general')}</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="bug" id="bug" />
                                    <Label htmlFor="bug">{t('feedback.form.type.bug')}</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="feature" id="feature" />
                                    <Label htmlFor="feature">{t('feedback.form.type.feature')}</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="feedback">{t('feedback.form.content.label')}</Label>
                            <Textarea
                                id="feedback"
                                placeholder={t('feedback.form.content.placeholder')}
                                value={feedbackText}
                                onChange={(e) => setFeedbackText(e.target.value)}
                                rows={5}
                            />
                        </div>
                        <Button type="submit">{t('feedback.form.submit')}</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
