import { BadRequestError } from "../errors/bad-request-error"
import { UserRepository } from "@/users/domain/repositories/user.repository"
import { UserEntity } from "@/users/domain/entities/user.entity"

export namespace SignupUseCase {

    export type Input = {
        name: string
        email: string
        password: string
    }

    export type Output = {
        id: string
        name: string
        email: string
        password: string
        createdAt: Date
    }

    export class UseCase  {

        constructor(
            private readonly userRepo: UserRepository.Repository
        ) {}

        async execute(input: Input): Promise<Output> {

            const { name, email, password} = input

            if(!name || !email || !password)
                throw new BadRequestError("Input data not provided")

            await this.userRepo.emailExists(email)

            const entity = new UserEntity(input)
            await this.userRepo.save(entity)

            return entity.toJSON()
        }
    }
}