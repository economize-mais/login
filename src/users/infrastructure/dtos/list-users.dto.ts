import { IsOptional } from "class-validator"

import { ListUserUseCase } from "@/users/application/usecases/list-user.usecase"
import { SortDirection } from "@/shared/domain/repositories/searchable-repository-contracts"

export class ListUserDto implements ListUserUseCase.Input {
    @IsOptional()
    page?: number

    @IsOptional()
    perPage?: number

    @IsOptional()
    sort?: {
        by: string
        direction: SortDirection
    }

    @IsOptional()
    filter?: string
}