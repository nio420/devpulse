import dotenv from "dotenv";
dotenv.config();
const config = {
    databaseUrl: process.env.DATABASE_URL,
    port: process.env.PORT,
    jwtSecretKey: process.env.JWT_SECRET_KEY,
    clientUrl: process.env.CLIENT_URL
};
export default config;
//# sourceMappingURL=index.js.map