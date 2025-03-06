import { Entity } from "../entities/entity"
import { RepositoryInterface } from "./repository-contracts"

export interface SearchableRepositoryInterface<
    E extends Entity<Props>,
    Props,
    SearchInput,
    SearchOutput
> extends RepositoryInterface<E, Props> {
    search(props: SearchInput): Promise<SearchOutput>
}