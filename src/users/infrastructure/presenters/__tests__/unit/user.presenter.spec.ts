import { UserPresenter } from "../../user.presenter"

describe("UsersPresenter unit tests", () => {

    const createdAt = new Date()

    let props = {
        id: "d42ccf19-b246-4d1e-b64e-c3bdc392bd3f",
        name: "test name",
        email: "a@a.com",
        password: "fake",
        createdAt
    }

    describe("constuctor", () => {
        it("should be defined", () => {
            const sut = new UserPresenter(props)
            expect(sut.id).toEqual(props.id)
            expect(sut.name).toEqual(props.name)
            expect(sut.email).toEqual(props.email)
            expect(sut.createdAt).toEqual(props.createdAt)
        })
    })
})