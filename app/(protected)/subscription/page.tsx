"use client"

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { getTranslations, getSupportedLocales } from "@/lib/i18n";
import type { Dictionary, Locale } from "@/lib/i18n/types";
import type { SubscriptionPlan } from "@/types/subscription";
import { getSubscriptionPlans, formatPrice } from "@/lib/subscription";
import { Skeleton } from "@/components/ui/skeleton";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function SubscriptionPage() {
    const router = useRouter();
    const [loading, setLoading] = useState<string | null>(null);
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [locale, setLocale] = useState<Locale>("ja");
    
    const t = getTranslations(locale) as Dictionary;

    useEffect(() => {
        async function initializeLocale() {
            try {
                const supabase = createClientComponentClient();
                const { data: { session } } = await supabase.auth.getSession();
                
                if (session?.user) {
                    const { data: userSettings } = await supabase
                        .from('user_settings')
                        .select('language')
                        .eq('user_id', session.user.id)
                        .single();

                    if (userSettings?.language) {
                        const supportedLocales = getSupportedLocales();
                        if (supportedLocales.includes(userSettings.language as Locale)) {
                            setLocale(userSettings.language as Locale);
                            return;
                        }
                    }
                }

                const browserLocale = navigator.language.split('-')[0] as Locale;
                const supportedLocales = getSupportedLocales();
                if (supportedLocales.includes(browserLocale)) {
                    setLocale(browserLocale);
                }
            } catch (err) {
                console.error('Error loading locale:', err);
            }
        }

        initializeLocale();
    }, []);

    useEffect(() => {
        async function loadPlans() {
            try {
                setIsLoading(true);
                const subscriptionPlans = await getSubscriptionPlans();
                setPlans(subscriptionPlans);
            } catch (err) {
                console.error('Error loading plans:', err);
                setError(t.errors.loadingPlans);
            } finally {
                setIsLoading(false);
            }
        }

        loadPlans();
    }, [t.errors.loadingPlans]);

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
                throw new Error(t.errors.checkoutSession);
            }

            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error("Error:", error);
            alert(t.errors.generalError);
        } finally {
            setLoading(null);
        }
    }

    if (error) {
        return (
            <div className="container mx-auto py-10 text-center">
                <p className="text-red-500">{error}</p>
                <Button onClick={() => window.location.reload()} className="mt-4">
                    {t.errors.retry}
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
            <h1 className="text-3xl font-bold text-center mb-10">{t.plans.title}</h1>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {plans.map((plan) => (
                    <Card key={plan.id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle>{plan.name}</CardTitle>
                            <CardDescription>{plan.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <div className="text-3xl font-bold mb-4">
                                {formatPrice(plan.price, plan.currency, locale)}
                                <span className="text-sm font-normal">{t.plans.perMonth}</span>
                            </div>
                            <ul className="space-y-2">
                                {plan.features.map((feature, index) => (
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
                                {loading === plan.id ? t.plans.processing : t.plans.selectPlan}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
