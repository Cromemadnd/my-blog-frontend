"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronRight, ChevronDown } from "lucide-react"
import { useState } from "react"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
    items: any // IndexData
}

export function SidebarNav({ items }: SidebarNavProps) {
    const pathname = usePathname()

    const renderItems = (data: any, pathPrefix: string = "") => {
        return Object.keys(data).map((key) => {
            if (key === "index") return null // Skip index files in tree, they are accessed via parent folder

            const item = data[key]
            const currentPath = pathPrefix ? `${pathPrefix}/${key}` : key

            // Simple heuristic: if it has 'title' and 'date', it's a post. Otherwise it's a folder.
            // But wait, my index.json structure:
            // "posts": { "hello_world": { title... }, "index": { title... } }
            // "posts" is a folder. "hello_world" is a post.

            const isPost = item.title && item.date;

            if (isPost) {
                return (
                    <Link
                        key={currentPath}
                        href={`/${currentPath}`}
                        className={cn(
                            "group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline",
                            pathname === `/${currentPath}`
                                ? "font-medium text-foreground"
                                : "text-muted-foreground"
                        )}
                    >
                        {item.title}
                    </Link>
                )
            } else {
                // Folder
                return (
                    <FolderItem key={key} title={key}>
                        {renderItems(item, currentPath)}
                    </FolderItem>
                )
            }
        })
    }

    return (
        <ScrollArea className="h-full py-6 pr-6 lg:py-8">
            <div className="w-full">
                {renderItems(items)}
            </div>
        </ScrollArea>
    )
}

function FolderItem({ title, children }: { title: string, children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(true)

    return (
        <div className="pb-4">
            <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold flex items-center cursor-pointer hover:bg-muted/50" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <ChevronDown className="h-4 w-4 mr-2" /> : <ChevronRight className="h-4 w-4 mr-2" />}
                {title}
            </h4>
            {isOpen && (
                <div className="grid grid-flow-row auto-rows-max text-sm pl-4">
                    {children}
                </div>
            )}
        </div>
    )
}
