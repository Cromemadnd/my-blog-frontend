"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search as SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command" // I need to install command component from shadcn
import { cn } from "@/lib/utils"

interface SearchProps {
    posts: { slug: string; metadata: any }[]
    className?: string
}

export function Search({ posts, className }: SearchProps) {
    const [open, setOpen] = React.useState(false)
    const router = useRouter()

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false)
        command()
    }, [])

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className={cn(
                    className
                )}
                onClick={() => setOpen(true)}
            >
                <SearchIcon className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Search</span>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen} className="-skew-x-12 px-12 py-4">
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Posts">
                        {posts.map((post) => (
                            <CommandItem
                                className="skew-x-12"
                                key={post.slug}
                                value={`${post.metadata.title} ${post.metadata.date} ${post.metadata.tags?.join(" ") || ""} ${post.metadata.summary || ""}`}
                                onSelect={() => {
                                    runCommand(() => router.push(`/${post.slug}`))
                                }}
                            >
                                <SearchIcon className="mr-2 h-4 w-4 shrink-0" />
                                <div className="flex flex-col overflow-hidden">
                                    <span className="truncate">{post.metadata.title}</span>
                                    <span className="text-xs text-muted-foreground truncate">
                                        {post.metadata.date}
                                        {post.metadata.tags?.length ? ` • ${post.metadata.tags.join(", ")}` : ""}
                                    </span>
                                </div>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    )
}
