import { Module } from "@nestjs/common"
import { BcryptjsHashProvider } from "./providers/hash-provider/bcryptjs-hash.provider"
import { DeleteUserUseCase } from "../application/usecases/delete-user.usecase"
import { GetUserUseCase } from "../application/usecases/get-user.usecase"
import { HashProvider } from "@/shared/application/providers/hash-provider"
import { ListUserUseCase } from "../application/usecases/list-user.usecase"
import { PrismaService } from "@/shared/infrastructure/database/prisma/prisma.service"
import { SigninUseCase } from "../application/usecases/signin.usecase"
import { SignupUseCase } from "../application/usecases/signup.usecase"
import { UpdatePasswordUseCase } from "../application/usecases/update-password.usecase"
import { UpdateUserUseCase } from "../application/usecases/update-user.usecase"
import { UserPrismaRepository } from "./database/prisma/repositories/user-prisma.repository"
import { UserRepository } from "../domain/repositories/user.repository"
import { UsersController } from "./users.controller"

@Module({
    controllers: [
        UsersController
    ],
    providers: [
        {
            provide: "PrismaService",
            useClass: PrismaService
        },
        {
            provide: "UserRepository",
            useFactory: (prismaService: PrismaService) => {
                return new UserPrismaRepository(prismaService)
            },
            inject: [ "PrismaService" ]
        },
        {
            provide: "HashProvider",
            useClass: BcryptjsHashProvider
        },
        {
            provide: SignupUseCase.UseCase,
            useFactory: (
                hashProvider: HashProvider,
                repo: UserRepository.Repository
            ) => {
                return new SignupUseCase.UseCase(hashProvider, repo)
            },
            inject: [
                "HashProvider",
                "UserRepository"
            ]
        },
        {
            provide: SigninUseCase.UseCase,
            useFactory: (
                hashProvider: HashProvider,
                repo: UserRepository.Repository
            ) => {
                return new SigninUseCase.UseCase(hashProvider, repo)
            },
            inject: [
                "HashProvider",
                "UserRepository"
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