import { Test, TestingModule } from "@nestjs/testing"
import request from "supertest"

import { applyGlobalConfig } from "@/global-config"
import { BcryptjsHashProvider } from "../../providers/hash-provider/bcryptjs-hash.provider"
import { EnvConfigModule } from "@/shared/infrastructure/env-config/env-config.module"
import { DatabaseModule } from "@/shared/infrastructure/database/database.module"
import { HashProvider } from "@/shared/application/providers/hash-provider"
import { INestApplication } from "@nestjs/common"
import { PrismaClient } from "@prisma/client"
import { setupPrismaTests } from "@/shared/infrastructure/database/prisma/testing/setup-prisma-tests"
import { UpdatePasswordDto } from "../../dtos/update-password.dto"
import { UserDataBuilder } from "@/users/domain/testing/helpers/user-data-builder"
import { UserEntity } from "@/users/domain/entities/user.entity"
import { UserRepository } from "@/users/domain/repositories/user.repository"
import { UsersModule } from "../../users.module"

describe("UsersController e2e tests", () => {

    let app: INestApplication
    let module: TestingModule
    let repo: UserRepository.Repository
    let updatePasswordDto: UpdatePasswordDto
    let hashProvider: HashProvider
    let entity: UserEntity

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
    })

    beforeEach(async () => {
        updatePasswordDto = {
            password: "new_password",
            oldPassword: "old_password"
        }

        await prismaService.user.deleteMany()
        const hashPassword = await hashProvider.generateHash("old_password")
        entity = new UserEntity(UserDataBuilder({
            email: "a@a.com",
            password: hashPassword
        }))
        await repo.save(entity)

        const loginResponse = await request(app.getHttpServer())
            .post("/users/login")
            .send({ email: "a@a.com", password: "old_password" })
            .expect(200)

        accessToken = loginResponse.body.accessToken
    })

    describe("PATCH /users", () => {

        it("should update a password", async () => {

            const res = await request(app.getHttpServer())
                .patch(`/users/${entity._id}`)
                .set("Authorization", `Bearer ${accessToken}`)
                .send(updatePasswordDto)
                .expect(200)

            expect(Object.keys(res.body)).toStrictEqual(["data"])

            const user = await repo.getById(res.body.data.id)
            const checkNewPassword = await hashProvider.compareHash("new_password", user.password)

            expect(checkNewPassword).toBeTruthy()
        })

        it("should return a error with 422 code when the request body is invalid", async () => {
            const res = await request(app.getHttpServer())
                .patch("/users/fakeid")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({})
                .expect(422)

            expect(res.body.error).toBe("Unprocessable Entity")
            expect(res.body.message).toEqual([
                "password should not be empty",
                "password must be a string",
                "oldPassword should not be empty",
                "oldPassword must be a string"
            ])
        })

        it("should return a error with 404 code when throw NotFoundError with invalid id", async () => {
            const res = await request(app.getHttpServer())
                .patch("/users/fakeid")
                .set("Authorization", `Bearer ${accessToken}`)
                .send(updatePasswordDto)
                .expect(404)

            expect(res.body.error).toBe("Not Found")
            expect(res.body.message).toEqual("UserModel not found using ID fakeid")
        })

        it("should return a error with 422 code when the password field is invalid", async () => {
            delete updatePasswordDto.password

            const res = await request(app.getHttpServer())
                .patch(`/users/${entity._id}`)
                .set("Authorization", `Bearer ${accessToken}`)
                .send(updatePasswordDto)
                .expect(422)

            expect(res.body.error).toBe("Unprocessable Entity")
            expect(res.body.message).toEqual([
                "password should not be empty",
                "password must be a string"
            ])
        })

        it("should return a error with 422 code when the oldPassword field is invalid", async () => {
            delete updatePasswordDto.oldPassword

            const res = await request(app.getHttpServer())
                .patch(`/users/${entity._id}`)
                .set("Authorization", `Bearer ${accessToken}`)
                .send(updatePasswordDto)
                .expect(422)

            expect(res.body.error).toBe("Unprocessable Entity")
            expect(res.body.message).toEqual([
                "oldPassword should not be empty",
                "oldPassword must be a string"
            ])
        })

        it("should return a error with 422 code when password does not match", async () => {
            updatePasswordDto.oldPassword = "fake"

            const res = await request(app.getHttpServer())
                .patch(`/users/${entity._id}`)
                .set("Authorization", `Bearer ${accessToken}`)
                .send(updatePasswordDto)
                .expect(422)
                .expect({
                    statusCode: 422,
                    error: 'Unprocessable Entity',
                    message: 'Old password does not match'
                  })
        })

        it("should return a error with 401 code when the request is not authorized", async () => {
            await request(app.getHttpServer())
                .patch(`/users/${entity._id}`)
                .expect(401)
                .expect({
                    statusCode: 401,
                    message: "Unauthorized"
                })
        })
    })
})