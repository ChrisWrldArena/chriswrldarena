/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useReducer, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { BlogPost } from "@/app/lib/interface";
import moment from "moment";
import Link from "next/link";
import { calculateReadingTime, formatNumberShort, getEditorWordCount, getReadingTimeRange, wordTimeCalculator } from "@/app/lib/function";
import { BarChart, Bookmark, Eye, Heart, Share, Share2, View } from "lucide-react";
import { FaCommentAlt, FaComments } from "react-icons/fa";
import { useRouter } from "next/navigation";



const BlogsClient = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const navigation = useRouter()

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch(`/api/blogPost/?include=${JSON.stringify({ author: true, Like: true, Comment: true, Share: true, Save: true, View: true })}`);
                if (!res.ok) throw new Error("Failed to fetch blogs");
                const data = await res.json();
                setPosts(data);
            } catch {
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this blog?")) return;
        const res = await fetch(`/api/blogPost/${id}`, { method: "DELETE" });
        if (res.ok) {
            setPosts(posts.filter((b) => b.id !== id));
            toast.success("Blog deleted");
        } else {
            toast.error("Failed to delete blog");
        }
    };

    return (
        <div className="">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">Blog Posts</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Manage your blog posts, create new content, and monitor engagement.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <Link
                        href="/dashboard/blogs/create"
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700  focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
                    >
                        New post
                    </Link>
                </div>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {loading ? (
                    <div className="col-span-full text-center text-gray-500 py-8">
                        Loading...
                    </div>
                ) : posts.length === 0 ? (
                    <div className="col-span-full text-center text-gray-500 py-8">
                        No blog posts found.
                    </div>
                ) : (
                    posts.map((post) => {
                        const wordcount = getEditorWordCount(JSON.parse(post.content)).wordCount
                        const text = getEditorWordCount(JSON.parse(post.content)).text
                        const readingspeed = getReadingTimeRange(wordcount!).wordCount
                        
                        const readingtime = wordTimeCalculator(text!).readingTime
                        return (
                            <div
                                suppressHydrationWarning
                                key={post.author?.id}
                                className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-shadow hover:shadow-xl cursor-pointer"
                                onClick={() => navigation.push("/dashboard/blogs/" + post.id)}
                            >
                                <div className="flex-shrink-0">
                                    <img
                                        className="h-48 w-full object-cover"
                                        src={post.image || "/default-image.jpg"}
                                        alt={post.title}
                                        width={400}
                                        height={200}
                                    />
                                </div>
                                <div className="flex-1 flex flex-col justify-between bg-white p-6">
                                    <div className="flex-1">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <img
                                                    className="h-10 w-10 rounded-full"
                                                    src={post.author?.image || "/avatars/default_img.webp"}
                                                    alt={post.author?.username || "Author"}
                                                    width={40}
                                                    height={40}
                                                />
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-base font-medium text-gray-900">
                                                    {post.author?.username || "Unknown Author"}
                                                </p>
                                                <div className="flex space-x-1 text-sm text-gray-500">
                                                    <time dateTime={moment(post.publishedAt).format("LLL")}>{moment(post!.createdAt).format('LLL')}</time>
                                                    <span aria-hidden="true">&middot;</span>
                                                    <span>{readingtime.formattedTime}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full mt-4 inline-block">
                                            <p className="text-xl font-semibold text-gray-900">
                                                {post.title}
                                            </p>
                                            <p className="mt-3 text-sm text-gray-500 line-clamp-3">
                                                {post.summary || "No excerpt available for this post."}
                                            </p>
                                        </div>
                                        <div className="w-full flex items-center justify-between mt-4">
                                            <div className="">
                                                <span
                                                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${post.status === "published"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-yellow-100 text-yellow-800"
                                                        }`}
                                                >
                                                    {post.status}
                                                </span>
                                                <span className="ml-2 inline-flex rounded-full bg-blue-100 px-2 text-xs font-semibold leading-5 text-blue-800">
                                                    {post.category || "Uncategorized"}
                                                </span>



                                            </div>
                                            <div className="flex items-center gap-4">
                                                <p className="text-xs font-thin italic text-neutral-400">{[post.tags].join(",  ")}</p>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            {post.status === "draft" && <a
                                                href={`/dashboard/blogs/update/${post.id}`}
                                                className="text-neutral-600 hover:text-neutral-900 text-sm font-medium px-4 py-0.5 rounded-full bg-neutral-200"
                                            >
                                                Publish Post
                                            </a>}
                                            <a
                                                href={`/dashboard/blogs/update/?id=${post.id}`}
                                                className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                                            >
                                                Edit Post
                                            </a>
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                className="text-red-600 hover:text-red-900 text-sm font-medium">
                                                Delete
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <div className="text-xs text-gray-500">
                                                <BarChart className="inline-block mr-1 text-neutral-500 size-4" />
                                                {formatNumberShort(post.View.length || '0')}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                <Heart className="inline-block mr-1 text-neutral-500 size-4" />
                                                {formatNumberShort(post.Like.length || '0')}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                <FaComments className="inline-block mr-1 text-neutral-500 size-4" />
                                                {formatNumberShort(post.Comment.length || '0')}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                <Share2 className="inline-block mr-1 text-neutral-500 size-4" />
                                                {formatNumberShort(post.Share.length || '0')}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                <Bookmark className="inline-block mr-1 text-neutral-500 size-4" />
                                                {formatNumberShort(post.Save.length || '0')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    );
};

export default BlogsClient;
