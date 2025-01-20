import { z } from 'zod';

export interface AuthUser {
    id: string;
    email: string;
    email_verified?: boolean;
    created_at?: string;
}

export const AuthUserSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    email_verified: z.boolean().optional(),
    created_at: z.string().optional(),
});

export interface AuthUserMetadata {
    lastSignInTime?: string;
    creationTime: string;
    providerId: AuthProvider;
}

export const AuthUserMetadataSchema = z.object({
    lastSignInTime: z.string().optional(),
    creationTime: z.string(),
    providerId: z.enum(['google', 'github', 'credentials']),
});

export interface AuthSession {
    user: AuthUser;
    expires_at: number;
    access_token: string;
    refresh_token?: string;
}

export const AuthSessionSchema = z.object({
    user: AuthUserSchema,
    expires_at: z.number(),
    access_token: z.string(),
    refresh_token: z.string().optional(),
});

export interface AuthResponse {
    data: {
        user: AuthUser | null;
        session: AuthSession | null;
    };
    error: Error | null;
}

export const AuthResponseSchema = z.object({
    data: z.object({
        user: AuthUserSchema.nullable(),
        session: AuthSessionSchema.nullable(),
    }),
    error: z.instanceof(Error).nullable(),
});

export interface AuthTokens {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
}

export const AuthTokensSchema = z.object({
    access_token: z.string(),
    refresh_token: z.string().optional(),
    expires_in: z.number(),
});

export type AuthProvider = 'google' | 'github' | 'credentials';

export interface AuthError {
    code: string;
    message: string;
    status?: number;
}

export const AuthErrorSchema = z.object({
    code: z.string(),
    message: z.string(),
    status: z.number().optional(),
});

export type AuthState = 'authenticated' | 'unauthenticated' | 'loading';

export interface SignInCredentials {
    email: string;
    password: string;
}

export const SignInCredentialsSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export interface SignUpCredentials extends SignInCredentials {
    full_name?: string;
}

export const SignUpCredentialsSchema = z.object({
    full_name: z.string().optional(),
}).merge(SignInCredentialsSchema);
