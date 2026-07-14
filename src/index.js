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

bootstrap();
