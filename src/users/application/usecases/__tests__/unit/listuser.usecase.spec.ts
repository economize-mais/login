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

    it("should return the users ordered by createdAt", async () => {

        const createdAt = new Date()
        const items = [
            new UserEntity(UserDataBuilder({ createdAt })),
            new UserEntity(UserDataBuilder({ createdAt: new Date(createdAt.getTime() + 1) }))
        ]

        repo.items = items

        let output = await sut.execute({})

        expect(output).toStrictEqual({
            items: [ ...items ].reverse().map(item => item.toJSON()),
            total: 2,
            currentPage: 1,
            lastPage: 1,
            perPage: 15
        })
    })

    it("should return the users using pagination, sort and filter", async () => {

        const items = [
            new UserEntity(UserDataBuilder({ name: "a" })),
            new UserEntity(UserDataBuilder({ name: "AA" })),
            new UserEntity(UserDataBuilder({ name: "Aa" })),
            new UserEntity(UserDataBuilder({ name: "b" })),
            new UserEntity(UserDataBuilder({ name: "c" }))
        ]

        repo.items = items

        let output = await sut.execute({
            page: 1,
            perPage: 2,
            sort: {
                by: "name",
                direction: "asc"
            },
            filter: "a"
        })

        expect(output).toStrictEqual({
            items: [
                items[1].toJSON(),
                items[2].toJSON()
            ],
            total: 3,
            currentPage: 1,
            lastPage: 2,
            perPage: 2
        })
    })
})