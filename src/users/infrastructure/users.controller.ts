import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, HttpCode, Query, Put } from "@nestjs/common"
import { DeleteUserUseCase } from "../application/usecases/delete-user.usecase"
import { GetUserUseCase } from "../application/usecases/get-user.usecase"
import { ListUserUseCase } from "../application/usecases/list-user.usecase"
import { SignupDto } from "./dtos/signup.dto"
import { SigninUseCase } from "../application/usecases/signin.usecase"
import { SignupUseCase } from "../application/usecases/signup.usecase"
import { UpdatePasswordUseCase } from "../application/usecases/update-password.usecase"
import { UpdateUserDto } from "./dtos/update-user.dto"
import { UpdateUserUseCase } from "../application/usecases/update-user.usecase"
import { SigninDto } from "./dtos/signin.dto"
import { ListUserDto } from "./dtos/list-users.dto"
import { UpdatePasswordDto } from "./dtos/update-password.dto"

@Controller("users")
export class UsersController {

    @Inject(SignupUseCase.UseCase)
    private signupUseCase: SignupUseCase.UseCase

    @Inject(SigninUseCase.UseCase)
    private signinUseCase: SigninUseCase.UseCase

    @Inject(GetUserUseCase.UseCase)
    private getUserUseCase: GetUserUseCase.UseCase

    @Inject(ListUserUseCase.UseCase)
    private listUserUseCase: ListUserUseCase.UseCase

    @Inject(UpdateUserUseCase.UseCase)
    private updateUserUseCase: UpdateUserUseCase.UseCase

    @Inject(UpdatePasswordUseCase.UseCase)
    private updatePasswordUseCase: UpdatePasswordUseCase.UseCase

    @Inject(DeleteUserUseCase.UseCase)
    private deleteUserUseCase: DeleteUserUseCase.UseCase

    @Post()
    async create(@Body() signupDto: SignupDto) {
        return await this.signupUseCase.execute(signupDto)
    }

    @HttpCode(200)
    @Post("login")
    async login(@Body() signinDto: SigninDto) {
        return this.signinUseCase.execute(signinDto)
    }

    @Get()
    async search(@Query() searchParams: ListUserDto) {
        return this.listUserUseCase.execute(searchParams)
    }

    @Get(":id")
    async findOne(@Param("id") id: string) {
        return this.getUserUseCase.execute({ id })
    }

    @Put(":id")
    async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.updateUserUseCase.execute({ id, ...updateUserDto })
    }

    @Patch(":id")
    async updatePassword(@Param("id") id: string, @Body() updatePasswordDto: UpdatePasswordDto) {
        return this.updatePasswordUseCase.execute({ id, ...updatePasswordDto })
    }

    @HttpCode(204)
    @Delete(":id")
    async remove(@Param("id") id: string) {
        await this.deleteUserUseCase.execute({ id })
    }
}