import { BaseDbService } from "../../db/base-db-service.js";
import { whatsappKeysTable } from "../schemas/whatsapp-key.schema.js";

export class WhatsappKeyService extends BaseDbService {
	/**
	 * @param {object} request
	 * @param {import("drizzle-orm/libsql").LibSQLDatabase} request.dbClient
	 * @param {typeof import("drizzle-orm")} request.drizzleOrm
	 */
	constructor({ dbClient, drizzleOrm }) {
		super({ dbClient, drizzleOrm, table: whatsappKeysTable, tableName: "whatsappKeysTable" });
	}

	async findByCredIdAndKeyTypeAndKeyId({ credId, keyType, keyId }) {
		const resultList = await this._dbClient
			.select()
			.from(this._table)
			.where(
				this._drizzleOrm.and(
					this._drizzleOrm.eq(this._table.credId, credId),
					this._drizzleOrm.eq(this._table.keyType, keyType),
					this._drizzleOrm.eq(this._table.keyId, keyId),
				),
			);

		if (resultList.length > 0) {
			return resultList[0];
		}

		return null;
	}
}
