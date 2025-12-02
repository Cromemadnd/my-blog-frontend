"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"

export function BackgroundGrid() {
    const [mounted, setMounted] = useState(false)
    const [mouseX, setMouseX] = useState(0)
    const [mouseY, setMouseY] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)

    const [gridDimensions, setGridDimensions] = useState({ width: 40, height: 40 })

    useEffect(() => {
        const calculateGrid = () => {
            const cellSize = 120 // Target size for each cell in pixels
            const width = Math.ceil((window.innerWidth * 2) / cellSize)
            const height = Math.ceil((window.innerHeight * 2) / cellSize)
            setGridDimensions({ width, height })
        }

        calculateGrid()
        window.addEventListener("resize", calculateGrid)
        return () => window.removeEventListener("resize", calculateGrid)
    }, [])

    const GRID_WIDTH = gridDimensions.width
    const GRID_HEIGHT = gridDimensions.height

    const matrix = Array.from({ length: GRID_HEIGHT * GRID_WIDTH }).map((_, i) => {
        const x = i % GRID_WIDTH
        const y = Math.floor(i / GRID_WIDTH)
        return { x, y }
    })

    const getMouseGridPosition = () => {
        if (!containerRef.current) return { x: -100, y: -100 }

        // 1. 获取容器的逻辑尺寸
        const logicalWidth = containerRef.current.offsetWidth
        const logicalHeight = containerRef.current.offsetHeight

        const cellWidth = logicalWidth / GRID_WIDTH
        const cellHeight = logicalHeight / GRID_HEIGHT

        // 2. 定义变换参数
        const skewDeg = -12
        const skewRad = (skewDeg * Math.PI) / 180
        const tanAlpha = Math.tan(skewRad) // 约为 -0.21

        // 3. 精确校准坐标系
        // 当 skewX 为负值时，元素底部向左倾斜。
        // getBoundingClientRect().left 对齐的是变形后的"最左点"（即左下角）。
        // 而我们的逻辑坐标系原点是"左上角"。
        // 因此，我们需要计算左下角相对于左上角的水平偏移量。
        const boundingBoxOffset = Math.abs(logicalHeight * tanAlpha)

        // 4. 修正鼠标坐标
        // mouseX 目前是相对于 BoundingBox 左边缘的距离
        // 我们需要将其转换为相对于逻辑左上角的距离
        const relativeX = mouseX - boundingBoxOffset
        const relativeY = mouseY

        // 5. 应用逆变换公式
        // x_logical = x_screen - y_screen * tan(alpha)
        // 原理：x_screen = x_logical + y_logical * tan(alpha)
        const unskewedX = relativeX - relativeY * tanAlpha

        const gridMouseX = unskewedX / cellWidth
        const gridMouseY = relativeY / cellHeight

        return { x: gridMouseX, y: gridMouseY }
    }

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect()
                setMouseX(e.clientX - rect.left)
                setMouseY(e.clientY - rect.top)
            }
        }

        window.addEventListener("mousemove", handleMouseMove)
        return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [mouseX, mouseY])

    if (!mounted) return null

    return (
        <div
            ref={containerRef}
            className="fixed -inset-[50%] z-0 -skew-x-12 pointer-events-none select-none overflow-hidden"
        >
            <motion.div
                className="w-full h-full grid"
                style={{
                    gridTemplateColumns: `repeat(${GRID_WIDTH}, 1fr)`,
                }}
            >
                {matrix.map(({ x, y }) => {
                    let style: React.CSSProperties = {}
                    const mousePosGrid = getMouseGridPosition()

                    // 提取背景色逻辑：如果在鼠标附近则计算动态透明度，否则使用棋盘格纹理
                    let bgClass = ""
                    if (Math.floor(mousePosGrid.x) === x && Math.floor(mousePosGrid.y) === y) {
                        bgClass = "bg-foreground/20 dark:bg-foreground/50"
                    } else if (Math.sqrt((mousePosGrid.x - x - 0.5) ** 2 + (mousePosGrid.y - y - 0.5) ** 2) < 1.7) {
                        if ((x + y) % 2 === 0) {
                            bgClass = "bg-foreground/10 dark:bg-foreground/25"
                        } else {
                            bgClass = "bg-foreground/8 dark:bg-foreground/20"
                        }
                    }
                    else if ((x + y) % 2 === 0) {
                        bgClass = "bg-foreground/3 dark:bg-foreground/8"
                    } else {
                        bgClass = "bg-transparent"
                    }

                    return (
                        <div
                            key={`${x}-${y}`}
                            className={`aspect-square border border-foreground/5 dark:border-foreground/15 transition-colors duration-100 ${bgClass}`}
                            style={style}
                        />
                    )
                })}
            </motion.div>
        </div>
    )
}
