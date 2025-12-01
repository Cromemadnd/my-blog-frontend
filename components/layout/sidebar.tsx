import { getSidebarData } from "@/lib/posts"
import { SidebarNav } from "./sidebar-nav"

export async function Sidebar() {
    const sidebarData = await getSidebarData()

    return (
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
            <div className="h-full py-6 pl-8 pr-6 lg:py-8">
                <SidebarNav items={sidebarData} />
            </div>
        </aside>
    )
}
