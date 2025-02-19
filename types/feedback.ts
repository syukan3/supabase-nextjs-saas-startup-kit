import { z } from 'zod';
import { RecordStatus } from './index.d';

export interface Feedback {
    id: string;
    user_id: string;
    feedback_type: 'general' | 'bug' | 'feature';
    content: string;
    created_by: string;
    updated_by: string;
    created_at: string;
    updated_at: string;
    status: RecordStatus;
}

export const FeedbackSchema = z.object({
    id: z.string(),
    user_id: z.string(),
    feedback_type: z.enum(['general', 'bug', 'feature']),
    content: z.string(),
    created_by: z.string(),
    updated_by: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    status: z.enum(['active', 'inactive', 'deleted']),
});

export type FeedbackCreateInput = Omit<Feedback, 'id' | 'created_by' | 'updated_by' | 'created_at' | 'updated_at'>;
export type FeedbackUpdateInput = Partial<Omit<Feedback, 'id' | 'user_id' | 'created_by' | 'updated_by' | 'created_at' | 'updated_at'>>;

export const FeedbackCreateInputSchema = z.object({
    user_id: z.string(),
    feedback_type: z.enum(['general', 'bug', 'feature']),
    content: z.string(),
    status: z.enum(['active', 'inactive', 'deleted']),
});

export const FeedbackUpdateInputSchema = z.object({
    feedback_type: z.enum(['general', 'bug', 'feature']).optional(),
    content: z.string().optional(),
    status: z.enum(['active', 'inactive', 'deleted']).optional(),
});
