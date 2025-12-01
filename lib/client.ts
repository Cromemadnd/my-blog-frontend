const CONTENT_BASE = 'https://blog-contents.cromemadnd.cn/';

export interface PostMetadata {
    title: string;
    date: string;
    tags?: string[];
    summary?: string;
}

export interface Post {
    slug: string;
    metadata: PostMetadata;
    content: string;
}

export interface Category {
    [key: string]: PostMetadata | Category;
}

export type IndexData = Category;

function getContentBase(): string {
    return CONTENT_BASE;
}

export async function getIndexData(): Promise<IndexData> {
    const base = getContentBase();
    const url = `${base}/index.json`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Failed to fetch remote index.json: ${res.status} ${res.statusText}`);
    }
    return (await res.json()) as IndexData;
}

async function getMetadataFromIndex(slug: string[]): Promise<PostMetadata | null> {
    try {
        const indexData = await getIndexData();
        let current: any = indexData;

        if (slug.length === 0) {
            return current['index'] as PostMetadata;
        }

        for (let i = 0; i < slug.length; i++) {
            const segment = slug[i];
            if (current && current[segment]) {
                current = current[segment];
            } else {
                return null;
            }
        }

        if (current && current.title) {
            return current as PostMetadata;
        }
        return null;
    } catch (e) {
        console.error("Error fetching metadata", e);
        return null;
    }
}

export async function fetchPost(slug: string[]): Promise<Post | null> {
    const base = getContentBase();

    if (slug.length === 0) {
        // root index
        const url = `${base}/index.md`;
        const res = await fetch(url);
        if (res.status === 404) return null;
        if (!res.ok) throw new Error(`Failed to fetch post ${url}: ${res.status}`);
        const text = await res.text();
        const meta = await getMetadataFromIndex([]);
        return { slug: '', metadata: meta || { title: 'Home', date: '', summary: '' }, content: text };
    }

    // Try file path first, then directory index
    const fileUrl = `${base}/${slug.join('/')}.md`;
    const dirIndexUrl = `${base}/${slug.join('/')}/index.md`;

    // Try fetching as file
    let res = await fetch(fileUrl);
    if (res.ok) {
        const text = await res.text();
        const meta = await getMetadataFromIndex(slug);
        return { slug: slug.join('/'), metadata: meta || { title: slug[slug.length - 1], date: '', summary: '' }, content: text };
    }

    // Try fetching as directory index
    res = await fetch(dirIndexUrl);
    if (res.ok) {
        const text = await res.text();
        const meta = await getMetadataFromIndex([...slug, 'index']);
        return { slug: slug.join('/'), metadata: meta || { title: slug[slug.length - 1], date: '', summary: '' }, content: text };
    }

    return null;
}
