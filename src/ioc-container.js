import { asClass, asFunction, asValue, createContainer, InjectionMode, listModules } from "awilix";
import { environments } from "./environments.js";
import express from "express";
import ioredis from "ioredis";
import bullmq from "bullmq";
import nodemailer from "nodemailer";
import playwright from "playwright";
import * as drizzleOrm from "drizzle-orm";
import { ServerApp } from "./server/server-app.js";
import { WhatsappController } from "./whatsapp/whatsapp.controller.js";
import { EmailController } from "./email/email.controller.js";
import { SocketServer } from "./socket/socket-server.js";
import { ContainerAdapter } from "./container-adapter.js";
import { RedisApp } from "./redis/redis-app.js";
import { EmailWorker } from "./email/email-worker.js";
import { EmailWorkerService } from "./email/email-worker.service.js";
import { EmailQueue } from "./email/email-queue.js";
import { WhatsappWorker } from "./whatsapp/whatsapp-worker.js";
import { WhatsappWorkerService } from "./whatsapp/whatsapp-worker.service.js";
import { WhatsappQueue } from "./whatsapp/whatsapp-queue.js";
import { SmsWorker } from "./sms/sms-worker.js";
import { SmsWorkerService } from "./sms/sms-worker.service.js";
import { SmsQueue } from "./sms/sms-queue.js";
import { SmsController } from "./sms/sms.controller.js";
import { SocketClient } from "./socket/socket-client.js";
import { EmailProvider } from "./email/email-provider.js";
import { EmailNotifier } from "./email/email-notifier.js";
import { DatabaseProvider } from "./db/database-provider.js";
import { CompanyService } from "./company/company.service.js";
import { DbSeed } from "./db/db-seed.js";
import { ChannelTypeService } from "./channel/channel-type.service.js";
import { ChannelService } from "./channel/channel.service.js";
import { EmailService } from "./email/email.service.js";
import { ErrorHandler } from "./server/error-handler.js";
import { SocketServerHandler } from "./socket/socket-server-handler.js";
import { SocketClientHandler } from "./socket/socket-client-handler.js";

const iocContainer = createContainer({
	injectionMode: InjectionMode.PROXY,
	strict: true,
});

const controllerModules = listModules("**/*.controller.js").map((module) => {
	return { ...module, name: module.name.replace(".controller", "Controller") };
});

iocContainer.register({
	//external dependencies
	express: asValue(express),
	ioredis: asValue(ioredis),
	bullmq: asValue(bullmq),
	nodemailer: asValue(nodemailer),
	playwright: asValue(playwright),
	drizzleOrm: asValue(drizzleOrm),

	//Container
	container: asValue(iocContainer),
	containerAdapter: asClass(ContainerAdapter).singleton(),

	// Configurations
	environments: asValue(environments),
	serverApp: asClass(ServerApp).singleton(),
	errorHandler: asClass(ErrorHandler).singleton(),
	redisApp: asClass(RedisApp).singleton(),
	socketServerHandler: asClass(SocketServerHandler).singleton(),
	socketClientHandler: asClass(SocketClientHandler).singleton(),

	// bullmq workers
	emailWorker: asClass(EmailWorker).singleton(),
	whatsappWorker: asClass(WhatsappWorker).singleton(),
	smsWorker: asClass(SmsWorker).singleton(),

	// worker services
	emailWorkerService: asClass(EmailWorkerService).singleton(),
	whatsappWorkerService: asClass(WhatsappWorkerService).singleton(),
	smsWorkerService: asClass(SmsWorkerService).singleton(),

	// bullmq queues
	emailQueue: asClass(EmailQueue).singleton(),
	whatsappQueue: asClass(WhatsappQueue).singleton(),
	smsQueue: asClass(SmsQueue).singleton(),

	// socket server
	socketServer: asClass(SocketServer).singleton(),

	// socket client
	socketClient: asClass(SocketClient).singleton(),

	//Controllers
	whatsappController: asClass(WhatsappController).singleton(),
	emailController: asClass(EmailController).singleton(),
	smsController: asClass(SmsController).singleton(),
	controllers: asFunction(function () {
		const containerInstance = iocContainer;

		return controllerModules.map((module) => containerInstance.resolve(module.name));
	}).singleton(),

	// providers
	databaseProvider: asClass(DatabaseProvider).singleton(),
	emailProvider: asClass(EmailProvider).singleton(),

	// notifiers
	emailNotifier: asClass(EmailNotifier).singleton(),

	// db services
	channelTypeService: asClass(ChannelTypeService).singleton(),
	companyService: asClass(CompanyService).singleton(),
	channelService: asClass(ChannelService).singleton(),

	// db seeders
	dbSeed: asClass(DbSeed).singleton(),

	// controller services
	emailService: asClass(EmailService).singleton(),
});

export { iocContainer };
