import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { baseSchema } from "../db/base.schema.js";

export const companiesTable = sqliteTable("companies", {
	...baseSchema,
	name: text("name").notNull(),
	referenceId: text("reference_id").notNull(),
});
