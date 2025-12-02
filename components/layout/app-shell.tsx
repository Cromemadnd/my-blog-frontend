"use client"

import * as React from "react"
import { useLayout } from "@/components/layout-context"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Search } from "@/components/search"
import { BackgroundGrid } from "@/components/ui/background-grid"

interface AppShellProps {
    children: React.ReactNode
    leftSidebar: React.ReactNode
    rightSidebar: React.ReactNode
    posts?: { slug: string; metadata: any }[]
}

export function AppShell({ children, leftSidebar, rightSidebar, posts = [] }: AppShellProps) {
    const { title, date, tags } = useLayout()
    const { setTheme, theme } = useTheme()

    return (
        <div className="flex min-h-screen w-full bg-background/50 text-foreground overflow-hidden relative">

            {/* Top Title Bar (Fixed, Z-Index High) */}
            <header className="fixed top-0 left-0 right-0 h-24 flex items-center justify-between px-8 border-b border-border/50 bg-sidebar/50 z-50">
                <div className="flex-1" /> {/* Spacer */}

                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center max-w-[60%] space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight uppercase truncate w-full text-center">
                        {title}
                    </h1>
                    {(date || tags) && (
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {date && <span>{date}</span>}
                            {tags && tags.length > 0 && (
                                <div className="flex gap-2">
                                    {tags.map((tag) => (
                                        <span key={tag} className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold border-transparent bg-secondary text-secondary-foreground">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex items-center space-x-4 z-50">
                    <Search posts={posts} />
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                    >
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </div>
            </header>

            {/* Left Sidebar (Fixed Trapezoid) */}
            <aside className="fixed top-0 left-0 bottom-0 w-[280px] z-[60] hidden md:block pointer-events-none">
                {/* Background Shape */}
                <div className="absolute top-0 bottom-0 right-0 w-[300%] bg-sidebar/80 border-r border-sidebar-border pointer-events-auto origin-bottom-right -skew-x-12">
                </div>
                {/* Content */}
                <div className="relative h-full flex flex-col px-6 py-8 pt-8 z-10 pointer-events-auto w-full">
                    {leftSidebar}
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative min-w-0 z-10 md:pl-[280px] lg:pr-[280px] transition-all duration-300 pt-32 overflow-hidden">
                <BackgroundGrid />
                {/* Content */}
                <div className="flex-1 px-8 py-2 max-w-5xl mx-auto w-full relative z-10">
                    {children}
                </div>
            </main>

            {/* Right Sidebar (Fixed Trapezoid) */}
            <aside className="fixed top-0 right-0 bottom-0 w-[280px] z-30 hidden lg:block pointer-events-none">
                {/* Background Shape */}
                <div className="absolute top-0 bottom-0 left-0 w-[300%] bg-sidebar/70 border-l border-sidebar-border pointer-events-auto origin-top-left -skew-x-12">
                </div>
                {/* Content */}
                <div className="relative h-full flex flex-col px-6 py-8 pt-36 z-10 ml-auto w-[85%] -skew-x-12 origin-top-left pointer-events-auto">
                    {rightSidebar}
                </div>
            </aside>
        </div>
    )
}
