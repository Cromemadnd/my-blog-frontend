"use client"

import * as React from "react"

interface LayoutContextType {
    title: string
    setTitle: (title: string) => void
    date?: string
    setDate: (date: string | undefined) => void
    tags?: string[]
    setTags: (tags: string[] | undefined) => void
}

const LayoutContext = React.createContext<LayoutContextType | undefined>(undefined)

export function LayoutProvider({ children }: { children: React.ReactNode }) {
    const [title, setTitle] = React.useState("Now Loading...")
    const [date, setDate] = React.useState<string | undefined>(undefined)
    const [tags, setTags] = React.useState<string[] | undefined>(undefined)

    return (
        <LayoutContext.Provider value={{ title, setTitle, date, setDate, tags, setTags }}>
            {children}
        </LayoutContext.Provider>
    )
}

export function useLayout() {
    const context = React.useContext(LayoutContext)
    if (context === undefined) {
        throw new Error("useLayout must be used within a LayoutProvider")
    }
    return context
}
