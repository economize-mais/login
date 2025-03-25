import { Entity } from "@/shared/domain/entities/entity"
import { SearcResult } from "@/shared/domain/repositories/searchable-repository-contracts"

export type PaginationOutput<Item = any> = {
    items: Item[]
    total: number
    currentPage: number
    lastPage: number
    perPage: number
}

export class PaginationOutputMapper {
    static toOutput<Item = any>(items: Item[], result: SearcResult<Entity<any>>): PaginationOutput<Item> {
        return {
            items,
            total: result.total,
            currentPage: result.currentPage,
            lastPage: result.lastPage,
            perPage: result.perPage
        }
    }
}