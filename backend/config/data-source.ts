import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

import { Category } from "../models/Category";
import { Product } from "../models/Product";
import { StockMovement } from "../models/StockMovement";
import { Supplier } from "../models/Supplier";
import { User } from "../models/User";

dotenv.config();


export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "1234",
    database: process.env.DB_NAME || "gs_db",
    synchronize: true, 
    logging: false,
    entities: [Category, Product, StockMovement, Supplier, User],
    migrations: [],
    subscribers: [],
});
