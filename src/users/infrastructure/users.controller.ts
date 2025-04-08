import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, HttpCode, Query, Put } from "@nestjs/common"
import { DeleteUserUseCase } from "../application/usecases/delete-user.usecase"
import { GetUserUseCase } from "../application/usecases/get-user.usecase"
import { ListUserDto } from "./dtos/list-users.dto"
import { ListUserUseCase } from "../application/usecases/list-user.usecase"
import { SignupDto } from "./dtos/signup.dto"
import { SigninDto } from "./dtos/signin.dto"
import { SigninUseCase } from "../application/usecases/signin.usecase"
import { SignupUseCase } from "../application/usecases/signup.usecase"
import { UpdatePasswordDto } from "./dtos/update-password.dto"
import { UpdatePasswordUseCase } from "../application/usecases/update-password.usecase"
import { UpdateUserDto } from "./dtos/update-user.dto"
import { UpdateUserUseCase } from "../application/usecases/update-user.usecase"
import { UserOutput } from "../application/dtos/user-output"
import { UserPresenter } from "./presenters/user.presenter"

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

    static userToResponse(output: UserOutput) {
        return new UserPresenter(output)
    }

    @Post()
    async create(@Body() signupDto: SignupDto) {
        const output = await this.signupUseCase.execute(signupDto)
        return UsersController.userToResponse(output)
    }

    @HttpCode(200)
    @Post("login")
    async login(@Body() signinDto: SigninDto) {
        const output = await this.signinUseCase.execute(signinDto)
        return UsersController.userToResponse(output)
    }

    @Get()
    async search(@Query() searchParams: ListUserDto) {
        return await this.listUserUseCase.execute(searchParams)
    }

    @Get(":id")
    async findOne(@Param("id") id: string) {
        const output = await this.getUserUseCase.execute({ id })
        return UsersController.userToResponse(output)
    }

    @Put(":id")
    async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
        const output = await this.updateUserUseCase.execute({ id, ...updateUserDto })
        return UsersController.userToResponse(output)
    }

    @Patch(":id")
    async updatePassword(@Param("id") id: string, @Body() updatePasswordDto: UpdatePasswordDto) {
        const output = await this.updatePasswordUseCase.execute({ id, ...updatePasswordDto })
        return UsersController.userToResponse(output)
    }

    @HttpCode(204)
    @Delete(":id")
    async remove(@Param("id") id: string) {
        await this.deleteUserUseCase.execute({ id })
    }
}