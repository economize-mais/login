import { UseCase as DefaultUseCase } from "@/shared/application/usecases/use-case"
import { UserRepository } from "@/users/domain/repositories/user.repository"
import { SearchInput } from "@/shared/application/dtos/search-input"

export namespace ListUserUseCase {

    export type Input = SearchInput

    export type Output = void

    export class UseCase implements DefaultUseCase<Input, Output>  {

        constructor (
            private readonly userRepo: UserRepository.Repository
        ) {}

        async execute(input: Input): Promise<Output> {
            const params = new UserRepository.SearchParams(input)
            const searchResult = await this.userRepo.search(params)
            return
        }
    }
}