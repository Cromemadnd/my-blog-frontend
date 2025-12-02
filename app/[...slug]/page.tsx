import { getAllPaths } from "@/lib/posts"
import { PageContent } from "@/components/page-content"

interface PageProps {
    params: Promise<{
        slug: string[]
    }>
}

export async function generateStaticParams() {
    const paths = await getAllPaths()
    return paths.map((path) => ({
        slug: path.split('/'),
    }))
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params
    // We do NOT fetch post here anymore. We let the client component fetch it.
    // This allows the page to be static shell, but content to be dynamic/fresh.

    return <PageContent slug={slug} />
}

