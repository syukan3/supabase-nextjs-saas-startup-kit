'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useTranslation } from 'react-i18next'
import { toast } from "@/hooks/use-toast"
import { submitFeedback, FeedbackType } from './actions'
import { useRouter } from 'next/navigation'
import { logger } from '@/lib/logger'

export default function FeedbackPage() {
    const { t } = useTranslation('common')
    const router = useRouter()
    const [feedbackType, setFeedbackType] = useState<FeedbackType>('general')
    const [feedbackText, setFeedbackText] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!feedbackText.trim()) {
            toast({
                title: t('toast.error'),
                description: t('feedback.form.error.empty_content'),
                variant: 'destructive',
            })
            return
        }

        setIsSubmitting(true)

        try {
            const result = await submitFeedback(feedbackType, feedbackText)

            if (!result.success) {
                if (result.error === 'unauthorized') {
                    // 未ログインなどのリダイレクトパターン
                    toast({
                        title: t('toast.error'),
                        description: t('common.errors.unauthorized'),
                        variant: 'destructive',
                    })
                    router.push('/login')
                } else if (result.error === 'validation_error') {
                    // バリデーションエラーの場合、各エラーメッセージを翻訳
                    const errorMessages = Array.isArray(result.details)
                        ? result.details.map(err => t(err)).join(', ')
                        : t(result.details || 'feedback.form.error.validation');
                    toast({
                        title: t('toast.error'),
                        description: errorMessages,
                        variant: 'destructive',
                    })
                } else {
                    logger.error('Feedback submission error', result.details ? new Error(String(result.details)) : new Error('Unknown error'))
                    toast({
                        title: t('toast.error'),
                        description: t('feedback.form.error.submission'),
                        variant: 'destructive',
                    })
                }
            } else {
                // 成功時
                toast({
                    title: t('feedback.form.success.title'),
                    description: t('feedback.form.success.description'),
                    // variantを指定すると視覚的に目立たせたりできます（'success'など任意の名称）
                    variant: 'success'
                })

                // フィードバック内容をリセット
                setFeedbackText('')
                setFeedbackType('general')
            }
        } catch (err) {
            logger.error('Unexpected error during feedback submission', err instanceof Error ? err : new Error('Unknown error'))
            toast({
                title: t('toast.error'),
                description: t('feedback.submit_error'),
                variant: 'destructive',
            })
        } finally {
            setIsSubmitting(false)
        }
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
                            <RadioGroup
                                defaultValue="general"
                                onValueChange={(value: string) => setFeedbackType(value as FeedbackType)}
                                value={feedbackType}
                            >
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
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? t('common.submitting') : t('common.submit')}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
