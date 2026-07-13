import { sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { baseSchema } from "../db/base.schema.js";
import { channelsTable } from "./channel.schema.js";
import { whatsappCredsTable } from "../whatsapp/schemas/whatsapp-cred.schema.js";

export const channelAssignWpCredsTable = sqliteTable(
	"channel_assign_wp_creds",
	{
		...baseSchema,
		channelId: text("channel_id")
			.notNull()
			.references(() => channelsTable.id, { onDelete: "cascade" }),
		whatsappCredId: text("whatsapp_cred_id")
			.notNull()
			.references(() => whatsappCredsTable.id, { onDelete: "cascade" }),
	},
	(table) => [
		uniqueIndex("assign_channel_id_whatsapp_cred_id_unique").on(
			table.channelId,
			table.whatsappCredId,
		),
	],
);
