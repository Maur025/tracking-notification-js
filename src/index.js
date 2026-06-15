import "dotenv/config";
import { overrideLog } from "atx-prettylog";
import { iocContainer } from "./ioc-container.js";

async function bootstrap() {
	overrideLog();

	const redisApp = iocContainer.resolve("redisApp");
	const emailWorker = iocContainer.resolve("emailWorker");
	const whatsappWorker = iocContainer.resolve("whatsappWorker");
	const smsWorker = iocContainer.resolve("smsWorker");
	const serverApp = iocContainer.resolve("serverApp");
	const socketServer = iocContainer.resolve("socketServer");

	try {
		redisApp.initialize();
		emailWorker.initialize(redisApp.getRedisConnection());
		whatsappWorker.initialize(redisApp.getRedisConnection());
		smsWorker.initialize(redisApp.getRedisConnection());
		serverApp.initialize();
		socketServer.initialize(serverApp.getHttpServer());

		await serverApp.listen();
	} catch (error) {
		console.error("Error starting the application:", error);

		process.exit(1);
	}
}

bootstrap();
