import { PrismaClient } from "@prisma/client"
import { Test, TestingModule } from "@nestjs/testing"
import { BcryptjsHashProvider } from "@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider"
import { DatabaseModule } from "@/shared/infrastructure/database/database.module"
import { HashProvider } from "@/shared/application/providers/hash-provider"
import { setupPrismaTests } from "@/shared/infrastructure/database/prisma/testing/setup-prisma-tests"
import { SignupUseCase } from "../../signup.usecase"
import { UserPrismaRepository } from "@/users/infrastructure/database/prisma/repositories/user-prisma.repository"

describe("SignupUseCase integration tests", () => {
    const prismaService =  new PrismaClient()
    let sut: SignupUseCase.UseCase
    let repository: UserPrismaRepository
    let module: TestingModule
    let hashProvider: HashProvider

    beforeAll(async () => {
        setupPrismaTests()
        module = await Test.createTestingModule({
            imports: [DatabaseModule.forTest(prismaService)]
        }).compile()

        repository = new UserPrismaRepository(prismaService as any)
        hashProvider = new BcryptjsHashProvider()
    })

    beforeEach(async () => {
        sut = new SignupUseCase.UseCase(hashProvider, repository)
        await prismaService.user.deleteMany()
    })

    afterAll(async () => {
        await module.close()
    })

    it("should create a user", async () => {
        const props = {
            name: "John Doe",
            email: "a@a.com",
            password: "TestPassword123"
        }
        const output = await sut.execute(props)
        expect(output.id).toBeDefined()
        expect(output.createdAt).toBeInstanceOf(Date)
    })
})