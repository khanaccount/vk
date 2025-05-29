import {
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
    Box,
    CircularProgress,
    Snackbar,
    Alert,
    Tooltip,
} from "@mui/material"
import { Grid } from "@mui/material"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import type { TableColumn } from "@/shared/types/table"
import { useTableData } from "@/features/Table/model/useTableData"
import { useState } from "react"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"

interface CreateFormProps {
    columns: TableColumn[]
}

type FormValues = {
    [key: string]: string | number | Date | undefined
}

type SchemaType = yup.NumberSchema | yup.DateSchema | yup.StringSchema

const MAX_TEXT_LENGTH = 30

export const CreateForm = ({ columns }: CreateFormProps) => {
    const { createRecord, isCreating } = useTableData()
    const [notification, setNotification] = useState<{ open: boolean; message: string; type: "success" | "error" }>({
        open: false,
        message: "",
        type: "success",
    })

    // Create validation schema based on columns
    const validationSchema = yup.object().shape(
        columns.reduce(
            (acc, column) => {
                let fieldSchema: SchemaType

                switch (column.type) {
                    case "number":
                        if (column.field === "age") {
                            fieldSchema = yup
                                .number()
                                .typeError("Must be a number")
                                .min(0, "Age must be at least 0")
                                .max(100, "Age must not exceed 100")
                                .required("Required")
                        } else {
                            fieldSchema = yup
                                .number()
                                .typeError("Must be a number")
                                .min(0, "Must be a positive number")
                                .required("Required")
                        }
                        break
                    case "date":
                        fieldSchema = yup.date().typeError("Must be a valid date").required("Required")
                        break
                    default:
                        fieldSchema = yup.string().trim().required("Required")
                        if (column.field === "email") {
                            fieldSchema = (fieldSchema as yup.StringSchema).email("Must be a valid email")
                        }
                        if (column.field === "phone") {
                            fieldSchema = (fieldSchema as yup.StringSchema)
                                .matches(/^\+?[\d\s-()]+$/, "Must be a valid phone number")
                                .min(10, "Phone number must be at least 10 digits")
                                .max(15, "Phone number must not exceed 15 digits")
                                .test("phone-format", "Invalid phone number format", (value) => {
                                    if (!value) return true
                                    const digitsOnly = value.replace(/\D/g, "")
                                    return digitsOnly.length >= 10 && digitsOnly.length <= 15
                                })
                        }
                }

                acc[column.field] = fieldSchema
                return acc
            },
            {} as Record<string, SchemaType>
        )
    )

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: yupResolver(validationSchema),
        mode: "onChange",
    })

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

    const onSubmit = (data: FormValues) => {
        const formattedData = Object.entries(data).reduce(
            (acc, [key, value]) => {
                const column = columns.find((col) => col.field === key)
                if (column?.type === "number") {
                    acc[key] = Number(value)
                } else if (value instanceof Date) {
                    acc[key] = value.toISOString().split("T")[0]
                } else {
                    acc[key] = String(value).trim()
                }
                return acc
            },
            {} as Record<string, string | number>
        )

        createRecord(formattedData, {
            onSuccess: () => {
                reset()
                setNotification({
                    open: true,
                    message: "Record created successfully",
                    type: "success",
                })
            },
            onError: () => {
                setNotification({
                    open: true,
                    message: "Failed to create record",
                    type: "error",
                })
            },
        })
    }

    const handleCloseNotification = () => {
        setNotification((prev) => ({ ...prev, open: false }))
    }

    return (
        <Card sx={{ mt: 2 }}>
            <CardContent>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Create New Record
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Fill in the form below to create a new record
                    </Typography>
                </Box>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={3}>
                        {columns.map((column) => (
                            <Grid item xs={12} sm={6} md={4} key={column.field}>
                                <Controller
                                    name={column.field}
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label={column.headerName}
                                            variant="outlined"
                                            type={
                                                column.type === "date"
                                                    ? "date"
                                                    : column.type === "number"
                                                      ? "number"
                                                      : "text"
                                            }
                                            error={!!errors[column.field]}
                                            helperText={errors[column.field]?.message as string}
                                            InputProps={{
                                                endAdornment: field.value &&
                                                    String(field.value).length > MAX_TEXT_LENGTH && (
                                                        <Tooltip title="Click to copy full text">
                                                            <Box
                                                                component="span"
                                                                sx={{
                                                                    cursor: "pointer",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                }}
                                                                onClick={() => handleCopyText(String(field.value))}
                                                            >
                                                                <ContentCopyIcon fontSize="small" />
                                                            </Box>
                                                        </Tooltip>
                                                    ),
                                            }}
                                            value={field.value ? truncateText(String(field.value)) : ""}
                                        />
                                    )}
                                />
                            </Grid>
                        ))}
                        <Grid item xs={12}>
                            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    disabled={isCreating}
                                    sx={{
                                        minWidth: 200,
                                        py: 1.5,
                                    }}
                                >
                                    {isCreating ? <CircularProgress size={24} color="inherit" /> : "Create Record"}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </CardContent>
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
        </Card>
    )
}
