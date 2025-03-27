import { UserOutput } from "@/users/application/dtos/user-output"
import { UsersController } from "../../users.controller"
import { SignupUseCase } from "@/users/application/usecases/signup.usecase"
import { SignupDto } from "../../dtos/signup.dto"

describe("UsersController unit tests", () => {

    let sut: UsersController
    let id: string
    let props: UserOutput

    beforeEach(() => {
        sut = new UsersController()
        id = "d42ccf19-b246-4d1e-b64e-c3bdc392bd3f"
        props = {
            id,
            name: "John Doe",
            email: "a@a.com",
            password: "1234",
            createdAt: new Date()
        }
    })

    it("should be defined", () => {
        expect(sut).toBeDefined()
    })

    it("should create a user", async () => {
        const output: SignupUseCase.Output = props
        const mockSingupUseCase = { execute: jest.fn().mockReturnValue(Promise.resolve(output)) }
        sut["signupUseCase"] = mockSingupUseCase as any
        const input: SignupDto = {
            name: "John Doe",
            email: "a@a.com",
            password: "1234"
        }
        const result = await sut.create(input)
        expect(output).toMatchObject(result)
        expect(mockSingupUseCase.execute).toHaveBeenCalledWith(input)
    })
})