import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { baseSchema } from "../db/base.schema.js";
import { channelTypesTable } from "./channel-type.schema.js";
import { relations } from "drizzle-orm";
import { companiesTable } from "../company/company.schema.js";

export const channelsTable = sqliteTable("channels", {
	...baseSchema,
	name: text("name").notNull(),
	channelTypeId: text("channel_type_id")
		.notNull()
		.references(() => channelTypesTable.id),
	companyId: text("company_id")
		.notNull()
		.references(() => companiesTable.id),
	referenceId: text("reference_id").notNull(),
	host: text("host"),
	port: text("port"),
	username: text("username"),
	password: text("password"),
	secure: integer("secure", { mode: "boolean" }).default(false),
});

export const channelsRelations = relations(channelsTable, ({ one }) => ({
	channelType: one(channelTypesTable, {
		fields: [channelsTable.channelTypeId],
		references: [channelTypesTable.id],
	}),
	company: one(companiesTable, {
		fields: [channelsTable.companyId],
		references: [companiesTable.id],
	}),
}));
