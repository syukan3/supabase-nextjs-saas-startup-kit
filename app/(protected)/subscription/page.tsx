"use client"

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import type { SubscriptionPlan } from "@/types/subscription";
import { getSubscriptionPlans, formatPrice } from "@/lib/subscription";
import { Skeleton } from "@/components/ui/skeleton";
import { createBrowserClient } from '@supabase/ssr';
import { isStripeEnabled } from '@/utils/stripe';
import { useTranslation } from 'react-i18next';

export default function SubscriptionPage() {
    const { t, i18n } = useTranslation();

    if (!isStripeEnabled()) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">{t('stripe.disabled.title')}</h1>
                    <p>{t('stripe.disabled.message')}</p>
                </div>
            </div>
        );
    }

    const router = useRouter();
    const [loading, setLoading] = useState<string | null>(null);
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function initializeLocale() {
            try {
                // createBrowserClient を利用して Supabase クライアントを生成
                const supabase = createBrowserClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
                );
                const { data: { session } } = await supabase.auth.getSession();

                if (session?.user) {
                    const { data: userSettings } = await supabase
                        .from('user_settings')
                        .select('language')
                        .eq('user_id', session.user.id)
                        .single();

                    if (userSettings?.language) {
                        i18n.changeLanguage(userSettings.language);
                    }
                }
            } catch (err) {
                console.error('Error loading locale:', err);
            }
        }

        initializeLocale();
    }, [i18n]);

    useEffect(() => {
        async function loadPlans() {
            try {
                setIsLoading(true);
                const subscriptionPlans = await getSubscriptionPlans();
                setPlans(subscriptionPlans);
            } catch (err) {
                console.error('Error loading plans:', err);
                setError(t('errors.loadingPlans'));
            } finally {
                setIsLoading(false);
            }
        }

        loadPlans();
    }, [t]);

    async function handleStartSubscription(planId: string) {
        try {
            setLoading(planId);
            const res = await fetch("/api/create-checkout-session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ planId }),
            });

            if (!res.ok) {
                throw new Error(t('errors.checkoutSession'));
            }

            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error("Error:", error);
            alert(t('errors.generalError'));
        } finally {
            setLoading(null);
        }
    }

    if (error) {
        return (
            <div className="container mx-auto py-10 text-center">
                <p className="text-red-500">{error}</p>
                <Button onClick={() => window.location.reload()} className="mt-4">
                    {t('errors.retry')}
                </Button>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="container mx-auto py-10">
                <h1 className="text-3xl font-bold text-center mb-10">
                    <Skeleton className="h-9 w-64 mx-auto" />
                </h1>
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {[1, 2].map((i) => (
                        <Card key={i} className="flex flex-col">
                            <CardHeader>
                                <Skeleton className="h-7 w-32 mb-2" />
                                <Skeleton className="h-5 w-full" />
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <Skeleton className="h-10 w-32 mb-4" />
                                <div className="space-y-2">
                                    {[1, 2, 3].map((j) => (
                                        <Skeleton key={j} className="h-6 w-full" />
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Skeleton className="h-10 w-full" />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold text-center mb-10">{t('plans.title')}</h1>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {plans.map((plan) => (
                    <Card key={plan.id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-3xl">{t(`plans.${plan.name.toLowerCase()}.name`)}</CardTitle>
                            <CardDescription>{t(`plans.${plan.name.toLowerCase()}.description`)}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <div className="text-3xl font-bold mb-4">
                                {formatPrice(plan.amount, plan.currency, i18n.language)}
                                <span className="text-sm font-normal">{t('plans.perMonth')}</span>
                            </div>
                            <ul className="space-y-2">
                                {plan.features?.[i18n.language as keyof typeof plan.features]?.map((feature: string, index: number) => (
                                    <li key={index} className="flex items-center">
                                        <svg
                                            className="w-4 h-4 mr-2 text-green-500"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path d="M5 13l4 4L19 7"></path>
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                onClick={() => handleStartSubscription(plan.id)}
                                disabled={!!loading}
                            >
                                {loading === plan.id ? t('plans.processing') : t('plans.selectPlan')}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
