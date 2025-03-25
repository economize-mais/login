import { BadRequestError } from "@/shared/application/errors/bad-request-error"
import { HashProvider } from "@/shared/application/providers/hash-provider"
import { InvalidCredentialsError } from "@/shared/application/errors/invalid-credentials-error"
import { UseCase as DefaultUseCase } from "@/shared/application/usecases/use-case"
import { UserOutput, UserOutputMapper } from "../dtos/user-output"
import { UserRepository } from "@/users/domain/repositories/user.repository"

export namespace SigninUseCase {

    export type Input = {
        email: string
        password: string
    }

    export type Output = UserOutput

    export class UseCase implements DefaultUseCase<Input, Output> {

        constructor (
            private readonly hashProvider: HashProvider,
            private readonly userRepo: UserRepository.Repository
        ) {}

        async execute(input: Input): Promise<Output> {

            const { email, password} = input

            if(!email || !password)
                throw new BadRequestError("Input data not provided")

            const entity = await this.userRepo.getByEmail(email)

            const hashPasswordMatch = await this.hashProvider.compareHash(password, entity.password)

            if(!hashPasswordMatch)
                throw new InvalidCredentialsError("Invalid credentials")

            return UserOutputMapper.toOutput(entity)
        }
    }
}