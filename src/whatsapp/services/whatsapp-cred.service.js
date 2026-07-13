import { BaseDbService } from "../../db/base-db-service.js";
import { whatsappCredsTable } from "../schemas/whatsapp-cred.schema.js";

export class WhatsappCredService extends BaseDbService {
	/**
	 * @param {object} request
	 * @param {import("drizzle-orm/libsql").LibSQLDatabase} request.dbClient
	 * @param {typeof import("drizzle-orm")} request.drizzleOrm
	 */
	constructor({ dbClient, drizzleOrm }) {
		super({ dbClient, drizzleOrm, table: whatsappCredsTable, tableName: "whatsappCredsTable" });
	}

	async saveOrUpdate({ data }) {
		// eslint-disable-next-line no-unused-vars
		const { id, ...updateData } = data;

		const rows = await this._dbClient
			.insert(this._table)
			.values(data)
			.onConflictDoUpdate({
				target: this._table.id,
				set: updateData,
			})
			.returning();

		return rows[0];
	}
}
