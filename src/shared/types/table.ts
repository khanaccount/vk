export interface TableRow {
    id: number
    [key: string]: string | number | boolean | null
}

export interface TableColumn {
    field: string
    headerName: string
    width?: number
    type?: "string" | "number" | "date"
    sortable?: boolean
}

export interface TableData {
    id: string
    [key: string]: string | number | boolean | null
}

export interface TableResponse {
    data: TableData[]
    total: number
    page: number
    pageSize: number
}
