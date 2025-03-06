import { ConflictError } from "@/shared/domain/errors/conflict-error"
import { NotFoundError } from "@/shared/domain/errors/not-found-error"
import { InMemoryRepository } from "@/shared/domain/repositories/in-memory.repository"
import { UserEntity, UserProps } from "@/users/domain/entities/user.entity"
import { UserRepository } from "@/users/domain/repositories/user.repository"

export class UserInMemoryRepository extends InMemoryRepository<UserEntity, UserProps> implements UserRepository {

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
}