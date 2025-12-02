import { getSidebarData } from "@/lib/posts"
import { SidebarNav } from "./sidebar-nav"
import Link from "next/link"
import Image from "next/image"

export async function LeftSidebarContent() {
    const sidebarData = await getSidebarData()

    return (
        <div className="flex flex-col h-full space-y-2">
            <div className="mb-6 w-120 flex items-center space-x-3 px-2">
                <Link href="/" className="flex items-center space-x-2 w-full pl-8">
                    <Image
                        src="/favicon.jpg"
                        alt="Logo"
                        width={40}
                        height={40}
                        className="rounded-lg"
                    />
                    <span className="font-bold text-2xl tracking-tighter uppercase">Cromemadnd&apos;s Blog</span>
                </Link>
            </div>

            <div className="flex-1">
                <SidebarNav items={sidebarData} />
            </div>

            <div className="text-s text-muted-foreground mt-auto pt-4 border-t border-sidebar-border/50 w-60">
                &copy; 2025 Cromemadnd Lancity
            </div>
        </div>
    )
}
