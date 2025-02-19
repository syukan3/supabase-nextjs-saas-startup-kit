import { z } from 'zod';
import { RecordStatus } from './index.d';

export interface User {
    id: string;
    email: string;
    stripe_customer_id?: string;
    created_by: string;
    updated_by: string;
    created_at: string;
    updated_at: string;
    last_login?: string;
    status: RecordStatus;
}

export interface UserProfile {
    id: string;
    email: string;
    full_name: string;
    display_name: string;
    avatar_url: string;
    bio: string;
    website: string;
    created_at?: string;
    updated_at?: string;
    status: RecordStatus;
}

export const UserSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    stripe_customer_id: z.string().optional(),
    created_by: z.string(),
    updated_by: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    last_login: z.string().optional(),
    status: z.enum(['active', 'inactive', 'deleted']),
});

export const UserProfileSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    full_name: z.string(),
    display_name: z.string(),
    avatar_url: z.string(),
    bio: z.string(),
    website: z.string(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    status: z.enum(['active', 'inactive', 'deleted']),
});

export interface UserSettings {
    user_id: string;
    email_notifications: boolean;
    marketing_emails: boolean;
    theme?: 'light' | 'dark' | 'system';
    language?: string;
    notification_preferences: {
        push: boolean;
        in_app: boolean;
    };
    status: RecordStatus;
}

export const UserSettingsSchema = z.object({
    user_id: z.string(),
    email_notifications: z.boolean(),
    marketing_emails: z.boolean(),
    theme: z.enum(['light', 'dark', 'system']).optional(),
    language: z.string().optional(),
    notification_preferences: z.object({
        push: z.boolean(),
        in_app: z.boolean(),
    }),
    status: z.enum(['active', 'inactive', 'deleted']),
});

export type UserUpdateInput = Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>;
export type UserProfileUpdateInput = Partial<Omit<UserProfile, keyof User>>;
export type UserSettingsUpdateInput = Partial<Omit<UserSettings, 'user_id'>>;

export type UserStatus = 'active' | 'inactive' | 'suspended';
export interface UserWithProfile extends User {
    profile: UserProfile;
    settings: UserSettings;
}

export const UserWithProfileSchema = z.object({
    profile: UserProfileSchema,
    settings: UserSettingsSchema,
}).merge(UserSchema);

