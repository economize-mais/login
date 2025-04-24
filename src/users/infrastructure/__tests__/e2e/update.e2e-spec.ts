import { Test, TestingModule } from "@nestjs/testing"
import request from "supertest"

import { applyGlobalConfig } from "@/global-config"
import { EnvConfigModule } from "@/shared/infrastructure/env-config/env-config.module"
import { DatabaseModule } from "@/shared/infrastructure/database/database.module"
import { INestApplication } from "@nestjs/common"
import { instanceToPlain } from "class-transformer"
import { PrismaClient } from "@prisma/client"
import { setupPrismaTests } from "@/shared/infrastructure/database/prisma/testing/setup-prisma-tests"
import { UpdateUserDto } from "../../dtos/update-user.dto"
import { UserDataBuilder } from "@/users/domain/testing/helpers/user-data-builder"
import { UserEntity } from "@/users/domain/entities/user.entity"
import { UserRepository } from "@/users/domain/repositories/user.repository"
import { UsersModule } from "../../users.module"
import { UsersController } from "../../users.controller"

describe("UsersController e2e tests", () => {

    let app: INestApplication
    let module: TestingModule
    let repo: UserRepository.Repository
    let updateUserDto: UpdateUserDto
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
        updateUserDto = {
            name: "test name"
        }

        await prismaService.user.deleteMany()
        entity = new UserEntity(UserDataBuilder({}))
        await repo.save(entity)
    })

    describe("PUT /users/:id", () => {

        it("should update a user", async () => {

            updateUserDto.name = "new name"

            const res = await request(app.getHttpServer())
                .put(`/users/${entity._id}`)
                .send(updateUserDto)
                .expect(200)

            const user = await repo.getById(entity._id)
            const presenter = UsersController.userToResponse(user.toJSON())
            const serialized = instanceToPlain(presenter)

            expect(res.body.data).toStrictEqual(serialized)
        })

        it("should return a error with 422 code when the request body is invalid", async () => {
            const res = await request(app.getHttpServer())
                .put(`/users/${entity._id}`)
                .send({})
                .expect(422)

            expect(res.body.error).toBe("Unprocessable Entity")
            expect(res.body.message).toEqual([
                "name should not be empty",
                "name must be a string"
            ])
        })
    })
})