import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { SubscriptionPlan } from '@/types/subscription';

export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const supabase = createClientComponentClient();
  
  const { data: plans, error } = await supabase
    .from('subscription_plans')
    .select('*')
    .order('price', { ascending: true });

  if (error) {
    console.error('Error fetching subscription plans:', error);
    throw error;
  }

  return plans || [];
}

export function formatPrice(price: number, currency: string, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(price);
} 