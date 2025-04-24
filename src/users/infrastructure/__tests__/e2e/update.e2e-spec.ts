import { Test, TestingModule } from "@nestjs/testing"
import request from "supertest"

import { applyGlobalConfig } from "@/global-config"
import { BcryptjsHashProvider } from "../../providers/hash-provider/bcryptjs-hash.provider"
import { EnvConfigModule } from "@/shared/infrastructure/env-config/env-config.module"
import { DatabaseModule } from "@/shared/infrastructure/database/database.module"
import { HashProvider } from "@/shared/application/providers/hash-provider"
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

    let hashProvider: HashProvider
    let hashPassword: string
    let accessToken: string

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

        hashProvider = new BcryptjsHashProvider()
        hashPassword = await hashProvider.generateHash("1234")
    })

    beforeEach(async () => {
        updateUserDto = {
            name: "test name"
        }

        await prismaService.user.deleteMany()
        entity = new UserEntity(UserDataBuilder({
            email: "a@a.com",
            password: hashPassword
        }))
        await repo.save(entity)

        const loginResponse = await request(app.getHttpServer())
            .post("/users/login")
            .send({ email: "a@a.com", password: "1234" })
            .expect(200)

        accessToken = loginResponse.body.accessToken
    })

    describe("PUT /users/:id", () => {

        it("should update a user", async () => {

            updateUserDto.name = "new name"

            const res = await request(app.getHttpServer())
                .put(`/users/${entity._id}`)
                .set("Authorization", `Bearer ${accessToken}`)
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
                .set("Authorization", `Bearer ${accessToken}`)
                .send({})
                .expect(422)

            expect(res.body.error).toBe("Unprocessable Entity")
            expect(res.body.message).toEqual([
                "name should not be empty",
                "name must be a string"
            ])
        })

        it("should return a error with 404 code when throw NotFoundError with invalid id", async () => {
            await request(app.getHttpServer())
                .put(`/users/fakeid`)
                .set("Authorization", `Bearer ${accessToken}`)
                .send(updateUserDto)
                .expect(404)
                .expect({
                    statusCode: 404,
                    error: "Not Found",
                    message: "UserModel not found using ID fakeid"
                })
        })

        it("should return a error with 401 code when the request is not authorized", async () => {
            await request(app.getHttpServer())
                .put(`/users/fakeid`)
                .expect(401)
                .expect({
                    statusCode: 401,
                    message: "Unauthorized"
                })
        })
    })
})