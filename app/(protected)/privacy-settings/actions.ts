'use server'

import { z } from 'zod';
import { createClient } from '@/utils/supabase/server'
import { PrivacySettingsFormData } from '@/types/privacy'
import { logger } from '@/lib/logger'

export async function updatePrivacySettings(data: PrivacySettingsFormData): Promise<{ success: boolean; error?: string; details?: unknown }> {
    const supabase = await createClient()

    try {
        const { data: user, error: userError } = await supabase.auth.getUser()
        if (userError) {
            logger.error('Error getting user', userError)
            return { success: false, error: 'unauthorized' }
        }

        // レコードの存在確認
        const { data: existingSettings, error: fetchError } = await supabase
            .from('privacy_settings')
            .select('*')
            .eq('user_id', user.user.id)
            .maybeSingle()

        if (fetchError) {
            logger.error('Error fetching existing privacy settings', fetchError)
            return { success: false, error: 'database_error', details: fetchError.message }
        }

        let error
        if (existingSettings) {
            // レコードが存在する場合は更新
            ({ error } = await supabase
                .from('privacy_settings')
                .update({
                    profile_visibility: data.profile_visibility,
                    activity_tracking: data.activity_tracking,
                    data_sharing: data.data_sharing,
                    updated_at: new Date().toISOString(),
                })
                .eq('user_id', user.user.id))
        } else {
            // レコードが存在しない場合は新規作成
            ({ error } = await supabase
                .from('privacy_settings')
                .insert([{
                    user_id: user.user.id,
                    profile_visibility: data.profile_visibility,
                    activity_tracking: data.activity_tracking,
                    data_sharing: data.data_sharing,
                    updated_at: new Date().toISOString(),
                }]))
        }

        if (error) {
            logger.error('Error updating privacy settings', error)
            return { success: false, error: 'database_error', details: error.message }
        }

        return { success: true }
    } catch (error) {
        logger.error('Unexpected error updating privacy settings', error instanceof Error ? error : new Error('Unknown error'))
        return { success: false, error: 'unexpected_error' }
    }
}

export async function getPrivacySettings(): Promise<{
    success: boolean;
    data?: PrivacySettingsFormData;
    error?: string;
    details?: unknown;
}> {
    const supabase = await createClient()

    try {
        const { data: user, error: userError } = await supabase.auth.getUser()
        if (userError) {
            logger.error('Error getting user', userError)
            return { success: false, error: 'unauthorized' }
        }

        const { data, error } = await supabase
            .from('privacy_settings')
            .select('profile_visibility, activity_tracking, data_sharing')
            .eq('user_id', user.user.id)
            .single()

        if (error) {
            if (error.code === 'PGRST116') {
                // レコードが見つからない場合はデフォルト値を返す
                return {
                    success: true,
                    data: {
                        profile_visibility: 'public',
                        activity_tracking: true,
                        data_sharing: false,
                    },
                }
            }
            logger.error('Error fetching privacy settings', error)
            return { success: false, error: 'database_error', details: error.message }
        }

        return { success: true, data }
    } catch (error) {
        logger.error('Unexpected error fetching privacy settings', error instanceof Error ? error : new Error('Unknown error'))
        return { success: false, error: 'unexpected_error' }
    }
} 