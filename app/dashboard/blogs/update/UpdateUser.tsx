/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { CheckCircleIcon, X } from "lucide-react";
import DynamicForm from "@/app/components/forms/DynamicForm";
import { blogFormSchema } from "@/app/lib/formschemas/blogForm";
import { BlogPost } from "@/app/lib/interface";
import { useDialog } from "@/app/components/shared/dialog";

export default function UpdateBlog() {
    const dialog = useDialog()
    const [blog, setBlog] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const search = useSearchParams();
    const blogid = search.get("id") || "";

    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();


    useEffect(() => {
        const getBlog = async () => {
            try {
                const blogs = await fetch(`/api/blogPost/${blogid}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                const data = await blogs.json();
                setBlog(data || []);
                console.log(data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        }

        getBlog();

    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    async function handleUpdate(data: BlogPost) {
        setIsSubmitting(true);
        try {
            // Remove 'id' from data before sending
            const { id, ...dataWithoutId } = data;
            const response = await fetch(`/api/blogPost/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...dataWithoutId,
                    content: JSON.stringify(data.content),
                    tags: [data.tags]
                }),
            });
            if (!response.ok) throw new Error("Failed to Update blog");
            toast.success("User updated successfully!", {
                duration: 5000,
                position: "top-center",
                icon: <CheckCircleIcon className="text-green-600" />,
            });
            router.push("/dashboard/blogs");
        } catch (error) {
            toast.error("Failed to Update blog. Please try again.", {
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
            schema={blogFormSchema}
            onSubmit={handleUpdate}
            submitLabel="Update Pser"
            isSubmitting={isSubmitting}
            initialData={blog || {}}

        />
    ); */
    /**
     * Convert the blog's publishedAt to a string suitable for datetime-local input.
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
    const initialData = blog
        ? {
            ...blog,
            content: JSON.parse(blog.content),
            tags: JSON.parse(JSON.stringify(blog.tags)).join(", ")
        }
        : {};


    return (
        <DynamicForm
            schema={blogFormSchema}
            onSubmit={handleUpdate}
            submitLabel="Update Pser"
            isSubmitting={isSubmitting}
            initialData={initialData}
        />
    );
}
