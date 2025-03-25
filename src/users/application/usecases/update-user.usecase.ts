import { BadRequestError } from "@/shared/application/errors/bad-request-error"
import { UseCase as DefaultUseCase } from "@/shared/application/usecases/use-case"
import { UserOutput, UserOutputMapper } from "../dtos/user-output"
import { UserRepository } from "@/users/domain/repositories/user.repository"

export namespace UpdateUserUseCase {

    export type Input = {
        id: string
        name: string
    }

    export type Output = UserOutput

    export class UseCase implements DefaultUseCase<Input, Output>  {

        constructor (
            private readonly userRepo: UserRepository.Repository
        ) {}

        async execute(input: Input): Promise<Output> {
            if(!input.name)
                throw new BadRequestError("Name not provided")

            const entity = await this.userRepo.getById(input.id)
            entity.updateName(input.name)
            await this.userRepo.update(entity)
            return UserOutputMapper.toOutput(entity)
        }
    }
}