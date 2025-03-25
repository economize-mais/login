import { SortDirection } from "@/shared/domain/repositories/searchable-repository-contracts"

export type SearchInput<Filter = string> = {
    page?: number
    perPage?: number
    sort?: {
        by: string | null
        direction: SortDirection | null
    }
    filter?: Filter | null
}