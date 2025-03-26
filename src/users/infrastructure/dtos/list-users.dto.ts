import { SortDirection } from "@/shared/domain/repositories/searchable-repository-contracts"
import { ListUserUseCase } from "@/users/application/usecases/list-user.usecase"

export class ListUserDto implements ListUserUseCase.Input {
    page?: number
    perPage?: number
    sort?: {
        by: string
        direction: SortDirection
    }
    filter?: string
}