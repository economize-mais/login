import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"

import { CollectionPresenter } from "@/shared/infrastructure/presenters/collection.presenter"
import { ListUserUseCase } from "@/users/application/usecases/list-user.usecase"
import { UserOutput } from "@/users/application/dtos/user-output"

export class UserPresenter {

    @ApiProperty({
        description: "Identificação do usuário"
    })
    id: string

    @ApiProperty({
        description: "Nome do usuário"
    })
    name: string

    @ApiProperty({
        description: "Email do usuário"
    })
    email: string

    @ApiProperty({
        description: "Data de criação do usuário"
    })
    @Transform(({ value }: { value: Date }) => value.toISOString())
    createdAt: Date

    constructor(output: UserOutput) {
        this.id = output.id
        this.name = output.name
        this.email = output.email
        this.createdAt = output.createdAt
    }
}

export class UserCollectionPresenter extends CollectionPresenter {
    data: UserPresenter[]

    constructor(output: ListUserUseCase.Output) {
        const { items, ...paginationProps } = output
        super(paginationProps)
        this.data = items.map(item => new UserPresenter(item))
    }
}