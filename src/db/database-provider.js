import { drizzle } from "drizzle-orm/libsql";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";

export class DatabaseProvider {
	#containerAdapter;
	#dbClient;
	#environment;

	constructor({ containerAdapter, environments }) {
		this.#containerAdapter = containerAdapter;
		this.#environment = environments;
	}

	initialize() {
		const absoluteDbPath = path.resolve(process.cwd(), this.#environment.DB_URL);
		const directory = path.dirname(absoluteDbPath);

		console.log({ absoluteDbPath, directory });

		if (!existsSync(directory)) {
			mkdirSync(directory, { recursive: true });
		}

		this.#dbClient = drizzle({
			connection: {
				url: `file:${this.#environment.DB_URL}`,
			},
		});

		this.#containerAdapter.registerValue("dbClient", this.#dbClient);
	}

	getDbClient() {
		return this.#dbClient;
	}
}
