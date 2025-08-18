"use client";

import DynamicForm from "@/app/components/forms/DynamicForm";
import { useAuth } from "@/app/contexts/AuthContext";
import { blogFormSchema } from "@/app/lib/formschemas/blogForm";
import { BlogPost } from "@/app/lib/interface";
import { CheckCircleIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";


const CreateBlogClient: React.FC = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bulkJson, setBulkJson] = useState('');
    const router = useRouter();
    const { user } = useAuth();
    const [iscode, setIsCode] = useState(false);

    async function handleCreate(data: BlogPost) {
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/blogPost", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...data,
                    publishedAt: new Date(data.publishedAt || Date.now()).toISOString(),
                    tags: data.tags.split(', '),
                    content: JSON.stringify(data.content),
                    authorId: user?.id
                }),
            });
            if (!response.ok) throw new Error("Failed to create blogPost." + response.statusText);
            console.log(response.status);
            toast.success("blogPost created successfully!", {
                duration: 5000,
                position: "top-center",
                icon: <CheckCircleIcon className="text-green-600" />,
            });
            router.push("/dashboard/blogs");
        } catch (error: any) {
            console.log(error);
            toast.error("Failed to create blogPost. Please try again.", {
                duration: 10000,
                position: "top-center",
                icon: <X className="text-red-600" />,
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <DynamicForm
            schema={blogFormSchema}
            onSubmit={handleCreate}
            submitLabel="Create Post"
            isSubmitting={isSubmitting}
        />
    );
};

export default CreateBlogClient;