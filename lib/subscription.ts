import { createBrowserClient } from '@supabase/ssr';
import type { SubscriptionPlan } from '@/types/subscription';
import { createClient } from '@/utils/supabase/server';
import { logger } from '@/lib/logger';

export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  try {
    const supabase = await createClient();
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
      logger.error('Error fetching subscription plans', error);
      return [];
    }

    // 取得したデータを SubscriptionPlan 型に変換
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
  } catch (error) {
    logger.error('Unexpected error during subscription plan retrieval', error instanceof Error ? error : new Error('Unknown error'));
    return [];
  }
}

export function formatPrice(price: number, currency: string, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(price);
}
