import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "paulin",
    password: "",
    database: "test-crm",
    synchronize: true,
    logging: true,
    entities: ["src/entity/*.ts"],
    subscribers: [],
    migrations: [],
})
