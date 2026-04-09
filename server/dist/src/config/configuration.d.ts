declare const _default: (() => {
    port: number;
    databaseUrl: string | undefined;
    bcryptSaltRounds: number;
    jwt: {
        accessSecret: string | undefined;
        accessExpires: string;
        refreshSecret: string | undefined;
        refreshExpires: string;
        resetSecret: string | undefined;
        resetExpires: string;
    };
    frontendUrl: string;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    port: number;
    databaseUrl: string | undefined;
    bcryptSaltRounds: number;
    jwt: {
        accessSecret: string | undefined;
        accessExpires: string;
        refreshSecret: string | undefined;
        refreshExpires: string;
        resetSecret: string | undefined;
        resetExpires: string;
    };
    frontendUrl: string;
}>;
export default _default;
