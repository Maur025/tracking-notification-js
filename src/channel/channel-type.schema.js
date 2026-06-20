import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { baseSchema } from "../db/base.schema.js";

export const channelTypesTable = sqliteTable("channel_types", {
	...baseSchema,
	name: text("name").notNull(),
	code: text("code").notNull().unique(),
});
