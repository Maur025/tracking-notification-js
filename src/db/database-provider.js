import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import * as schema from "./schema.js";

export class DatabaseProvider {
	#containerAdapter;
	#dbClient;
	#environment;

	constructor({ containerAdapter, environments }) {
		this.#containerAdapter = containerAdapter;
		this.#environment = environments;
	}

	async initialize() {
		const absoluteDbPath = path.resolve(process.cwd(), this.#environment.DB_URL);
		const directory = path.dirname(absoluteDbPath);

		if (!existsSync(directory)) {
			mkdirSync(directory, { recursive: true });
		}

		this.#dbClient = drizzle({
			connection: {
				url: `file:${this.#environment.DB_URL}`,
			},
			schema,
		});

		this.#containerAdapter.registerValue("dbClient", this.#dbClient);

		await migrate(this.#dbClient, {
			migrationsFolder: path.resolve(process.cwd(), "./drizzle"),
		});
	}

	getDbClient() {
		return this.#dbClient;
	}
}
