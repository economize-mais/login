import { instanceToPlain } from "class-transformer"
import { UserCollectionPresenter, UserPresenter } from "../../user.presenter"
import { PaginationPresenter } from "@/shared/infrastructure/presenters/pagination.presenter"

describe("UsersPresenter unit tests", () => {

    const createdAt = new Date()
    let sut: UserPresenter

    let props = {
        id: "d42ccf19-b246-4d1e-b64e-c3bdc392bd3f",
        name: "test name",
        email: "a@a.com",
        password: "fake",
        createdAt
    }

    beforeEach(() => {
        sut = new UserPresenter(props)
    })

    describe("constuctor", () => {
        it("should set values", () => {
            expect(sut.id).toEqual(props.id)
            expect(sut.name).toEqual(props.name)
            expect(sut.email).toEqual(props.email)
            expect(sut.createdAt).toEqual(props.createdAt)
        })
    })

    it("should presenter data", () => {
        const output = instanceToPlain(sut)
        expect(output).toStrictEqual({
            id: "d42ccf19-b246-4d1e-b64e-c3bdc392bd3f",
            name: "test name",
            email: "a@a.com",
            createdAt: createdAt.toISOString()
        })
    })
})

describe("UsersCollectionPresenter unit tests", () => {

    const createdAt = new Date()

    let props = {
        id: "d42ccf19-b246-4d1e-b64e-c3bdc392bd3f",
        name: "test name",
        email: "a@a.com",
        password: "fake",
        createdAt
    }

    describe("constuctor", () => {
        it("should set values", () => {
            const sut = new UserCollectionPresenter({
                items: [props],
                currentPage: 1,
                perPage: 2,
                lastPage: 1,
                total: 1
            })
            expect(sut.meta).toBeInstanceOf(PaginationPresenter)
            expect(sut.meta).toStrictEqual(
                new PaginationPresenter({
                    currentPage: 1,
                    perPage: 2,
                    lastPage: 1,
                    total: 1
                })
            )
            expect(sut.data).toStrictEqual(
                [new UserPresenter(props)]
            )
        })
    })

    it("should presenter data", () => {
        let sut = new UserCollectionPresenter({
            items: [props],
            currentPage: 1,
            perPage: 2,
            lastPage: 1,
            total: 1
        })
        let output = instanceToPlain(sut)
        expect(output).toStrictEqual({
            data: [
                {
                    id: "d42ccf19-b246-4d1e-b64e-c3bdc392bd3f",
                    name: "test name",
                    email: "a@a.com",
                    createdAt: createdAt.toISOString()
                }
            ],
            meta: {
                currentPage: 1,
                perPage: 2,
                lastPage: 1,
                total: 1
            }
        })

        sut = new UserCollectionPresenter({
            items: [props],
            currentPage: "1" as any,
            perPage: "2" as any,
            lastPage: "1" as any,
            total: "1" as any
        })
        output = instanceToPlain(sut)
        expect(output).toStrictEqual({
            data: [
                {
                    id: "d42ccf19-b246-4d1e-b64e-c3bdc392bd3f",
                    name: "test name",
                    email: "a@a.com",
                    createdAt: createdAt.toISOString()
                }
            ],
            meta: {
                currentPage: 1,
                perPage: 2,
                lastPage: 1,
                total: 1
            }
        })
    })
})