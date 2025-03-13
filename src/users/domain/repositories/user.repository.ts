import {
    SearchParams as DefaultSearchParams,
    SearcResult as DefaultSearcResult,
    SearchableRepositoryInterface
} from "@/shared/domain/repositories/searchable-repository-contracts"
import { UserEntity, UserProps } from "../entities/user.entity"

export namespace UserRepository {

    export type Filter = string

    export class SearchParams extends DefaultSearchParams<Filter> {}

    export class SearcResult extends DefaultSearcResult<UserEntity, Filter> {}

    export interface Repository
        extends SearchableRepositoryInterface<
            UserEntity,
            UserProps,
            Filter,
            SearchParams,
            SearcResult
    > {
        emailExists(email: string): Promise<void>
        getByEmail(email: string): Promise<UserEntity>
    }
}