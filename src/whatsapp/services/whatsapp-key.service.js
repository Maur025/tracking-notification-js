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

	async findByCredIdAndKeyTypeAndKeyIdIn({ credId, keyType, keyIds }) {
		return this._dbClient
			.select()
			.from(this._table)
			.where(
				this._drizzleOrm.and(
					this._drizzleOrm.eq(this._table.credId, credId),
					this._drizzleOrm.eq(this._table.keyType, keyType),
					this._drizzleOrm.inArray(this._table.keyId, keyIds),
				),
			);
	}
	async saveWithTransaction({ data, transaction }) {
		return transaction.insert(this._table).values(data).returning();
	}

	async deleteByIdWithTransaction({ id, transaction }) {
		await transaction.delete(this._table).where(this._drizzleOrm.eq(this._table.id, id));
	}

	async deleteByCredIdAndKeyTypeAndKeyId({ credId, keyType, keyId }) {
		await this._dbClient
			.delete(this._table)
			.where(
				this._drizzleOrm.and(
					this._drizzleOrm.eq(this._table.credId, credId),
					this._drizzleOrm.eq(this._table.keyType, keyType),
					this._drizzleOrm.eq(this._table.keyId, keyId),
				),
			);
	}

	async saveOrUpdate({ data }) {
		// eslint-disable-next-line no-unused-vars
		const { id, ...updateData } = data;

		const rows = await this._dbClient
			.insert(this._table)
			.values(data)
			.onConflictDoUpdate({
				target: [this._table.credId, this._table.keyType, this._table.keyId],
				set: updateData,
			})
			.returning();

		return rows[0];
	}
}
