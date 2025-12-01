"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

interface TOCItem {
    id: string
    text: string
    level: number
}

export function TableOfContents() {
    const [headings, setHeadings] = React.useState<TOCItem[]>([])
    const [activeId, setActiveId] = React.useState<string>("")
    const pathname = usePathname()

    React.useEffect(() => {
        // Reset headings on path change
        setHeadings([])

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id)
                    }
                })
            },
            { rootMargin: "0px 0px -80% 0px" }
        )

        const handleNewHeadings = (elements: Element[]) => {
            const newItems = elements.map((elem) => ({
                id: elem.id,
                text: elem.textContent || "",
                level: Number(elem.tagName.substring(1)),
            })).filter(item => item.id && item.text)

            if (newItems.length > 0) {
                setHeadings(prev => {
                    const existingIds = new Set(prev.map(p => p.id))
                    const unique = newItems.filter(i => !existingIds.has(i.id))
                    if (unique.length === 0) return prev
                    return [...prev, ...unique]
                })

                elements.forEach(el => observer.observe(el))
            }
        }

        // Initial scan
        const initialElements = Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6"))
        handleNewHeadings(initialElements)

        // Rely on MutationObserver and initial scan to find headings.

        const mutationObserver = new MutationObserver((mutations) => {
            const addedElements: Element[] = []
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node instanceof HTMLElement) {
                        if (/^H[1-6]$/.test(node.tagName)) {
                            addedElements.push(node)
                        }
                        const nested = node.querySelectorAll("h1, h2, h3, h4, h5, h6")
                        nested.forEach(el => addedElements.push(el))
                    }
                })
            })

            if (addedElements.length > 0) {
                handleNewHeadings(addedElements)
            }
        })
        const mainContent = document.querySelector('main')
        if (mainContent) {
            mutationObserver.observe(mainContent, {
                childList: true,
                subtree: true
            })
        }

        return () => {
            observer.disconnect()
            mutationObserver.disconnect()
        }
    }, [pathname])

    if (headings.length === 0) return null

    return (
        <div className="space-y-2 -ml-6">
            <h4
                className="font-medium text-lg uppercase tracking-wider text-muted-foreground mb-4 cursor-pointer hover:text-foreground transition-colors"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
                本文导航
            </h4>
            <ul className="space-y-2">
                {headings.map((item, index) => (
                    <li
                        key={item.id}
                        style={{
                            paddingLeft: (item.level - 1) * 12,
                            width: `${120 + (index / headings.length) * 40}%` // Increases from 60% to 100%
                        }}
                    >
                        <a
                            href={`#${item.id}`}
                            className={cn(
                                "block transition-colors hover:text-foreground truncate",
                                item.id === activeId ? "text-foreground font-medium" : "text-muted-foreground",
                                item.level === 1 ? "text-lg font-bold" :
                                    item.level === 2 ? "text-base font-semibold" :
                                        "text-sm"
                            )}
                            onClick={(e) => {
                                e.preventDefault()
                                document.getElementById(item.id)?.scrollIntoView({
                                    behavior: "smooth",
                                })
                                setActiveId(item.id)
                            }}
                        >
                            {item.text}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    )
}
