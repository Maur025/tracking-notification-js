import { BaseDbService } from "../db/base-db-service.js";
import { channelTypesTable } from "./channel-type.schema.js";

export class ChannelTypeService extends BaseDbService {
	/**
	 * @param {object} request
	 * @param {import("drizzle-orm/libsql").LibSQLDatabase} request.dbClient
	 * @param {typeof import("drizzle-orm")} request.drizzleOrm
	 */
	constructor({ dbClient, drizzleOrm }) {
		super({
			dbClient,
			drizzleOrm,
			table: channelTypesTable,
			tableName: "channelTypesTable",
		});
	}

	async findOneByCode({ code }) {
		const config = this.getConfigWithData();

		return this._dbClient.query[this._tableName].findFirst({
			...config,
			where: {
				code,
			},
		});
	}
}
