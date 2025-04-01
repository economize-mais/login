import { DatabaseModule } from "@/shared/infrastructure/database/database.module"
import { NotFoundError } from "@/shared/domain/errors/not-found-error"
import { PrismaClient } from "@prisma/client"
import { setupPrismaTests } from "@/shared/infrastructure/database/prisma/testing/setup-prisma-tests"
import { Test, TestingModule } from "@nestjs/testing"
import { UserDataBuilder } from "@/users/domain/testing/helpers/user-data-builder"
import { UserEntity } from "@/users/domain/entities/user.entity"
import { UserPrismaRepository } from "../../user-prisma.repository"

describe("UserPrismaRepository integration tests", () => {
    const prismaService =  new PrismaClient()
    let sut: UserPrismaRepository
    let module: TestingModule

    beforeAll(async () => {
        setupPrismaTests()
        module = await Test.createTestingModule({
            imports: [DatabaseModule.forTest(prismaService)]
        }).compile()
    })

    beforeEach(async () => {
        sut = new UserPrismaRepository(prismaService as any)
        await prismaService.user.deleteMany()
    })

    it("should throws error when entity not found", async () => {
        expect(() => sut.getById("fakeId")).rejects.toThrow(
            new NotFoundError("UserModel not found usind ID fakeId")
        )
    })

    it("should finds a entity by id", async () => {
        const entity = new UserEntity(UserDataBuilder({}))
        const newUser = await prismaService.user.create({
            data: entity.toJSON()
        })
        const output = await sut.getById(newUser.id)
        expect(output.toJSON()).toStrictEqual(entity.toJSON())
    })

    it("should insert a new entity", async () => {
        const entity = new UserEntity(UserDataBuilder({}))
        await sut.save(entity)
        const result = await prismaService.user.findUnique({
            where: {
                id: entity._id
            }
        })
        expect(result).toStrictEqual(entity.toJSON())
    })

    it("should returns all users", async () => {
        const entity = new UserEntity(UserDataBuilder({}))
        const newUser = await prismaService.user.create({
            data: entity.toJSON()
        })
        const entities = await sut.getAll()
        expect(entities).toHaveLength(1)
        expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]))
        entities.map(item => expect(item.toJSON()).toStrictEqual(entity.toJSON()))
    })
})