import dotenv from "dotenv";
dotenv.config();

const config = {
  development: {
    username: process.env.CONFIG_NAME,
    password: process.env.CONFIG_PASSWORD,
    database: process.env.CONFIG_DATABASE,
    host: process.env.CONFIG_HOST,
    port: process.env.CONFIG_PORT,
    dialect: process.env.CONFIG_DIALECT,
  },
  test: {
    username: process.env.CONFIG_NAME,
    password: process.env.CONFIG_PASSWORD,
    database: process.env.CONFIG_DATABASE,
    host: process.env.CONFIG_HOST,
    port: process.env.CONFIG_PORT,
    dialect: process.env.CONFIG_DIALECT,
  },
  production: {
    username: process.env.CONFIG_NAME,
    password: process.env.CONFIG_PASSWORD,
    database: process.env.CONFIG_DATABASE,
    host: process.env.CONFIG_HOST,
    port: process.env.CONFIG_PORT,
    dialect: process.env.CONFIG_DIALECT,
  }
}

export default config;
