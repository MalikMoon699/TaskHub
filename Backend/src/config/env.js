import dotenv from "dotenv";

dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const { NODE_ENV, DB_URI, PORT, JWT_SECRET } = process.env;
