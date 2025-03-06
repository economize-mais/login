import { Entity } from "@/shared/domain/entities/entity"
import { InMemoryRepository } from "../../in-memory.repository"

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
        expect(entity.toJSON()).toEqual(sut.items[0].toJSON())
    })
})