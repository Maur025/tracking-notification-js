import "dotenv/config";
import { logger } from "./common/logger.js";
import { iocContainer } from "./ioc-container.js";
import { Scheduler } from "./common/scheduler.cjs";
import { NodeControllerServer } from "tracking-common";

async function bootstrap() {
	const environment = iocContainer.resolve("environments");
	const databaseProvider = iocContainer.resolve("databaseProvider");
	const redisApp = iocContainer.resolve("redisApp");

	try {
		await databaseProvider.initialize();
		redisApp.initialize();

		const emailWorker = iocContainer.resolve("emailWorker");
		const whatsappWorker = iocContainer.resolve("whatsappWorker");
		const smsWorker = iocContainer.resolve("smsWorker");

		const socketClient = iocContainer.resolve("socketClient");
		const serverApp = iocContainer.resolve("serverApp");
		const socketServer = iocContainer.resolve("socketServer");

		const scheduler = new Scheduler();
		scheduler.start();
		await setupScheduler(scheduler);

		socketClient.initialize();
		socketClient.clientStart();

		const wsServerOutput = new NodeControllerServer({
			port: environment.WS_PORT,
			prefix: "ws-processor-output",
		});
		wsServerOutput.start();
		await setupOutput(wsServerOutput);

		emailWorker.initialize(redisApp.getRedisConnection());
		whatsappWorker.initialize(redisApp.getRedisConnection());
		smsWorker.initialize(redisApp.getRedisConnection());
		serverApp.initialize();
		socketServer.initialize(serverApp.getHttpServer());

		const dbSeed = iocContainer.resolve("dbSeed");
		await dbSeed.runSeeders();

		const registerChannelOfDbConfigAction = iocContainer.resolve(
			"registerChannelOfDbConfigAction",
		);
		await registerChannelOfDbConfigAction.execute({});

		await serverApp.listen();
	} catch (error) {
		logger.error("Error starting the application:", error);

		process.exit(1);
	}
}

const setupOutput = async (wsServerOutput) => {
	wsServerOutput.wsServerManager.on("connected", (client, data) => {
		console.error("wsServerOutput.wsServerManager on connected", data);
		client.socket.emit("devices", []);
	});
};

/** @param {Scheduler} scheduler*/
const setupScheduler = async (scheduler) => {
	scheduler.on("time.ping", () => {});
	scheduler.on("time.save", () => {
		console.log("saving");
	});
	scheduler.on("time.storage", () => {});
};

const handleShutdown = async (signal) => {
	console.info(`Received ${signal}. Shutting down gracefully...`);

	try {
		/** @type {import('./email/email-worker.js').EmailWorker} */
		const emailWorker = iocContainer.resolve("emailWorker");
		await emailWorker.close();

		/** @type {import('./whatsapp/whatsapp-worker.js').WhatsappWorker} */
		const whatsappWorker = iocContainer.resolve("whatsappWorker");
		await whatsappWorker.close();

		/** @type {import('./whatsapp/whatsapp-provider.js').WhatsappProvider} */
		const whatsappProvider = iocContainer.resolve("whatsappProvider");
		await whatsappProvider.disconnectAllChannels();

		/** @type {import('./email/email-provider.js').EmailProvider} */
		const emailProvider = iocContainer.resolve("emailProvider");
		await emailProvider.disconnectAllChannels();

		/** @type {import('./redis/redis-app.js').RedisApp} */
		const redisApp = iocContainer.resolve("redisApp");
		await redisApp.close();

		/** @type {import('./db/database-provider.js').DatabaseProvider} */
		const databaseProvider = iocContainer.resolve("databaseProvider");
		await databaseProvider.close();
	} catch (error) {
		logger.error("Error occurred while shutting down app:", error);
	} finally {
		console.info("Shutdown complete. Exiting process.");
		process.exit(0);
	}
};

bootstrap();

process.on("SIGINT", () => handleShutdown("SIGINT"));

process.on("SIGTERM", () => handleShutdown("SIGTERM"));

process.on("uncaughtException", (error) => {
	logger.error("Uncaught Exception:", error);
	handleShutdown("uncaughtException");
});

process.on("unhandledRejection", (reason, promise) => {
	logger.error("Unhandled Rejection at:", promise, "reason:", reason);
	handleShutdown("unhandledRejection");
});
