import "dotenv/config";

export const PASSWORD_HASH_SALT_ROUNDS = Number.parseInt(
    process.env.PASSWORD_HASH_SALT_ROUNDS,
    10,
);

export const JWT_TOKENKEY_SECRET = process.env.JWT_TOKENKEY;
export const JWT_ACCESS_TOKEN_EXPIRES_IN = "5s";
export const JWT_REFRESH_TOKEN_EXPIRES_IN = "10m";
