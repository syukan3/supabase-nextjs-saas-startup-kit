import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { SubscriptionPlan } from '@/types/subscription';

export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const supabase = createClientComponentClient();

  const { data: plans, error } = await supabase
    .from('subscription_plans')
    .select(`
      id,
      name,
      stripe_price_id,
      interval,
      interval_count,
      amount,
      currency,
      trial_period_days,
      features,
      metadata,
      created_by,
      updated_by,
      created_at,
      updated_at
    `)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching subscription plans:', error);
    throw error;
  }

  // Transform the data to match the SubscriptionPlan type
  const transformedPlans: SubscriptionPlan[] = plans?.map(plan => ({
    id: plan.id,
    name: plan.name,
    description: plan.metadata?.description || '',
    interval_count: plan.interval_count,
    trial_period_days: plan.trial_period_days,
    amount: plan.amount || 0,
    currency: plan.currency || 'USD',
    interval: plan.interval,
    stripe_price_id: plan.stripe_price_id,
    features: plan.features || [],
    created_by: '',
    updated_by: '',
    severity: 1,
    created_at: plan.created_at,
    updated_at: plan.created_at,
    is_active: plan.metadata?.is_active || true,
  })) || [];

  return transformedPlans;
}

export function formatPrice(price: number, currency: string, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(price);
}
