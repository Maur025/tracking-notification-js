export class BaseDbService {
	_dbClient;
	_table;
	_tableName;
	_drizzleOrm;
	_withData;

	constructor({ dbClient, drizzleOrm, table, withData, tableName }) {
		this._dbClient = dbClient;
		this._drizzleOrm = drizzleOrm;
		this._table = table;
		this._tableName = tableName;
		this._withData = withData || {};
	}

	async save({ data }) {
		return this.processTransaction(async (transaction) =>
			transaction.insert(this._table).values(data).returning(),
		);
	}

	async findAll() {
		console.log({ tableName: this._tableName });

		return this._dbClient.query[this._tableName].findMany({
			with: this._withData,
		});
	}

	async findById({ id }) {
		const [row] = await this._dbClient
			.select()
			.from(this._table)
			.where(this._drizzleOrm.eq(this._table.id, id))
			.limit(1);

		return row || null;
	}

	async update({ data, id }) {
		return this.processTransaction(async (transaction) =>
			transaction
				.update(this._table)
				.set(data)
				.where(this._drizzleOrm.eq(this._table.id, id))
				.returning(),
		);
	}

	async deleteById({ id }) {
		await this.processTransaction(async (transaction) =>
			transaction.delete(this._table).where(this._drizzleOrm.eq(this._table.id, id)),
		);
	}

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

	async count() {
		const [{ count }] = await this._dbClient
			.select({ count: this._drizzleOrm.count() })
			.from(this._table);
		return count;
	}
}
