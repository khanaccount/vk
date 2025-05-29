import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { Table } from "../Table"
import { useTableData } from "../../model/useTableData"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { jest, describe, it, expect, beforeEach } from "@jest/globals"
import "@testing-library/jest-dom"
import type { Mock } from "jest-mock"
import type { TableData } from "@/shared/types/table"

jest.mock("../../model/useTableData")

const mockColumns = [
    { field: "name", headerName: "Name", type: "string" as const },
    { field: "age", headerName: "Age", type: "number" as const },
]

const mockData: TableData[] = [
    { id: "1", name: "John Doe", age: 30 },
    { id: "2", name: "Jane Smith", age: 25 },
]

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
})

const renderTable = () => {
    return render(
        <QueryClientProvider client={queryClient}>
            <Table columns={mockColumns} />
        </QueryClientProvider>
    )
}

describe("Table", () => {
    beforeEach(() => {
        jest.clearAllMocks()
        ;(useTableData as Mock).mockReturnValue({
            data: mockData,
            isLoading: false,
            error: null,
            deleteRecord: jest.fn(),
            isDeleting: false,
            fetchNextPage: jest.fn(),
            hasNextPage: true,
            isFetchingNextPage: false,
        })
    })

    it("renders table with data", () => {
        renderTable()

        expect(screen.getByText("Name")).toBeTruthy()
        expect(screen.getByText("Age")).toBeTruthy()
        expect(screen.getByText("John Doe")).toBeTruthy()
        expect(screen.getByText("30")).toBeTruthy()
        expect(screen.getByText("Jane Smith")).toBeTruthy()
        expect(screen.getByText("25")).toBeTruthy()
    })

    it("shows loading state", () => {
        (useTableData as Mock).mockReturnValue({ data: [], isLoading: true, error: null })

        renderTable()

        expect(screen.getByRole("progressbar")).toBeTruthy()
    })

    it("shows error state", () => {
        (useTableData as Mock).mockReturnValue({ data: [], isLoading: false, error: new Error("Failed to load") })

        renderTable()

        expect(screen.getByText("Error loading data")).toBeTruthy()
    })

    it("handles delete action", async () => {
        const deleteRecord = jest.fn()
        ;(useTableData as Mock).mockReturnValue({
            data: mockData,
            isLoading: false,
            error: null,
            deleteRecord,
            isDeleting: false,
            fetchNextPage: jest.fn(),
            hasNextPage: true,
            isFetchingNextPage: false,
        })

        renderTable()

        const deleteButtons = screen.getAllByRole("button", { name: /delete/i })
        fireEvent.click(deleteButtons[0])

        await waitFor(() => {
            expect(deleteRecord).toHaveBeenCalledWith("1", expect.anything())
        })
    })

    it("handles copy action for long text", async () => {
        const longText: string = "This is a very long text that should be truncated"
        ;(useTableData as Mock).mockReturnValue({
            data: [{ id: "1", name: longText, age: 30 }],
            isLoading: false,
            error: null,
            deleteRecord: jest.fn(),
            isDeleting: false,
        })

        renderTable()

        const copyButton = screen.getByRole("button", { name: /copy/i })
        fireEvent.click(copyButton)

        await waitFor(() => {
            expect(screen.getByText("Text copied to clipboard")).toBeTruthy()
        })
    })
})
