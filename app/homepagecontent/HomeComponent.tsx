/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
'use client'
import Link from 'next/link'
import Image from 'next/image'

import { Prediction } from '../lib/interface';
import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { useAuth } from '../contexts/AuthContext';
import { sportTypeOptions } from '../lib/formschemas/predictionForm';
import { Check, Clock, Copy, Edit, Edit2, LoaderCircle, Mail, MoreVertical, Phone, PlusCircle, Trash, X, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useDialog } from '../components/shared/dialog';
import { addBettingCode, updateTitle } from '../actions/utils';
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover';
import { FaSpinner, FaTelegram, FaTwitter } from 'react-icons/fa';
import { Action, Column, TableComponent } from '../components/shared/TableSeater';

const HomePageComponent = ({ content }: { content: any }) => {
    const { user } = useAuth()
    const dialog = useDialog()
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    const [updating, setUpdating] = useState<boolean>(false);
    const [currentposition, setCurrentPosition] = useState<number>(-1);
    const [loading, setLoading] = useState(false)
    const [title, setTitle] = useState<Record<string, any>[]>([])
    const [shouldShow, setShouldShow] = useState(false);
    const [bettingCode, setBettingCode] = useState<string>("")
    const [bettingPlatform, setBettingPlatform] = useState<string>("")


    const parentRef = useRef<HTMLDivElement>(null)


    const defaulttitles = [
        "Vip Predictions",
        "Bet of the day",
        "Free Hot Odds",
        "Previously Won Matches",
        "Midnight Owl",
    ]

    const features = [
        {
            title: 'AI-Powered Analysis',
            description: 'Our advanced AI algorithms analyze millions of data points to provide highly accurate predictions.',
            icon: (
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            gradient: 'from-green-500 to-green-500'
        },
        {
            title: 'Real-Time Updates',
            description: 'Get instant notifications and live updates for matches, odds changes, and prediction results.',
            icon: (
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            gradient: 'from-green-500 to-green-500'
        },
        {
            title: 'Secure Payments',
            description: 'Multiple payment options with bank-grade security. Easy subscriptions and instant access.',
            icon: (
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
            gradient: 'from-green-500 to-green-500'
        },
        {
            title: 'Premium Insights',
            description: 'Access detailed match analysis, expert opinions, and exclusive VIP predictions.',
            icon: (
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            gradient: 'from-pink-500 to-rose-500'
        },
        {
            title: 'Multiple Payment Methods',
            description: 'Pay with credit cards, PayPal, crypto, or mobile money. Flexible subscription options.',
            icon: (
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            ),
            gradient: 'from-cyan-500 to-green-500'
        },
        {
            title: '24/7 Support',
            description: 'Get help anytime with our dedicated customer support team and community forum.',
            icon: (
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
            ),
            gradient: 'from-green-500 to-green-500'
        },
    ]

    const customgames = ['Bet of the Day', 'Correct Score', 'Draw Games']

    useEffect(() => {
        if (content && Array.isArray(content.titles)) {
            // Sort content.titles by their customtitle's index in defaulttitles

            const sortedTitles = content.titles.sort((a: any, b: any) => {
                const idA = parseInt(a.id, 10);
                const idB = parseInt(b.id, 10);
                return idA - idB;
            });


            setTitle(sortedTitles);
        }

        if (content?.predictions?.length > 0) {
            setPredictions(content?.predictions || []);
        }

        if (content?.betslip?.length > 0) {
            setBettingCode(content.betslip[0].bettingCode || "(Set Platform)")
            setBettingPlatform(content.betslip[0].bettingPlatform || "(Set Code)")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [content]);

    const getRandomDelay = () => {
        return Math.floor(Math.random() * (7000 - 3000 + 1)) + 3000; // Random between 3-7 seconds
    }

    useEffect(() => {
        setTimeout(() => {
            setShouldShow(true);
        }, getRandomDelay())
    }, [])



    const updateTableTitle = async (index: number, name: string) => {
        let titlename = ""

        const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
            titlename = e.target.value
        }

        dialog.showDialog({
            title: "Update " + name,
            message: `If you really want to to update this tables tltle from ${name}, input the new table title name below`,
            type: "component",
            component: (
                <div className="my-4 w-full">
                    <input
                        type="text"
                        className="w-full px-4 py-2 border border-green-400 rounded-lg  focus:ring-2 focus:ring-green-500 text-gray-900 mt-2 select-all "
                        autoFocus
                        onFocus={e => e.target.select()}
                        placeholder="Enter new table title"
                        onChange={handleTitleChange}
                    />
                </div>
            ),
            async onConfirm() {
                if (!titlename && titlename.length < 5 && titlename.toLowerCase() === titlename.toLowerCase()) {
                    toast.error('Your title should be longer enough or should not be the same title as before.')
                } else {

                    const updatedTitles = [...title];
                    updatedTitles[index - 1] = { ...updatedTitles[index - 1], defaulttitle: titlename };

                    await updateTitle(String(index), titlename)
                    setTitle(updatedTitles);
                    titlename = ""
                }
            },

        })
    }

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
                }

            }
        })
    }

    const updateWLPrediction = async (index: number, prediction: Prediction, data: string) => {
        setCurrentPosition(index);
        const { id, ...dataWithoutId } = prediction;
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

                } catch (error) {
                    setUpdating(false);
                }

            }
        })
    }

    const showBettingCode = () => {
        let bettingPlatform = ""
        let bettingCode = ""
        dialog.showDialog({
            title: "Betting Slip Code",
            message: "Enter the betting slip details below",
            type: "component",
            component: (
                <div className="mb-4 w-full gap-8">
                    <select
                        className="w-full px-4 py-2 border border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 mt-2 appearance-none"
                        onChange={(e) => {
                            bettingPlatform = e.target.value;
                        }}

                    >
                        <option className='bg-green-50' value="">Select Betting Platform</option>
                        <option className='bg-green-50' value="SPORTYBET">SPORTYBET</option>
                        <option className='bg-green-50' value="1XBET">1XBET</option>
                        <option className='bg-green-50' value="BET365">BET365</option>
                        <option className='bg-green-50' value="BETWAY">BETWAY</option>
                        <option className='bg-green-50' value="BETKING">BETKING</option>
                        <option className='bg-green-50' value="BETWINNER">BETWINNER</option>
                        <option className='bg-green-50' value="22BET">22BET</option>
                        <option className='bg-green-50' value="NAIRABET">NAIRABET</option>
                        <option className='bg-green-50' value="MERRYBET">MERRYBET</option>
                        <option className='bg-green-50' value="BANGBET">BANGBET</option>
                        <option className='bg-green-50' value="MSPORT">MSPORT</option>
                        <option className='bg-green-50' value="MELBET">MELBET</option>
                        <option className='bg-green-50' value="OGABET">OGABET</option>
                        <option className='bg-green-50' value="PARIPESA">PARIPESA</option>
                        <option className='bg-green-50' value="WAZOBET">WAZOBET</option>
                    </select>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 mt-2 select-all"
                        autoFocus
                        onFocus={e => e.target.select()}
                        placeholder="Enter new code for this slip"
                        onChange={(e) => {
                            bettingCode = e.target.value;

                        }}
                    />


                </div>
            ),
            onConfirm: async () => {

                if (!bettingPlatform || !bettingCode) {
                    toast.error("Please fill in all fields before saving.", {
                        id: "bettingCodeError",
                    });
                }
                else {
                    toast.loading("Saving betting code...", {
                        id: "bettingCode",
                    });
                    try {
                        await addBettingCode(content.betslip[0].id, {
                            bettingPlatform,
                            bettingCode
                        })
                        setBettingCode(bettingCode);
                        setBettingPlatform(bettingPlatform);
                        toast.dismiss()
                        toast.success("Betting code saved successfully!", {
                            id: "bettingCode",
                        });
                    } catch (error: any) {
                        toast.dismiss()
                        toast.error(`Error saving betting code: ${error.message}`, {
                            id: "bettingCodeError",
                        });

                    }

                }
            }

        });
    }


    const VIPGames = predictions.filter(prediction => prediction.result === "PENDING" && prediction.gameType === "VIP_GAME")
    const BetOfTheDayGames = predictions.filter(prediction => prediction.result === "PENDING" && prediction.gameType === "BET_OF_THE_DAY")
    const PrevWonGames = predictions.filter(prediction => prediction.result !== "PENDING")
        .filter(prediction => {
            const predictionDate = new Date(prediction.publishedAt);
            const now = new Date();
            const twentyFourHoursAgo = new Date(now.getTime() - (48 * 60 * 60 * 1000));
            return predictionDate >= twentyFourHoursAgo;
        })
    const FreeGames = predictions.filter(prediction => prediction.result === "PENDING" && prediction.gameType === "FREE_GAME")
    const MidnightOwlGames = predictions.filter(prediction => prediction.result === "PENDING").slice(0, 0)


    const VIPData = () => {
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
            title: title[0]?.defaulttitle || defaulttitles[0],
            badge: 'Premium',
            isAdmin: user?.role === "ADMIN",
            onTitleEdit: (title: string) => updateTableTitle(1, title),

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
            title: title[1]?.defaulttitle || defaulttitles[1],
            //badge: 'Premium',
            isAdmin: user?.role === "ADMIN",
            onTitleEdit: (title: string) => updateTableTitle(2, title),

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
            data: BetOfTheDayGames,
            columns,
            actions,
            header,
            footer,
            slice,

            updating,
            uniqueId
        }
    }
    const FreeGamesData = () => {
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
                    {prediction.tip || 'No prediction available'}</>,
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
            title: title[2]?.defaulttitle || defaulttitles[2],
            //badge: 'Premium',
            isAdmin: user?.role === "ADMIN",
            onTitleEdit: (title: string) => updateTableTitle(3, title),

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
        const component = <div className="flex justify-center px-4">
            <div key={Date.now()} className="relative flex flex-col md:flex-row w-full items-center justify-between gap-4 px-4 py-4 bg-green-100 text-green-800 rounded-lg shadow-sm min-w-xs max-w-md lg:max-w-lg mx-8 my-4 place-self-center">
                <div className="flex items-center mr-4">
                    {user?.role === "ADMIN" && <Edit2 className="size-5 text-green-600 hover:text-green-800 cursor-pointer mr-2 md:mr-4"
                        onClick={showBettingCode} />}
                    <p className='text-base text-center font-medium leading-5'>BET DIRECTLY ON <span className='italic underline underline-offset-4'>{bettingPlatform}</span></p>
                </div>

                <div className="flex items-center gap-2">
                    <p className='text-base text-center leading-5 font-medium'>CODE: <span className='font-extrabold'>{bettingCode}</span></p>
                    <Copy className="size-5 font-medium text-green-600 hover:text-green-800 transition-colors duration-300"
                        onClick={() => {
                            navigator.clipboard.writeText(bettingCode);
                            toast.success(`Code ${bettingCode} copied to clipboard!`);
                        }}
                    />
                </div>
            </div>
        </div>

        return {
            data: FreeGames,
            columns,
            actions,
            header,
            footer,
            slice,

            updating,
            uniqueId,
            className,
            component
        }
    }
    const PreviousWonData = () => {
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
                header: 'Game',
                accessorKey: 'gameType',
                cell: (prediction) => prediction.gameType.replace(/_/g, ' ').toUpperCase() || 'N/A',
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
            title: title[3]?.defaulttitle || defaulttitles[3],
            //badge: 'Premium',
            isAdmin: user?.role === "ADMIN",
            onTitleEdit: (title: string) => updateTableTitle(4, title),

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
            data: PrevWonGames,
            columns,
            actions,
            header,
            footer,
            slice,

            updating,
            uniqueId
        }
    }

    const MidnightOwlData = () => {
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
        const slice = 3
        const header = {
            title: title[5]?.defaulttitle || defaulttitles[5],
            //badge: 'Premium',
            isAdmin: user?.role === "ADMIN",
            onTitleEdit: (title: string) => updateTableTitle(4, title),

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
            data: MidnightOwlGames,
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

    const WelcomPopoup = () => {
        const [isOpen, setIsOpen] = useState(false);
        useEffect(() => {
            setIsOpen(true);

            const handleEscape = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    setIsOpen(false);
                    setShouldShow(false);
                }
            };

            const handleClickOutside = (e: Event) => {
                if (!(e.target as HTMLElement).closest('[data-popup]')) {
                    setIsOpen(false);
                    setShouldShow(false);
                }
            };

            document.addEventListener('keydown', handleEscape);
            document.addEventListener('mousedown', handleClickOutside);

            return () => {
                document.removeEventListener('keydown', handleEscape);
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }, []);

        if (!isOpen) return null;


        return (
            <div className="fixed inset-0 flex gap-2 bg-black/60 z-50 backdrop-blur-sm p-8 items-center justify-center transition-all duration-300">
                <XCircle className='absolute text-neutral-500 hover:text-red-700 rounded-full p-2 top-10 right-10 size-10 transition-all duration-300'
                    onClick={() => setIsOpen(false)}
                />
                <div data-popup
                    className="bg-neutral-800/80 backdrop-blur-md px-6 py-12 rounded-lg shadow-lg w-full max-w-lg animate-in fade-in zoom-in duration-500"
                    style={{
                        animation: 'fadeInScale 0.5s ease-out',
                        transform: 'scale(0.9)',
                        opacity: 0,
                        animationFillMode: 'forwards'
                    }}>
                    <style jsx>{`
                    @keyframes fadeInScale {
                        from {
                            transform: scale(0.9);
                            opacity: 0;
                        }
                        to {
                            transform: scale(1);
                            opacity: 1;
                        }
                    } 
                `}</style>
                    <h2 className="text-xl font-bold text-white mb-4 text-center">LET US ALL WIN TOGETHER</h2>
                    <hr className="border-neutral-600 my-4" />

                    <div className="my-4 rounded-md bg-green-100 overflow-hidden">
                        <img
                            className='bject-cover w-full rounded-md'
                            src="/cwa.jpg" alt="" />
                    </div>
                    <hr className="border-neutral-600 my-8" />
                    <div className="flex justify-center gap-4">

                        <Link
                            href="https://t.me/Chriswrldarena1"
                            target='_blank'
                            className="px-6 py-2 bg-gradient-to-r from-green-800 to-green-800 text-white font-bold rounded-lg hover:from-green-800 hover:to-green-90000 transition-colors"
                        >
                            Join Telegram Channel!
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen w-full">
            {/* Hero Section */}
            {shouldShow && <WelcomPopoup />}
            {/* Hero Section */}
            <section className="md:px-8 flex flex-col justify-center items-center relative text-white w-full">
                {/* Dynamic Background with Overlay */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/80" />
                    <div className="absolute inset-0 bg-[url('/stadium.jpg')] bg-cover bg-center mix-blend-overlay" />
                    {/* Animated Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-gray-900/30 animate-gradient" />
                </div>

                {/* Content Container */}
                <div className="relative z-10 container mx-auto px-4">
                    <div className="w-full flex items-center justify-center flex-col lg:flex-row lg:justify-between gap-8">
                        {/* Text Content */}
                        <div className="w-full flex flex-col justify-center mx-8 my-16 md:my-24 lg:my-28">
                            <div className="flex flex-col w-full m-auto justify-center text-left mt-10 gap-4 md:gap-8 xl:gap-10">
                                {/* Intro Description */}
                                <h1 className="text-xl sm:text-xl md:text-5xl xl:text-6xl 2xl:text-7xl font-bold lg:leading-relaxed md:leading-16 xl:leading-20">
                                    Welcome to <br />ChrisWrld Arena Official Page
                                </h1>

                                {/* Enhanced Description */}
                                <p className="text-xs sm:text-lg md:text-xl text-gray-300 max-w-2xl xl:max-w-4xl">
                                    Join our elite community for expert predictions and data-driven insights that help turn your betting passion into consistent profits.
                                </p>

                            </div>

                            {/* Enhanced CTA Buttons */}
                            <div className="flex flex-col gap-4 pt-4 mt-8">
                                <Link
                                    href="/pricing"
                                    className="group relative overflow-hidden px-6 py-1.5 w-max rounded-lg  bg-yellow-500 text-black font-semibold text-center transform hover:scale-[1.02] transition-all duration-300"
                                >
                                    <span className="text-base md:text-lg lg:text-xl xl:text-2xl flex items-center justify-center gap-2">
                                        GET VIP GAMES
                                        <div className="absolute top-1 right-1">
                                            <div className="relative w-2 h-2">
                                                <div className="absolute inset-0 rounded-full bg-yellow-400 animate-ping" />
                                            </div>
                                        </div>
                                    </span>
                                </Link>
                                <Link
                                    href="https://t.me/Chriswrldarena1"
                                    target='_blank'
                                    className="group relative overflow-hidden px-6 py-1.5 w-max rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold text-center transform hover:scale-[1.02] transition-all duration-300 shadow-lg"
                                >
                                    <span className="text-base md:text-lg lg:text-xl xl:text-2xl flex items-center justify-center gap-2">
                                        <svg className="size-4 md:size-6" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.227-.535.227l.19-2.712 4.94-4.465c.215-.19-.047-.296-.332-.106l-6.103 3.854-2.623-.816c-.57-.18-.582-.57.12-.843l10.238-3.948c.473-.174.887.104.605 1.337z" />
                                        </svg>
                                        JOIN TELEGRAM CHANNEL

                                    </span>
                                </Link>

                            </div>
                        </div>

                        <div className="hidden flex-col w-full lg:w-1/2 text-center lg:text-left space-y-8">
                            {/* Main Heading with Enhanced Typography */}
                            <div className="space-y-4">
                                {/* Stats Section */}
                                <div className="flex flex-wrap justify-between gap-4 pt-6">
                                    <div className="text-center">
                                        <p className="text-3xl xl:text-7xl font-extrabold text-white">95%</p>
                                        <p className=" xl:text-lg text-green-500">Success Rate</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-3xl xl:text-7xl font-extrabold text-white">10K+</p>
                                        <p className="text-lg text-green-500">Happy Members</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-3xl xl:text-7xl font-extrabold text-white">24/7</p>
                                        <p className=" xl:text-lg text-green-500">Expert Support</p>
                                    </div>
                                </div>
                            </div>

                            {/* Key Stats/Features Animation */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                                <div className="bg-green-950 backdrop-blur-sm p-4 rounded-xl border border-green-800 hover:border-green-900 transition-all duration-300 group hover:shadow-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-white to-white/50 rounded-lg flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300">
                                            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-sm xl:text-lg font-semibold text-white">High Win Rate</h4>
                                            <p className="text-xs xl:text-sm text-neutral-300">95% success rate across all predictions</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-green-950 backdrop-blur-sm p-4 rounded-xl border border-green-800 hover:border-green-900 transition-all duration-300 group hover:shadow-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-white to-white/50 rounded-lg flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300">
                                            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-sm xl:text-lg font-semibold text-white">Real-Time Updates</h4>
                                            <p className="text-xs xl:text-sm text-neutral-300">Instant notifications for all matches</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Enhanced CTA Buttons */}
                            <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                                <Link
                                    href="https://t.me/Chriswrldarena1"
                                    target='_blank'
                                    className="group relative overflow-hidden px-4 py-3 w-max rounded-lg bg-yellow-500 text-black font-semibold text-center transform hover:scale-[1.02] transition-all duration-300"
                                >
                                    <span className="flex text-sm items-center justify-center gap-2">
                                        <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.227-.535.227l.19-2.712 4.94-4.465c.215-.19-.047-.296-.332-.106l-6.103 3.854-2.623-.816c-.57-.18-.582-.57.12-.843l10.238-3.948c.473-.174.887.104.605 1.337z" />
                                        </svg>
                                        JOIN TELEGRAM CHANNEL
                                        <span className="absolute inset-0 flex justify-center items-center bg-black text-yellow-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                            CLICK TO JOIN OUR CHANNEL →
                                        </span>
                                    </span>
                                </Link>

                                <Link
                                    href="/pricing"
                                    className="group relative overflow-hidden px-4 py-2 w-max rounded-lg bg-yellow-500 text-black font-semibold text-center transform hover:scale-[1.02] transition-all duration-300"
                                >
                                    <span className="flex text-sm items-center justify-center gap-2">
                                        <svg className="size-7" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M2 8l4 10h12l4-10-6 5-4-7-4 7-6-5z" />
                                        </svg>
                                        GET VIP GAMES
                                        <div className="absolute top-1 right-1">
                                            <div className="relative w-2 h-2">
                                                <div className="absolute inset-0 rounded-full bg-yellow-400 animate-ping" />
                                            </div>
                                        </div>
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section >

            {/* Recent Predictions Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col space-y-12">
                        {/* Section Header */}
                        <div className="text-center">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Expert Predictions
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
                                Access our winning predictions with proven success rates. Upgrade to VIP for premium insights.
                            </p>
                        </div>

                        <div className="w-full ">
                            <div className="flex flex-col w-full xl:col-span-2 gap-16">

                                {/* VIP Games */}
                                <TableComponent
                                    uniqueId={PreviousWonData().uniqueId}
                                    data={PreviousWonData().data}
                                    columns={PreviousWonData().columns}
                                    //slice={PreviousWonData().slice}
                                    actions={PreviousWonData().actions}
                                    footer={PreviousWonData().footer}
                                    header={PreviousWonData().header}
                                    updating={updating}
                                    currentPosition={currentposition}
                                />

                                {content.isSubscriptionActive &&
                                    <TableComponent
                                        uniqueId={VIPData().uniqueId}
                                        data={VIPData().data}
                                        columns={VIPData().columns}
                                        //slice={VIPData().slice}
                                        actions={VIPData().actions}
                                        footer={VIPData().footer}
                                        header={VIPData().header}
                                        updating={updating}
                                        currentPosition={currentposition}
                                    />}
                                {/* <TableComponent
                                    uniqueId={BetOfTheDayGamesData().uniqueId}
                                    data={BetOfTheDayGamesData().data}
                                    columns={BetOfTheDayGamesData().columns}
                                    actions={BetOfTheDayGamesData().actions}
                                    footer={BetOfTheDayGamesData().footer}
                                    header={BetOfTheDayGamesData().header}
                                    updating={updating}
                                    currentPosition={currentposition}
                                />*/}
                                <TableComponent
                                    uniqueId={FreeGamesData().uniqueId}
                                    data={FreeGamesData().data}
                                    columns={FreeGamesData().columns}
                                    //slice={FreeGamesData().slice}
                                    actions={FreeGamesData().actions}
                                    footer={FreeGamesData().footer}
                                    header={FreeGamesData().header}
                                    className={FreeGamesData().className}
                                    updating={updating}
                                    currentPosition={currentposition}
                                    component={FreeGamesData().component}
                                />


                                {/*  {new Date().getHours() >= 0 && new Date().getHours() < 5 ? (<TableComponent
                                    uniqueId={MidnightOwlData().uniqueId}
                                    data={MidnightOwlData().data}
                                    columns={MidnightOwlData().columns}
                                    //slice={MidnightOwlData().slice}
                                    actions={MidnightOwlData().actions}
                                    footer={MidnightOwlData().footer}
                                    header={MidnightOwlData().header}
                                    className={MidnightOwlData().className}
                                    updating={updating}
                                    currentPosition={currentposition}

                                />) : ( )} */}
                                <div className={`bg-white rounded-xl shadow-sm overflow-hidden border border-green-200 h-max `}>
                                    {/* Header Section */}

                                    <div className="p-6 bg-gradient-to-r from-green-950 to-green-900 border-b border-green-200">
                                        <div className="relative flex flex-col lg:flex-row gap-4 items-center justify-between">

                                            <h3 className={`text-sm sm:text-xl font-bold text-white flex items-center gap-2 uppercase`}>
                                                {title[4]?.defaulttitle || defaulttitles[4]}
                                                {user?.role === "ADMIN" && (
                                                    <span
                                                        className="inline-flex cursor-pointer items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-400 text-gray-900"
                                                        onClick={() => updateTableTitle(5, title[4]?.defaulttitle || defaulttitles[4])}>
                                                        <Edit2 className="size-4" />&nbsp;Edit
                                                    </span>
                                                )}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="text-center py-12 border border-gray-200 rounded-lg bg-green-50">
                                        {new Date().getHours() >= 0 && new Date().getHours() > 5 ? (
                                            <>
                                                <div className="w-20 h-20 mx-auto mb-6 text-gray-400">
                                                    <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <h3 className="text-xs sm:text-xl font-medium text-gray-900 mb-2">Predictions Unavailable</h3>
                                                <p className="text-xs sm:text-base text-gray-600">Our Midnight Oracle predictions are only available from 12 AM to 5 AM.</p>
                                                <p suppressHydrationWarning className="text-xs sm:text-sm text-green-600 mt-2">Returns in {23 - new Date().getHours()} hours - {60 - new Date().getMinutes()} mins</p>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <FaSpinner className="animate-spin size-6 text-green-500 mt-4" />
                                                <p className="text-xs sm:text-base text-gray-600">Our Midnight Oracle predictions are only available from 12 AM to 5 AM.</p>
                                                <p className="text-xs sm:text-lg text-green-600 mt-2">Predictions will be available soon.</p>
                                            </div>

                                        )}

                                    </div>

                                </div>

                            </div>

                            {/* TODO: duplicate to make adds */}
                        </div>
                    </div>
                </div>
            </section >




            {/* Enhanced CTA Section with Animated Elements */}
            <section className="relative py-20 overflow-hidden">
                {/* Dynamic Background */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
                    <div className="absolute inset-0 bg-[url('/stadium.jpg')] bg-cover bg-center opacity-5" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(20,184,166,0.15),transparent_50%)]" />
                    <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-yellow-500/10 to-transparent" />
                </div>

                {/* Floating Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -left-40 w-80 h-80 border border-yellow-500/10 rounded-full animate-spin-slow" />
                    <div className="absolute top-0 right-0 w-64 h-64 border border-yellow-500/20 rounded-full animate-reverse-spin" />
                    <div className="absolute bottom-20 left-1/2 w-40 h-40 border border-yellow-500/10 rounded-full animate-pulse" />
                </div>

                <div className="container relative z-10 mx-auto px-4">
                    <div className="max-w-5xl mx-auto text-center">
                        {/* Animated Heading */}
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">
                            Transform Your
                            <span className="relative inline-block px-2">
                                <span className="relative z-10 bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                                    Predictions
                                </span>
                                <div className="absolute inset-0 bg-yellow-400/20 blur-2xl animate-pulse" />
                            </span>
                            Into Profit
                        </h2>

                        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                            Join our elite community of successful bettors and unlock expert predictions
                            that consistently deliver results.
                        </p>

                        {/* Enhanced CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <Link href="/signup"
                                className="group relative px-8 py-4 text-lg font-semibold text-black rounded-xl overflow-hidden transition-all duration-300"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-yellow-600 transition-all duration-300 group-hover:scale-105" />
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
                                </div>
                                <span className="relative flex items-center gap-2">
                                    Start Winning Now
                                    <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 animate-bounce-x" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </span>
                            </Link>

                            <Link href="/pricing"
                                className="group relative px-8 py-4 text-lg font-semibold text-white rounded-xl overflow-hidden transition-all duration-300"
                            >
                                <div className="absolute inset-0 bg-white/10 border border-white/30 transition-all duration-300 group-hover:bg-white/20" />
                                <span className="relative flex items-center gap-2">
                                    View Premium Plans
                                    <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </span>
                            </Link>
                        </div>


                    </div>
                </div>
            </section>

            {/* Enhanced Contact Section */}
            <section className="relative py-10">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(184, 168, 20, 0.1),transparent_50%)]" />
                    <div className="absolute inset-0 bg-[linear-gradient(40deg,transparent,rgba(20,184,166,0.05)_20%,rgba(20,184,166,0)_80%)]" />
                    <div className="absolute w-full h-full bg-[radial-gradient(#14b8a650_1px,transparent_1px)] bg-[size:20px_20px]" />
                </div>
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="relative p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                            <div className="absolute inset-0  rounded-2xl" />
                            <div className="relative">
                                <h2 className="text-4xl md:text-5xl font-bold lg:font-extrabold text-green-900 mb-8 text-center uppercase">Connect With Us</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {[
                                        { title: "phone", label: "Call Us", href: "tel:+233 24 0646729 ", icon: <Phone className="size-6 text-black" /> },
                                        { title: "mail", label: "Email", href: "mailto:chriswrld95@gmail.com", icon: <Mail className="size-6 text-black" /> },
                                        { title: "telegram", label: "Telegram", href: "https://t.me/Chriswrldarena1", icon: <FaTelegram className="size-6 text-black" /> },
                                        { title: "twitter", label: "Twitter", href: "https://x.com/chriswrld233", icon: <FaTwitter className="size-6 text-black" /> }
                                    ].map((contact, index) => (
                                        <a key={index}
                                            href={contact.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex flex-col items-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
                                        >
                                            <div className="w-12 h-12 mb-3 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 hover:to-yellow-600 flex items-center justify-center">
                                                {contact.icon}
                                            </div>
                                            <span className="text-sm text-neutral-500 group-hover:text-neutral-700 transition-colors">
                                                {contact.label}
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


        </div >
    )
}

export default HomePageComponent

