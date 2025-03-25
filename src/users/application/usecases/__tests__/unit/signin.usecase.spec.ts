import { BadRequestError } from "@/shared/application/errors/bad-request-error"
import { BcryptjsHashProvider } from "@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider"
import { HashProvider } from "@/shared/application/providers/hash-provider"
import { InvalidCredentialsError } from "@/shared/application/errors/invalid-credentials-error"
import { NotFoundError } from "@/shared/domain/errors/not-found-error"
import { SigninUseCase } from "../../signin.usecase"
import { UserDataBuilder } from "@/users/domain/testing/helpers/user-data-builder"
import { UserEntity } from "@/users/domain/entities/user.entity"
import { UserInMemoryRepository } from "@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository"

describe("SigninUsecase unit tests", () => {

    let hashProvider: HashProvider
    let repo: UserInMemoryRepository
    let sut: SigninUseCase.UseCase

    beforeEach(() => {
        hashProvider = new BcryptjsHashProvider()
        repo = new UserInMemoryRepository()
        sut = new SigninUseCase.UseCase(hashProvider, repo)
    })

    it("should authenticate a user", async () => {

        const spyGetByEmail = jest.spyOn(repo, "getByEmail")

        const hashPasswor = await hashProvider.generateHash("1234")

        const entity = new UserEntity(UserDataBuilder({ email: "a@a.com", password: hashPasswor }))
        repo.items = [entity]

        const result = await sut.execute({
            email: entity.email,
            password: "1234"
        })

        expect(spyGetByEmail).toHaveBeenCalledTimes(1)
        expect(result).toStrictEqual(entity.toJSON())
    })

    it("should throws error when email not provided", async () => {
        const props = { email: null, password: "1234" }
        await expect(() => sut.execute(props)).rejects.toBeInstanceOf(BadRequestError)
    })

    it("should throws error when password not provided", async () => {
        const props = { email: "a@a.com", password: null }
        await expect(() => sut.execute(props)).rejects.toBeInstanceOf(BadRequestError)
    })

    it("should not be able to authenticate with wrong email", async () => {
        const props = { email: "a@a.com", password: "1234" }
        await expect(() => sut.execute(props)).rejects.toBeInstanceOf(NotFoundError)
    })

    it("should not be able to authenticate with wrong password", async () => {
        const hashPasswor = await hashProvider.generateHash("1234")

        const entity = new UserEntity(UserDataBuilder({ email: "a@a.com", password: hashPasswor }))
        repo.items = [entity]

        const props = { email: "a@a.com", password: "fake" }
        await expect(() => sut.execute(props)).rejects.toBeInstanceOf(InvalidCredentialsError)
    })
})