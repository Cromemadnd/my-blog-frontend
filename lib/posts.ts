const CONTENT_BASE = 'https://blog-contents.cromemadnd.cn/';

function getContentBase(): string {
    return CONTENT_BASE;
}

export interface PostMetadata {
    title: string;
    date: string;
    tags?: string[];
    summary?: string;
}

export interface Post {
    slug: string; // e.g., "posts/hello_world" or "index"
    metadata: PostMetadata;
    content: string;
}

export interface Category {
    [key: string]: PostMetadata | Category;
}

export type IndexData = Category;

export async function getIndexData(): Promise<IndexData> {
    const base = getContentBase();
    const url = `${base}/index.json`;
    const res = await fetch(url, {
        // server component: allow ISR by callers if desired
    });
    if (!res.ok) {
        throw new Error(`Failed to fetch remote index.json: ${res.status} ${res.statusText}`);
    }
    return (await res.json()) as IndexData;
}

export async function getPost(slug: string[]): Promise<Post | null> {
    // slug is array of path segments, e.g. ['posts', 'hello_world']
    // or [] for root index

    if (slug.length === 0) {
        // root index
        const base = getContentBase();
        const url = `${base}/index.md`;
        const res = await fetch(url);
        if (res.status === 404) return null;
        if (!res.ok) throw new Error(`Failed to fetch post ${url}: ${res.status}`);
        const text = await res.text();
        const meta = await getMetadataFromIndex([]);
        return { slug: '', metadata: meta || { title: 'Untitled', date: '', summary: '' }, content: text };
    } else {
        // Check if it is a directory (category index) or a file
        // We rely on index.json to tell us? 
        // Or we just try both.

        const base = getContentBase();
        // Try file path first, then directory index
        const fileUrl = `${base}/${slug.join('/')}.md`;
        const dirIndexUrl = `${base}/${slug.join('/')}/index.md`;
        let res = await fetch(fileUrl);
        if (res.ok) {
            const text = await res.text();
            const meta = await getMetadataFromIndex(slug);
            return { slug: slug.join('/'), metadata: meta || { title: 'Untitled', date: '', summary: '' }, content: text };
        }
        res = await fetch(dirIndexUrl);
        if (res.ok) {
            const text = await res.text();
            const meta = await getMetadataFromIndex([...slug, 'index']);
            return { slug: slug.join('/'), metadata: meta || { title: 'Untitled', date: '', summary: '' }, content: text };
        }
        if (res.status === 404) return null;
        // if neither exist, return null
        return null;
    }
}

async function getMetadataFromIndex(slug: string[]): Promise<PostMetadata | null> {
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
}

export async function getCategoryChildren(slug: string[]) {
    const indexData = await getIndexData();
    let current: any = indexData;

    if (slug.length > 0) {
        for (const segment of slug) {
            if (current[segment]) current = current[segment];
            else return [];
        }
    }

    const children: { key: string; data: any; isPost: boolean }[] = [];

    if (current && typeof current === 'object') {
        for (const key in current) {
            if (key !== 'index') {
                const item = current[key];
                const isPost = item && item.title && item.date;
                children.push({ key, data: item, isPost: !!isPost });
            }
        }
    }
    return children;
}

// Helper to flatten all posts for search/list
export async function getAllPosts(): Promise<{ slug: string; metadata: PostMetadata }[]> {
    const indexData = await getIndexData();
    const posts: { slug: string; metadata: PostMetadata }[] = [];

    function traverse(current: any, pathSegments: string[]) {
        for (const key in current) {
            const value = current[key];
            if (value && value.title && value.date) {
                const slug = [...pathSegments, key].join('/');
                posts.push({ slug, metadata: value });
            } else if (value && typeof value === 'object') {
                traverse(value, [...pathSegments, key]);
            }
        }
    }

    traverse(indexData, []);
    return posts;
}

export async function getAllPaths(): Promise<string[]> {
    const indexData = await getIndexData();
    const paths: string[] = [];

    function traverse(current: any, pathSegments: string[]) {
        for (const key in current) {
            if (key === 'index') continue;

            const value = current[key];
            const currentPath = [...pathSegments, key];

            paths.push(currentPath.join('/'));

            const isPost = value && value.title && value.date;
            if (!isPost && value && typeof value === 'object') {
                traverse(value, currentPath);
            }
        }
    }

    traverse(indexData, []);
    return paths;
}

export async function getSidebarData() {
    return await getIndexData();
}
