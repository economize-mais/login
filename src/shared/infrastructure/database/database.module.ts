import { ConfigService } from "@nestjs/config"
import { DynamicModule, Global, Module } from "@nestjs/common"
import { EnvConfigModule } from "../env-config/env-config.module"
import { PrismaClient } from "@prisma/client"
import { PrismaService } from "./prisma/prisma.service"

@Global()
@Module({
    imports: [
        EnvConfigModule.forRoot()
    ],
    providers: [
        ConfigService,
        PrismaService
    ],
    exports: [
        PrismaService
    ]
})

export class DatabaseModule {
    static forTest(prismaClient: PrismaClient): DynamicModule {
        return {
            module: DatabaseModule,
            providers: [
                {
                    provide: PrismaService,
                    useFactory: () => prismaClient as PrismaService
                }
            ]
        }
    }
}