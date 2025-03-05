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
    })
})