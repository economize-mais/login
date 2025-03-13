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

export class SearchParams {

    protected _page: number
    protected _perPage: number
    protected _sort: {
        by: string | null
        direction: SortDirection | null
    }
    protected _filter: string

    constructor(props: SearchProps = {}) {
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

    get filter(): string {
        return this._filter
    }

    private set filter(value: string) {
        this._filter = isNullOrEmpty(value) ? null : `${value}`
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

function isNullOrEmpty(value: string | null): boolean {
    return value === null || value === undefined || value === ""
}

export interface SearchableRepositoryInterface<
    E extends Entity<Props>,
    Props,
    SearchInput,
    SearchOutput
> extends RepositoryInterface<E, Props> {
    search(props: SearchParams): Promise<SearchOutput>
}