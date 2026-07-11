import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { baseSchema } from "../../db/base.schema.js";

export const whatsappCredsTable = sqliteTable("whatsapp_creds", {
	...baseSchema,
	credsJson: text("creds_json").notNull(),
	phoneNumberIdentifier: text("phone_number_identifier").unique(),
});
