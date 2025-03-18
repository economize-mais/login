import { UserOutput } from "../dtos/user-output"
import { UserRepository } from "@/users/domain/repositories/user.repository"

export namespace GetUserUseCase {

    export type Input = {
        id: string
    }

    export type Output = UserOutput

    export class UseCase  {

        constructor (
            private readonly userRepo: UserRepository.Repository
        ) {}

        async execute(input: Input): Promise<Output> {
            const entity = await this.userRepo.getById(input.id)
            return entity.toJSON()
        }
    }
}