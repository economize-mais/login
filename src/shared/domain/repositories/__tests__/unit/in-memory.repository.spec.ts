import { Entity } from "@/shared/domain/entities/entity"
import { InMemoryRepository } from "../../in-memory.repository"
import { NotFoundError } from "@/shared/domain/errors/not-found-error"

type StubEntityProps = {
    name: string
    price: number
}

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemoryRepository extends InMemoryRepository<StubEntity, StubEntityProps> {}

describe("InMemoryRepository unit tests", () => {
    let sut: StubInMemoryRepository

    beforeEach(() => {
        sut = new StubInMemoryRepository()
    })

    it("should save an entity", async () => {
        const entity = new StubEntity({ name: "product", price: 10 })
        await sut.save(entity)
        expect(entity.toJSON()).toStrictEqual(sut.items[0].toJSON())
    })

    it("should throw error when entity not found", async () => {
        await expect(sut.getById("fakeId")).rejects.toThrow(new NotFoundError("Entity not found"))
    })

    it("should find a entity by id", async () => {
        const entity = new StubEntity({ name: "product", price: 10 })
        await sut.save(entity)
        const result = await sut.getById(entity.id)
        expect(entity.toJSON()).toStrictEqual(result.toJSON())
    })
})