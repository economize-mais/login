import { ApiProperty } from "@nestjs/swagger"
import {
    IsEmail,
    IsNotEmpty,
    IsString
} from "class-validator"

import { SigninUseCase } from "@/users/application/usecases/signin.usecase"

export class SigninDto implements SigninUseCase.Input {

    @ApiProperty({
        description: "Email do usuário"
    })
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string

    @ApiProperty({
        description: "Senha do usuário"
    })
    @IsString()
    @IsNotEmpty()
    password: string
}
