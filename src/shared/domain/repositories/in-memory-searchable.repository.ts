import { Entity } from "../entities/entity"
import { InMemoryRepository } from "./in-memory.repository"
import { SearchableRepositoryInterface } from "./searchable-repository-contracts"

export abstract class InMemorySearchableRepository<E extends Entity<Props>, Props> extends InMemoryRepository<E, Props> implements SearchableRepositoryInterface<E, Props, any, any> {
    async search(props: any): Promise<E[]> {
        const items = this.items.filter(item => {
            return Object.keys(props).every(key => {
                return item.props[key] === props[key];
            });
        });
        return items;
    }

}