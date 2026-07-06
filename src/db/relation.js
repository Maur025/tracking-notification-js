import { defineRelations } from "drizzle-orm";
import * as schema from "./schema.js";

export const relations = defineRelations(schema, (rel) => ({
	channelsTable: {
		channelType: rel.one.channelTypesTable({
			from: rel.channelsTable.channelTypeId,
			to: rel.channelTypesTable.id,
		}),
	},
}));
