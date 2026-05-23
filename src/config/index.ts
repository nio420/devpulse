import dotenv from "dotenv";

dotenv.config()

const config = {
    databaseUrl: process.env.DATABASE_URL as string,
    port: process.env.PORT,
    jwtSecretKey: process.env.JWT_SECRET_KEY as string,
    clientUrl: process.env.CLIENT_URL as string
}

export default config;