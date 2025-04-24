import { JwtModule } from "@nestjs/jwt"
import { Module } from "@nestjs/common"

import { AuthService } from "./auth.service"
import { EnvConfigModule } from "@/shared/infrastructure/env-config/env-config.module"
import { EnvConfigService } from "@/shared/infrastructure/env-config/env-config.service"


@Module({
    imports: [
        EnvConfigModule,
        JwtModule.registerAsync({
            imports: [
                EnvConfigModule
            ],
            useFactory: async (config: EnvConfigService) => ({
                global: true,
                secret: config.getJwtSecret(),
                signOptions: {
                    expiresIn: config.getJwtExpiresInSeconds()
                }
            }),
            inject: [EnvConfigService]
        })
    ],
    providers: [
        AuthService
    ],
    exports: [
        AuthService
    ]
})

export class AuthModule {}