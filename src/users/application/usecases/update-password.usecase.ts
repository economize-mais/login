import { HashProvider } from "@/shared/application/providers/hash-provider"
import { InvalidPasswordError } from "@/shared/application/errors/invalid-password-error"
import { UseCase as DefaultUseCase } from "@/shared/application/usecases/use-case"
import { UserOutput, UserOutputMapper } from "../dtos/user-output"
import { UserRepository } from "@/users/domain/repositories/user.repository"

export namespace UpdatePasswordUseCase {

    export type Input = {
        id: string
        password: string,
        oldPassword: string
    }

    export type Output = UserOutput

    export class UseCase implements DefaultUseCase<Input, Output>  {

        constructor (
            private hashProvider: HashProvider,
            private readonly userRepo: UserRepository.Repository
        ) {}

        async execute(input: Input): Promise<Output> {
            const entity = await this.userRepo.getById(input.id)

            if(!input.password || !input.oldPassword)
                throw new InvalidPasswordError("Old password and new password is required")

            const checkOldPassword = await this.hashProvider.compareHash(input.oldPassword, entity.password)

            if(!checkOldPassword)
                throw new InvalidPasswordError("Old password does not match")

            const hashPassword = await this.hashProvider.generateHash(input.password)
            entity.updatePassword(hashPassword)
            await this.userRepo.update(entity)
            return UserOutputMapper.toOutput(entity)
        }
    }
}