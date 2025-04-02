import { NotFoundError } from "@/shared/domain/errors/not-found-error"
import { PrismaService } from "@/shared/infrastructure/database/prisma/prisma.service"
import { UserEntity } from "@/users/domain/entities/user.entity"
import { UserModelMapper } from "../../models/user-model.mapper"
import { UserRepository } from "@/users/domain/repositories/user.repository"

export class UserPrismaRepository implements UserRepository.Repository {

    sortableFields: string[] = [
        "name",
        "createdAt"
    ]

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

    async search(props: UserRepository.SearchParams): Promise<UserRepository.SearcResult> {
        const sortable = this.sortableFields?.includes(props?.sort?.by) || false
        const orderByField = sortable ? props.sort.by : "createdAt"
        const orderByDir = sortable ? props.sort.direction : "desc"

        const count = await this.prismaService.user.count({
            ...(props.filter && {
                where: {
                    name: {
                        contains: props.filter,
                        mode: "insensitive"
                    }
                }
            })
        })

        const models = await this.prismaService.user.findMany({
            ...(props.filter && {
                where: {
                    name: {
                        contains: props.filter,
                        mode: "insensitive"
                    }
                },
            }),
            orderBy: {
                [orderByField]: orderByDir
            },
            skip: props.page && props.page > 0 ? (props.page - 1) * props.perPage : 1,
            take: props.perPage && props.perPage > 0 ? props.perPage : 15
        })

        return new UserRepository.SearcResult({
            items: models.map(model => UserModelMapper.toEntity(model)),
            total: count,
            currentPage: props.page,
            perPage: props.perPage,
            sort: {
                by: orderByField,
                direction: orderByDir
            },
            filter: props.filter
        })
    }

    delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async getAll(): Promise<UserEntity[]> {
        const models = await this.prismaService.user.findMany()
        return models.map(model => UserModelMapper.toEntity(model))
    }

    async save(entity: UserEntity): Promise<void> {
        await this.prismaService.user.create({ data: entity.toJSON() })
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