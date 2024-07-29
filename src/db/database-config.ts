import dotenv from 'dotenv';
dotenv.config();
import { DataSourceOptions } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const databaseConfiguration = (
    isMigrationRun = true
): DataSourceOptions => {
    const ROOT_PATH = process.cwd();

    const migrationPath =
        process.env.NODE_ENV === 'development'
            ? `${ROOT_PATH}/**/migrations/*{.ts,.js}`
            : `build/**/migrations/*{.ts,.js}`;

    const entitiesPath =
        process.env.NODE_ENV === 'development'
            ? `${ROOT_PATH}/**/*.entity{.ts,.js}`
            : `build/**/*.entity{.ts,.js}`;

    const config: PostgresConnectionOptions = {
        type: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: +process.env.POSTGRES_PORT!,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        entities: [entitiesPath],
        migrations: [migrationPath],
        migrationsTableName: 'migrations',
        migrationsRun: isMigrationRun,
        logging: false,
        synchronize: true,
    };

    return config;
};
