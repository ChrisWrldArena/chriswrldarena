/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { CheckCircleIcon, X } from "lucide-react";
import DynamicForm from "@/app/components/forms/DynamicForm";
import { predictionFormSchema } from "@/app/lib/formschemas/predictionForm";
import { CreatePredictionDTO, Prediction } from "@/app/lib/interface";
import { useAuth } from "@/app/contexts/AuthContext";
import { useDialog } from "@/app/components/shared/dialog";

export default function UpdatePredictionClient() {
    const dialog = useDialog()
    const [prediction, setPrediction] = useState<Prediction | null>(null);
    const [loading, setLoading] = useState(true);
    const search = useSearchParams();
    const predid = search.get("id") || "";

    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
        const getPred = async () => {
            try {
                const predictions = await fetch(`/api/prediction/${predid}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                const data = await predictions.json();
                setPrediction(data || []);
                console.log(data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        }

        getPred();

    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    async function handleUpdate(data: CreatePredictionDTO) {
        setIsSubmitting(true);
        try {
            // Remove 'id' from data before sending
            const { id, ...dataWithoutId } = data;
            console.log('Update data:', dataWithoutId);
            console.log('League value:', dataWithoutId.league);
            console.log('League type:', typeof dataWithoutId.league);
            
            const response = await fetch(`/api/prediction/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...dataWithoutId,
                    publishedAt: new Date(data.publishedAt).toISOString(),
                }),
            });
            if (!response.ok) throw new Error("Failed to Update prediction");
            toast.success("Prediction updated successfully!", {
                duration: 5000,
                position: "top-center",
                icon: <CheckCircleIcon className="text-green-600" />,
            });
            router.push("/dashboard/predictions");
        } catch (error) {
            toast.error("Failed to Update prediction. Please try again.", {
                duration: 10000,
                position: "top-center",
                icon: <X className="text-red-600" />,
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    /* return (
        <DynamicForm
            schema={predictionFormSchema}
            onSubmit={handleUpdate}
            submitLabel="Update Prediction"
            isSubmitting={isSubmitting}
            initialData={prediction || {}}

        />
    ); */
    /**
     * Convert the prediction's publishedAt to a string suitable for datetime-local input.
     * datetime-local expects 'YYYY-MM-DDTHH:mm' format.
     */
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

    // Prepare initialData for DynamicForm, converting publishedAt to string
    const initialData = prediction
        ? {
            ...prediction,
            publishedAt: formatDateTimeLocal(prediction.publishedAt),
        }
        : {};

    console.log(initialData)

    return (
        <DynamicForm
            schema={predictionFormSchema}
            onSubmit={handleUpdate}
            submitLabel="Update Prediction"
            isSubmitting={isSubmitting}
            initialData={initialData}
        />
    );
}
