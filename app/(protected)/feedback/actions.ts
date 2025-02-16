'use server'

import { z } from 'zod';
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { logger } from '@/lib/logger'

// フィードバックのバリデーションスキーマを定義
const FeedbackInputSchema = z.object({
    feedbackType: z.enum(['general', 'bug', 'feature'], {
        required_error: 'feedback.form.error.invalid_type',
        invalid_type_error: 'feedback.form.error.invalid_type',
    }),
    feedbackText: z.string()
        .min(1, 'feedback.form.error.empty_content')
        .max(1000, 'feedback.form.error.too_long'),
});

export type FeedbackResponse = {
    success: boolean
    error?: string
    details?: string
}

export async function submitFeedback(
    feedbackType: string,
    feedbackText: string
): Promise<FeedbackResponse> {
    try {
        // 入力値のバリデーション
        try {
            FeedbackInputSchema.parse({ feedbackType, feedbackText });
        } catch (validationError) {
            if (validationError instanceof z.ZodError) {
                // エラーメッセージをi18nキーとして返す
                return {
                    success: false,
                    error: 'validation_error',
                    details: validationError.errors.map(err => err.message).join('||')
                };
            }
        }

        const supabase = await createClient()

        // セッションとユーザー情報を取得
        const {
            data: { user },
            error: userError
        } = await supabase.auth.getUser()

        if (userError) {
            logger.error('User authentication error', userError)
            return {
                success: false,
                error: 'unauthorized',
                details: 'feedback.form.error.unauthorized'
            }
        }

        if (!user) {
            logger.error('No active user found')
            return {
                success: false,
                error: 'unauthorized',
                details: 'feedback.form.error.unauthorized'
            }
        }

        // ユーザー情報を users テーブルに upsert
        const { error: upsertError } = await supabase
            .from('users')
            .upsert({ id: user.id, email: user.email });
        if (upsertError) {
            logger.error('Error upserting user information', upsertError);
            return {
                success: false,
                error: 'database_error',
                details: upsertError.message
            };
        }

        // フィードバック送信前のログ
        logger.info('Feedback submission preparation complete', {
            userId: user.id,
            feedbackType,
            contentLength: feedbackText.length
        })

        // feedback テーブルにデータを挿入
        const { error: insertError } = await supabase
            .from('feedback')
            .insert({
                user_id: user.id,
                feedback_type: feedbackType,
                content: feedbackText
            })

        if (insertError) {
            logger.error('Feedback registration error', insertError, {
                code: insertError.code,
                details: insertError.details,
                hint: insertError.hint
            })
            return {
                success: false,
                error: 'database_error',
                details: insertError.message
            }
        }

        // /feedback ページの再検証をトリガー
        revalidatePath('/feedback')
        logger.info('Feedback submitted successfully', { userId: user.id, feedbackType })
        return { success: true }
    } catch (error) {
        logger.error('Unexpected error during feedback processing', error instanceof Error ? error : new Error('Unknown error'))
        return {
            success: false,
            error: 'internal_error',
            details: error instanceof Error ? error.message : 'Unknown error occurred'
        }
    }
}
