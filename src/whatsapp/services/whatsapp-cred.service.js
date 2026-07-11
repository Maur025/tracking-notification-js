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
}
