import { Entity } from "../entities/entity"
import { NotFoundError } from "../errors/not-found-error"
import { RepositoryInterface } from "./repository-contracts"

export abstract class InMemoryRepository<E extends Entity<Props>, Props> implements RepositoryInterface<E, Props> {

    items: E[] = []

    async delete(id: string): Promise<void> {
        await this._get(id)
        const index = this.items.findIndex(entity => entity.id === id)
        this.items.splice(index, 1)
    }

    async getAll(): Promise<E[]> {
        return this.items
    }

    async getById(id: string): Promise<E> {
        return this._get(id)
    }

    async save(entity: E): Promise<void> {
        this.items.push(entity)
    }

    async update(entity: E): Promise<void> {
        await this._get(entity.id)
        const index = this.items.findIndex(e => e.id === entity.id)
        this.items[index] = entity
    }

    private async _get(id: string): Promise<E> {
        const entity = this.items.find(entity => entity.id === id)

        if (!entity)
            throw new NotFoundError("Entity not found")

        return entity
    }
}