import { DeleteUserUseCase } from "../../delete-user.usecase"
import { NotFoundError } from "@/shared/domain/errors/not-found-error"
import { UserDataBuilder } from "@/users/domain/testing/helpers/user-data-builder"
import { UserEntity } from "@/users/domain/entities/user.entity"
import { UserInMemoryRepository } from "@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository"

describe("DeleteUserUseCase unit tests", () => {

    let repo: UserInMemoryRepository
    let sut: DeleteUserUseCase.UseCase

    beforeEach(() => {
        repo = new UserInMemoryRepository()
        sut = new DeleteUserUseCase.UseCase(repo)
    })

    it("should throws error when entity not found", async () => {
        await expect(() => sut.execute({ id: "fakeId" })).rejects.toThrow(new NotFoundError("Entity not found"))
    })

    it("should delete a user", async () => {
        const spyDelete = jest.spyOn(repo, "delete")

        const items = [
            new UserEntity(UserDataBuilder({}))
        ]

        repo.items = items

        expect(repo.items).toHaveLength(1)
        await sut.execute({ id: items[0]._id })

        expect(spyDelete).toHaveBeenCalledTimes(1)
        expect(repo.items).toHaveLength(0)
    })
})