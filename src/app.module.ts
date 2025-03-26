import { Module } from "@nestjs/common"
import { BcryptjsHashProvider } from "./users/infrastructure/providers/hash-provider/bcryptjs-hash.provider"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { EnvConfigModule } from "./shared/infrastructure/env-config/env-config.module"
import { HashProvider } from "./shared/application/providers/hash-provider"
import { SigninUseCase } from "./users/application/usecases/signin.usecase"
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
            provide: SigninUseCase.UseCase,
            useFactory: (
                hashProvider: HashProvider,
                userRepository: UserRepository.Repository
            ) => {
                return new SigninUseCase.UseCase(hashProvider, userRepository)
            },
            inject: ["UserRepository", "HashProvider"]
        }
    ]
})

export class AppModule {}