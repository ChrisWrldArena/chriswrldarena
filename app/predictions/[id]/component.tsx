'use client'
import { useDialog } from '@/app/components/shared/dialog'
import { Action, Column, TableComponent } from '@/app/components/shared/TableSeater'
import { useAuth } from '@/app/contexts/AuthContext'
import { Prediction } from '@/app/lib/interface'
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover'
import { Check, Clock, Edit, LoaderCircle, MoreVertical, PlusCircle, Trash, X } from 'lucide-react'
import moment from 'moment'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'


const PredictionComponent = ({ content, title }: { content: Prediction[], title: string }) => {
    const router = useRouter()
    const { user } = useAuth()
    const dialog = useDialog()
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    
    const [updating, setUpdating] = useState<boolean>(false);
    const [currentposition, setCurrentPosition] = useState<number>(-1);
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        setPredictions(content)
    }, [content])

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
                    const newresult = await response.json();

                    const newdata = predictions.filter((pred) => pred.id !== id)
                    setPredictions([
                        ...newdata,
                        newresult
                    ])


                    setUpdating(false);
                    console.log("Prediction updated successfully:", newresult);
                    // setPredictions(result);
                } catch (error) {
                    setUpdating(false);
                    console.error("Error updating prediction:", error);
                }

            }
        })
    }

    const CustomViewData = () => {
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
                header: 'Analysis',
                accessorKey: 'analysis',
                cell: (prediction) => (
                    <span className="px-2 py-1 text-xs text-neutral-800 rounded-full" title={prediction.analysis}>
                        <Popover>
                            <PopoverTrigger className='max-w-lg w-full' asChild>
                                <p className="max-w-xs truncate text-sm cursor-default">{prediction.analysis}</p>

                            </PopoverTrigger>
                            <PopoverContent align="center" className=" h-auto w-md bg-white z-50 rounded-lg shadow-lg border-2 border-neutral-300 p-4 outline-0">
                                <p className="whitespace-pre-wrap text-sm">{prediction.analysis}</p>
                            </PopoverContent>
                        </Popover>

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
                        {updating && rowIndex === currentposition ? <LoaderCircle className="animate-spin size-4" /> : <Clock className="w-4 h-4"/>}
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
            title,
            //badge: 'Premium',
            //isAdmin: user?.role === "ADMIN",
            //onTitleEdit: (title: string) => updateTableTitle(3, title),
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
        const className = "bg-gray-50 border-2 border-gray-200 rounded-lg"

        return {
            data: predictions,
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
        <div className="relative mx-auto px-4 py-12">
            <div className="absolute inset-0 bg-cover bg-center h-64 shadow-lg -z-20"
                style={{
                    backgroundImage: 'linear-gradient(to right, #1a1818c0, #111010cb), url(/stadium.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}>

            </div>
            <div className="max-w-[94rem] mx-auto mt-28 z-50">
                <h1 className="text-4xl font-bold mb-20 text-white">{title.toUpperCase() || "No category specified"}</h1>
            </div>


            <div className="container w-full mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 h-max">
                <TableComponent
                    uniqueId={CustomViewData().uniqueId}
                    data={CustomViewData().data}
                    columns={CustomViewData().columns}
                    actions={CustomViewData().actions}
                    footer={CustomViewData().footer}
                    header={CustomViewData().header}
                    className={CustomViewData().className}
                    updating={updating}
                    currentPosition={currentposition}
                />

            </div>

        </div>
    )
}

export default PredictionComponent