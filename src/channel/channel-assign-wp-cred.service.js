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
			tableName: "channelAssignWpCredsTable",
			withData: {
				channel: true,
				whatsappCred: true,
			},
		});
	}

	async deleteByChannelId({ channelId }) {
		const channelAssignWpCredList = await this._dbClient
			.select()
			.from(this._table)
			.where(this._drizzleOrm.eq(this._table.channelId, channelId));

		const deleteIdSet = new Set(channelAssignWpCredList.map((item) => item.id));

		for (const id of deleteIdSet.values()) {
			await this.deleteById({ id });
		}
	}
}
