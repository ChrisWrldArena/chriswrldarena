/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getDateRange } from '../lib/function';

interface ContentData {
    content: Record<string, any> | null;
    setContent: (content: Record<string, any> | null) => void;
    isSubscriptionActive?: boolean;
    setIsSubscriptionActive?: (isActive: boolean) => void;
}


const ContentContext = createContext<ContentData | undefined>(undefined);

export function ContentProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [content, setContent] = useState<Record<string, any> | null>(null);
    const [isSubscriptionActive, setIsSubscriptionActive] = useState<boolean>(false);
    
        async function fetchAll() {
            const cacheKey = 'content_data'
            const cache = typeof window !== 'undefined' ? localStorage.getItem(cacheKey) : null
            if (cache) {
                try {
                    setContent(JSON.parse(cache))
                    console.log('Using cached content data', JSON.parse(cache));
                } catch { }
            }

            const predictionsRes = await fetch('/api/prediction/?include=' + (JSON.stringify({
                createdBy: true,
                league_rel: true,
                Share: true,
                Save: true,
                Like: true,
                Comment: true,
                View: true,
            })))
            const paymentsRes = user ? await fetch(`/api/payment/?include=${JSON.stringify({ userId: user?.id })}`) : null
            const pricingRes = await fetch('/api/pricing')
            const subscriptionsRes = user ? await fetch(`/api/subscription/?include=${JSON.stringify({ userId: user?.id })}`) : null
            const blogPostsRes = await fetch('/api/blogPost/?include=' + (JSON.stringify({
                author: true,
                Share: true,
                Save: true,
                Like: true,
                Comment: true,
                View: true,
            })))
            const currencyrateRes = await fetch(`https://fxds-public-exchange-rates-api.oanda.com/cc-api/currencies?base=GHS&quote=${user?.location?.currencycode}&data_type=general_currency_pair&${getDateRange()}`, {
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
                },
                "referrer": "https://www.oanda.com/",
            });


            // Fetch fresh data
            const [predictions, payments, pricing, subscriptions, blogPosts, currencyrate] = await Promise.all([
                await predictionsRes.json(),
                await paymentsRes?.json(),
                await pricingRes.json(),
                await subscriptionsRes?.json(),
                await blogPostsRes.json(),
                await currencyrateRes.json(),
            ])

            if (!predictions.success || !payments.success || !pricing.success || !subscriptions.success || !blogPosts.success || !currencyrate) {
                console.error('Error fetching content data:', {
                    predictions: predictions.error,
                    payments: payments?.error,
                    pricing: pricing.error,
                    subscriptions: subscriptions?.error,
                    blogPosts: blogPosts.error,
                    currencyrate: currencyrate
                });

                const checkSubscriptionStatus = async (subs: any) => {
                    let hasActive = false;
                    const now = new Date();

                    if (Array.isArray(subs)) {
                        for (const sub of subs) {
                            if (sub.status === 'ACTIVE') {
                                const expiry = new Date(sub.expiresAt);
                                if (expiry > now) {
                                    hasActive = true;
                                    console.log(`Subscription ${sub.id} is ACTIVE and valid until ${expiry}`);
                                } else {
                                    // Expired but still marked ACTIVE, update to EXPIRED
                                    await fetch(`/api/subscription/${sub.id}`, {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ status: 'EXPIRED' }),
                                    });
                                }
                            }
                        }
                    }
                    console.log('Subscription active status:', hasActive);
                    setIsSubscriptionActive(hasActive);
                }

                /* console.log(...values)
                     checkSubscriptionStatus(values[3])
      
                     setContent({
                         ...values
                     });
      
                     if (typeof window !== 'undefined') {
                    
                     localStorage.setItem(cacheKey, JSON.stringify({
                         predictions,
                         pricing,
                         payments,
                         subscriptions,
                         blogposts,
                         currencyrate
                     }))
                 }
                     */

                // Cache the fresh summary


            }
        }




    const value = {
        content, setContent,
        isSubscriptionActive, setIsSubscriptionActive
    };

    return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export const useContent = () => {
    const context = useContext(ContentContext);
    if (context === undefined) {
        throw new Error('useContent must be used within an ContentProvider');
    }
    return context;
};
