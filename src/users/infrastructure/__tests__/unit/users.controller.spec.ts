import { GetUserUseCase } from "@/users/application/usecases/get-user.usecase"
import { ListUserUseCase } from "@/users/application/usecases/list-user.usecase"
import { SigninDto } from "../../dtos/signin.dto"
import { SigninUseCase } from "@/users/application/usecases/signin.usecase"
import { SignupDto } from "../../dtos/signup.dto"
import { SignupUseCase } from "@/users/application/usecases/signup.usecase"
import { UpdatePasswordDto } from "../../dtos/update-password.dto"
import { UpdatePasswordUseCase } from "@/users/application/usecases/update-password.usecase"
import { UpdateUserDto } from "../../dtos/update-user.dto"
import { UpdateUserUseCase } from "@/users/application/usecases/update-user.usecase"
import { UsersController } from "../../users.controller"
import { UserOutput } from "@/users/application/dtos/user-output"

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
        const mockSignupUseCase = { execute: jest.fn().mockReturnValue(Promise.resolve(output)) }
        sut["signupUseCase"] = mockSignupUseCase as any
        const input: SignupDto = {
            name: "John Doe",
            email: "a@a.com",
            password: "1234"
        }
        const result = await sut.create(input)
        expect(output).toMatchObject(result)
        expect(mockSignupUseCase.execute).toHaveBeenCalledWith(input)
    })

    it("should authenticate a user", async () => {
        const output: SigninUseCase.Output = props
        const mockSigninUseCase = { execute: jest.fn().mockReturnValue(Promise.resolve(output)) }
        sut["signinUseCase"] = mockSigninUseCase as any
        const input: SigninDto = {
            email: "a@a.com",
            password: "1234"
        }
        const result = await sut.login(input)
        expect(output).toMatchObject(result)
        expect(mockSigninUseCase.execute).toHaveBeenCalledWith(input)
    })

    it("should update a user", async () => {
        const output: UpdateUserUseCase.Output = props
        const mockUpdateUserUseCase = { execute: jest.fn().mockReturnValue(Promise.resolve(output)) }
        sut["updateUserUseCase"] = mockUpdateUserUseCase as any
        const input: UpdateUserDto = {
            name: "new name"
        }
        const result = await sut.update(id, input)
        expect(output).toMatchObject(result)
        expect(mockUpdateUserUseCase.execute).toHaveBeenCalledWith({ id, ...input })
    })

    it("should update password a user", async () => {
        const output: UpdatePasswordUseCase.Output = props
        const mockUpdatePasswordUseCase = { execute: jest.fn().mockReturnValue(Promise.resolve(output)) }
        sut["updatePasswordUseCase"] = mockUpdatePasswordUseCase as any
        const input: UpdatePasswordDto = {
            password: "new password",
            oldPassword: "old password"
        }
        const result = await sut.updatePassword(id, input)
        expect(output).toMatchObject(result)
        expect(mockUpdatePasswordUseCase.execute).toHaveBeenCalledWith({ id, ...input })
    })

    it("should delete a user", async () => {
        const output = undefined
        const mockDeleteUserUseCase = { execute: jest.fn().mockReturnValue(Promise.resolve(output)) }
        sut["deleteUserUseCase"] = mockDeleteUserUseCase as any

        const result = await sut.remove(id)
        expect(output).toStrictEqual(result)
        expect(mockDeleteUserUseCase.execute).toHaveBeenCalledWith({ id })
    })

    it("should gets a user", async () => {
        const output: GetUserUseCase.Output = props
        const mockGetUserUseCase = { execute: jest.fn().mockReturnValue(Promise.resolve(output)) }
        sut["getUserUseCase"] = mockGetUserUseCase as any

        const result = await sut.findOne(id)
        expect(output).toStrictEqual(result)
        expect(mockGetUserUseCase.execute).toHaveBeenCalledWith({ id })
    })

    it("should list users", async () => {
        const output: ListUserUseCase.Output = {
            items: [props],
            currentPage: 1,
            lastPage: 1,
            perPage: 10,
            total: 1
        }
        const mockListUsersUseCase = { execute: jest.fn().mockReturnValue(Promise.resolve(output)) }
        sut["listUserUseCase"] = mockListUsersUseCase as any
        const searchParams = {
            page: 1,
            perPage: 1
        }
        const result = await sut.search(searchParams)
        expect(output).toStrictEqual(result)
        expect(mockListUsersUseCase.execute).toHaveBeenCalledWith(searchParams)
    })
})