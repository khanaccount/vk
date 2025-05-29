import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/shared/api/api"
import type { TableData } from "@/shared/types/table"

interface ApiResponse {
    data: TableData[]
    total: number
}

export const useTableData = () => {
    const queryClient = useQueryClient()

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useInfiniteQuery<ApiResponse>({
        queryKey: ["records"],
        queryFn: ({ pageParam = 1 }) => api.getRecords(pageParam as number),
        getNextPageParam: (lastPage, allPages) => {
            const nextPage = allPages.length + 1
            return nextPage * 10 <= lastPage.total ? nextPage : undefined
        },
        initialPageParam: 1,
    })

    const { mutate: createRecord, isPending: isCreating } = useMutation({
        mutationFn: api.createRecord,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["records"] })
        },
    })

    const { mutate: deleteRecord, isPending: isDeleting } = useMutation({
        mutationFn: api.deleteRecord,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["records"] })
        },
    })

    return {
        data: data?.pages.flatMap((page) => page.data) ?? [],
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        error,
        createRecord,
        isCreating,
        deleteRecord,
        isDeleting,
    }
}
