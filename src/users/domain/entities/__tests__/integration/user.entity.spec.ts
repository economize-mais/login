import { EntityValidationError } from "@/shared/domain/errors/validation-error"
import { UserDataBuilder } from "@/users/domain/testing/helpers/user-data-builder"
import { UserEntity } from "../../user.entity"

describe("UserEntity integration tests", () => {
    describe("Constuctor method", () => {
        it("Should throw an error when creation a user with invalid name", () => {
            let props = { ...UserDataBuilder({}), name: null }
            expect(() => new UserEntity(props)).toThrow(EntityValidationError)

            props = { ...UserDataBuilder({}), name: "" }
            expect(() => new UserEntity(props)).toThrow(EntityValidationError)

            props = { ...UserDataBuilder({}), name: "a".repeat(256) }
            expect(() => new UserEntity(props)).toThrow(EntityValidationError)

            props = { ...UserDataBuilder({}), name: 10 as any }
            expect(() => new UserEntity(props)).toThrow(EntityValidationError)
        })

        it("Should throw an error when creation a user with invalid email", () => {
            let props = { ...UserDataBuilder({}), email: null }
            expect(() => new UserEntity(props)).toThrow(EntityValidationError)

            props = { ...UserDataBuilder({}), email: "" }
            expect(() => new UserEntity(props)).toThrow(EntityValidationError)

            props = { ...UserDataBuilder({}), email: "a".repeat(256) }
            expect(() => new UserEntity(props)).toThrow(EntityValidationError)

            props = { ...UserDataBuilder({}), email: 10 as any }
            expect(() => new UserEntity(props)).toThrow(EntityValidationError)
        })

        it("Should throw an error when creation a user with invalid password", () => {
            let props = { ...UserDataBuilder({}), password: null }
            expect(() => new UserEntity(props)).toThrow(EntityValidationError)

            props = { ...UserDataBuilder({}), password: "" }
            expect(() => new UserEntity(props)).toThrow(EntityValidationError)

            props = { ...UserDataBuilder({}), password: "a".repeat(101) }
            expect(() => new UserEntity(props)).toThrow(EntityValidationError)

            props = { ...UserDataBuilder({}), password: 10 as any }
            expect(() => new UserEntity(props)).toThrow(EntityValidationError)
        })

        it("Should throw an error when creation a user with invalid createdAt", () => {
            let props = { ...UserDataBuilder({}), createdAt: "05-03-2025" as any }
            expect(() => new UserEntity(props)).toThrow(EntityValidationError)

            props = { ...UserDataBuilder({}), createdAt: 10 as any }
            expect(() => new UserEntity(props)).toThrow(EntityValidationError)
        })

        it("Should a valid user", () => {
            expect.assertions(0)
            const props = UserDataBuilder({})
            new UserEntity(props)
        })
    })

    describe("Update name method", () => {
        it("Should a invalid user using name field", () => {
            const entity = new UserEntity(UserDataBuilder({}))
            expect(() => entity.updateName(null)).toThrow(EntityValidationError)
            expect(() => entity.updateName("")).toThrow(EntityValidationError)
            expect(() => entity.updateName("a".repeat(256))).toThrow(EntityValidationError)
            expect(() => entity.updateName(10 as any)).toThrow(EntityValidationError)
        })

        it("Should a valid update name", () => {
            expect.assertions(0)
            const props = UserDataBuilder({})
            const entity = new UserEntity(props)
            entity.updateName("new name")
        })
    })

    describe("Update password method", () => {
        it("Should a invalid user using password field", () => {
            const entity = new UserEntity(UserDataBuilder({}))
            expect(() => entity.updatePassword(null)).toThrow(EntityValidationError)
            expect(() => entity.updatePassword("")).toThrow(EntityValidationError)
            expect(() => entity.updatePassword("a".repeat(101))).toThrow(EntityValidationError)
            expect(() => entity.updatePassword(10 as any)).toThrow(EntityValidationError)
        })

        it("Should a valid update password", () => {
            expect.assertions(0)
            const props = UserDataBuilder({})
            const entity = new UserEntity(props)
            entity.updatePassword("new password")
        })
    })
})