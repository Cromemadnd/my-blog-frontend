"use client"

import * as React from "react"
import { Streamdown } from 'streamdown'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import rehypeRaw from 'rehype-raw'
import 'katex/dist/katex.min.css'
import { cn } from '@/lib/utils'
import { AlertCircle, Info, AlertTriangle, Flame } from "lucide-react"
import { usePathname } from "next/navigation"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"

interface MarkdownRendererProps {
    content: string
    className?: string
}

function ScrollAnimated({ as, className, children, disabled, ...props }: any) {
    const ref = React.useRef<HTMLElement | null>(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    })
    const [state, setState] = React.useState("hidden-bottom")
    // If animations are explicitly disabled via prop, keep them off.
    const localDisabled = Boolean(disabled)

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        if (localDisabled) return
        if (latest < 0.05) {
            if (state !== "hidden-bottom") setState("hidden-bottom")
        } else if (latest > 0.9) {
            if (state !== "hidden-top") setState("hidden-top")
        } else {
            if (state !== "visible") setState("visible")
        }
    })

    if (localDisabled) {
        const Component = as
        return <Component ref={ref as any} className={className} {...props}>{children}</Component>
    }

    const variants = {
        "hidden-bottom": { x: "-50%", opacity: 0 },
        "visible": { x: 0, opacity: 1 },
        "hidden-top": { x: "50%", opacity: 0 }
    }

    const Component = motion[as as keyof typeof motion] as any

    return (
        <Component
            ref={ref as any}
            animate={state}
            variants={variants}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={className}
            {...props}
        >
            {children}
        </Component>
    )
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
    const pathname = usePathname()

    React.useEffect(() => {
        // Keep pathname as a dependency to re-render when route changes if needed.
    }, [pathname])

    return (
        <div className={cn("prose dark:prose-invert max-w-none", className)}>
            <Streamdown
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeKatex, rehypeHighlight, rehypeSlug, rehypeRaw]}
                components={{
                    h1: ({ ...props }) => <ScrollAnimated as="h1" className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4" {...props} />,
                    h2: ({ ...props }) => <ScrollAnimated as="h2" className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-4 mt-8" {...props} />,
                    h3: ({ ...props }) => <ScrollAnimated as="h3" className="scroll-m-20 text-2xl font-semibold tracking-tight mb-4 mt-6" {...props} />,
                    h4: ({ ...props }) => <ScrollAnimated as="h4" className="scroll-m-20 text-xl font-semibold tracking-tight mb-4 mt-6" {...props} />,
                    h5: ({ ...props }) => <ScrollAnimated as="h5" className="scroll-m-20 text-lg font-semibold tracking-tight mb-4 mt-6" {...props} />,
                    h6: ({ ...props }) => <ScrollAnimated as="h6" className="scroll-m-20 text-base font-semibold tracking-tight mb-4 mt-6" {...props} />,
                    p: ({ ...props }) => <ScrollAnimated as="p" className="leading-7 [&:not(:first-child)]:mt-6" {...props} />,
                    ul: ({ ...props }) => <ScrollAnimated as="ul" className="my-6 ml-6 list-disc [&>li]:mt-2" {...props} />,
                    ol: ({ ...props }) => <ScrollAnimated as="ol" className="my-6 ml-6 list-decimal [&>li]:mt-2" {...props} />,
                    blockquote: ({ children, ...props }) => {
                        const childrenArray = React.Children.toArray(children);
                        const firstChild = childrenArray[0] as any;

                        if (firstChild && firstChild.props && firstChild.props.node && firstChild.props.node.tagName === 'p') {
                            const textContent = firstChild.props.children[0];
                            if (typeof textContent === 'string') {
                                const match = textContent.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/);
                                if (match) {
                                    const type = match[1].toLowerCase();
                                    const restOfText = textContent.replace(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/, '').trim();

                                    const newFirstChild = React.cloneElement(firstChild, {
                                        ...firstChild.props,
                                        children: [restOfText, ...firstChild.props.children.slice(1)]
                                    });

                                    const newChildren = [newFirstChild, ...childrenArray.slice(1)];

                                    return (
                                        <ScrollAnimated as="div">
                                            <Alert type={type}>
                                                {newChildren}
                                            </Alert>
                                        </ScrollAnimated>
                                    )
                                }
                            }
                        }
                        return <ScrollAnimated as="blockquote" className="mt-6 border-l-2 pl-6 italic" {...props}>{children}</ScrollAnimated>
                    },
                    pre: ({ ...props }) => (
                        <ScrollAnimated as="pre" className="mb-4 mt-6 overflow-x-auto rounded-lg border bg-muted p-4" {...props} />
                    ),
                    code: ({ className, children, ...props }: any) => {
                        return (
                            <code className={cn(className, "relative")} {...props}>
                                {children}
                            </code>
                        )
                    },
                    div: ({ ...props }) => <ScrollAnimated as="div" {...props} />,
                    img: ({ ...props }) => <ScrollAnimated as="img" className="rounded-md border" {...props} />,
                    table: ({ ...props }) => <ScrollAnimated as="table" className="my-6 w-full overflow-y-auto" {...props} />,
                    tr: ({ ...props }) => <ScrollAnimated as="tr" className="m-0 border-t p-0 even:bg-muted" {...props} />,
                    th: ({ ...props }) => <ScrollAnimated as="th" className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right" {...props} />,
                    td: ({ ...props }) => <ScrollAnimated as="td" className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right" {...props} />,
                }}
            >
                {content}
            </Streamdown>
        </div>
    )
}

function Alert({ type, children }: { type: string, children: React.ReactNode }) {
    const styles: Record<string, { icon: React.ReactNode, color: string, title: string }> = {
        note: { icon: <Info className="h-4 w-4" />, color: "text-blue-500 border-blue-500/50 bg-blue-500/10", title: "Note" },
        tip: { icon: <Flame className="h-4 w-4" />, color: "text-green-500 border-green-500/50 bg-green-500/10", title: "Tip" },
        important: { icon: <AlertCircle className="h-4 w-4" />, color: "text-purple-500 border-purple-500/50 bg-purple-500/10", title: "Important" },
        warning: { icon: <AlertTriangle className="h-4 w-4" />, color: "text-yellow-500 border-yellow-500/50 bg-yellow-500/10", title: "Warning" },
        caution: { icon: <AlertTriangle className="h-4 w-4" />, color: "text-red-500 border-red-500/50 bg-red-500/10", title: "Caution" },
    }

    const style = styles[type] || styles.note;

    return (
        <div className={cn("my-6 w-full rounded-lg border p-4 [&>svg~*]:pl-7", style.color)}>
            <div className="flex items-center gap-2 font-medium mb-2">
                {style.icon}
                <h5 className="mb-1 font-medium leading-none tracking-tight">{style.title}</h5>
            </div>
            <div className="text-sm [&_p]:leading-relaxed">
                {children}
            </div>
        </div>
    )
}
