"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronRight, ChevronDown } from "lucide-react"
import { useState, useMemo } from "react"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
    items: any // IndexData
}

interface NavItem {
    type: 'post' | 'folder'
    path: string
    title: string
    level: number
    data?: any
}

export function SidebarNav({ items }: SidebarNavProps) {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState<Set<string>>(new Set())

    const toggleCollapse = (path: string) => {
        const newCollapsed = new Set(collapsed)
        if (newCollapsed.has(path)) {
            newCollapsed.delete(path)
        } else {
            newCollapsed.add(path)
        }
        setCollapsed(newCollapsed)
    }

    const visibleItems = useMemo(() => {
        const result: NavItem[] = []

        const traverse = (data: any, prefix = "", level = 0) => {
            Object.keys(data).forEach((key) => {
                if (key === "index") return

                const item = data[key]
                const currentPath = prefix ? `${prefix}/${key}` : key
                const isPost = item.title && item.date

                if (isPost) {
                    result.push({ type: 'post', path: currentPath, title: item.title, level })
                } else {
                    // Folder
                    result.push({ type: 'folder', path: currentPath, title: key, level, data: item })
                    if (!collapsed.has(currentPath)) {
                        traverse(item, currentPath, level + 1)
                    }
                }
            })
        }

        traverse(items)
        return result
    }, [items, collapsed])

    return (
        <ScrollArea className="h-full py-6 pr-6 lg:py-8 w-120">
            <div className="space-y-1">
                {visibleItems.map((item, index) => {
                    if (item.type === 'post') {
                        return (
                            <div key={item.path}>
                                <Link
                                    href={`/${item.path}`}
                                    className={cn(
                                        "group flex items-center w-full rounded-md border border-transparent px-2 py-1 hover:underline",
                                        pathname === `/${item.path}`
                                            ? "font-medium text-foreground"
                                            : "text-muted-foreground"
                                    )}
                                    style={{
                                        paddingLeft: `${item.level * 16 + 8}px`,
                                        width: `${480 - index * 20 - item.level * 16}px`
                                    }}
                                >
                                    {item.title}
                                </Link>
                            </div>
                        )
                    } else {
                        const isOpen = !collapsed.has(item.path)
                        return (
                            <div
                                key={item.path}
                            >
                                <h4
                                    className="mb-1 rounded-md px-2 py-1 text-sm font-semibold flex items-center cursor-pointer truncate"
                                    style={{ paddingLeft: `${item.level * 16}px` }}
                                >
                                    <ChevronRight className="h-4 w-4 mr-2 shrink-0 transition-transform duration-200" style={{ rotate: isOpen ? "90deg" : "0deg" }} onClick={() => toggleCollapse(item.path)} />
                                    <Link className="hover:underline" href={`/${item.path}`}>{item.title}</Link>
                                </h4>
                            </div>
                        )
                    }
                })}
            </div>
        </ScrollArea>
    )
}
