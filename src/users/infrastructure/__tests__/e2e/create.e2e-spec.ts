import { Test, TestingModule } from "@nestjs/testing"
import request from "supertest"

import { applyGlobalConfig } from "@/global-config"
import { EnvConfigModule } from "@/shared/infrastructure/env-config/env-config.module"
import { DatabaseModule } from "@/shared/infrastructure/database/database.module"
import { INestApplication } from "@nestjs/common"
import { instanceToPlain } from "class-transformer"
import { PrismaClient } from "@prisma/client"
import { setupPrismaTests } from "@/shared/infrastructure/database/prisma/testing/setup-prisma-tests"
import { SignupDto } from "../../dtos/signup.dto"
import { UserRepository } from "@/users/domain/repositories/user.repository"
import { UsersModule } from "../../users.module"
import { UsersController } from "../../users.controller"

describe("UsersController e2e tests", () => {

    let app: INestApplication
    let module: TestingModule
    let repo: UserRepository.Repository
    let signupDto: SignupDto

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
        signupDto = {
            name: "test name",
            email: "a@a.com",
            password: "TestPassword123"
        }

        await prismaService.user.deleteMany()
    })

    describe("POST /users", () => {
        it("should create a user", async () => {
            const res = await request(app.getHttpServer())
                .post("/users")
                .send(signupDto)
                .expect(201)

            expect(Object.keys(res.body)).toStrictEqual(["data"])

            const user = await repo.getById(res.body.data.id)
            const presenter = UsersController.userToResponse(user.toJSON())
            const serialized = instanceToPlain(presenter)

            expect(res.body.data).toStrictEqual(serialized)
        })
    })
})