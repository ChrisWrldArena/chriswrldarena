/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client"

import { useAuth } from '@/app/contexts/AuthContext'
import { BlogPost, Comment } from '@/app/lib/interface'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { Heart, MessageCircle, Share2, Bookmark, SendHorizontal } from 'lucide-react'
import Link from 'next/link'
import moment from 'moment'
import { OutputData } from '@editorjs/editorjs'
import { renderEditorContent } from '@/app/lib/function'

export default function BlogDetailsClient({ id }: { id: string }) {
    const { user } = useAuth()
    const router = useRouter()
    const [blog, setBlog] = useState<BlogPost | null>(null)
    const [loading, setLoading] = useState(true)
    const [comment, setComment] = useState('')
    const [comments, setComments] = useState<Comment[]>([])
    const [likes, setLikes] = useState([])
    const [shares, setShares] = useState([])
    const [saves, setSaves] = useState([])
    const [views, setViews] = useState([])
    const [liked, setLiked] = useState(false)
    const [saved, setSaved] = useState(false)
    const [likeCount, setLikeCount] = useState(0)
    const [SaveCount, setSeveCount] = useState(0)


    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await fetch(`/api/blogPost/${id}/?include=${JSON.stringify({
                    author: true, Share: true, Save: true, Like: true,
                    Comment: {
                        include: {
                            user: true
                        }
                    },
                    View: true
                })}`)

                if (!response.ok) throw new Error('Blog not found')
                const data = await response.json()
                setBlog(data[0])
                setComments(data[0].Comment || [])
                setLikes(data[0].Like || [])
                setShares(data[0].Share || [])
                setSaves(data[0].Save || [])
                setViews(data[0].View || [])
                setLikeCount(data[0].Like ? data[0].Like.length : 0)
                setSeveCount(data[0].Save ? data[0].Save.length : 0)
                setLiked(data[0].Like ? data[0].Like.some((like: any) => like.userId === user?.id) : false)
                setSaved(data[0].Save ? data[0].Save.some((save: any) => save.userId === user?.id) : false)
                // Increment view count
                setLoading(false)
            } catch (error: any) {
                setLoading(false)
                setBlog(null)
                toast.error('Failed to load blog: ' + error.message)
                //router.push('/blog')
            }
        }


        if (id) {
            fetchBlog()
        }
    }, [id, user?.id])

    const handleLike = async () => {
        if (!user) {
            toast.error('Please sign in to like this blog')
            return
        }

        try {
            const response = liked ?
                await fetch(`/api/like/${id}`, {
                    method: 'DELETE',
                }) :
                await fetch(`/api/like`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        blogPostId: id,
                        userId: user.id,
                    }),
                })
            if (response.ok) {
                setLiked(!liked)
                setLikeCount(liked ? likeCount - 1 : likeCount + 1)
                toast.success(liked ? 'Blog unliked' : 'Blog liked')
            }
        } catch (error) {
            toast.error('Failed to like blog')
        }
    }

    const handleSave = async () => {
        if (!user) {
            toast.error('Please sign in to save this blog')
            return
        }

        try {
            const response = saved ?
                await fetch(`/api/save/${id}`, {
                    method: 'DELETE',
                }) :

                await fetch(`/api/save`, {
                    method: 'POST',
                })
            if (response.ok) {
                setSaved(!saved)
                toast.success(saved ? 'Blog unsaved' : 'Blog saved')
            }
        } catch (error) {
            toast.error('Failed to save blog')
        }
    }

    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) {
            toast.error('Please sign in to comment')
            return
        }

        if (!comment.trim()) {
            toast.error('Comment cannot be empty')
            return
        }

        try {
            const response = await fetch(`/api/comment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: comment,
                    blogPostId: id,
                    userId: user.id,
                }),
            })
            if (response.ok) {
                setComment("")
                toast.success('Comment added')
            }
        } catch (error) {
            toast.error('Failed to add comment')
        }
    }

    const handleShare = async () => {
        try {
            await navigator.share({
                title: blog?.title,
                text: blog?.excerpt,
                url: window.location.href,
            })
        } catch (error) {
            // Fallback to copying link
            navigator.clipboard.writeText(window.location.href)
            toast.success('Link copied to clipboard')
        }
    }

    if (loading) return <div className="flex justify-center items-center text-center h-96 mt-16">Loading...</div>
    if (!blog) return <div className="flex justify-center items-center text-center h-96 mt-16">Blog not found</div>




    const htmlString = renderEditorContent(JSON.parse(blog.content))

    return (
        <article className="space-y-8">
            <div className="absolute inset-0 bg-cover bg-center h-64 shadow-lg -z-20"
                style={{
                    backgroundImage: 'linear-gradient(to right, #1a1818c0, #111010cb), url(/stadium.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}></div>
            {/* Blog Header */}
            <header className="space-y-4 mt-24">
                <h1 className="text-4xl font-bold text-white">{blog.title}</h1>
                <div className="flex items-center space-x-4 mt-16">
                    <div className="flex items-center">
                        <img
                            src={blog.author?.image || '/avatars/default_img.webp'}
                            alt={blog.author?.username || 'Author'}
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
                        <div className="ml-2">
                            <p className="font-medium">{blog.author?.username}</p>
                            <p className="text-sm text-gray-500">
                                {moment(blog.publishedAt).format("LLL")}
                            </p>
                        </div>
                    </div>

                </div>


            </header>

            {/* Blog Content */}
            <div className="prose max-w-none">

                <div dangerouslySetInnerHTML={{ __html: htmlString }} />
                {blog.tags && (Array.isArray(blog.tags) ? blog.tags.length > 0 : !!blog.tags) && (
                    <div className="flex flex-wrap gap-2">
                        {(Array.isArray(blog.tags) ? blog.tags : [blog.tags]).map((tag: string, index: number) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                {tag}
                            </span>
                        ))}

                    </div>
                )}
            </div>

            {/* Engagement Bar */}
            <div className="flex items-center justify-between py-4 border-t border-b">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleLike}
                        className={`flex items-center space-x-1 ${liked ? 'text-red-500' : ''}`}
                    >
                        <Heart className={`h-6 w-6 ${liked ? 'fill-current' : ''}`} />
                        <span>{likeCount}</span>
                    </button>
                    <button className="flex items-center space-x-1">
                        <MessageCircle className="h-6 w-6" />
                        <span>{comments.length}</span>
                    </button>
                    <button onClick={handleShare} className="flex items-center space-x-1">
                        <Share2 className="h-6 w-6" />
                    </button>
                </div>
                <button
                    onClick={handleSave}
                    className={`flex items-center space-x-1 ${saved ? 'text-blue-500' : ''}`}
                >
                    <Bookmark className={`h-6 w-6 ${saved ? 'fill-current' : ''}`} />
                </button>
            </div>

            {/* Comments Section */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold">Comments</h2>
                <div className="">
                    {comments.map((comment) => (
                        <div key={comment.id} className="rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <Image
                                    src={'/avatars/default_img.webp'}
                                    alt={comment.user.username || 'Commenter'}
                                    width={32}
                                    height={32}
                                    className="rounded-full"
                                />
                                <div>
                                    <p className="font-medium">{comment.user.username}</p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <p>{comment.content}</p>
                        </div>
                    ))}
                    <form onSubmit={handleComment} className="ml-8 relative flex items-start space-x-2 hidden">
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Reply to this comment..."
                            className="flex-1 p-2 border border-neutral-100 rounded-lg resize-none  focus:ring-2 focus:ring-neutral-200 h-16"
                            required
                            rows={50}
                            cols={50}
                            disabled
                            maxLength={500}
                        />
                        <div className="absolute bottom-5 right-5 flex items-center gap-4">
                            <div className="flex items-center gap-4">
                                <Heart className={`h-5 w-5 ${liked ? 'text-red-500' : ''}`} />
                                <span className="text-sm">{likeCount}</span>
                            </div>
                            <p className="text-sm text-neutral-400"></p>
                            <button
                                type="submit"
                                disabled
                                className=" px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                <SendHorizontal className="h-5 w-5 " />
                            </button>
                        </div>
                    </form>
                </div>


                {user ? (
                    <form onSubmit={handleComment} className="relative flex items-start space-x-2">
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="flex-1 p-2 border border-neutral-200 rounded-lg resize-none  focus:ring-2 focus:ring-neutral-300 h-56"
                            required
                            rows={50}
                            cols={50}
                            maxLength={500}
                        />
                        <div className="absolute bottom-5 right-5 flex items-center gap-4">
                            <p className="text-sm text-neutral-400">{500 - comment.length} &bull; word count</p>
                            <button
                                type="submit"
                                className=" px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                <SendHorizontal className="h-5 w-5 " />
                            </button>
                        </div>
                    </form>
                ) : (
                    <p className=" text-center py-4">
                        <Link href="/signin" className="text-blue-600 hover:underline">
                            Sign in
                        </Link>{' '}
                        to leave a comment
                    </p>
                )}


            </section>
        </article>
    )
}
