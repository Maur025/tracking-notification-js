import { BaseDbService } from "../db/base-db-service.js";
import { channelsTable } from "./channel.schema.js";

export class ChannelService extends BaseDbService {
	constructor({ dbClient, drizzleOrm }) {
		super({ dbClient, drizzleOrm, table: channelsTable });
	}
}
