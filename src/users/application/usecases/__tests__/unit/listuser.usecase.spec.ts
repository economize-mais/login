import { ListUserUseCase } from "../../listuser.usecase"
import { UserInMemoryRepository } from "@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository"
import { UserRepository } from "@/users/domain/repositories/user.repository"
import { UserEntity } from "@/users/domain/entities/user.entity"
import { UserDataBuilder } from "@/users/domain/testing/helpers/user-data-builder"

describe("ListUserUseCase unit tests", () => {

    let repo: UserInMemoryRepository
    let sut: ListUserUseCase.UseCase

    beforeEach(() => {
        repo = new UserInMemoryRepository()
        sut = new ListUserUseCase.UseCase(repo)
    })

    it("toOutput method", () => {
        let result = new UserRepository.SearcResult({
            items: [],
            total: 1,
            currentPage: 1,
            perPage: 2,
            sort: null,
            filter: null
        })

        let output = sut["toOutput"](result)
        expect(output).toStrictEqual({
            items: [],
            total: 1,
            currentPage: 1,
            lastPage: 1,
            perPage: 2
        })

        const entity = new UserEntity(UserDataBuilder({}))

        result = new UserRepository.SearcResult({
            items: [entity],
            total: 1,
            currentPage: 1,
            perPage: 2,
            sort: null,
            filter: null
        })

        output = sut["toOutput"](result)
        expect(output).toStrictEqual({
            items: [entity.toJSON()],
            total: 1,
            currentPage: 1,
            lastPage: 1,
            perPage: 2
        })
    })
})