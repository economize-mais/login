import { Test, TestingModule } from "@nestjs/testing"
import request from "supertest"

import { applyGlobalConfig } from "@/global-config"
import { EnvConfigModule } from "@/shared/infrastructure/env-config/env-config.module"
import { DatabaseModule } from "@/shared/infrastructure/database/database.module"
import { INestApplication } from "@nestjs/common"
import { PrismaClient } from "@prisma/client"
import { setupPrismaTests } from "@/shared/infrastructure/database/prisma/testing/setup-prisma-tests"
import { UserDataBuilder } from "@/users/domain/testing/helpers/user-data-builder"
import { UserEntity } from "@/users/domain/entities/user.entity"
import { UserRepository } from "@/users/domain/repositories/user.repository"
import { UsersModule } from "../../users.module"

describe("UsersController e2e tests", () => {

    let app: INestApplication
    let module: TestingModule
    let repo: UserRepository.Repository
    let entity: UserEntity

    const prismaService = new PrismaClient()

    beforeAll(async () => {
        setupPrismaTests()

        module = await Test.createTestingModule({
            imports: [
                EnvConfigModule,
                UsersModule,
                DatabaseModule.forTest(prismaService)
            ]
        }).compile()

        app = module.createNestApplication()
        applyGlobalConfig(app)
        await app.init()
        repo = module.get<UserRepository.Repository>("UserRepository")
    })

    beforeEach(async () => {
        await prismaService.user.deleteMany()
        entity = new UserEntity(UserDataBuilder({}))
        await repo.save(entity)
    })

    describe("DELETE /users/:id", () => {

        it("should delete a user", async () => {

            const res = await request(app.getHttpServer())
                .delete(`/users/${entity._id}`)
                .expect(204)
                .expect({})
        })

        it("should return a error with 404 code when throw NotFoundError with invalid id", async () => {
            await request(app.getHttpServer())
                .delete(`/users/fakeid`)
                .expect(404)
                .expect({
                    statusCode: 404,
                    error: "Not Found",
                    message: "UserModel not found using ID fakeid"
                })
        })
    })
})