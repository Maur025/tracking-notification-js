import { companiesTable } from "../company/company.schema.js";
import { BaseDbService } from "../db/base-db-service.js";
import { channelTypesTable } from "./channel-type.schema.js";
import { channelsTable } from "./channel.schema.js";

export class ChannelService extends BaseDbService {
	/**
	 * @param {object} request
	 * @param {import("drizzle-orm/libsql").LibSQLDatabase} request.dbClient
	 * @param {typeof import("drizzle-orm")} request.drizzleOrm
	 */
	constructor({ dbClient, drizzleOrm }) {
		super({
			dbClient,
			drizzleOrm,
			table: channelsTable,
			tableName: "channelsTable",
			withData: { channelType: true, company: false },
		});
	}

	async findOneByFilters({ companyReferenceId, channelType, channelReferenceId }) {
		const query = this._dbClient
			.select()
			.from(this._table)
			.innerJoin(
				channelTypesTable,
				this._drizzleOrm.eq(this._table.channelTypeId, channelTypesTable.id),
			)
			.leftJoin(
				companiesTable,
				this._drizzleOrm.eq(this._table.companyId, companiesTable.id),
			);

		const andConditions = [];

		if (companyReferenceId) {
			andConditions.push(this._drizzleOrm.eq(companiesTable.referenceId, companyReferenceId));
		}

		if (channelType) {
			andConditions.push(
				this._drizzleOrm.eq(channelTypesTable.code, this.getChannelTypeCode(channelType)),
			);
		}

		if (channelReferenceId) {
			andConditions.push(this._drizzleOrm.eq(this._table.referenceId, channelReferenceId));
		}

		if (andConditions.length > 0) {
			query.where(this._drizzleOrm.and(...andConditions));
		}

		const [result] = await query.limit(1);

		if (!result) {
			return null;
		}

		return {
			...result.channels,
			channelType: result.channel_types,
			company: result.companies,
		};
	}

	getChannelTypeCode(channelType) {
		if (!channelType) {
			return null;
		}

		const type = channelType.trim().toUpperCase();

		switch (type) {
			case "EMAIL":
				return "mail_smtp";
			case "SMS":
				return "sms_service";
			case "WHATSAPP":
				return "whatsapp_service";
			default:
				return null;
		}
	}
}
