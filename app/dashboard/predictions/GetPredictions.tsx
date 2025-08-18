'use client'
import { Prediction, PredictionFilters } from '@/app/lib/interface';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import moment from 'moment';
import { Check, Clock, Diamond, Edit, MoreVertical, SubscriptIcon, Trash, X } from 'lucide-react';
import { useDialog } from '@/app/components/shared/dialog';
import { FaSpinner } from 'react-icons/fa';

const PAGE_SIZE = 50;

const GetPredictions = () => {
    const dialog = useDialog()
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<boolean>(false);
    const [currentposition, setCurrentPosition] = useState<number>(-1);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = PAGE_SIZE;


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
                    const result = await response.json();

                    const updatedPredictions = [...predictions];
                    updatedPredictions[index] = {
                        ...updatedPredictions[index],
                        result: data as Prediction['result'],
                    };
                    setPredictions([
                        ...updatedPredictions
                    ])
                    setUpdating(false);
                    console.log("Prediction updated successfully:", result);
                    // setPredictions(result);
                } catch (error) {
                    setUpdating(false);
                    console.error("Error updating prediction:", error);
                }

            }
        })
    }

    useEffect(() => {
        const getPred = async () => {
            try {
                const predictions = await fetch("/api/prediction", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                if (!predictions.ok) {
                    throw new Error("Failed to fetch predictions");
                }
                const data = await predictions.json();
                setPredictions(data || []);
                console.log(data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        }

        getPred();

    }, []);

    // Calculate paginated predictions
    const totalPages = Math.ceil(predictions.length / pageSize);
    const paginatedPredictions = predictions
        .sort((a, b) => {
            const statusOrder = { 'PENDING': 0, 'WON': 1, 'LOST': 2 };
            return statusOrder[a.result as keyof typeof statusOrder] - statusOrder[b.result as keyof typeof statusOrder];
        }).slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className="p-4 bg-white">
            <div className="sticky top-0 flex items-center justify-between bg-white border-b border-gray-200 py-3 z-10">
                <div className="">
                    <h1 className="text-2xl font-bold text-gray-900">My Predictions</h1>
                    <p className="text-gray-600 mt-1">View and track all your predictions</p>
                </div>
                {/* Add New Prediction Button */}
                <Link href={'/dashboard/predictions/create'} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700  focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    Add Prediction
                </Link>
            </div>

            {/* Predictions filters
            <div className="flex flex-wrap gap-4 mb-6">
                <select className="rounded-lg border-gray-300 text-sm focus:ring-green-500 focus:border-green-500">
                    <option>All Sports</option>
                    <option>Football</option>
                    <option>Basketball</option>
                    <option>Tennis</option>
                </select>
                <select className="rounded-lg border-gray-300 text-sm focus:ring-green-500 focus:border-green-500">
                    <option>All Status</option>
                    <option>Won</option>
                    <option>Lost</option>
                    <option>Pending</option>
                </select>
                <select className="rounded-lg border-gray-300 text-sm focus:ring-green-500 focus:border-green-500">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                    <option>All time</option>
                </select>
            </div> */}

            {/* Predictions list */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden my-12">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        {predictions.length > 0 && <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prediction</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Odds</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">Action</th>
                            </tr>
                        </thead>}
                        <tbody className="divide-y divide-gray-100">
                            {predictions.length === 0 && loading ? (
                                <tr>
                                    <td colSpan={5} className="w-full px-6 py-8 text-center text-gray-500">
                                        <FaSpinner className="animate-spin h-6 w-6 text-gray-400 mx-auto mb-2" />
                                        Loading predictions...
                                    </td>
                                </tr>
                            ) : predictions.length === 0 && !loading ? (
                                <tr className='w-full'>
                                    <td colSpan={5} className="w-full px-6 py-8 text-center text-gray-500">
                                        {/* No predictions found icon */}
                                        <div className="flex flex-col items-center justify-center">
                                            <svg
                                                className="size-20  mb-2 text-gray-300"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                                viewBox="0 0 48 48"
                                                aria-hidden="true"
                                            >
                                                <rect x="8" y="12" width="32" height="24" rx="4" stroke="currentColor" fill="none" />
                                                <path d="M16 20h16M16 28h8" stroke="currentColor" strokeLinecap="round" />
                                            </svg>
                                        </div>
                                        No predictions found.
                                    </td>
                                </tr>
                            ) : (
                                paginatedPredictions.map((prediction, i) => (
                                    <tr key={i + (currentPage - 1) * pageSize} className="hover:bg-gray-50">
                                        <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-600">{moment(prediction.publishedAt).format("L")}
                                            <br />
                                            {moment(prediction.publishedAt).format("LT")}
                                        </td>
                                        <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900"><span className="font-bold">{prediction.sportType.toUpperCase()}</span> &bull; {prediction.league}
                                            {prediction.gameType !== "FREE_GAMES" && (
                                                <span className="inline-block ml-2 align-middle">
                                                    <svg
                                                        className="size-4"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <defs>
                                                            <linearGradient id={`diamond-gradient-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                                                <stop offset="0%" stopColor="#facc15">
                                                                    <animate attributeName="stop-color" values="#fa4315;#f542ec;#15ccfa" dur="2s" repeatCount="indefinite" />
                                                                </stop>
                                                                <stop offset="100%" stopColor="#fa7c15">
                                                                    <animate attributeName="stop-color" values="#f542ec;#facc15;#15ccfa" dur="2s" repeatCount="indefinite" />
                                                                </stop>
                                                            </linearGradient>
                                                        </defs>
                                                        <path d="M12 2L2 9l10 13 10-13-10-7z" fill={`url(#diamond-gradient-${i})`} />
                                                    </svg>
                                                </span>
                                            )}
                                            <br />
                                            <span className="text-gray-500">{prediction.homeTeam} vs {prediction.awayTeam}</span>
                                        </td>
                                        <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-600">{prediction.tip}</td>
                                        <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-600">{prediction.odds}</td>
                                        <td className="px-6 py-2 whitespace-nowrap">
                                            {updating && i === currentposition && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                                                    <svg className="animate-spin h-4 w-4 mr-1 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                                    </svg>

                                                </span>
                                            ) || (

                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${prediction.result.toLowerCase() === 'won'
                                                            ? 'bg-green-50 text-green-600'
                                                            : prediction.result.toLowerCase() === 'lost'
                                                                ? 'bg-red-50 text-red-600'
                                                                : 'bg-yellow-50 text-yellow-600'
                                                            }`}
                                                    >
                                                        {prediction.result.toLowerCase() === 'won' && (
                                                            <Check className="w-4 h-4 mr-1 text-green-500" />
                                                        )}
                                                        {prediction.result.toLowerCase() === 'lost' && (
                                                            <X className="w-4 h-4 mr-1 text-red-500" />
                                                        )}
                                                        {prediction.result.toLowerCase() === 'pending' && (
                                                            <Clock className="w-4 h-4 mr-1 text-yellow-500" />
                                                        )}
                                                        {prediction.result.charAt(0).toUpperCase() + prediction.result.slice(1)}
                                                    </span>
                                                )}
                                        </td>



                                        {predictions.length > 0 && !loading && <td className=" px-6 py-2 flex gap-2 items-center justify-end">
                                            <div className="group my-4">
                                                <MoreVertical
                                                    className="text-neutral-500 cursor-pointer hover:text-neutral-600 size-5"
                                                    tabIndex={0}
                                                />
                                                <div className="absolute right-5  w-32 bg-white border border-gray-200 rounded shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity z-10 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto">
                                                    <button
                                                        className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        onClick={() => {
                                                            // Navigate to edit page
                                                            updateWLPrediction(i, prediction, 'WON');
                                                        }}
                                                    >
                                                        <Check className="w-4 h-4 text-neutral-500" />
                                                        Won
                                                    </button>
                                                    <button
                                                        className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        onClick={() => {
                                                            // Navigate to edit page
                                                            updateWLPrediction(i, prediction, 'LOST');
                                                        }}
                                                    >
                                                        <X className="w-4 h-4 text-neutral-500" />
                                                        Loss
                                                    </button>
                                                    <button
                                                        className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        onClick={() => {
                                                            // Navigate to edit page
                                                            updateWLPrediction(i, prediction, 'PENDING');
                                                        }}
                                                    >
                                                        <Clock className="w-4 h-4 text-gray-500" />
                                                        Pending
                                                    </button>
                                                    <button
                                                        className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        onClick={() => {
                                                            // Navigate to edit page
                                                            window.location.href = `/dashboard/predictions/update/?id=${prediction.id}`;
                                                        }}
                                                    >
                                                        <Edit className="w-4 h-4 text-gray-500" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                                        onClick={() => deletePrediction(i, prediction.id)}
                                                    >
                                                        <Trash className="w-4 h-4 text-red-500" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </td>}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {predictions.length > 0 && (
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                        <button
                            className="text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-600">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            className="text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default GetPredictions