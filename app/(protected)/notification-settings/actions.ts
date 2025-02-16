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

        // 通知設定テーブルにアップサート
        const { error } = await supabase
            .from('notification_settings')
            .upsert({
                user_id: user.id,
                email_notifications: input.email_notifications,
                push_notifications: input.push_notifications,
                sms_notifications: input.sms_notifications,
                marketing_emails: input.marketing_emails,
                notification_frequency: input.notification_frequency,
                updated_at: new Date().toISOString(),
            });

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
