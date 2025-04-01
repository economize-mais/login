import { PrismaClient, User } from "@prisma/client"
import { setupPrismaTests } from "@/shared/infrastructure/database/prisma/testing/setup-prisma-tests"
import { UserEntity } from "@/users/domain/entities/user.entity"
import { UserModelMapper } from "../../user-model.mapper"
import { ValidationError } from "@/shared/domain/errors/validation-error"

describe("UserModelMapper integration tests", () => {
    let prismaService: PrismaClient
    let props: any

    beforeAll(async () => {
        setupPrismaTests()
        prismaService = new PrismaClient()
        await prismaService.$connect()
    })

    beforeEach(async () => {
        await prismaService.user.deleteMany()
        props = {
            id: "d42ccf19-b246-4d1e-b64e-c3bdc392bd3f",
            name: "John Doe",
            email: "a@a.com",
            password: "TestPassword123",
            createdAt: new Date()
        }
    })

    afterAll(async () => {
        await prismaService.$disconnect()
    })

    it("should throws error when user model is invalid", async () => {
        const user: User = Object.assign(props, { name: null })
        expect(() => UserModelMapper.toEntity(user)).toThrowError(ValidationError)
    })

    it("should convert a user model to a user entity", async () => {
        const model: User = await prismaService.user.create({
            data: props
        })
        const sut = UserModelMapper.toEntity(model)
        expect(sut).toBeInstanceOf(UserEntity)
        expect(sut.toJSON()).toStrictEqual(props)
    })
})