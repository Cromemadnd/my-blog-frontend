export default function Loading() {
    return (
        <div className="flex h-[50vh] w-full items-center justify-center">
            <div className="flex space-x-4">
                <div className="h-8 w-8 animate-pulse bg-primary transform -skew-x-12"></div>
                <div className="h-8 w-8 animate-pulse bg-primary transform -skew-x-12 delay-75"></div>
                <div className="h-8 w-8 animate-pulse bg-primary transform -skew-x-12 delay-150"></div>
            </div>
        </div>
    )
}
