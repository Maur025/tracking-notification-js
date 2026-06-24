import { jest, describe, beforeEach, afterEach, test, expect } from "@jest/globals";
import { EmailService } from "../../src/email/email.service.js";

describe("EmailService", () => {
	let emailService;

	let mockEmailQueue;
	let mockEmailAddToQueue;

	beforeEach(() => {
		mockEmailAddToQueue = jest.fn();
		mockEmailQueue = {
			addToQueue: mockEmailAddToQueue,
		};

		emailService = new EmailService({ emailQueue: mockEmailQueue });
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	test("should distribute emails in 2 batches with same channel id", async () => {
		const expectedChannelId = "channel1";

		const requestData = {
			toList: Array.from({ length: 35 }, (_, i) => `user${i}@example.com`),
			channelIds: [expectedChannelId],
		};

		await emailService.assignAndDistributeJobs({ requestData });

		expect(mockEmailAddToQueue).toHaveBeenCalledTimes(2);
		expect(mockEmailAddToQueue).toHaveBeenCalledWith(
			expect.any(String),
			expect.objectContaining({
				toList: requestData.toList.slice(0, 25),
				channelId: expectedChannelId,
			}),
		);
		expect(mockEmailAddToQueue).toHaveBeenCalledWith(
			expect.any(String),
			expect.objectContaining({
				toList: requestData.toList.slice(25, 35),
				channelId: expectedChannelId,
			}),
		);
	});

	test("should distribute emails in 3 batches with different channel id", async () => {
		const requestData = {
			toList: Array.from({ length: 75 }, (_, i) => `user${i}@example.com`),
			channelIds: ["channel1", "channel2", "channel3"],
		};

		await emailService.assignAndDistributeJobs({ requestData });

		expect(mockEmailAddToQueue).toHaveBeenCalledTimes(3);
		expect(mockEmailAddToQueue).toHaveBeenCalledWith(
			expect.any(String),
			expect.objectContaining({
				toList: requestData.toList.slice(0, 25),
				channelId: requestData.channelIds[0],
			}),
		);
		expect(mockEmailAddToQueue).toHaveBeenCalledWith(
			expect.any(String),
			expect.objectContaining({
				toList: requestData.toList.slice(25, 50),
				channelId: requestData.channelIds[1],
			}),
		);

		expect(mockEmailAddToQueue).toHaveBeenCalledWith(
			expect.any(String),
			expect.objectContaining({
				toList: requestData.toList.slice(50, 75),
				channelId: requestData.channelIds[2],
			}),
		);
	});

	test("should distribute emails in 4 batches with 2 channels", async () => {
		const requestData = {
			toList: Array.from({ length: 90 }, (_, i) => `user${i}@example.com`),
			channelIds: ["channel1", "channel2"],
		};

		await emailService.assignAndDistributeJobs({ requestData });

		expect(mockEmailAddToQueue).toHaveBeenCalledTimes(4);
		expect(mockEmailAddToQueue).toHaveBeenCalledWith(
			expect.any(String),
			expect.objectContaining({
				toList: requestData.toList.slice(0, 25),
				channelId: requestData.channelIds[0],
			}),
		);
		expect(mockEmailAddToQueue).toHaveBeenCalledWith(
			expect.any(String),
			expect.objectContaining({
				toList: requestData.toList.slice(25, 50),
				channelId: requestData.channelIds[1],
			}),
		);

		expect(mockEmailAddToQueue).toHaveBeenCalledWith(
			expect.any(String),
			expect.objectContaining({
				toList: requestData.toList.slice(50, 75),
				channelId: requestData.channelIds[0],
			}),
		);

		expect(mockEmailAddToQueue).toHaveBeenCalledWith(
			expect.any(String),
			expect.objectContaining({
				toList: requestData.toList.slice(75, 90),
				channelId: requestData.channelIds[1],
			}),
		);
	});
});
