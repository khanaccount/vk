import {
    Table as MuiTable,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    CircularProgress,
    Box,
    Snackbar,
    Alert,
    Tooltip,
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import type { TableColumn } from "@/shared/types/table"
import { useTableData } from "../model/useTableData"
import { useState, useEffect, useRef } from "react"

interface TableProps {
    columns: TableColumn[]
}

const MAX_TEXT_LENGTH = 15

export const Table = ({ columns }: TableProps) => {
    const { data, isLoading, error, deleteRecord, isDeleting, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useTableData()
    const [notification, setNotification] = useState<{ open: boolean; message: string; type: "success" | "error" }>({
        open: false,
        message: "",
        type: "success",
    })

    const observerTarget = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage()
                }
            },
            { threshold: 1.0 }
        )

        if (observerTarget.current) {
            observer.observe(observerTarget.current)
        }

        return () => observer.disconnect()
    }, [fetchNextPage, hasNextPage, isFetchingNextPage])

    const handleDelete = (id: string) => {
        deleteRecord(id, {
            onSuccess: () => {
                setNotification({
                    open: true,
                    message: "Record deleted successfully",
                    type: "success",
                })
            },
            onError: () => {
                setNotification({
                    open: true,
                    message: "Failed to delete record",
                    type: "error",
                })
            },
        })
    }

    const handleCopyText = (text: string) => {
        navigator.clipboard.writeText(text)
        setNotification({
            open: true,
            message: "Text copied to clipboard",
            type: "success",
        })
    }

    const truncateText = (text: string) => {
        if (text.length <= MAX_TEXT_LENGTH) return text
        return text.slice(0, MAX_TEXT_LENGTH) + "..."
    }

    const handleCloseNotification = () => {
        setNotification((prev) => ({ ...prev, open: false }))
    }

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
            </Box>
        )
    }

    if (error) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4, color: "error.main" }}>Error loading data</Box>
        )
    }

    if (!Array.isArray(data)) {
        return null
    }

    return (
        <TableContainer component={Paper}>
            <MuiTable>
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell key={column.field}>{column.headerName}</TableCell>
                        ))}
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row) => (
                        <TableRow key={row.id}>
                            {columns.map((column) => {
                                const value = String(row[column.field] ?? "")
                                const isLongText = value.length > MAX_TEXT_LENGTH
                                return (
                                    <TableCell key={`${row.id}-${column.field}`}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                            <Tooltip title={isLongText ? value : ""}>
                                                <span>{truncateText(value)}</span>
                                            </Tooltip>
                                            {isLongText && (
                                                <Tooltip title="Click to copy full text">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleCopyText(value)}
                                                        sx={{
                                                            ml: 0.5,
                                                            p: 0.5,
                                                            "& .MuiSvgIcon-root": {
                                                                fontSize: "1rem",
                                                            },
                                                        }}
                                                    >
                                                        <ContentCopyIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </Box>
                                    </TableCell>
                                )
                            })}
                            <TableCell>
                                <IconButton
                                    color="error"
                                    onClick={() => handleDelete(row.id)}
                                    disabled={isDeleting}
                                    aria-label="Delete record"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </MuiTable>
            <Box ref={observerTarget} sx={{ p: 2, textAlign: "center" }}>
                {isFetchingNextPage && <CircularProgress size={24} />}
            </Box>
            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert onClose={handleCloseNotification} severity={notification.type} sx={{ width: "100%" }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </TableContainer>
    )
}
