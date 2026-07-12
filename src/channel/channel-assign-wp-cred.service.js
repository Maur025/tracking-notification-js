import { BaseDbService } from "../db/base-db-service.js";
import { channelAssignWpCredsTable } from "./channel-assign-wp-cred.schema.js";

export class ChannelAssignWpCredService extends BaseDbService {
	/**
	 * @param {object} request
	 * @param {import("drizzle-orm/libsql").LibSQLDatabase} request.dbClient
	 * @param {typeof import("drizzle-orm")} request.drizzleOrm
	 */
	constructor({ dbClient, drizzleOrm }) {
		super({
			dbClient,
			drizzleOrm,
			table: channelAssignWpCredsTable,
			tableName: "channelAssignWpCred",
			withData: {
				channel: true,
				whatsappCred: true,
			},
		});
	}
}
