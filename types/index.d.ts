// Export auth types
export * from './auth';

// Export user types
export * from './user';

// Export subscription types
export * from './subscription';

// Common shared types
export type Timestamp = {
    seconds: number;
    nanoseconds: number;
};

export type ApiResponse<T> = {
    success: boolean;
    data?: T;
    error?: {
        message: string;
        code?: string;
        details?: Record<string, any>;
    };
};

export type PaginationParams = {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
    filters?: Record<string, any>;
};

export type PaginatedResponse<T> = {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
};

export interface Metadata {
    [key: string]: any;
}

export interface ErrorResponse {
    message: string;
    status: number;
    code?: string;
    details?: Record<string, any>;
}

export type DateString = string; // ISO 8601 format

export type Currency = 'usd' | 'eur' | 'gbp' | 'jpy';

export type Optional<T> = {
    [P in keyof T]?: T[P];
};

export type WithTimestamps = {
    createdAt: Timestamp;
    updatedAt: Timestamp;
};

export type DatabaseRecord = {
    id: string;
} & WithTimestamps;