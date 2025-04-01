import { NotFoundError } from "@/shared/domain/errors/not-found-error"
import { PrismaService } from "@/shared/infrastructure/database/prisma/prisma.service"
import { UserEntity } from "@/users/domain/entities/user.entity"
import { UserModelMapper } from "../../models/user-model.mapper"
import { UserRepository } from "@/users/domain/repositories/user.repository"

export class UserPrismaRepository implements UserRepository.Repository {

    sortableFields: string[];

    constructor(
        private prismaService: PrismaService
    ) {}

    getByEmail(email: string): Promise<UserEntity> {
        throw new Error("Method not implemented.");
    }

    emailExists(email: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    getById(id: string): Promise<UserEntity> {
        return this._get(id)
    }

    search(props: UserRepository.SearchParams): Promise<UserRepository.SearcResult> {
        throw new Error("Method not implemented.");
    }

    delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getAll(): Promise<UserEntity[]> {
        throw new Error("Method not implemented.");
    }

    save(entity: UserEntity): Promise<void> {
        throw new Error("Method not implemented.");
    }

    update(entity: UserEntity): Promise<void> {
        throw new Error("Method not implemented.");
    }

    protected async _get(id: string): Promise<UserEntity> {
        try {
            const user = await this.prismaService.user.findUnique({
                where: { id }
            })

            return UserModelMapper.toEntity(user)

        } catch (err) {
            throw new NotFoundError(`UserModel not found usind ID ${id}`)
        }
    }
}