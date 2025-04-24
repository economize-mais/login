import {
    ClassSerializerInterceptor,
    HttpStatus,
    INestApplication,
    ValidationPipe
} from "@nestjs/common"
import { Reflector } from "@nestjs/core"

import { ConflictErrorFilter } from "./shared/infrastructure/exception-filters/conflict-error/conflict-error.filter"
import { NotFoundErrorFilter } from "./shared/infrastructure/exception-filters/not-found-error/not-found-error.filter"
import { WrapperDataInterceptor } from "./shared/infrastructure/interceptor/wrapper-data/wrapper-data.interceptor"

export function applyGlobalConfig(app: INestApplication) {

    app.useGlobalPipes(
        new ValidationPipe({
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true
        })
    )
    app.useGlobalInterceptors(
        new WrapperDataInterceptor(),
        new ClassSerializerInterceptor(app.get(Reflector))
    )

    app.useGlobalFilters(
        new ConflictErrorFilter(),
        new NotFoundErrorFilter()
    )
}