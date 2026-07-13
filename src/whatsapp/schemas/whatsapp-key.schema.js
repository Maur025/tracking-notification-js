import { sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { baseSchema } from "../../db/base.schema.js";
import { whatsappCredsTable } from "./whatsapp-cred.schema.js";

export const whatsappKeysTable = sqliteTable(
	"whatsapp_keys",
	{
		...baseSchema,
		keyType: text("key_type"),
		keyId: text("key_id"),
		valueJson: text("value_json"),
		credId: text("cred_id")
			.notNull()
			.references(() => whatsappCredsTable.id, { onDelete: "cascade" }),
	},
	(table) => [
		uniqueIndex("whatsapp_keys_cred_id_key_id_unique").on(
			table.credId,
			table.keyId,
			table.keyType,
		),
	],
);
