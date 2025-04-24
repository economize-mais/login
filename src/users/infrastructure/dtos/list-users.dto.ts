import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsOptional } from "class-validator"

import { ListUserUseCase } from "@/users/application/usecases/list-user.usecase"
import { SortDirection } from "@/shared/domain/repositories/searchable-repository-contracts"

export class ListUserDto implements ListUserUseCase.Input {

    @ApiPropertyOptional({
        description: "Página que será retornada"
    })
    @IsOptional()
    page?: number

    @ApiPropertyOptional({
        description: "Quantidade de registros por página"
    })
    @IsOptional()
    perPage?: number

    @ApiPropertyOptional({
        description: "Ordenação do resultado"
    })
    @IsOptional()
    sort?: {
        by: string
        direction: SortDirection
    }

    @ApiPropertyOptional({
        description: "Dado informado para filtrar o resultado"
    })
    @IsOptional()
    filter?: string
}