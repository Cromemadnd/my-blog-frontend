import { getPost } from "@/lib/posts"
import { notFound } from "next/navigation"
import { PageContent } from "@/components/page-content"

export default async function Home() {
    const post = await getPost([])

    if (!post) {
        notFound()
    }

    return <PageContent post={post} />
}
