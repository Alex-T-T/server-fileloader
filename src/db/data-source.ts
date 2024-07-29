import { DataSource } from 'typeorm'
import { databaseConfiguration } from './database-config'

export const AppDataSource = new DataSource(databaseConfiguration(false))
