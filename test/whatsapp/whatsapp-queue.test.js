import { jest, describe, beforeEach, afterEach, test, expect } from "@jest/globals";
import { WhatsappQueue } from "../../src/whatsapp/whatsapp-queue";

describe("WhatsappQueue", () => {
	const expectedQueueName = "whatsappQueue";
	let whatsappQueue;

	let mockBullmq;
	let mockQueue;
	let mockQueueAdd;

	beforeEach(() => {
		mockQueueAdd = jest.fn();

		mockQueue = jest.fn().mockImplementation(() => ({
			add: mockQueueAdd,
		}));

		mockBullmq = {
			Queue: mockQueue,
		};

		whatsappQueue = new WhatsappQueue({ bullmq: mockBullmq });
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	test("should return instance of whatsapp queue", () => {
		const queueInstance = whatsappQueue.getQueue();

		expect(queueInstance).toBeDefined();
		expect(mockQueue).toHaveBeenCalledWith(expectedQueueName);
	});

	test("should add job to the whatsapp queue", async () => {
		const expectedQueueReturn = {
			id: "1",
			queueName: expectedQueueName,
			timestamp: 1781540592,
		};

		mockQueueAdd.mockResolvedValue({
			id: "1",
			queueQualifiedName: expectedQueueName,
			timestamp: 1781540592,
		});

		const jobName = "send.whatsapp";
		const payload = { greeting: "Hello, World!" };

		const result = await whatsappQueue.addToQueue(jobName, payload);

		expect(mockQueueAdd).toHaveBeenCalledWith(
			jobName,
			payload,
			expect.objectContaining({
				attempts: 5,
			}),
		);
		expect(result).toEqual(expectedQueueReturn);
	});
});
