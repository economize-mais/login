import { BadRequestError } from "@/shared/application/errors/bad-request-error"
import { NotFoundError } from "@/shared/domain/errors/not-found-error"
import { UpdateUserUseCase } from "../../update-user.usecase"
import { UserDataBuilder } from "@/users/domain/testing/helpers/user-data-builder"
import { UserEntity } from "@/users/domain/entities/user.entity"
import { UserInMemoryRepository } from "@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository"

describe("UpdateUserUseCase unit tests", () => {

    let repo: UserInMemoryRepository
    let sut: UpdateUserUseCase.UseCase

    beforeEach(() => {
        repo = new UserInMemoryRepository()
        sut = new UpdateUserUseCase.UseCase(repo)
    })

    it("should throws error when entity not found", async () => {
        await expect(() => sut.execute({ id: "fakeId", name: "test name" })).rejects.toThrow(new NotFoundError("Entity not found"))
    })

    it("should throws error when name not provided", async () => {
        await expect(() => sut.execute({ id: "fakeId", name: "" })).rejects.toThrow(new BadRequestError("Name not provided"))
    })

    it("should update a user", async () => {
        const spyGetById = jest.spyOn(repo, "update")

        const items = [
            new UserEntity(UserDataBuilder({}))
        ]
        repo.items = items

        const res = await sut.execute({ id: items[0]._id, name: "new name" })

        expect(spyGetById).toHaveBeenCalledTimes(1)

        expect(res).toMatchObject({
            id: items[0].id,
            name: "new name",
            email: items[0].email,
            password: items[0].password,
            createdAt: items[0].createdAt
        })
    })
})