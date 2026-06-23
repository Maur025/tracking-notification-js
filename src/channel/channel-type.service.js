import { BaseDbService } from "../db/base-db-service.js";
import { channelTypesTable } from "./channel-type.schema.js";

export class ChannelTypeService extends BaseDbService {
	constructor({ dbClient, drizzleOrm }) {
		super({ dbClient, drizzleOrm, table: channelTypesTable });
	}
}
