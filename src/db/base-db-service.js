import {
	validateAndParse,
	calculateTotalPages,
	mapOrderBy,
	getOrderByValues,
} from "../common/pagination-helper.js";

export class BaseDbService {
	_dbClient;
	_table;
	_tableName;
	_drizzleOrm;
	_withData;

	/**
	 * @param {object} request
	 * @param {import("drizzle-orm/libsql").LibSQLDatabase} request.dbClient
	 * @param {typeof import("drizzle-orm")} request.drizzleOrm
	 * @param {import("drizzle-orm/sqlite-core").SQLiteTableWithColumns} request.table
	 * @param {object} request.withData
	 * @param {string} request.tableName
	 */
	constructor({ dbClient, drizzleOrm, table, withData, tableName }) {
		this._dbClient = dbClient;
		this._drizzleOrm = drizzleOrm;
		this._table = table;
		this._tableName = tableName;
		this._withData = withData || {};
	}

	getConfigWithData() {
		const config = {};

		if (this._withData) {
			config.with = this._withData;
		}

		return config;
	}

	/**
	 * @param {object} request
	 * @param {object} request.data
	 */
	async save({ data }) {
		const [result] = await this._dbClient.insert(this._table).values(data).returning();

		return result;
	}

	async findAll() {
		const config = this.getConfigWithData();

		return this._dbClient.query[this._tableName].findMany({
			...config,
		});
	}

	/**
	 * @param {object} request
	 * @param {number} request.page
	 * @param {number} request.size
	 * @param {string|[string, boolean][]} request.orderBy
	 * @param {boolean|undefined} request.descending
	 */
	async findAllWithPagination(request) {
		const { size, offset, orderBy, descending } = validateAndParse(request);

		const config = this.getConfigWithData();
		const orderConfig = mapOrderBy(getOrderByValues(orderBy, descending));

		const [total, result] = await Promise.all([
			this.count(),
			this._dbClient.query[this._tableName].findMany({
				...config,
				...orderConfig,
				limit: size,
				offset,
			}),
		]);

		return {
			data: result,
			totalPages: calculateTotalPages(total, size),
			totalElements: total,
		};
	}

	/**
	 * @param {object} request
	 * @param {string} request.id
	 */
	async findById({ id }) {
		const config = this.getConfigWithData();

		return this._dbClient.query[this._tableName].findFirst({
			...config,
			where: {
				id: id,
			},
		});
	}

	/**
	 * @param {object} request
	 * @param {string} request.id
	 */
	async findByIdThrow({ id }) {
		const existingRecord = await this.findById({ id });

		if (!existingRecord) {
			throw new Error(`Record with id ${id} not found in ${this._tableName}`);
		}

		return existingRecord;
	}

	/**
	 * @param {object} request
	 * @param {object} request.data
	 * @param {string} request.id
	 */
	async updateById({ data, id }) {
		await this.findByIdThrow({ id });

		return this._dbClient
			.update(this._table)
			.set(data)
			.where(this._drizzleOrm.eq(this._table.id, id))
			.returning();
	}

	/**
	 * @param {object} request
	 * @param {string} request.id
	 */
	async deleteById({ id }) {
		await this.findByIdThrow({ id });

		await this._dbClient.delete(this._table).where(this._drizzleOrm.eq(this._table.id, id));
	}

	async count() {
		const [{ count }] = await this._dbClient
			.select({ count: this._drizzleOrm.count() })
			.from(this._table);
		return count;
	}
	/**
	 * @typedef {object} UpdateBulkRequest
	 * @property {string} id - The ID of the record to update.
	 * @property {object} data - The data to update the record with.
	 *
	 * @param {UpdateBulkRequest[]} request
	 */
	async updateBulk(updates) {
		return this.processTransaction(async (transaction) => {
			const promises = updates.map(({ id, data }) =>
				transaction
					.update(this._table)
					.set(data)
					.where(this._drizzleOrm.eq(this._table.id, id)),
			);

			const results = await Promise.all(promises);
			return results.flat();
		});
	}

	/**
	 * @param {object[]} dataArray
	 */
	async saveBulk(dataArray) {
		return this.processTransaction(async (transaction) => {
			const promises = dataArray.map((data) =>
				transaction.insert(this._table).values(data).returning(),
			);

			const results = await Promise.all(promises);
			return results.flat();
		});
	}

	/**
	 * @typedef {import("drizzle-orm/libsql").LibSQLTransaction} Transaction
	 * @param {(transaction:Transaction)=>any} processCallback
	 * @param {Function|undefined} errorCallback
	 */
	async processTransaction(processCallback, errorCallback) {
		try {
			return await this._dbClient.transaction(async (transaction) => {
				return processCallback(transaction);
			});
		} catch (error) {
			console.error("Error processing transaction:", error);

			if (errorCallback) {
				errorCallback(error);
			}

			throw error;
		}
	}
}
