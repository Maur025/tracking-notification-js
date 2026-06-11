import "dotenv/config";
import { overrideLog } from "atx-prettylog";
import { iocContainer } from "./ioc-container.js";

async function bootstrap() {
	overrideLog();

	const serverApp = iocContainer.resolve("serverApp");
	const socketServer = iocContainer.resolve("socketServer");

	try {
		serverApp.initialize();
		socketServer.initialize(serverApp.getHttpServer());

		await serverApp.listen();
	} catch (error) {
		console.error("Error starting the application:", error);

		process.exit(1);
	}
}

bootstrap();
