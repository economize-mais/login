import { SearchParams } from "../../searchable-repository-contracts"

describe("Searchable Repository unit tests", () => {
    describe("SearchParams tests", () => {
        it("page prop", () => {
            const sut = new SearchParams()
            expect(sut.page).toBe(1)

            const params = [
                { page: null as any, expected: 1 },
                { page: undefined as any, expected: 1 },
                { page: "" as any, expected: 1 },
                { page: "test" as any, expected: 1 },
                { page: 0, expected: 1 },
                { page: -1, expected: 1 },
                { page: 5.5, expected: 1 },
                { page: true, expected: 1 },
                { page: false, expected: 1 },
                { page: {}, expected: 1 },
                { page: 1, expected: 1 },
                { page: 2, expected: 2 },
                { page: 10, expected: 10 }
            ]

            params.forEach(param => {
                expect(new SearchParams({ page: param.page }).page).toBe(param.expected)
            })
        })

        it("perPage prop", () => {
            const sut = new SearchParams()
            expect(sut.perPage).toBe(15)

            const params = [
                { perPage: null as any, expected: 15 },
                { perPage: undefined as any, expected: 15 },
                { perPage: "" as any, expected: 15 },
                { perPage: "test" as any, expected: 15 },
                { perPage: 0, expected: 15 },
                { perPage: -1, expected: 15 },
                { perPage: 5.5, expected: 15 },
                { perPage: true, expected: 15 },
                { perPage: false, expected: 15 },
                { perPage: {}, expected: 15 },
                { perPage: 1, expected: 1 },
                { perPage: 2, expected: 2 },
                { perPage: 10, expected: 10 }
            ]

            params.forEach(param => {
                expect(new SearchParams({ perPage: param.perPage }).perPage).toBe(param.expected)
            })
        })

        it("sort prop", () => {

            const sut = new SearchParams()
            expect(sut.sort).toBeNull()

            const params = [
                { sort: { by: null, direction: null }, expected: null },
                { sort: { by: null, direction: "asc" }, expected: null },
                { sort: { by: null, direction: "desc" }, expected: null },
                { sort: { by: "field", direction: null }, expected: { by: "field", direction: "desc" } },
                { sort: { by: "field", direction: "" as any }, expected: { by: "field", direction: "desc" } },
                { sort: { by: "field", direction: "test" as any }, expected: { by: "field", direction: "desc" } },
                { sort: { by: "field", direction: "asc" as any }, expected: { by: "field", direction: "asc" } },
                { sort: { by: "field", direction: "desc" as any }, expected: { by: "field", direction: "desc" } }
            ]

            params.forEach(param => {
                expect(new SearchParams({ sort: param.sort }).sort).toEqual(param.expected)
            })
        })

        it("filter prop", () => {
            const sut = new SearchParams()
            expect(sut.filter).toBeNull()

            const params = [
                { filter: null as any, expected: null },
                { filter: undefined as any, expected: null },
                { filter: "" as any, expected: null },
                { filter: "test" as any, expected: "test" },
                { filter: 0, expected: "0" },
                { filter: -1, expected: "-1" },
                { filter: 5.5, expected: "5.5" },
                { filter: true, expected: "true" },
                { filter: false, expected: "false" },
                { filter: {}, expected: "[object Object]" },
                { filter: 1, expected: "1" },
                { filter: 2, expected: "2" },
                { filter: 10, expected: "10" }
            ]

            params.forEach(param => {
                expect(new SearchParams({ filter: param.filter }).filter).toBe(param.expected)
            })
        })
    })
})