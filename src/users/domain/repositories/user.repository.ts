import { RepositoryInterface } from "@/shared/domain/repositories/repository-contracts"
import { UserEntity, UserProps } from "../entities/user.entity"

export interface UserRepository extends RepositoryInterface<UserEntity, UserProps> {
    emailExists(email: string): Promise<void>
    getByEmail(email: string): Promise<UserEntity>
}