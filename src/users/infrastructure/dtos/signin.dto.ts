import {
    IsEmail,
    IsNotEmpty,
    IsString
} from "class-validator"

import { SigninUseCase } from "@/users/application/usecases/signin.usecase"

export class SigninDto implements SigninUseCase.Input {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string
}
