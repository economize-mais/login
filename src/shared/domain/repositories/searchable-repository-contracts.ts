import { Entity } from "../entities/entity"
import { RepositoryInterface } from "./repository-contracts"

export type SortDirection = "asc" | "desc"

export type SearchProps<Filter = string> = {
    page?: number
    perPage?: number
    sort?: {
        by: string | null
        direction: SortDirection | null
    }
    filter?: Filter | null
}

export type SearchResultProps<E extends Entity<any>, Filter> = {
    items: E[]
    total: number
    currentPage: number
    perPage: number
    sort: {
        by: string | null
        direction: SortDirection | null
    }
    filter: Filter | null
}

export class SearchParams<Filter = string> {

    protected _page: number
    protected _perPage: number
    protected _sort: {
        by: string | null
        direction: SortDirection | null
    }
    protected _filter: Filter

    constructor(props: SearchProps<Filter> = {}) {
        this.page = props.page
        this.perPage = props.perPage
        this.sort = props.sort
        this.filter = props.filter
    }

    get page(): number {
        return this._page
    }

    private set page(value: number) {

        let _page = +value

        if (isNaN(_page) || _page < 1 || parseInt(value.toString()) !== _page)
            _page = 1

        this._page = _page
    }

    get perPage(): number {
        return this._perPage
    }

    private set perPage(value: number) {

        let _perPage = +value

        if (isNaN(_perPage) || _perPage < 1 || parseInt(value.toString()) !== _perPage || typeof value === "boolean")
            _perPage = 15

        this._perPage = _perPage
    }

    get sort() {
        return this._sort
    }

    private set sort(value) {

        if(!value || isNullOrEmpty(value.by)) {
            this._sort = null
            return
        }

        value.direction = value.direction?.toLowerCase() === "asc" ? "asc" : "desc"
        this._sort = value
    }

    get filter(): Filter {
        return this._filter
    }

    private set filter(value: Filter | null) {
        this._filter = isNullOrEmpty<Filter | null>(value) ? null : (`${value}` as any)
    }
}

export class SearcResult<E extends Entity<any>, Filter = string> {
    readonly items: E[]
    readonly total: number
    readonly currentPage: number
    readonly perPage: number
    readonly lastPage: number
    readonly sort: {
        by: string | null
        direction: SortDirection | null
    }
    readonly filter: Filter | null

    constructor(props: SearchResultProps<E, Filter>) {
        this.items = props.items
        this.total = props.total
        this.currentPage = props.currentPage
        this.perPage = props.perPage
        this.lastPage = Math.ceil(this.total / this.perPage)
        this.sort = props.sort ?? null
        this.filter = props.filter ?? null
    }

    toJSON(forceEntity = false) {
        return {
            items: forceEntity ? this.items.map(item => item.toJSON()) : this.items,
            total: this.total,
            currentPage: this.currentPage,
            perPage: this.perPage,
            lastPage: this.lastPage,
            sort: this.sort,
            filter: this.filter
        }
    }
}

function isNullOrEmpty<T>(value: T): boolean {
    return value === null || value === undefined || value === ""
}

export interface SearchableRepositoryInterface<
    E extends Entity<Props>,
    Props,
    Filter = string,
    SearchInput = SearchParams<Filter>,
    SearchOutput = SearcResult<E, Filter>
> extends RepositoryInterface<E, Props> {
    sortableFields: string[]
    search(props: SearchInput): Promise<SearchOutput>
}