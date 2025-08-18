/* eslint-disable @typescript-eslint/no-unused-vars */
'use server'
import { get } from "http"
import Analytics from "../lib/analytics"
import { createData, getData, getDataWithOption, updateData } from "../lib/database"
import { getDateRange } from "../lib/function"
import { getCurrentUser } from "../lib/jwt"

export const homeData = async () => {
    try {
        const currentuser = await getCurrentUser()
        const [predictions, pricings, subscriptions, payments, titles, betslip, currencyrate] = await Promise.all([
            await getDataWithOption('prediction', {
                createdBy: true,
                Share: true,
                Save: true,
                Like: true,
                Comment: true,
                View: true,
            }),
            await getData('pricing'),
            currentuser ? await getData('subscription', { userId: currentuser?.id }) : null,
            currentuser ? await getData('payment', { userId: currentuser?.id }) : null,
            await getData('title'),
            await getData('bettingCode'),
            await fetch(`https://fxds-public-exchange-rates-api.oanda.com/cc-api/currencies?base=GHS&quote=${currentuser?.location?.currencycode || "USD"}&data_type=general_currency_pair&${getDateRange()}`, {
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
                },
                "referrer": "https://www.oanda.com/",
            })
        ])

        const rate = await currencyrate.json()
        const cr = rate?.response?.[0] || null
        return {
            predictions: predictions.data || [],
            pricing: pricings.data || [],
            payments: payments?.data || [],
            subscriptions: subscriptions?.data || [],
            titles: titles?.data || [],
            betslip: betslip?.data || [],
            currencyrate: cr,
            isSubscriptionActive: await checkSubscriptionStatus(currentuser, subscriptions?.data || [])
        }
    } catch (error) {
        console.log()
        return {
            predictions: [],
            pricings: [],
            payments: [],
            subscriptions: [],
            titles: [],
            betslip: [],
            currencyrate: { high_ask: 1 },
            error: error
        }
    }
}

const checkSubscriptionStatus = async (user: any, subs: any) => {
    if (!user) return false;
    const userId = user.id
    let hasActive = false;
    const now = new Date();

    if (Array.isArray(subs)) {

        for (const sub of subs) {
            if (sub.status === 'ACTIVE') {
                const expiry = new Date(sub.expiresAt);
                if (expiry > now) {
                    const subscriptionIndex = subs.indexOf(sub);
                    await updateData("settings", { userId }, { values: JSON.stringify({ subscriptionIndex }) })
                    // await updateData("settings", { userId }, { values: JSON.stringify({ subscriptionIndex: subscriptionIndex })})
                    hasActive = true;
                    break; // Exit loop once we find an active subscription
                } else {
                    await updateData("subscription", { id: sub.id }, { status: 'EXPIRED' })
                }
            }
        }
    }
    return hasActive;
}


export async function overviewData() {
    // Fetch fresh data
    try {

        const [users, predictions, payments, subscriptions] = await Promise.all([
            getDataWithOption('user', {
                predictions: true,
                subscriptions: true,
                payments: true,
                Notification: true,
                View: true,
                Like: true,
                Save: true,
                Share: true,
                Comment: true,
                Settings: true
            }),
            getDataWithOption('prediction', {
                createdBy: true,
                Share: true,
                Save: true,
                Like: true,
                Comment: true,
                View: true,
            }),

            getData('payment'),
            getData('subscription'),
        ])

        const summary = Analytics.Summary.getDashboardSummary({
            users: users.data.filter((user: any) => user.role !== 'ADMIN'),
            predictions: predictions.data,
            payments: payments.data,
            subscriptions: subscriptions.data,
        })

        return {
            users,
            predictions,
            payments,
            subscriptions,
            summary
        }

    } catch (error: any) {
       console.log('Failed to fetch dashboard data: ' + error.message)
    }
}

export const updateTitle = async (id: string, title: string) => {
    const res = await updateData('title', { id }, { defaulttitle: title })
    return res
}

export const addPrices = async (items: any) => {
    return await createData('pricing', items);
}


export const addBettingCode = async (id: string, items: any) => {
    return await updateData('bettingCode', { id }, items);
}

export const savePayment = async (paymentitems: any, subscriptionitems: any) => {
    try {
        const [paymentResult, subscriptionResult] = await Promise.all([
            await createData('payment', paymentitems),
            await createData('subscription', subscriptionitems)
        ]);

        return {
            success: true,
            payment: paymentResult,
            subscription: subscriptionResult
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}


