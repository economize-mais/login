import { NotFoundError } from "@/shared/domain/errors/not-found-error"
import { GetUserUseCase } from "../../get-user.usecase"
import { UserInMemoryRepository } from "@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository"
import { UserEntity } from "@/users/domain/entities/user.entity"
import { UserDataBuilder } from "@/users/domain/testing/helpers/user-data-builder"

describe("GetUserUseCase unit tests", () => {

    let repo: UserInMemoryRepository
    let sut: GetUserUseCase.UseCase

    beforeEach(() => {
        repo = new UserInMemoryRepository()
        sut = new GetUserUseCase.UseCase(repo)
    })

    it("should throws error when entity not found", async () => {
        await expect(() => sut.execute({ id: "fakeId" })).rejects.toThrow(new NotFoundError("Entity not found"))
    })

    it("should be able to get user profile", async () => {
        const spyGetById = jest.spyOn(repo, "getById")

        const items = [
            new UserEntity(UserDataBuilder({}))
        ]
        repo.items = items

        const res = await sut.execute({ id: items[0]._id })

        expect(spyGetById).toHaveBeenCalledTimes(1)
        expect(res).toMatchObject({
            id: items[0].id,
            name: items[0].name,
            email: items[0].email,
            password: items[0].password,
            createdAt: items[0].createdAt
        })
    })
})