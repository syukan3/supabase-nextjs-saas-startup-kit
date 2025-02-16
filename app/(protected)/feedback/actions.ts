'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

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
        const supabase = await createClient()

        // セッションとユーザー情報を取得
        const {
            data: { user },
            error: userError
        } = await supabase.auth.getUser()

        if (userError) {
            console.error('[User Error]', userError)
            return {
                success: false,
                error: 'unauthorized',
                details: userError.message
            }
        }

        if (!user) {
            console.error('[No User]')
            return {
                success: false,
                error: 'unauthorized',
                details: 'No active user found'
            }
        }

        // ユーザー情報を users テーブルに upsert して、外部キー制約エラーを回避する
        const { error: upsertError } = await supabase
            .from('users')
            .upsert({ id: user.id, email: user.email });
        if (upsertError) {
            console.error('[User Upsert Error]', upsertError);
            return {
                success: false,
                error: 'database_error',
                details: upsertError.message
            };
        }

        // 挿入前にユーザー情報をログ出力
        console.log('[User Info]', {
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
            console.error('[Feedback Insert Error]', {
                code: insertError.code,
                message: insertError.message,
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
        return { success: true }
    } catch (error) {
        console.error('[Feedback Action Error]', error)
        return {
            success: false,
            error: 'internal_error',
            details: error instanceof Error ? error.message : 'Unknown error occurred'
        }
    }
}
