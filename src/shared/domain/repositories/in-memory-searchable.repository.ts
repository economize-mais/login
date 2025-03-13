import { Entity } from "../entities/entity"
import { InMemoryRepository } from "./in-memory.repository"
import { SearchableRepositoryInterface, SearchParams, SearcResult, SortDirection } from "./searchable-repository-contracts"

export abstract class InMemorySearchableRepository<E extends Entity<Props>, Props> extends InMemoryRepository<E, Props> implements SearchableRepositoryInterface<E, Props, any, any> {

    sortableFields: string[] = []

    async search(props: SearchParams): Promise<SearcResult<E>> {
        const itemsFiltered = await this.applyFilter(this.items, props.filter)
        const itemsSorted = await this.applySort(itemsFiltered, props.sort)
        const itemsPaginated = await this.applyPaginated(itemsSorted, props.page, props.perPage)
        return new SearcResult({
            items: itemsPaginated,
            total: itemsFiltered.length,
            currentPage: props.page,
            perPage: props.perPage,
            sort: props.sort,
            filter: props.filter
        })
    }

    protected abstract applyFilter(item: E[], filter: string | null): Promise<E[]>

    protected async applySort(
        items: E[],
        sort: {
            by: string | null,
            direction: SortDirection | null
        }
    ): Promise<E[]> {
        if(!sort || !this.sortableFields.includes(sort.by))
            return items

        return [...items].sort((a, b) => {
            if(a.props[sort.by] < b.props[sort.by])
                return sort.direction === "asc" ? -1 : 1

            if(a.props[sort.by] > b.props[sort.by])
                return sort.direction === "asc" ? 1 : -1

            return 0
        })
    }

    protected async applyPaginated(
        items: E[],
        page: SearchParams["page"],
        perPage: SearchParams["perPage"]
    ): Promise<E[]> {
        const start = (page - 1) * perPage
        const limit = start + perPage
        return items.slice(start, limit)
    }
}