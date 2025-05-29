import { Container, Typography, Box } from "@mui/material"
import { Table } from "@/features/Table/ui/Table"
import { CreateForm } from "@/features/CreateForm/ui/CreateForm"
import { ThemeToggle } from "@/features/ThemeToggle/ui/ThemeToggle"
import type { TableColumn } from "@/shared/types/table"

const columns: TableColumn[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 130 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "age", headerName: "Age", width: 90, type: "number" },
    { field: "address", headerName: "Address", width: 200 },
    { field: "phone", headerName: "Phone", width: 130 },
    { field: "company", headerName: "Company", width: 130 },
]

export const MainPage = () => {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Typography variant="h4" component="h1">
                    Data Management
                </Typography>
                <ThemeToggle />
            </Box>

            <CreateForm columns={columns} />

            <Table columns={columns} />
        </Container>
    )
}
