"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('config', () => ({
    port: parseInt(process.env.PORT || '5000', 10),
    databaseUrl: process.env.DATABASE_URL,
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUND || '10', 10),
    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET,
        accessExpires: process.env.JWT_ACCESS_EXPIRES || '15d',
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        refreshExpires: process.env.JWT_REFRESH_EXPIRES || '30d',
        resetSecret: process.env.JWT_RESET_PASS_SECRET,
        resetExpires: process.env.JWT_RESET_PASS_SECRET_EXPIRES || '15m',
    },
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
}));
//# sourceMappingURL=configuration.js.map