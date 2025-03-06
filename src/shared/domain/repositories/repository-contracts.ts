import { Entity } from "../entities/entity"

export interface RepositoryInterface<E extends Entity<Props>, Props> {
    delete(id: string): Promise<void>
    getAll(): Promise<E[]>
    getById(id: string): Promise<E>
    save(entity: E): Promise<void>
    update(entity: E): Promise<void>
}