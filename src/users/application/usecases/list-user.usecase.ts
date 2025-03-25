import { PaginationOutput, PaginationOutputMapper } from "@/shared/application/dtos/pagination-output"
import { SearchInput } from "@/shared/application/dtos/search-input"
import { UseCase as DefaultUseCase } from "@/shared/application/usecases/use-case"
import { UserOutput, UserOutputMapper } from "../dtos/user-output"
import { UserRepository } from "@/users/domain/repositories/user.repository"

export namespace ListUserUseCase {

    export type Input = SearchInput

    export type Output = PaginationOutput<UserOutput>

    export class UseCase implements DefaultUseCase<Input, Output>  {

        constructor (
            private readonly userRepo: UserRepository.Repository
        ) {}

        async execute(input: Input): Promise<Output> {
            const params = new UserRepository.SearchParams(input)
            const searchResult = await this.userRepo.search(params)
            return this.toOutput(searchResult)
        }

        private toOutput(searchResult: UserRepository.SearcResult): Output {
            const items = searchResult.items.map(item => {
                return UserOutputMapper.toOutput(item)
            })
            return PaginationOutputMapper.toOutput(items, searchResult)
        }
    }
}