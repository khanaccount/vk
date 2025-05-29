import { api } from "../api"
import axios from "axios"
import { jest, describe, it, expect, beforeEach } from "@jest/globals"

jest.mock("axios")
const mockedAxios = axios as jest.Mocked<typeof axios>

describe("API", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe("getRecords", () => {
        it("should fetch records with pagination", async () => {
            const mockResponse = {
                data: [{ id: "1", name: "Test" }],
                headers: { "x-total-count": "100" },
            }
            mockedAxios.get.mockResolvedValueOnce(mockResponse)

            const result = await api.getRecords(1, 10)

            expect(mockedAxios.get).toHaveBeenCalledWith("http://localhost:3001/records", {
                params: {
                    _page: 1,
                    _limit: 10,
                    _sort: "id",
                    _order: "desc",
                },
            })
            expect(result).toEqual({
                data: [{ id: "1", name: "Test" }],
                total: 100,
            })
        })
    })

    describe("createRecord", () => {
        it("should create a new record", async () => {
            const mockData = { name: "Test" }
            const mockResponse = { data: { id: "1", ...mockData } }
            mockedAxios.post.mockResolvedValueOnce(mockResponse)

            const result = await api.createRecord(mockData)

            expect(mockedAxios.post).toHaveBeenCalledWith("http://localhost:3001/records", mockData)
            expect(result).toEqual({ id: "1", name: "Test" })
        })
    })

    describe("deleteRecord", () => {
        it("should delete a record", async () => {
            mockedAxios.delete.mockResolvedValueOnce({})

            await api.deleteRecord("1")

            expect(mockedAxios.delete).toHaveBeenCalledWith("http://localhost:3001/records/1")
        })
    })
})
