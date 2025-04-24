import {
    FastifyAdapter,
    NestFastifyApplication,
} from "@nestjs/platform-fastify"
import { NestFactory } from "@nestjs/core"

import { applyGlobalConfig } from "./global-config"
import { AppModule } from "./app.module"

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter()
    )
    applyGlobalConfig(app)
    await app.listen(process.env.PORT ?? 3000, "0.0.0.0")
}

bootstrap()