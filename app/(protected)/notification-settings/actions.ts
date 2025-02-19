'use server'

import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { logger } from '@/lib/logger';

// 通知設定の入力バリデーションスキーマ
const NotificationSettingsInputSchema = z.object({
    email_notifications: z.boolean(),
    push_notifications: z.boolean(),
    sms_notifications: z.boolean(),
    marketing_emails: z.boolean(),
    notification_frequency: z.enum(['realtime', 'daily', 'weekly']),
});

export type NotificationSettingsInput = z.infer<typeof NotificationSettingsInputSchema>;

export type NotificationSettingsResponse = {
    success: boolean;
    error?: string;
    details?: string | string[];
};

/**
 * 通知設定を保存するサーバーアクション
 * @param {NotificationSettingsInput} input - 通知設定の入力データ
 * @returns {Promise<NotificationSettingsResponse>} - 保存結果
 */
export async function saveNotificationSettings(
    input: NotificationSettingsInput
): Promise<NotificationSettingsResponse> {
    // 入力値のバリデーション
    const validationResult = NotificationSettingsInputSchema.safeParse(input);
    if (!validationResult.success) {
        return {
            success: false,
            error: 'validation_error',
            details: validationResult.error.errors.map(err => err.message),
        };
    }

    try {
        // Supabaseクライアントをサーバー側で生成
        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            logger.error('User authentication error', userError || new Error('User not found'));
            return {
                success: false,
                error: 'unauthorized',
                details: 'notification_settings.error.unauthorized',
            };
        }

        const { data: existingSettings, error: fetchError } = await supabase
            .from('notification_settings')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

        if (fetchError) {
            logger.error('Error fetching existing notification settings', fetchError);
            return {
                success: false,
                error: 'database_error',
                details: fetchError.message,
            };
        }

        let error;
        if (existingSettings) {
            // レコードが存在する場合は更新する
            ({ error } = await supabase
                .from('notification_settings')
                .update({
                    email_notifications: input.email_notifications,
                    push_notifications: input.push_notifications,
                    sms_notifications: input.sms_notifications,
                    marketing_emails: input.marketing_emails,
                    notification_frequency: input.notification_frequency,
                    updated_at: new Date().toISOString(),
                })
                .eq('user_id', user.id));
        } else {
            // レコードが存在しない場合は新規作成する
            ({ error } = await supabase
                .from('notification_settings')
                .insert([
                    {
                        user_id: user.id,
                        email_notifications: input.email_notifications,
                        push_notifications: input.push_notifications,
                        sms_notifications: input.sms_notifications,
                        marketing_emails: input.marketing_emails,
                        notification_frequency: input.notification_frequency,
                        updated_at: new Date().toISOString(),
                    }
                ]));
        }

        if (error) {
            logger.error('Notification settings update error', error);
            return {
                success: false,
                error: 'database_error',
                details: error.message,
            };
        }

        // 設定完了後、画面再検証
        revalidatePath('/notification-settings');

        return { success: true };
    } catch (error) {
        logger.error('Unexpected error during notification settings update', error instanceof Error ? error : new Error('Unknown error'));
        return {
            success: false,
            error: 'internal_error',
            details: error instanceof Error ? error.message : 'Unknown error occurred',
        };
    }
}

/**
 * ユーザーの通知設定を取得する
 * @returns {Promise<NotificationSettingsInput | null>} - 通知設定、またはエラー時にnull
 */
export async function getNotificationSettings(): Promise<NotificationSettingsInput | null> {
    try {
        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            logger.error('User authentication error', userError || new Error('User not found'));
            return null;
        }

        const { data, error } = await supabase
            .from('notification_settings')
            .select('email_notifications, push_notifications, sms_notifications, marketing_emails, notification_frequency')
            .eq('user_id', user.id)
            .maybeSingle();

        if (error) {
            logger.error('Error fetching notification settings', error);
            return null;
        }

        return data;
    } catch (err) {
        logger.error('Unexpected error during fetching notification settings', err instanceof Error ? err : new Error('Unknown error'));
        return null;
    }
}
