import { instanceToPlain } from "class-transformer"
import { UserPresenter } from "../../user.presenter"

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