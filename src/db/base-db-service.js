export class BaseDbService {
	#dbClient;
	#table;
	#drizzleOrm;

	constructor({ dbClient, drizzleOrm, table }) {
		this.#dbClient = dbClient;
		this.#drizzleOrm = drizzleOrm;
		this.#table = table;
	}

	async save({ data }) {
		return this.processTransaction(async (transaction) =>
			transaction.insert(this.#table).values(data).returning(),
		);
	}

	async findAll() {
		return this.#dbClient.select().from(this.#table);
	}

	async findById({ id }) {
		const [row] = await this.#dbClient
			.select()
			.from(this.#table)
			.where(this.#drizzleOrm.eq(this.#table.id, id))
			.limit(1);

		return row || null;
	}

	async update({ data, id }) {
		return this.processTransaction(async (transaction) =>
			transaction
				.update(this.#table)
				.set(data)
				.where(this.#drizzleOrm.eq(this.#table.id, id))
				.returning(),
		);
	}

	async deleteById({ id }) {
		await this.processTransaction(async (transaction) =>
			transaction.delete(this.#table).where(this.#drizzleOrm.eq(this.#table.id, id)),
		);
	}

	async processTransaction(processCallback, errorCallback) {
		try {
			return await this.#dbClient.transaction(async (transaction) => {
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
		const [{ count }] = await this.#dbClient
			.select({ count: this.#drizzleOrm.count() })
			.from(this.#table);
		return count;
	}
}
