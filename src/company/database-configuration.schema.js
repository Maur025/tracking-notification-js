import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { baseSchema } from "../db/base.schema.js";

export const databaseConfigurationsTable = sqliteTable("database_configurations", {
	...baseSchema,
	host: text("host").notNull(),
	port: text("port").notNull(),
	database: text("database").notNull(),
	referenceId: text("reference_id").notNull(),
});
