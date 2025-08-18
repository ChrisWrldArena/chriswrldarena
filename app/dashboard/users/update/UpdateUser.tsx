/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { CheckCircleIcon, X } from "lucide-react";
import DynamicForm from "@/app/components/forms/DynamicForm";
import { userFormSchema } from "@/app/lib/formschemas/userForm";
import { User } from "@/app/lib/interface";
import { useAuth } from "@/app/contexts/AuthContext";
import { useDialog } from "@/app/components/shared/dialog";

export default function UpdateUser() {
    const dialog = useDialog()
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const search = useSearchParams();
    const userid = search.get("id") || "";

    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();


    useEffect(() => {
        const getUser = async () => {
            try {
                const users = await fetch(`/api/user/${userid}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                const data = await users.json();
                setUser(data || []);
                console.log(data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        }

        getUser();

    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    async function handleUpdate(data: User) {
        setIsSubmitting(true);
        try {
            // Remove 'id' from data before sending
            const { id, ...dataWithoutId } = data;
            const response = await fetch(`/api/user/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...dataWithoutId,
                    odds: Number(data.odds),
                }),
            });
            if (!response.ok) throw new Error("Failed to Update user");
            toast.success("Pser updated successfully!", {
                duration: 5000,
                position: "top-center",
                icon: <CheckCircleIcon className="text-green-600" />,
            });
            router.push("/dashboard/users");
        } catch (error) {
            toast.error("Failed to Update user. Please try again.", {
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
            schema={userFormSchema}
            onSubmit={handleUpdate}
            submitLabel="Update Pser"
            isSubmitting={isSubmitting}
            initialData={user || {}}

        />
    ); */
    /**
     * Convert the user's publishedAt to a string suitable for datetime-local input.
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


    return (
        <DynamicForm
            schema={userFormSchema}
            onSubmit={handleUpdate}
            submitLabel="Update Pser"
            isSubmitting={isSubmitting}
            initialData={user || {}}
        />
    );
}
