import {
    IsNotEmpty,
    IsString
} from "class-validator"

import { UpdatePasswordUseCase } from "@/users/application/usecases/update-password.usecase"

export class UpdatePasswordDto implements Omit<UpdatePasswordUseCase.Input, "id"> {
    @IsString()
    @IsNotEmpty()
    password: string

    @IsString()
    @IsNotEmpty()
    oldPassword: string
}
