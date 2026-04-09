"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const response_interceptor_1 = require("./common/interceptors/response.interceptor");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('config.port') || 5000;
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    app.useGlobalFilters(new http_exception_filter_1.GlobalExceptionFilter());
    app.useGlobalInterceptors(new response_interceptor_1.ResponseInterceptor());
    app.enableCors({
        origin: configService.get('config.frontendUrl'),
        credentials: true,
    });
    await app.listen(port);
    logger.log(`================================================`);
    logger.log(`🚀 TASK SERVER IS RUNNING ON PORT: [${port}]`);
    logger.log(`🏠 API PREFIX: [api/v1]`);
    logger.log(`✅ ENVIRONMENT: [SUCCESSFULLY INITIALIZED]`);
    logger.log(`================================================`);
}
void bootstrap();
//# sourceMappingURL=main.js.map