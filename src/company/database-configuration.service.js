import { BaseDbService } from "../db/base-db-service.js";
import { databaseConfigurationsTable } from "./database-configuration.schema.js";

export class DatabaseConfigurationService extends BaseDbService {
	/**
	 * @param {object} request
	 * @param {import("drizzle-orm/libsql").LibSQLDatabase} request.dbClient
	 * @param {typeof import("drizzle-orm")} request.drizzleOrm
	 */
	constructor({ dbClient, drizzleOrm }) {
		super({
			dbClient,
			drizzleOrm,
			table: databaseConfigurationsTable,
			tableName: "databaseConfigurationsTable",
		});
	}
}
