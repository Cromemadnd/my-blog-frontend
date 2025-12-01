import { getPost, getAllPosts } from "@/lib/posts"
import { notFound } from "next/navigation"
import { PageContent } from "@/components/page-content"

interface PageProps {
    params: Promise<{
        slug: string[]
    }>
}

export async function generateStaticParams() {
    const posts = await getAllPosts()
    return posts.map((post) => ({
        slug: post.slug.split('/'),
    }))
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params
    const post = await getPost(slug)

    if (!post) {
        notFound()
    }

    return <PageContent post={post} />
}

