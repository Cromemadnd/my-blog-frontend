"use client"

import { MarkdownRenderer } from "@/components/markdown-renderer"
import { motion } from "framer-motion"
import { useLayout } from "@/components/layout-context"
import { useEffect, useState } from "react"
import { fetchPost, Post } from "@/lib/client"
import { Skeleton } from "@/components/ui/skeleton"

interface PageContentProps {
    slug: string[]
}

export function PageContent({ slug }: PageContentProps) {
    const { setTitle, setDate, setTags } = useLayout()
    const [post, setPost] = useState<Post | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        let isMounted = true;

        const loadPost = async () => {
            setLoading(true);
            setError(false);

            // Reset layout while loading
            setTitle("Loading...")
            setDate(undefined)
            setTags(undefined)

            try {
                const data = await fetchPost(slug);
                if (!isMounted) return;

                if (data) {
                    setPost(data);
                    setTitle(data.metadata.title || "Untitled")
                    setDate(data.metadata.date)
                    setTags(data.metadata.tags)
                } else {
                    setError(true);
                    setTitle("Not Found")
                }
            } catch (err) {
                if (!isMounted) return;
                console.error(err);
                setError(true);
                setTitle("Error")
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadPost();

        return () => {
            isMounted = false;
        }
    }, [slug, setTitle, setDate, setTags]) // Re-fetch when slug changes

    if (loading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </div>
        )
    }

    if (error || !post) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <h2 className="text-2xl font-bold mb-2">Post Not Found</h2>
                <p>Could not load the requested content.</p>
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            <MarkdownRenderer content={post.content} />

            <div className="mt-10">
                <div className="flex items-center">
                    <hr className="flex-1 border-t border-gray-300" />
                    <span className="mx-4 text-2xl">EOF</span>
                    <hr className="flex-1 border-t border-gray-300" />
                </div>
            </div>
        </motion.div>
    )
}
