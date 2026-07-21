import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { relations } from "./relation.js";
import { getMillisecondsOfMinutes } from "../common/get-milliseconds-of-minutes.js";

export class DatabaseProvider {
	#containerAdapter;
	/** @type {ReturnType<typeof drizzle>} */
	#dbClient;
	#environment;
	#checkpointInterval;

	/**
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

		await this.#dbClient.$client.execute("PRAGMA journal_mode = WAL;");
		await this.#dbClient.$client.execute("PRAGMA temp_store = MEMORY;");
		await this.#dbClient.$client.execute("PRAGMA wal_autocheckpoint = 5000;");
		await this.#dbClient.$client.execute("PRAGMA busy_timeout = 5000;");
		await this.#dbClient.$client.execute("PRAGMA synchronous = NORMAL;");

		this.#containerAdapter.registerValue("dbClient", this.#dbClient);

		await migrate(this.#dbClient, {
			migrationsFolder: path.resolve(process.cwd(), "./drizzle"),
		});

		this.#checkpointInterval = setInterval(async () => {
			try {
				await this.#dbClient.$client.execute("PRAGMA wal_checkpoint(PASSIVE);");
			} catch (error) {
				console.error("[DB] Error during WAL checkpoint:", error);
			}
		}, getMillisecondsOfMinutes(this.#environment.DB_CHECKPOINT_INTERVAL_MINUTES));
	}

	async close() {
		if (this.#checkpointInterval) {
			clearInterval(this.#checkpointInterval);
			this.#checkpointInterval = null;
		}

		if (this.#dbClient?.$client) {
			try {
				await this.#dbClient.$client.execute("PRAGMA wal_checkpoint(FULL);");
				await this.#dbClient.$client.close();
				console.info("[DB] Database connection closed");
			} catch (error) {
				console.error("[DB] Error closing database connection:", error);
			}
		}
	}

	getDbClient() {
		return this.#dbClient;
	}
}
