import axios from "axios"
import type { TableData } from "@/shared/types/table"

const API_URL = "http://localhost:3001"

export const api = {
    getRecords: async (page: number = 1, limit: number = 10) => {
        const response = await axios.get(`${API_URL}/records`, {
            params: {
                _page: page,
                _limit: limit,
                _sort: "id",
                _order: "desc",
            },
        })
        return {
            data: response.data,
            total: parseInt(response.headers["x-total-count"] || "0", 10),
        }
    },

    createRecord: async (data: Omit<TableData, "id">) => {
        const response = await axios.post(`${API_URL}/records`, data)
        return response.data
    },

    deleteRecord: async (id: string) => {
        await axios.delete(`${API_URL}/records/${id}`)
    },
}
