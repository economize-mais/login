import { Module } from "@nestjs/common"
import { BcryptjsHashProvider } from "./providers/hash-provider/bcryptjs-hash.provider"
import { DeleteUserUseCase } from "../application/usecases/delete-user.usecase"
import { GetUserUseCase } from "../application/usecases/get-user.usecase"
import { HashProvider } from "@/shared/application/providers/hash-provider"
import { ListUserUseCase } from "../application/usecases/list-user.usecase"
import { SigninUseCase } from "../application/usecases/signin.usecase"
import { SignupUseCase } from "../application/usecases/signup.usecase"
import { UpdatePasswordUseCase } from "../application/usecases/update-password.usecase"
import { UpdateUserUseCase } from "../application/usecases/update-user.usecase"
import { UserInMemoryRepository } from "./database/in-memory/repositories/user-in-memory.repository"
import { UserRepository } from "../domain/repositories/user.repository"
import { UsersController } from "./users.controller"
import { UsersService } from "./users.service"

@Module({
    controllers: [
        UsersController
    ],
    providers: [
        UsersService,
        {
            provide: "UserRepository",
            useClass: UserInMemoryRepository
        },
        {
            provide: "HashProvider",
            useClass: BcryptjsHashProvider
        },
        {
            provide: SignupUseCase.UseCase,
            useFactory: (
                hashProvider: HashProvider,
                userRepository: UserRepository.Repository
            ) => {
                return new SignupUseCase.UseCase(hashProvider, userRepository)
            },
            inject: [
                "UserRepository",
                "HashProvider"
            ]
        },
        {
            provide: SigninUseCase.UseCase,
            useFactory: (
                hashProvider: HashProvider,
                userRepository: UserRepository.Repository
            ) => {
                return new SigninUseCase.UseCase(hashProvider, userRepository)
            },
            inject: [
                "UserRepository",
                "HashProvider"
            ]
        },
        {
            provide: GetUserUseCase.UseCase,
            useFactory: (
                userRepository: UserRepository.Repository
            ) => {
                return new GetUserUseCase.UseCase(userRepository)
            },
            inject: [
                "UserRepository"
            ]
        },
        {
            provide: ListUserUseCase.UseCase,
            useFactory: (
                userRepository: UserRepository.Repository
            ) => {
                return new ListUserUseCase.UseCase(userRepository)
            },
            inject: [
                "UserRepository"
            ]
        },
        {
            provide: UpdateUserUseCase.UseCase,
            useFactory: (
                userRepository: UserRepository.Repository
            ) => {
                return new UpdateUserUseCase.UseCase(userRepository)
            },
            inject: [
                "UserRepository"
            ]
        },
        {
            provide: UpdatePasswordUseCase.UseCase,
            useFactory: (
                hashProvider: HashProvider,
                userRepository: UserRepository.Repository
            ) => {
                return new UpdatePasswordUseCase.UseCase(hashProvider, userRepository)
            },
            inject: [
                "UserRepository",
                "HashProvider"
            ]
        },
        {
            provide: DeleteUserUseCase.UseCase,
            useFactory: (
                userRepository: UserRepository.Repository
            ) => {
                return new DeleteUserUseCase.UseCase(userRepository)
            },
            inject: [
                "UserRepository"
            ]
        }
    ]
})

export class UsersModule {}