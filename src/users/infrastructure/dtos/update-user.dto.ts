import {
    IsNotEmpty,
    IsString
} from "class-validator"

import { UpdateUserUseCase } from "@/users/application/usecases/update-user.usecase"

export class UpdateUserDto implements Omit<UpdateUserUseCase.Input, "id"> {
    @IsString()
    @IsNotEmpty()
    name: string
}
