import { BadRequestError } from "@/shared/application/errors/bad-request-error"
import { BcryptjsHashProvider } from "@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider"
import { ConflictError } from "@/shared/domain/errors/conflict-error"
import { HashProvider } from "@/shared/application/providers/hash-provider"
import { SignupUseCase } from "../../signup.usecase"
import { UserDataBuilder } from "@/users/domain/testing/helpers/user-data-builder"
import { UserInMemoryRepository } from "@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository"

describe("SignupUsecase unit tests", () => {

    let hashProvider: HashProvider
    let repo: UserInMemoryRepository
    let sut: SignupUseCase.UseCase

    beforeEach(() => {
        hashProvider = new BcryptjsHashProvider()
        repo = new UserInMemoryRepository()
        sut = new SignupUseCase.UseCase(hashProvider, repo)
    })

    it("should create a user", async () => {
        const spyInsert = jest.spyOn(repo, "save")
        const props = UserDataBuilder({})
        const result = await sut.execute(props)
        expect(result.id).toBeDefined()
        expect(result.createdAt).toBeInstanceOf(Date)
        expect(spyInsert).toHaveBeenCalledTimes(1)
    })

    it("should not be able to register with same email twice", async () => {
        const props = UserDataBuilder({ email: "a@a.com" })
        await sut.execute(props)
        await expect(() => sut.execute(props)).rejects.toBeInstanceOf(ConflictError)
    })

    it("should throws error when name not provided", async () => {
        const props = Object.assign(UserDataBuilder({}), { name: null })
        await expect(() => sut.execute(props)).rejects.toBeInstanceOf(BadRequestError)
    })

    it("should throws error when email not provided", async () => {
        const props = Object.assign(UserDataBuilder({}), { email: null })
        await expect(() => sut.execute(props)).rejects.toBeInstanceOf(BadRequestError)
    })

    it("should throws error when password not provided", async () => {
        const props = Object.assign(UserDataBuilder({}), { password: null })
        await expect(() => sut.execute(props)).rejects.toBeInstanceOf(BadRequestError)
    })
})