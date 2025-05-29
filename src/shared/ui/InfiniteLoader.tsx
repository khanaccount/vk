import { Box, CircularProgress } from "@mui/material"
import { useEffect, useRef } from "react"

interface InfiniteLoaderProps {
    onLoadMore: () => void
    hasMore: boolean
    isLoading: boolean
}

export const InfiniteLoader = ({ onLoadMore, hasMore, isLoading }: InfiniteLoaderProps) => {
    const observerRef = useRef<IntersectionObserver | null>(null)
    const loaderRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: "20px",
            threshold: 1.0,
        }

        observerRef.current = new IntersectionObserver((entries) => {
            const [entry] = entries
            if (entry.isIntersecting && hasMore && !isLoading) {
                onLoadMore()
            }
        }, options)

        if (loaderRef.current) {
            observerRef.current.observe(loaderRef.current)
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect()
            }
        }
    }, [hasMore, isLoading, onLoadMore])

    return (
        <Box
            ref={loaderRef}
            sx={{
                display: "flex",
                justifyContent: "center",
                padding: "20px",
            }}
        >
            {isLoading && <CircularProgress />}
        </Box>
    )
}
