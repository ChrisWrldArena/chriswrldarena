/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { CheckCircleIcon, X } from "lucide-react";
import DynamicForm from "@/app/components/forms/DynamicForm";
import { predictionFormSchema } from "@/app/lib/formschemas/predictionForm";
import { CreatePredictionDTO, Prediction } from "@/app/lib/interface";
import { useAuth } from "@/app/contexts/AuthContext";

export default function CreatePredictionClient() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bulkJson, setBulkJson] = useState('');
    const router = useRouter();
    const { user } = useAuth();
    const [iscode, setIsCode] = useState(false);

    const [defaultValues, setDefaultValues] = useState({ gameType: "FREE_GAME" });

    async function handleCreate(data: CreatePredictionDTO) {

        setIsSubmitting(true);
        try {

            const response = await fetch("/api/prediction", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...data,
                    publishedAt: new Date(data.publishedAt || Date.now()).toISOString(),
                    result: "PENDING",
                    userId: user?.id
                }),
            });
            if (!response.ok) throw new Error("Failed to create prediction." + response.statusText);
            toast.success("Prediction created successfully!", {
                duration: 5000,
                position: "top-center",
                icon: <CheckCircleIcon className="text-green-600" />,
            });
            router.push("/dashboard/predictions");
        } catch (error: any) {
            toast.error("Failed to create prediction. Please try again.", {
                duration: 10000,
                position: "top-center",
                icon: <X className="text-red-600" />,
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    function formatDateTimeLocal(date: string | Date | undefined): string {
        if (!date) return "";
        const d = typeof date === "string" ? new Date(date) : date;
        // Pad with zeros for month, day, hours, minutes
        const pad = (n: number) => n.toString().padStart(2, "0");
        return (
            d.getFullYear() +
            "-" +
            pad(d.getMonth() + 1) +
            "-" +
            pad(d.getDate()) +
            "T" +
            pad(d.getHours()) +
            ":" +
            pad(d.getMinutes())
        );
    }


  /*   async function handleBulkUpload() {
        setIsSubmitting(true);
        try {
            let predictions: Prediction[] = [];
            try {
                predictions = JSON.parse(bulkJson);
                if (!Array.isArray(predictions)) throw new Error('JSON must be an array');
            } catch (err) {
                toast.error('Invalid JSON format. Please paste a valid array of predictions.');
                setIsSubmitting(false);
                return;
            }
            let successCount = 0;
            let failCount = 0;
            for (const data of predictions) {
                try {

                    const defdata = {
                        ...data,
                        customTitle: "",
                        publishedAt: formatDateTimeLocal(data.publishedAt),
                    }

                    setDefaultValues(defdata);
                    const response = await fetch("/api/prediction", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            ...data,
                            publishedAt: new Date(data.publishedAt).toISOString(),

                        }),
                    });
                    if (response.ok) {
                        successCount++;
                    } else {
                        failCount++;
                    }
                } catch {
                    failCount++;
                }
            }
            toast.success(`Bulk upload complete: ${successCount} added, ${failCount} failed.`, {
                duration: 8000,
                position: "top-center",
            });
            if (successCount > 0) router.push("/dashboard/predictions");
        } finally {
            setIsSubmitting(false);
        }
    } */

    return (
        <>
            {!iscode && <DynamicForm
                schema={predictionFormSchema}
                onSubmit={handleCreate}
                submitLabel="Add Prediction"
                isSubmitting={isSubmitting}
                initialData={defaultValues}
            />}
            {iscode && <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <h2 className="font-bold mb-2">Bulk Upload Predictions (Paste JSON Array)</h2>
                <textarea
                    className="w-full h-40 p-2 border rounded mb-2 font-mono text-xs"
                    value={bulkJson}
                    onChange={e => setBulkJson(e.target.value)}
                    placeholder="Paste an array of prediction objects here..."
                    disabled={isSubmitting}
                />
                <button
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                   // onClick={handleBulkUpload}
                    disabled={isSubmitting || !bulkJson.trim()}
                >
                    Bulk Upload
                </button>
            </div>}
        </>
    );
}
