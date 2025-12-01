"use client"

import { MarkdownRenderer } from "@/components/markdown-renderer"
import { motion } from "framer-motion"
import { useLayout } from "@/components/layout-context"
import { useEffect } from "react"

interface PageContentProps {
    post: {
        metadata: any
        content: string
    }
}

export function PageContent({ post }: PageContentProps) {
    const { setTitle, setDate, setTags } = useLayout()

    useEffect(() => {
        setTitle(post.metadata.title)
        setDate(post.metadata.date)
        setTags(post.metadata.tags)
        return () => {
            setTitle("Loading...")
            setDate(undefined)
            setTags(undefined)
        }
    }, [post.metadata.title, post.metadata.date, post.metadata.tags, setTitle, setDate, setTags])

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
