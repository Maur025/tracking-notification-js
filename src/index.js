import "dotenv/config";
import { overrideLog } from "atx-prettylog";
import { iocContainer } from "./ioc-container.js";

async function bootstrap() {
	overrideLog();

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

		socketClient.initialize();
		socketClient.clientStart();

		emailWorker.initialize(redisApp.getRedisConnection());
		whatsappWorker.initialize(redisApp.getRedisConnection());
		smsWorker.initialize(redisApp.getRedisConnection());
		serverApp.initialize();
		socketServer.initialize(serverApp.getHttpServer());

		const dbSeed = iocContainer.resolve("dbSeed");
		await dbSeed.runSeeders();

		await serverApp.listen();
	} catch (error) {
		console.error("Error starting the application:", error);

		process.exit(1);
	}
}

bootstrap();
