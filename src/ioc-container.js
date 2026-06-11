import { asClass, asFunction, asValue, createContainer, InjectionMode, listModules } from "awilix";
import { environments } from "./environments.js";
import express from "express";
import ioredis from "ioredis";
import bullmq from "bullmq";
import nodemailer from "nodemailer";
import playwright from "playwright";
import { ServerApp } from "./server/server-app.js";
import { WhatsappController } from "./whatsapp/controller/whatsapp.controller.js";
import { EmailController } from "./email/controller/email.controller.js";
import { SocketServer } from "./socket/socket-server.js";
import { ContainerAdapter } from "./container-adapter.js";

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

	//Container
	container: asValue(iocContainer),
	containerAdapter: asClass(ContainerAdapter).singleton(),

	// Configurations
	environments: asValue(environments),
	serverApp: asClass(ServerApp).singleton(),

	// socket server
	socketServer: asClass(SocketServer).singleton(),

	//Controllers
	whatsappController: asClass(WhatsappController).singleton(),
	emailController: asClass(EmailController).singleton(),

	controllers: asFunction(function () {
		const containerInstance = iocContainer;

		return controllerModules.map((module) => containerInstance.resolve(module.name));
	}).singleton(),
});

export { iocContainer };
