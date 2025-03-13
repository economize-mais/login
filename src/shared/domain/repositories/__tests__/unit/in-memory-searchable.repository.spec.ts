import { Entity } from "@/shared/domain/entities/entity"
import { InMemorySearchableRepository } from "../../in-memory-searchable.repository"

type StubEntityProps = {
    name: string
    price: number
}

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemorySearchableRepository extends InMemorySearchableRepository<StubEntity, StubEntityProps> {
    sortableFields: string[] = ["name"]

    protected async applyFilter(items: StubEntity[], filter: string | null): Promise<StubEntity[]> {
        if(!filter)
            return items

        return items.filter(item => {
            return item.props.name.toLowerCase().includes(filter.toLowerCase())
        })
    }
}

describe("InMemoryRepository unit tests", () => {
    let sut: StubInMemorySearchableRepository

    beforeEach(() => {
        sut = new StubInMemorySearchableRepository()
    })

    describe("applyFilter method", () => {
        it("should save an entity", async () => {

        })
    })

    describe("applySort method", () => {
        it("should save an entity", async () => {

        })
    })

    describe("applyPaginate method", () => {
        it("should save an entity", async () => {

        })
    })

    describe("search method", () => {
        it("should save an entity", async () => {

        })
    })
})