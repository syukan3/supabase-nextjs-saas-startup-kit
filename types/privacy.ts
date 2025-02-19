import { z } from 'zod'
import type { RecordStatus } from '.'

export const ProfileVisibilityEnum = {
    PUBLIC: 'public',
    PRIVATE: 'private',
    FRIENDS: 'friends',
} as const

export type ProfileVisibility = (typeof ProfileVisibilityEnum)[keyof typeof ProfileVisibilityEnum]

export const privacySettingsFormSchema = z.object({
    profile_visibility: z.enum([ProfileVisibilityEnum.PUBLIC, ProfileVisibilityEnum.PRIVATE, ProfileVisibilityEnum.FRIENDS]),
    activity_tracking: z.boolean(),
    data_sharing: z.boolean(),
})

export const privacySettingsSchema = privacySettingsFormSchema.extend({
    created_at: z.date(),
    updated_at: z.date(),
    created_by: z.string().uuid(),
    updated_by: z.string().uuid()
})

export type PrivacySettingsFormData = z.infer<typeof privacySettingsFormSchema>
export type PrivacySettings = z.infer<typeof privacySettingsSchema> 