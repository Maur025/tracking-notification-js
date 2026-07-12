import { defineRelations } from "drizzle-orm";
import * as schema from "./schema.js";

export const relations = defineRelations(schema, (rel) => ({
	channelsTable: {
		channelType: rel.one.channelTypesTable({
			from: rel.channelsTable.channelTypeId,
			to: rel.channelTypesTable.id,
		}),
	},
	channelAssignWpCredsTable: {
		channel: rel.one.channelsTable({
			from: rel.channelAssignWpCredsTable.channelId,
			to: rel.channelsTable.id,
		}),
		whatsappCred: rel.one.whatsappCredsTable({
			from: rel.channelAssignWpCredsTable.whatsappCredId,
			to: rel.whatsappCredsTable.id,
		}),
	},
}));
