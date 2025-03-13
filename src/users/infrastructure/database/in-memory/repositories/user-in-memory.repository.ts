import { ConflictError } from "@/shared/domain/errors/conflict-error"
import { NotFoundError } from "@/shared/domain/errors/not-found-error"
import { InMemorySearchableRepository } from "@/shared/domain/repositories/in-memory-searchable.repository"
import { SortDirection } from "@/shared/domain/repositories/searchable-repository-contracts"
import { UserEntity, UserProps } from "@/users/domain/entities/user.entity"
import { UserRepository } from "@/users/domain/repositories/user.repository"

export class UserInMemoryRepository extends InMemorySearchableRepository<UserEntity, UserProps> implements UserRepository.Repository {

    sortableFields: string[] = ["name", "createdAt"]

    async emailExists(email: string): Promise<void> {
        const user = this.items.find((user) => user.email === email)

        if(user)
            throw new ConflictError("User with this email already exists")
    }

    async getByEmail(email: string): Promise<UserEntity> {
        const user = this.items.find((user) => user.email === email)

        if(!user)
            throw new NotFoundError(`User with this email ${email} not found`)

        return user
    }

    protected async applyFilter(items: UserEntity[], filter: UserRepository.Filter): Promise<UserEntity[]> {
        if(!filter)
            return items

        return items.filter(item => {
            return item.props.name.toLowerCase().includes(filter.toLowerCase())
        })
    }

    protected async applySort(items: UserEntity[], sort: { by: string | null; direction: SortDirection | null }): Promise<UserEntity[]> {
        return !sort || sort.by === null ?
            super.applySort(items, { by: "createdAt", direction: "desc" }) :
            super.applySort(items, { by: sort.by, direction: sort.direction === null ? "desc" : sort.direction })
    }
}