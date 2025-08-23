/* eslint-disable @typescript-eslint/no-unused-expressions */
'use client'
import React, { useState, useEffect, ChangeEvent, useCallback } from 'react'
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { Prediction } from '@prisma/client';
import moment from 'moment';
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover';
import { MoreVertical, Check, X, Clock, Edit, Trash, LoaderCircle, PlusCircle } from 'lucide-react';
import { useDialog } from '../components/shared/dialog';
import { savePayment, updateTitle } from '../actions/utils';
import { Action, Column, TableComponent } from '../components/shared/TableSeater';
import Link from 'next/link';

declare global {
    interface Window {
        FlutterwaveCheckout?: any;
    }
}

interface PricingPlanProps {
    id: string;
    name: string;
    price: number;
    currency: string;
    plan: string;
    features: string[];
    isPopular: boolean;
}

interface PendingPayment {
    id: string;
    userId: string;
    transactionId: string;
    txRef: string;
    amount: number;
    currency: string;
    plan: PricingPlanProps;
    timestamp: number;
    status: 'INITIATED' | 'PENDING' | 'VERIFYING' | 'COMPLETED' | 'FAILED';
    retryCount: number;
}

interface PaymentStatusResponse {
    status: 'success' | 'failed' | 'pending';
    data?: {
        status: string;
        amount: number;
        currency: string;
        tx_ref: string;
        id: number;
    };
}


interface PricingComponentProps {
    paymentKeys: Record<string, string>;
    content: any
}

const defaulttitles = [
    "Vip Predictions",
    "Bet of the day",
    "Previously Won Matches",
    "Free Hot Odds",
    "Midnight Owl",
]
const customgames = ['Bet of the Day', 'Correct Score', 'Draw Games']

const PricingComponent = ({ paymentKeys, content }: PricingComponentProps) => {
    const router = useRouter()
    const { user } = useAuth()
    //const { content, content.isSubscriptionActive } = useContent()
    const [pricingPlans, setPricingPlans] = useState<PricingPlanProps[]>([])

    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currency, setCurrency] = useState(1);


    const dialog = useDialog()
    const [games, setGames] = useState('soccer')
    const [updating, setUpdating] = useState<boolean>(false);
    const [currentposition, setCurrentPosition] = useState<number>(-1);
    const [loading, setLoading] = useState(false)
    const [title, setTitle] = useState<Record<string, any>[]>([])
    const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([])
    const [paymentPolling, setPaymentPolling] = useState(false)

    // Local storage keys
    const PENDING_PAYMENTS_KEY = 'pending_payments'
    const PAYMENT_RETRY_LIMIT = 5
    const PAYMENT_POLL_INTERVAL = 60_000 // 60 seconds

    // Helper functions for local storage
    const getPendingPayments = useCallback((): PendingPayment[] => {
        if (typeof window !== 'undefined') {
            try {
                const stored = localStorage.getItem(PENDING_PAYMENTS_KEY)
                return stored ? JSON.parse(stored) : []
            } catch (error) {
                console.error('Error getting pending payments:', error)
                return []
            }
        }
        return []
    }, [])

    // Currency conversion helper function
    const convertToGHS = useCallback((amount: number, fromCurrency: string): number => {
        try {
            // If already in GHS, return as is
            if (fromCurrency === 'GHS') {
                return amount;
            }

            // Get the currency rate from content
            const rate = content?.currencyrate?.high_ask || content?.currencyrate?.ask || 1;

            // The rate from OANDA is GHS to target currency
            // So to convert back to GHS, we divide by the rate
            const ghsAmount = amount / rate;

            console.log(`Converting ${amount} ${fromCurrency} to GHS: ${ghsAmount} (rate: ${rate})`);
            return Number(ghsAmount.toFixed(0));
        } catch (error) {
            console.error('Currency conversion error:', error);
            // Return original amount if conversion fails
            return amount;
        }
    }, [content?.currencyrate])

    const savePendingPayment = useCallback((payment: PendingPayment) => {
        try {
            const existing = getPendingPayments()
            const updated = existing.filter(p => p.txRef !== payment.txRef)
            updated.push(payment)
            localStorage.setItem(PENDING_PAYMENTS_KEY, JSON.stringify(updated))
            setPendingPayments(updated)
        } catch (error) {
            console.error('Error saving pending payment:', error)
        }
    }, [getPendingPayments])

    const removePendingPayment = useCallback((txRef: string) => {
        try {
            const existing = getPendingPayments()
            const updated = existing.filter(p => p.txRef !== txRef)
            localStorage.setItem(PENDING_PAYMENTS_KEY, JSON.stringify(updated))
            setPendingPayments(updated)
        } catch (error) {
            console.error('Error removing pending payment:', error)
        }
    }, [getPendingPayments])

    // Verify payment status with backend
    const verifyPaymentStatus = useCallback(async (txRef: string): Promise<PaymentStatusResponse> => {
        try {
            const response = await fetch('/api/payment/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tx_ref: txRef,
                    provider: 'flutterwave'
                }),
            })

            if (!response.ok) {
                throw new Error('Payment verification failed')
            }

            return await response.json()
        } catch (error) {
            console.error('Error verifying payment:', error)
            return { status: 'failed' }
        }
    }, [])

    // Process pending payment
    const processPendingPayment = useCallback(async (pendingPayment: PendingPayment) => {
        try {
            // Update status to verifying
            const updatedPayment = { ...pendingPayment, status: 'VERIFYING' as const }
            savePendingPayment(updatedPayment)

            // Verify with payment provider
            const verificationResult = await verifyPaymentStatus(
                pendingPayment.txRef
            )

            if (verificationResult.status === 'success' && verificationResult.data?.status === 'successful') {
                // Payment successful - save to database with GHS conversion
                const ghsAmount = convertToGHS(pendingPayment.amount, pendingPayment.currency);

                const paymentdata = {
                    userId: pendingPayment.userId,
                    amount: ghsAmount,
                    currency: 'GHS',
                    provider: 'Flutterwave',
                    status: "SUCCESS",
                    reference: `${pendingPayment.transactionId} ${pendingPayment.txRef}`,
                }

                const subscriptiondata = {
                    userId: pendingPayment.userId,
                    plan: pendingPayment.plan.plan,
                    status: 'ACTIVE',
                    startedAt: new Date().toISOString(),
                    expiresAt: (() => {
                        const start = new Date();
                        if (pendingPayment.plan.plan === 'DAILY') {
                            start.setDate(start.getDate() + 1);
                        } else if (pendingPayment.plan.plan === 'WEEKLY') {
                            start.setDate(start.getDate() + 7);
                        }
                        return start.toISOString();
                    })(),
                    flutterwavePaymentId: `${pendingPayment.transactionId} ${pendingPayment.txRef}`,
                }

                await savePayment(paymentdata, subscriptiondata)

                // Remove from pending
                removePendingPayment(pendingPayment.txRef)

                toast.success('Payment successful! Subscription activated.', {
                    style: {
                        backgroundColor: '#a0eca2',
                        color: '#4caf50',
                        border: '1px solid #4caf50',
                        borderRadius: '4px',
                        padding: '12px 24px',
                        cursor: 'pointer',
                    }
                })

                // Refresh page to update subscription status
                setTimeout(() => {
                    window.location.reload()
                }, 2000)

            } else if (verificationResult.status === 'pending') {
                toast.success('Payment is pending. If you have finished paying, wait for a couple of minutes or refresh the page', {
                    style: {
                        backgroundColor: '#fff3cd',
                        color: '#856404',
                        border: '1px solid #ffeeba',
                        borderRadius: '4px',
                        padding: '12px 24px',
                        cursor: 'pointer',
                    }
                })
            }

            else if (verificationResult.status === 'failed') {
                // Payment failed
                const failedPayment = {
                    ...pendingPayment,
                    status: 'FAILED' as const,
                    retryCount: pendingPayment.retryCount + 1
                }

                if (failedPayment.retryCount >= PAYMENT_RETRY_LIMIT) {
                    // Remove after max retries
                    removePendingPayment(pendingPayment.txRef)
                    toast.error('Payment verification failed after multiple attempts.', {
                        style: {
                            backgroundColor: '#f8d7da',
                            color: '#721c24',
                            border: '1px solid #721c24',
                            borderRadius: '4px',
                            padding: '12px 24px',
                            cursor: 'pointer',
                        }
                    })
                } else {
                    // Save for retry
                    savePendingPayment(failedPayment)
                }
            } else {
                // Still pending - increment retry count
                const retryPayment = {
                    ...pendingPayment,
                    status: 'PENDING' as const,
                    retryCount: pendingPayment.retryCount + 1
                }
                const isExpired = Date.now() - retryPayment.timestamp > 2 * 60 * 60 * 1000
                if (retryPayment.retryCount >= PAYMENT_RETRY_LIMIT && isExpired) {
                    removePendingPayment(pendingPayment.txRef)
                    toast.error('Payment verification timeout. Please contact support.', {
                        style: {
                            backgroundColor: '#f8d7da',
                            color: '#721c24',
                            border: '1px solid #721c24',
                            borderRadius: '4px',
                            padding: '12px 24px',
                            cursor: 'pointer',
                        }
                    })
                } else {
                    savePendingPayment(retryPayment)
                }
            }
        } catch (error) {
            console.error('Error processing pending payment:', error)

            // Increment retry count on error
            const errorPayment = {
                ...pendingPayment,
                status: 'PENDING' as const,
                retryCount: pendingPayment.retryCount + 1
            }
            const isExpired = Date.now() - errorPayment.timestamp > 2 * 60 * 60 * 1000
            if (isExpired) {
                removePendingPayment(pendingPayment.txRef)
                toast.error('Payment processing error. Please contact support.', {
                    style: {
                        backgroundColor: '#f8d7da',
                        color: '#721c24',
                        border: '1px solid #721c24',
                        borderRadius: '4px',
                        padding: '12px 24px',
                        cursor: 'pointer',
                    }
                })
            } else {
                savePendingPayment(errorPayment)
            }
        }
    }, [savePendingPayment, verifyPaymentStatus, removePendingPayment, convertToGHS])

    // Poll pending payments
    const pollPendingPayments = useCallback(async () => {
        if (paymentPolling) return

        setPaymentPolling(true)
        const pending = getPendingPayments()

        if (pending.length === 0) {
            setPaymentPolling(false)
            return
        }

        

        // Process each pending payment
        for (const payment of pending) {
            // Skip if too old (more than 5 hours)
            const isExpired = Date.now() - payment.timestamp > 2 * 60 * 60 * 1000
            if (isExpired) {
                removePendingPayment(payment.txRef)
                continue
            }

            await processPendingPayment(payment)
        }

        setPaymentPolling(false)
    }, [paymentPolling, getPendingPayments, removePendingPayment, processPendingPayment])

    useEffect(() => {
        window.addEventListener("error", (e) => {
            fetch("/api/log", {
                method: "POST",
                body: JSON.stringify({
                    message: e.message,
                    stack: e.error?.stack,
                    userAgent: navigator.userAgent,
                }),
            });
        });
    }, []);

    // Load pending payments on component mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const pending = getPendingPayments()
            setPendingPayments(pending)

            // Start polling if there are pending payments
            if (pending.length > 0) {
                pollPendingPayments()
            }
        }
    }, [pollPendingPayments, getPendingPayments]);

    // Set up polling interval for pending payments
    useEffect(() => {
        let pollInterval: NodeJS.Timeout | null = null

        if (pendingPayments.length > 0 && !paymentPolling) {
            pollInterval = setInterval(() => {
                pollPendingPayments()
            }, PAYMENT_POLL_INTERVAL)
        }

        return () => {
            if (pollInterval) {
                clearInterval(pollInterval)
            }
        }
    }, [pendingPayments.length, paymentPolling, pollPendingPayments])

    useEffect(() => {

        if (content?.predictions?.length > 0) {
            setCurrency(content.currencyrate.high_ask || 1)
            setPredictions(content?.predictions || []);

        }
    }, [content, content?.predictions]);

    useEffect(() => {
        if (content?.pricing) {
            content.pricing.length > 0 ? setPricingPlans(content.pricing) : null
            setLoading(false);
        }
    }, [pricingPlans, content?.pricing]);

    // Load Flutterwave script
    useEffect(() => {
        if (!document.getElementById('flutterwave-script')) {
            const script = document.createElement('script');
            script.id = 'flutterwave-script';
            script.src = 'https://checkout.flutterwave.com/v3.js';
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    // Process pending payments on mount and set up periodic checking
    useEffect(() => {
        const processAllPendingPayments = () => {
            const pending = getPendingPayments();
            const currentTime = Date.now();
            const INITIATED_TIMEOUT = 5 * 60 * 1000; // 5 minutes timeout for INITIATED payments

            pending.forEach(payment => {
                // Remove INITIATED payments older than 5 minutes (user likely closed browser)
                if (payment.status === 'INITIATED' &&
                    (currentTime - payment.timestamp) > INITIATED_TIMEOUT) {
                    console.log('Removing expired INITIATED payment:', payment.txRef);
                    removePendingPayment(payment.txRef);
                    return;
                }

                // Process all pending payments (we can now verify using just tx_ref)
                if (payment.status === 'PENDING' || payment.status === 'INITIATED') {
                    processPendingPayment(payment);
                }
            });
        };

        // Process immediately on mount
        processAllPendingPayments();

        // Set up interval for periodic checking
        const interval = setInterval(processAllPendingPayments, PAYMENT_POLL_INTERVAL);

        return () => clearInterval(interval);
    }, [getPendingPayments, removePendingPayment, processPendingPayment]);

    const handleFlutterwavePayment = (plan: PricingPlanProps) => {
        if (!user) return toast.error('Please log in to continue.', {
            style: {
                backgroundColor: '#f8d7da',
                color: '#721c24',
                border: '1px solid #721c24',
                borderRadius: '4px',
                padding: '12px 24px',
                cursor: 'pointer',
            }
        });

        if (!window.FlutterwaveCheckout) {
            alert('Payment gateway not loaded. Please try again.');
            return;
        }

        const txRef = `cwa-${Date.now()}`;
        const paymentAmount = plan.price * currency;
        const paymentCurrency = content.currencyrate ? user.location?.currencycode || "USD" : "USD";

        // Create pending payment record BEFORE initiating payment
        const pendingPayment: PendingPayment = {
            id: `${Date.now()}-${user.id}`,
            userId: user.id,
            transactionId: '', // Will be updated when we get the actual transaction ID
            txRef: txRef,
            amount: parseFloat(paymentAmount.toString()),
            currency: paymentCurrency,
            plan: plan,
            timestamp: Date.now(),
            status: 'PENDING', // Different status for pre-payment
            retryCount: 0
        }

        // Save to local storage immediately BEFORE payment
        savePendingPayment(pendingPayment)

        window.FlutterwaveCheckout({
            public_key: paymentKeys.FLW_PUBLIC_KEY,
            tx_ref: txRef,
            amount: plan.price * currency,
            currency: content.currencyrate ? user.location?.currencycode : "USD",
            payment_options: 'card,banktransfer,ussd,mobilemoneyghana,gpay,apay,paypal,opay',

            customer: {
                email: user.email,
                name: user.username,
            },

            customizations: {
                title: 'ChrisWrldArena Subscription',
                description: `Subscribe to ${plan.name}`,
                logo: 'https://chriswrldarena.com/img.png',
            },
            meta: {
                userId: user.id,
                plan: plan.plan,
                planName: plan.name,
                price: plan.price,
                currency: user.location?.currencycode || "USD",
                datetime: moment().format("LLL")
            },

            subaccounts: [{
                id: paymentKeys.FLW_SUBACCOUNT_ID
            }],


            callback: async (response: { status: string; transaction_id: string; tx_ref: string;[key: string]: unknown }) => {
                if (response.status === 'successful') {
                    console.log('Payment initiated:', response)

                    // Update the pending payment with the actual transaction ID
                    const updatedPendingPayment: PendingPayment = {
                        ...pendingPayment,
                        transactionId: response.transaction_id.toString(),
                        status: 'COMPLETED' // Update status to COMPLETED after successful initiation
                    }

                    // Update local storage with transaction ID
                    //savePendingPayment(updatedPendingPayment)

                    toast.success('Payment initiated! Verifying transaction...', {
                        style: {
                            backgroundColor: '#d4f5d6',
                            color: '#4caf50',
                            border: '1px solid #4caf50',
                            borderRadius: '4px',
                            padding: '12px 24px',
                            cursor: 'pointer',
                        }
                    })

                    // Start verification process immediately
                    processPendingPayment(updatedPendingPayment)

                    setTimeout(() => {
                        processPendingPayment(updatedPendingPayment)
                    }, 60_000)

                } else {
                    console.log('Payment not successful:', response);
                    // Remove the pending payment if payment failed
                    removePendingPayment(pendingPayment.txRef);
                    toast.error('Payment not completed.', {
                        style: {
                            backgroundColor: '#f8d7da',
                            color: '#721c24',
                            border: '1px solid #721c24',
                            borderRadius: '4px',
                            padding: '12px 24px',
                            cursor: 'pointer',
                        }
                    });
                }
            },
            onclose: () => {
                // Clean up pending payment if user closed window without completing payment
                setTimeout(() => {
                    const pending = getPendingPayments();
                    const abandonedPayment = pending.find(p =>
                        p.txRef === pendingPayment.txRef &&
                        p.status === 'INITIATED' &&
                        !p.transactionId
                    );
                    if (abandonedPayment) {
                        console.log('Cleaning up abandoned payment:', abandonedPayment.txRef);
                        removePendingPayment(abandonedPayment.txRef);
                    }
                }, 2000); // Wait 2 seconds to allow callback to execute if payment was successful
                toast.error('Payment window closed.', {
                    style: {
                        backgroundColor: '#f8d7da',
                        color: '#721c24',
                        border: '1px solid #721c24',
                        borderRadius: '4px',
                        padding: '12px 24px',
                        cursor: 'pointer',
                    }
                });
            },
        });
    };

    const deletePrediction = async (index: number, id: string) => {
        setCurrentPosition(index);
        dialog.showDialog({
            title: "Delete Prediction",
            message: "Are you sure you want to delete this prediction? This action cannot be undone.",
            type: "confirm",
            onConfirm: async () => {
                setUpdating(true);
                try {
                    const response = await fetch(`/api/prediction/${id}`, {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                    });
                    if (!response.ok) throw new Error("Failed to delete prediction");
                    setPredictions(predictions.filter(pred => pred.id !== id));
                    setUpdating(false);
                } catch (error) {
                    setUpdating(false);
                    console.error("Error deleting prediction:", error);
                }

            }
        })
    }

    const updateWLPrediction = async (index: number, prediction: Prediction, data: string) => {
        setCurrentPosition(index);
        const { id, ..._dataWithoutId } = prediction;
        dialog.showDialog({
            title: "Update Prediction",
            message: `Are you sure you want to update this prediction to "${data}"?`,
            type: "confirm",
            onConfirm: async () => {
                setUpdating(true);
                try {
                    const response = await fetch(`/api/prediction/${id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            //...dataWithoutId,
                            result: data,
                        }),
                    });
                    if (!response.ok) throw new Error("Failed to Update prediction");
                    const newresult = await response.json();

                    const newdata = predictions.filter((pred) => pred.id !== id)
                    setPredictions([
                        ...newdata,
                        newresult
                    ])


                    setUpdating(false);
                    // setPredictions(result);
                } catch (_error) {
                    setUpdating(false);
                }

            }
        })
    }


    const VIPGames = predictions.filter(prediction => prediction.result === "PENDING" && prediction.gameType === "VIP_GAME")
    const CorrectScoreGames = predictions.filter(prediction => prediction.result === "PENDING" && prediction.gameType === "CORRECT_SCORE")
    const DrawGames = predictions.filter(prediction => prediction.result === "PENDING" && prediction.gameType === "DRAW_GAME")
    const BetOfTheDayGames = predictions.filter(prediction => prediction.result === "PENDING" && prediction.gameType === "BET_OF_THE_DAY")
    const PrevWonGames = predictions.filter(prediction => prediction.result !== "PENDING" && (prediction.gameType === "VIP_GAME" || prediction.gameType === "DRAW_GAME" || prediction.gameType === "CORRECT_SCORE" || prediction.gameType === "BET_OF_THE_DAY"))
        .filter(prediction => {
            const predictionDate = new Date(prediction.publishedAt);
            const now = new Date();
            const twentyFourHoursAgo = new Date(now.getTime() - (48 * 60 * 60 * 1000));
            return predictionDate >= twentyFourHoursAgo;
        })
    const VIPGamesData = () => {
        const columns: Column<Prediction>[] = [
            {
                header: 'Date',
                accessorKey: 'publishedAt',
                cell: (prediction) => (
                    <>
                        {moment(prediction.publishedAt).format('LL')}

                    </>
                ),
            },
            {
                header: 'Match',
                accessorKey: 'homeTeam',
                cell: (prediction) => (
                    <div>
                        <div className="text-sm font-medium text-gray-900">
                            {prediction.league || 'Unknown League'}
                        </div>
                        <div className="text-sm text-gray-600 ">
                            {prediction.homeTeam} vs {prediction.awayTeam}
                        </div>
                    </div>
                ),
            },
            {
                header: 'Prediction',
                accessorKey: 'tip',
                cell: (prediction) => <>
                    <p className="md:hidden text-xs font-bold">{moment(prediction.publishedAt).format('LL')}</p>
                    <p className="md:hidden text-xs">----------</p>
                    {prediction.tip || 'No prediction available'}</>
            },
            {
                header: 'Odds',
                accessorKey: 'odds',
                cell: (prediction) => (
                    <span className="px-2 py-1 text-xs font-medium text-neutral-800 bg-neutral-100 rounded-full">
                        {prediction.odds || 'N/A'}
                    </span>
                ),
            },
            {
                header: 'Result',
                accessorKey: 'result',
                cell: (prediction, rowIndex, colIndex) => {
                    if (prediction.result === "WON") {
                        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800" title='Won'>
                            {updating && rowIndex === currentposition ? <LoaderCircle className="animate-spin size-4" /> : <Check className="w-4 h-4" />}
                        </span>;
                    }
                    if (prediction.result === "LOST") {
                        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800" title="Lost">
                            {updating && rowIndex === currentposition ? <LoaderCircle className="animate-spin size-4" /> : <X className="w-4 h-4" />}
                        </span>;
                    }
                    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800" title="Pending">
                        {updating && rowIndex === currentposition ? <LoaderCircle className="animate-spin size-4" /> : <Clock className="w-4 h-4" />}
                    </span>;
                },
            },
        ];
        const actions: Action<Prediction>[] = user?.role === "ADMIN" ? [
            {
                label: 'Won',
                icon: <Check className="w-4 h-4 text-neutral-500" />,
                onClick: (prediction, index) => updateWLPrediction(index, prediction, 'WON'),
            },
            {
                label: 'Lost',
                icon: <X className="w-4 h-4 text-neutral-500" />,
                onClick: (prediction, index) => updateWLPrediction(index, prediction, 'LOST'),
            },
            {
                label: 'Pending',
                icon: <Clock className="w-4 h-4 text-gray-500" />,
                onClick: (prediction, index) => updateWLPrediction(index, prediction, 'PENDING'),
            },
            {
                label: 'Edit',
                icon: <Edit className="w-4 h-4 text-gray-500" />,
                onClick: (prediction) => {
                    window.location.href = `/dashboard/predictions/update/?id=${prediction.id}`;
                },
            },
            {
                label: 'Delete',
                icon: <Trash className="w-4 h-4 text-red-500" />,
                onClick: (prediction, index) => deletePrediction(index, prediction.id),
                className: 'text-red-600',
            },
        ] : [];
        const slice = 10
        const header = {
            title: "VIP Odds Predictions"
        }

        const uniqueId = Date.now().toString()
        const footer = {
            emptyMessage: 'Empty List',
            viewMoreLink: "/pricing",
            viewMoreText: content.isSubscriptionActive ? "View More VIP Matches" : !user ? "Sign in to View" : "Upgrade to VIP",
            customActions: user?.role === "ADMIN" && (
                <Link
                    href={user ? "/dashboard/predictions/create" : "/signin"}
                    className="text-sm font-medium text-gray-900 hover:text-green-600 transition-all duration-300"
                >
                    <div className="group flex gap-1 items-center underline underline-offset-4 text-green-500 hover:text-gray-900">
                        <PlusCircle className='text-green-500 size-5 group-hover:text-gray-900' /> Add Data
                    </div>
                    {!user && "Sign in to View"}
                </Link>
            )
        }

        return {
            data: VIPGames,
            columns,
            actions,
            header,
            footer,
            slice,

            updating,
            uniqueId
        }
    }
    const CorrectScoreGamesData = () => {
        const columns: Column<Prediction>[] = [
            {
                header: 'Date',
                accessorKey: 'publishedAt',
                cell: (prediction) => (
                    <>
                        {moment(prediction.publishedAt).format('LL')}

                    </>
                ),
            },
            {
                header: 'Match',
                accessorKey: 'homeTeam',
                cell: (prediction) => (
                    <div>
                        <div className="text-sm font-medium text-gray-900">
                            {prediction.league || 'Unknown League'}
                        </div>
                        <div className="text-sm text-gray-600 ">
                            {prediction.homeTeam} vs {prediction.awayTeam}
                        </div>
                    </div>
                ),
            },
            {
                header: 'Prediction',
                accessorKey: 'tip',
                cell: (prediction) => <>
                    <p className="md:hidden text-xs font-bold">{moment(prediction.publishedAt).format('LL')}</p>
                    <p className="md:hidden text-xs">----------</p>
                    {prediction.tip || 'No prediction available'}</>
            },
            {
                header: 'Odds',
                accessorKey: 'odds',
                cell: (prediction) => (
                    <span className="px-2 py-1 text-xs font-medium text-neutral-800 bg-neutral-100 rounded-full">
                        {prediction.odds || 'N/A'}
                    </span>
                ),
            },
            {
                header: 'Result',
                accessorKey: 'result',
                cell: (prediction, rowIndex, colIndex) => {
                    if (prediction.result === "WON") {
                        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800" title='Won'>
                            {updating && rowIndex === currentposition ? <LoaderCircle className="animate-spin size-4" /> : <Check className="w-4 h-4" />}
                        </span>;
                    }
                    if (prediction.result === "LOST") {
                        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800" title="Lost">
                            {updating && rowIndex === currentposition ? <LoaderCircle className="animate-spin size-4" /> : <X className="w-4 h-4" />}
                        </span>;
                    }
                    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800" title="Pending">
                        {updating && rowIndex === currentposition ? <LoaderCircle className="animate-spin size-4" /> : <Clock className="w-4 h-4" />}
                    </span>;
                },
            },
        ];
        const actions: Action<Prediction>[] = user?.role === "ADMIN" ? [
            {
                label: 'Won',
                icon: <Check className="w-4 h-4 text-neutral-500" />,
                onClick: (prediction, index) => updateWLPrediction(index, prediction, 'WON'),
            },
            {
                label: 'Lost',
                icon: <X className="w-4 h-4 text-neutral-500" />,
                onClick: (prediction, index) => updateWLPrediction(index, prediction, 'LOST'),
            },
            {
                label: 'Pending',
                icon: <Clock className="w-4 h-4 text-gray-500" />,
                onClick: (prediction, index) => updateWLPrediction(index, prediction, 'PENDING'),
            },
            {
                label: 'Edit',
                icon: <Edit className="w-4 h-4 text-gray-500" />,
                onClick: (prediction) => {
                    window.location.href = `/dashboard/predictions/update/?id=${prediction.id}`;
                },
            },
            {
                label: 'Delete',
                icon: <Trash className="w-4 h-4 text-red-500" />,
                onClick: (prediction, index) => deletePrediction(index, prediction.id),
                className: 'text-red-600',
            },
        ] : [];
        const slice = 10
        const header = {
            title: "Correct Score Predictions"

        }

        const uniqueId = Date.now().toString()
        const footer = {
            emptyMessage: 'Empty List',
            viewMoreLink: "/predictions/custom",
            viewMoreText: "View More",
            customActions: user?.role === "ADMIN" && (
                <Link
                    href={user ? "/dashboard/predictions/create" : "/signin"}
                    className="text-sm font-medium text-gray-900 hover:text-green-600 transition-all duration-300"
                >
                    <div className="group flex gap-1 items-center underline underline-offset-4 text-green-500 hover:text-gray-900">
                        <PlusCircle className='text-green-500 size-5 group-hover:text-gray-900' /> Add Data
                    </div>
                    {!user && "Sign in to View"}
                </Link>
            )
        }

        return {
            data: CorrectScoreGames,
            columns,
            actions,
            header,
            footer,
            slice,

            updating,
            uniqueId
        }
    }
    const DrawGamesData = () => {
        const columns: Column<Prediction>[] = [
            {
                header: 'Date',
                accessorKey: 'publishedAt',
                cell: (prediction) => (
                    <>
                        {moment(prediction.publishedAt).format('LL')}

                    </>
                ),
            },
            {
                header: 'Match',
                accessorKey: 'homeTeam',
                cell: (prediction) => (
                    <div>
                        <div className="text-sm font-medium text-gray-900">
                            {prediction.league || 'Unknown League'}
                        </div>
                        <div className="text-sm text-gray-600 ">
                            {prediction.homeTeam} vs {prediction.awayTeam}
                        </div>
                    </div>
                ),
            },
            {
                header: 'Prediction',
                accessorKey: 'tip',
                cell: (prediction) => <>
                    <p className="md:hidden text-xs font-bold">{moment(prediction.publishedAt).format('LL')}</p>
                    <p className="md:hidden text-xs">----------</p>
                    {prediction.tip || 'No prediction available'}</>
            },
            {
                header: 'Odds',
                accessorKey: 'odds',
                cell: (prediction) => (
                    <span className="px-2 py-1 text-xs font-medium text-neutral-800 bg-neutral-100 rounded-full">
                        {prediction.odds || 'N/A'}
                    </span>
                ),
            },
            {
                header: 'Result',
                accessorKey: 'result',
                cell: (prediction, rowIndex, colIndex) => {
                    if (prediction.result === "WON") {
                        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800" title='Won'>
                            {updating && rowIndex === currentposition ? <LoaderCircle className="animate-spin size-4" /> : <Check className="w-4 h-4" />}
                        </span>;
                    }
                    if (prediction.result === "LOST") {
                        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800" title="Lost">
                            {updating && rowIndex === currentposition ? <LoaderCircle className="animate-spin size-4" /> : <X className="w-4 h-4" />}
                        </span>;
                    }
                    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800" title="Pending">
                        {updating && rowIndex === currentposition ? <LoaderCircle className="animate-spin size-4" /> : <Clock className="w-4 h-4" />}
                    </span>;
                },
            },
        ];
        const actions: Action<Prediction>[] = user?.role === "ADMIN" ? [
            {
                label: 'Won',
                icon: <Check className="w-4 h-4 text-neutral-500" />,
                onClick: (prediction, index) => updateWLPrediction(index, prediction, 'WON'),
            },
            {
                label: 'Lost',
                icon: <X className="w-4 h-4 text-neutral-500" />,
                onClick: (prediction, index) => updateWLPrediction(index, prediction, 'LOST'),
            },
            {
                label: 'Pending',
                icon: <Clock className="w-4 h-4 text-gray-500" />,
                onClick: (prediction, index) => updateWLPrediction(index, prediction, 'PENDING'),
            },
            {
                label: 'Edit',
                icon: <Edit className="w-4 h-4 text-gray-500" />,
                onClick: (prediction) => {
                    window.location.href = `/dashboard/predictions/update/?id=${prediction.id}`;
                },
            },
            {
                label: 'Delete',
                icon: <Trash className="w-4 h-4 text-red-500" />,
                onClick: (prediction, index) => deletePrediction(index, prediction.id),
                className: 'text-red-600',
            },
        ] : [];
        const slice = 10
        const header = {
            title: "Draw Games Predictions",

        }

        const uniqueId = Date.now().toString()
        const footer = {
            emptyMessage: 'Empty List',
            viewMoreLink: "/predictions/previousgames",
            viewMoreText: "View More",
            customActions: user?.role === "ADMIN" && (
                <Link
                    href={user ? "/dashboard/predictions/create" : "/signin"}
                    className="text-sm font-medium text-gray-900 hover:text-green-600 transition-all duration-300"
                >
                    <div className="group flex gap-1 items-center underline underline-offset-4 text-green-500 hover:text-gray-900">
                        <PlusCircle className='text-green-500 size-5 group-hover:text-gray-900' /> Add Data
                    </div>
                    {!user && "Sign in to View"}
                </Link>
            )
        }

        return {
            data: DrawGames,
            columns,
            actions,
            header,
            footer,
            slice,

            updating,
            uniqueId
        }
    }
    const BetOfTheDayGamesData = () => {
        const columns: Column<Prediction>[] = [
            {
                header: 'Date',
                accessorKey: 'publishedAt',
                cell: (prediction) => (
                    <>
                        {moment(prediction.publishedAt).format('LL')}

                    </>
                ),
            },
            {
                header: 'Match',
                accessorKey: 'homeTeam',
                cell: (prediction) => (
                    <div>
                        <div className="text-sm font-medium text-gray-900">
                            {prediction.league || 'Unknown League'}
                        </div>
                        <div className="text-sm text-gray-600 ">
                            {prediction.homeTeam} vs {prediction.awayTeam}
                        </div>
                    </div>
                ),
            },
            {
                header: 'Prediction',
                accessorKey: 'tip',
                cell: (prediction) => <>
                    <p className="md:hidden text-xs font-bold">{moment(prediction.publishedAt).format('LL')}</p>
                    <p className="md:hidden text-xs">----------</p>
                    {prediction.tip || 'No prediction available'}</>
            },
            {
                header: 'Odds',
                accessorKey: 'odds',
                cell: (prediction) => (
                    <span className="px-2 py-1 text-xs font-medium text-neutral-800 bg-neutral-100 rounded-full">
                        {prediction.odds || 'N/A'}
                    </span>
                ),
            },
            {
                header: 'Result',
                accessorKey: 'result',
                cell: (prediction, rowIndex, colIndex) => {
                    if (prediction.result === "WON") {
                        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800" title='Won'>
                            {updating && rowIndex === currentposition ? <LoaderCircle className="animate-spin size-4" /> : <Check className="w-4 h-4" />}
                        </span>;
                    }
                    if (prediction.result === "LOST") {
                        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800" title="Lost">
                            {updating && rowIndex === currentposition ? <LoaderCircle className="animate-spin size-4" /> : <X className="w-4 h-4" />}
                        </span>;
                    }
                    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800" title="Pending">
                        {updating && rowIndex === currentposition ? <LoaderCircle className="animate-spin size-4" /> : <Clock className="w-4 h-4" />}
                    </span>;
                },
            },
        ];
        const actions: Action<Prediction>[] = user?.role === "ADMIN" ? [
            {
                label: 'Won',
                icon: <Check className="w-4 h-4 text-neutral-500" />,
                onClick: (prediction, index) => updateWLPrediction(index, prediction, 'WON'),
            },
            {
                label: 'Lost',
                icon: <X className="w-4 h-4 text-neutral-500" />,
                onClick: (prediction, index) => updateWLPrediction(index, prediction, 'LOST'),
            },
            {
                label: 'Pending',
                icon: <Clock className="w-4 h-4 text-gray-500" />,
                onClick: (prediction, index) => updateWLPrediction(index, prediction, 'PENDING'),
            },
            {
                label: 'Edit',
                icon: <Edit className="w-4 h-4 text-gray-500" />,
                onClick: (prediction) => {
                    window.location.href = `/dashboard/predictions/update/?id=${prediction.id}`;
                },
            },
            {
                label: 'Delete',
                icon: <Trash className="w-4 h-4 text-red-500" />,
                onClick: (prediction, index) => deletePrediction(index, prediction.id),
                className: 'text-red-600',
            },
        ] : [];
        const slice = 10
        const header = {
            title: "Bet of the Day Predictions"

        }

        const uniqueId = Date.now().toString()
        const footer = {
            emptyMessage: 'Empty List',
            viewMoreLink: "/predictions/freegames",
            viewMoreText: "View More",
            customActions: user?.role === "ADMIN" && (
                <Link
                    href={user ? "/dashboard/predictions/create" : "/signin"}
                    className="text-sm font-medium text-gray-900 hover:text-green-600 transition-all duration-300"
                >
                    <div className="group flex gap-1 items-center underline underline-offset-4 text-green-500 hover:text-gray-900">
                        <PlusCircle className='text-green-500 size-5 group-hover:text-gray-900' /> Add Data
                    </div>
                    {!user && "Sign in to View"}
                </Link>
            ),
        }
        const className = "bg-green-50 border-2 border-green-200 rounded-lg"

        return {
            data: BetOfTheDayGames,
            columns,
            actions,
            header,
            footer,
            slice,

            updating,
            uniqueId,
            className
        }
    }
    const PrevGamesData = () => {
        const columns: Column<Prediction>[] = [
            {
                header: 'Date',
                accessorKey: 'publishedAt',
                cell: (prediction) => (
                    <>
                        {moment(prediction.publishedAt).format('LL')}

                    </>
                ),
            },
            {
                header: 'Match',
                accessorKey: 'homeTeam',
                cell: (prediction) => (
                    <div>
                        <div className="text-sm font-medium text-gray-900">
                            {prediction.league || 'Unknown League'}
                        </div>
                        <div className="text-sm text-gray-600 ">
                            {prediction.homeTeam} vs {prediction.awayTeam}
                        </div>
                    </div>
                ),
            },
            {
                header: 'Prediction',
                accessorKey: 'tip',
                cell: (prediction) => <>
                    <p className="md:hidden text-xs font-bold">{moment(prediction.publishedAt).format('LL')}</p>
                    <p className="md:hidden text-xs">----------</p>
                    {prediction.tip || 'No prediction available'}</>
            },
            {
                header: 'Odds',
                accessorKey: 'odds',
                cell: (prediction) => (
                    <span className="px-2 py-1 text-xs font-medium text-neutral-800 bg-neutral-100 rounded-full">
                        {prediction.odds || 'N/A'}
                    </span>
                ),
            },
            {
                header: 'Result',
                accessorKey: 'result',
                cell: (prediction, rowIndex, colIndex) => {
                    if (prediction.result === "WON") {
                        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800" title='Won'>
                            {updating && rowIndex === currentposition ? <LoaderCircle className="animate-spin size-4" /> : <Check className="w-4 h-4" />}
                        </span>;
                    }
                    if (prediction.result === "LOST") {
                        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800" title="Lost">
                            {updating && rowIndex === currentposition ? <LoaderCircle className="animate-spin size-4" /> : <X className="w-4 h-4" />}
                        </span>;
                    }
                    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800" title="Pending">
                        {updating && rowIndex === currentposition ? <LoaderCircle className="animate-spin size-4" /> : <Clock className="w-4 h-4" />}
                    </span>;
                },
            },
        ];
        const actions: Action<Prediction>[] = user?.role === "ADMIN" ? [
            {
                label: 'Won',
                icon: <Check className="w-4 h-4 text-neutral-500" />,
                onClick: (prediction, index) => updateWLPrediction(index, prediction, 'WON'),
            },
            {
                label: 'Lost',
                icon: <X className="w-4 h-4 text-neutral-500" />,
                onClick: (prediction, index) => updateWLPrediction(index, prediction, 'LOST'),
            },
            {
                label: 'Pending',
                icon: <Clock className="w-4 h-4 text-gray-500" />,
                onClick: (prediction, index) => updateWLPrediction(index, prediction, 'PENDING'),
            },
            {
                label: 'Edit',
                icon: <Edit className="w-4 h-4 text-gray-500" />,
                onClick: (prediction) => {
                    window.location.href = `/dashboard/predictions/update/?id=${prediction.id}`;
                },
            },
            {
                label: 'Delete',
                icon: <Trash className="w-4 h-4 text-red-500" />,
                onClick: (prediction, index) => deletePrediction(index, prediction.id),
                className: 'text-red-600',
            },
        ] : [];
        const slice = 10
        const header = {
            title: "Previous Won VIP Games Predictions"
        }
        const uniqueId = Date.now().toString()
        const footer = {
            emptyMessage: 'Empty List',
            viewMoreLink: "/predictions/freegames",
            viewMoreText: "View More",
            customActions: user?.role === "ADMIN" && (
                <Link
                    href={user ? "/dashboard/predictions/create" : "/signin"}
                    className="text-sm font-medium text-gray-900 hover:text-green-600 transition-all duration-300"
                >
                    <div className="group flex gap-1 items-center underline underline-offset-4 text-green-500 hover:text-gray-900">
                        <PlusCircle className='text-green-500 size-5 group-hover:text-gray-900' /> Add Data
                    </div>
                    {!user && "Sign in to View"}
                </Link>
            ),
        }
        const className = "bg-purple-50 border-2 border-purple-200 rounded-lg"

        return {
            data: PrevWonGames,
            columns,
            actions,
            header,
            footer,
            slice,
            updating,
            uniqueId,
            className
        }
    }

    return (
        <div className="relative mx-auto px-4 py-12 w-full">
            <div className="absolute inset-0 bg-cover bg-center h-64 shadow-lg -z-20"
                style={{
                    backgroundImage: 'linear-gradient(to right, #1a1818c0, #111010cb), url(/stadium.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}>
            </div>
            <div className="absolute inset-0 -z-30">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20, 184, 28, 0.986),transparent_50%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(40deg,transparent,rgba(24, 104, 24, 0.932)_20%,rgba(26, 184, 20, 0)_80%)]" />
                <div className="absolute w-full h-full bg-[radial-gradient(#14b8a650_1px,transparent_1px)] bg-[size:20px_20px]" />
            </div>
            <div className="flex flex-col max-w-4xl mx-auto mt-28 z-50">
                {!content.isSubscriptionActive && <h1 className="text-4xl font-bold mb-20 text-white">Choose Your Plan</h1>}
                {content.isSubscriptionActive && <h1 className="text-4xl font-bold mb-20 text-white">Vip Predictions & Analysis</h1>}
                {!content.isSubscriptionActive && <p className="text-2xl text-gray-600 text-center mt-32">Get access to premium predictions and expert analysis</p>}
                {getPendingPayments().length > 0 && <button className="rounded-lg bg-green-800 text-white px-8 py-2 place-self-center hover:scale-105 transition-all delay-100 duration-300"
                    onClick={() => {
                        pollPendingPayments()
                    }}
                >Refresh Payment Status</button>}
            </div>
            <div className="flex flex-col max-w-[95rem] w-full mx-auto gap-16">
                {/* TODO: toggle for debugging */}
                {!content.isSubscriptionActive && <div className="w-full grid justify-center gap-8 max-w-7xl mx-auto my-16">
                    <div className="flex flex-col md:flex-row gap-8 justify-center items-center mx-auto w-full">
                        {pricingPlans.length > 0 && user && pricingPlans.map((plan, index) => (
                            <div
                                key={plan.id}
                                className={`relative bg-neutral-100 w-full rounded-lg p-8 transform hover:scale-105 hover:shadow-2xl transition-transform duration-300 ${plan.isPopular ? 'border-2 border-green-900' : 'border border-neutral-200 shadow-md'} col-start-${2}`}
                            >
                                {plan.isPopular && (
                                    <div className="absolute top-0 right-0 bg-green-900 text-white px-4 py-1 rounded-bl-lg">
                                        Popular
                                    </div>
                                )}
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">{plan.name}</h2>
                                <p className="text-4xl font-bold text-green-900 mb-6">
                                    <span className="text-base text-neutral-500">{user?.location?.currencycode || "USD"}</span>{(plan.price * currency).toLocaleString("en-US", { maximumFractionDigits: 0 })}<span className="text-lg font-normal text-gray-500">/{plan.plan}</span>
                                </p>
                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-center">
                                            <svg className="h-5 w-5 text-green-500 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                                <path d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    className="w-full bg-green-900 text-white py-3 rounded-md hover:bg-green-700 transition-colors"
                                    onClick={() => handleFlutterwavePayment(plan)}
                                >
                                    Pay with Flutterwave
                                </button>
                            </div>
                        ))}
                        <div className="col-span-2 flex justify-center items-center">
                            {!loading && !user && (
                                <Link href="/signin" className="bg-green-900 text-white px-8 py-3 rounded-md hover:bg-green-950 transition-colors">
                                    Sign in to Subscribe
                                </Link>
                            )}
                            {loading ? (
                                <div className="flex items-center space-x-2">
                                    <LoaderCircle className="animate-spin h-5 w-5 text-green-900" />
                                    <span className="text-gray-600">Loading plans...</span>
                                </div>
                            ) : pricingPlans.length === 0 && (
                                <p className="text-gray-600">No pricing plans available</p>
                            )}
                        </div>
                    </div>
                </div>}

                {content.isSubscriptionActive && <div className="flex flex-col max-w-[95rem] w-full mx-auto gap-16 mt-16">

                    <TableComponent
                        uniqueId={VIPGamesData().uniqueId}
                        data={VIPGamesData().data}
                        columns={VIPGamesData().columns}
                        actions={VIPGamesData().actions}
                        footer={VIPGamesData().footer}
                        header={VIPGamesData().header}
                        updating={updating}
                        currentPosition={currentposition}
                    />

                    <TableComponent
                        uniqueId={CorrectScoreGamesData().uniqueId}
                        data={CorrectScoreGamesData().data}
                        columns={CorrectScoreGamesData().columns}
                        actions={CorrectScoreGamesData().actions}
                        footer={CorrectScoreGamesData().footer}
                        header={CorrectScoreGamesData().header}
                        updating={updating}
                        currentPosition={currentposition}
                    />
                    <TableComponent
                        uniqueId={DrawGamesData().uniqueId}
                        data={DrawGamesData().data}
                        columns={DrawGamesData().columns}
                        actions={DrawGamesData().actions}
                        footer={DrawGamesData().footer}
                        header={DrawGamesData().header}
                        updating={updating}
                        currentPosition={currentposition}
                    />
                    <TableComponent
                        uniqueId={PrevGamesData().uniqueId}
                        data={PrevGamesData().data}
                        columns={PrevGamesData().columns}
                        actions={PrevGamesData().actions}
                        footer={PrevGamesData().footer}
                        header={PrevGamesData().header}
                        className={PrevGamesData().className}
                        updating={updating}
                        currentPosition={currentposition}
                    />

                </div>}

            </div >
        </div >
    )
}

export default PricingComponent