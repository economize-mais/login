import { ApiProperty } from "@nestjs/swagger"
import {
    IsNotEmpty,
    IsString
} from "class-validator"

import { UpdateUserUseCase } from "@/users/application/usecases/update-user.usecase"

export class UpdateUserDto implements Omit<UpdateUserUseCase.Input, "id"> {

    @ApiProperty({
        description: "Nome do usuário"
    })
    @IsString()
    @IsNotEmpty()
    name: string
}
