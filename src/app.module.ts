import { Module } from "@nestjs/common"
import { DeleteUserUseCase } from "./users/application/usecases/delete-user.usecase"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { BcryptjsHashProvider } from "./users/infrastructure/providers/hash-provider/bcryptjs-hash.provider"
import { EnvConfigModule } from "./shared/infrastructure/env-config/env-config.module"
import { GetUserUseCase } from "./users/application/usecases/get-user.usecase"
import { HashProvider } from "./shared/application/providers/hash-provider"
import { ListUserUseCase } from "./users/application/usecases/list-user.usecase"
import { SigninUseCase } from "./users/application/usecases/signin.usecase"
import { SignupUseCase } from "./users/application/usecases/signup.usecase"
import { UpdatePasswordUseCase } from "./users/application/usecases/update-password.usecase"
import { UpdateUserUseCase } from "./users/application/usecases/update-user.usecase"
import { UserInMemoryRepository } from "./users/infrastructure/database/in-memory/repositories/user-in-memory.repository"
import { UserRepository } from "./users/domain/repositories/user.repository"
import { UsersModule } from "./users/infrastructure/users.module"

@Module({
    imports: [
        EnvConfigModule,
        UsersModule
    ],
    controllers: [
        AppController
    ],
    providers: [
        AppService,
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

export class AppModule {}