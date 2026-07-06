import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { relations } from "./relation.js";

export class DatabaseProvider {
	#containerAdapter;
	#dbClient;
	#environment;

	/**
	 *
	 * @param {object} request
	 * @param {import("../ioc-container.js").ContainerAdapter} request.containerAdapter
	 * @param {import("../environment/environment.js").Environment} request.environments
	 */
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
			relations,
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
