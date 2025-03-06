import { SearchableRepositoryInterface } from "@/shared/domain/repositories/searchable-repository-contracts"
import { UserEntity, UserProps } from "../entities/user.entity"

export interface UserRepository extends SearchableRepositoryInterface<UserEntity, UserProps, any, any> {
    emailExists(email: string): Promise<void>
    getByEmail(email: string): Promise<UserEntity>
}