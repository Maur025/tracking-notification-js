import { sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { baseSchema } from "../db/base.schema.js";

export const databaseConfigurationsTable = sqliteTable(
	"database_configurations",
	{
		...baseSchema,
		host: text("host").notNull(),
		port: text("port").notNull(),
		database: text("database").notNull(),
		referenceId: text("reference_id").notNull(),
	},
	(table) => [
		uniqueIndex("database_configurations_reference_id_unique").on(
			table.database,
			table.referenceId,
		),
	],
);
