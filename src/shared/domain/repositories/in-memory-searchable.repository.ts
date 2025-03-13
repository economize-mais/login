import { Entity } from "../entities/entity"
import { InMemoryRepository } from "./in-memory.repository"
import { SearchableRepositoryInterface, SearchParams, SearcResult } from "./searchable-repository-contracts"

export abstract class InMemorySearchableRepository<E extends Entity<Props>, Props> extends InMemoryRepository<E, Props> implements SearchableRepositoryInterface<E, Props, any, any> {
    async search(props: SearchParams): Promise<SearcResult<E>> {

    }

    protected abstract applyFilter(item: E[], filter: string | null): Promise<E[]>

    protected async applySort(
        items: E[],
        sort: string | null,
        sortDir: string | null
    ): Promise<E[]> {

    }

    protected async applyPaginated(
        items: E[],
        page: SearchParams["page"],
        perPage: SearchParams["perPage"]
    ): Promise<E[]> {

    }
}