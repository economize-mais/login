import { UserEntity } from "@/users/domain/entities/user.entity"
import { UserInMemoryRepository } from "../../user-in-memory.repository"
import { UserDataBuilder } from "@/users/domain/testing/helpers/user-data-builder"
import { NotFoundError } from "@/shared/domain/errors/not-found-error"
import { ConflictError } from "@/shared/domain/errors/conflict-error"

describe("UserInMemoryRepository unit tests", () => {

    let sut: UserInMemoryRepository

    beforeEach(() => {
        sut = new UserInMemoryRepository()
    })

    it("should throw error when not found - findByEmail method", async () => {
        await expect(sut.getByEmail("a@a.com")).rejects.toThrow(new NotFoundError("User with this email a@a.com not found"))
    })

    it("should find a entity by email - findByEmail method", async () => {
        const entity = new UserEntity(UserDataBuilder({}))
        await sut.save(entity)
        const res = await sut.getByEmail(entity.email)
        expect(entity.toJSON()).toStrictEqual(res.toJSON())
    })

    it("should throw error when not found - emailExists method", async () => {
        const entity = new UserEntity(UserDataBuilder({}))
        await sut.save(entity)
        await expect(sut.emailExists(entity.email)).rejects.toThrow(new ConflictError("User with this email already exists"))
    })

    it("should find a entity by email - emailExists method", async () => {
        expect.assertions(0)
        await sut.emailExists("a@a.com")
    })
})