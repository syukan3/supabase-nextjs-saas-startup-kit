'use server'

import { createServerClient } from '@supabase/ssr'
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
        // Next.js の cookies() を取得
        const cookieStore = await cookies()

        // createServerClient を用いて Supabase クライアントを作成
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    // クッキーの取得：Next.js の cookies() から全クッキーを返す
                    getAll: () => cookieStore.getAll(),
                    // クッキーの設定：必要に応じて setAll でクッキーを更新
                    setAll: (cookiesToSet) => {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            cookieStore.set(name, value, options)
                        })
                    }
                }
            }
        )

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
