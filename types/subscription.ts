import { z } from 'zod';
import { User } from './user';

export type SubscriptionStatus =
    | 'trialing'
    | 'active'
    | 'canceled'
    | 'incomplete'
    | 'incomplete_expired'
    | 'past_due'
    | 'unpaid'
    | 'paused';

export const SubscriptionStatusSchema = z.enum([
    'trialing',
    'active',
    'canceled',
    'incomplete',
    'incomplete_expired',
    'past_due',
    'unpaid',
    'paused',
]);

export type InvoiceStatus = 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';

export const InvoiceStatusSchema = z.enum(['draft', 'open', 'paid', 'uncollectible', 'void']);

export type ActiveSubscriptionStatus = Extract<SubscriptionStatus, 'trialing' | 'active'>;
export type InactiveSubscriptionStatus = Exclude<SubscriptionStatus, ActiveSubscriptionStatus>;

export type SubscriptionUpdatePayload = Partial<Pick<Subscription, 'plan_id' | 'metadata'>> & {
    cancel_at_period_end?: boolean;
};

export const SubscriptionUpdatePayloadSchema = z.object({
    plan_id: z.string().optional(),
    metadata: z.record(z.any()).optional(),
    cancel_at_period_end: z.boolean().optional(),
});

export type SubscriptionPlan = {
    id: string;
    name: string;
    description?: string;
    stripe_price_id: string;
    interval: 'day' | 'week' | 'month' | 'year';
    interval_count: number;
    trial_period_days?: number;
    amount: number;
    currency: string;
    features?: string[];
    metadata?: Record<string, any>;
    created_by: string;
    updated_by: string;
    created_at: string;
    updated_at: string;
    is_active?: boolean;
};

export const SubscriptionPlanSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    stripe_price_id: z.string(),
    interval: z.enum(['day', 'week', 'month', 'year']),
    interval_count: z.number(),
    trial_period_days: z.number().optional(),
    amount: z.number(),
    currency: z.string(),
    features: z.array(z.string()).optional(),
    metadata: z.record(z.any()).optional(),
    created_by: z.string(),
    updated_by: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    is_active: z.boolean().optional(),
});

export type PlanComparison = {
    isUpgrade: boolean;
    priceDifference: number;
    prorationDate?: string;
};

export const PlanComparisonSchema = z.object({
    isUpgrade: z.boolean(),
    priceDifference: z.number(),
    prorationDate: z.string().optional(),
});

export interface Subscription {
    id: string;
    user_id: string;
    plan_id: string;
    stripe_subscription_id: string;
    status: SubscriptionStatus;
    current_period_start: string;
    current_period_end: string;
    cancel_at_period_end: boolean;
    canceled_at?: string;
    trial_start?: string;
    trial_end?: string;
    metadata?: Record<string, any>;
    created_by: string;
    updated_by: string;
    created_at: string;
    updated_at: string;
}

export const SubscriptionSchema = z.object({
    id: z.string(),
    user_id: z.string(),
    plan_id: z.string(),
    stripe_subscription_id: z.string(),
    status: SubscriptionStatusSchema,
    current_period_start: z.string(),
    current_period_end: z.string(),
    cancel_at_period_end: z.boolean(),
    canceled_at: z.string().optional(),
    trial_start: z.string().optional(),
    trial_end: z.string().optional(),
    metadata: z.record(z.any()).optional(),
    created_by: z.string(),
    updated_by: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
});

export interface Invoice {
    id: string;
    user_id: string;
    subscription_id?: string;
    stripe_invoice_id: string;
    amount_due: number;
    amount_paid: number;
    amount_remaining: number;
    currency: string;
    status: InvoiceStatus;
    pdf_url?: string;
    hosted_invoice_url?: string;
    metadata?: Record<string, any>;
    created_by: string;
    updated_by: string;
    created_at: string;
    updated_at: string;
    paid_at?: string;
}

export const InvoiceSchema = z.object({
    id: z.string(),
    user_id: z.string(),
    subscription_id: z.string().optional(),
    stripe_invoice_id: z.string(),
    amount_due: z.number(),
    amount_paid: z.number(),
    amount_remaining: z.number(),
    currency: z.string(),
    status: InvoiceStatusSchema,
    pdf_url: z.string().optional(),
    hosted_invoice_url: z.string().optional(),
    metadata: z.record(z.any()).optional(),
    created_by: z.string(),
    updated_by: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    paid_at: z.string().optional(),
});

export interface InvoiceItem {
    id: string;
    invoice_id: string;
    description?: string;
    quantity: number;
    unit_amount: number;
    currency: string;
    period_start?: string;
    period_end?: string;
    proration: boolean;
    metadata?: Record<string, any>;
    created_by: string;
    updated_by: string;
    created_at: string;
    updated_at: string;
}

export const InvoiceItemSchema = z.object({
    id: z.string(),
    invoice_id: z.string(),
    description: z.string().optional(),
    quantity: z.number(),
    unit_amount: z.number(),
    currency: z.string(),
    period_start: z.string().optional(),
    period_end: z.string().optional(),
    proration: z.boolean(),
    metadata: z.record(z.any()).optional(),
    created_by: z.string(),
    updated_by: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
});

export type BillingOperation = {
    type: 'upgrade' | 'downgrade' | 'cancel' | 'reactivate';
    timestamp: string;
    changes: Partial<Subscription>;
};

export const BillingOperationSchema = z.object({
    type: z.enum(['upgrade', 'downgrade', 'cancel', 'reactivate']),
    timestamp: z.string(),
    changes: SubscriptionSchema.partial(),
});

export interface Plan {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    interval: 'month' | 'year';
    features: string[];
    isActive: boolean;
    tier?: string;
    maxUsers?: number;
    trialDays?: number;
}

export const PlanSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    price: z.number(),
    currency: z.string(),
    interval: z.enum(['month', 'year']),
    features: z.array(z.string()),
    isActive: z.boolean(),
    tier: z.string().optional(),
    maxUsers: z.number().optional(),
    trialDays: z.number().optional(),
});

export interface BillingDetails {
    customer_id: string;
    email: string;
    name: string;
    phone?: string;
    address?: {
        line1: string;
        line2?: string;
        city: string;
        state?: string;
        postal_code: string;
        country: string;
    };
}

export const BillingDetailsSchema = z.object({
    customer_id: z.string(),
    email: z.string().email(),
    name: z.string(),
    phone: z.string().optional(),
    address: z.object({
        line1: z.string(),
        line2: z.string().optional(),
        city: z.string(),
        state: z.string().optional(),
        postal_code: z.string(),
        country: z.string(),
    }).optional(),
});

export type SubscriptionWithPlan = Subscription & {
    plan: SubscriptionPlan;
};

export type UserWithSubscription = User & {
    subscription?: SubscriptionWithPlan;
};

export type SubscriptionUpdateInput = Partial<Omit<Subscription, 'id' | 'user_id' | 'created_at'>>;

export interface StripeWebhookEvent {
    id: string;
    event_id: string;
    event_type: string;
    event_data: Record<string, any>;
    created_by: string;
    updated_by: string;
    created_at: string;
    updated_at: string;
}

export const StripeWebhookEventSchema = z.object({
    id: z.string(),
    event_id: z.string(),
    event_type: z.string(),
    event_data: z.record(z.any()),
    created_by: z.string(),
    updated_by: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
});
