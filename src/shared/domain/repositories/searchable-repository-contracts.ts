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

export class SearchParams {

    protected _page: number
    protected _perPage: number
    protected _sort: {
        by: string | null
        direction: SortDirection | null
    }
    protected _filter: string

    constructor(props: SearchProps) {
        this._page = props.page
        this._perPage = props.perPage
        this._sort = props.sort
        this._filter = props.filter
    }

    get page(): number {
        return this._page
    }

    private set page(value: number) {

        let _page = +value

        if (isNaN(_page) || _page < 1)
            _page = 1

        this._page = _page
    }

    get perPage(): number {
        return this._perPage
    }

    private set perPage(value: number) {

        let _perPage = +value

        if (isNaN(_perPage) || _perPage < 1)
            _perPage = 15

        this._perPage = _perPage
    }

    get sort() {
        return this._sort
    }

    private set sort(sort) {

        let _sort = sort

        if(!_sort || isNullOrEmpty(_sort.by))
            _sort = null
        else if (_sort.direction.toLowerCase() !== "asc" && _sort.direction.toLowerCase() !== "desc")
            _sort.direction = "desc"

        this._sort = _sort
    }

    get filter(): string {
        return this._filter
    }

    private set filter(filter: string) {
        this._filter = isNullOrEmpty(filter) ? null : filter
    }
}

function isNullOrEmpty(value: string | null): boolean {
    return value === null || value === undefined || value.trim() === ""
}

export interface SearchableRepositoryInterface<
    E extends Entity<Props>,
    Props,
    SearchInput,
    SearchOutput
> extends RepositoryInterface<E, Props> {
    search(props: SearchParams): Promise<SearchOutput>
}