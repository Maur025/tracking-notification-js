import { vi, describe, beforeEach, afterEach, test, expect } from "vitest";
import { WhatsappQueue } from "../../src/whatsapp/whatsapp-queue.js";

describe("WhatsappQueue", () => {
	const expectedQueueName = "whatsappQueue";
	let whatsappQueue;

	let mockBullmq;
	let mockQueueAdd;

	beforeEach(() => {
		mockQueueAdd = vi.fn();

		class MockQueue {
			// eslint-disable-next-line no-unused-vars
			constructor(name) {}
			add = mockQueueAdd;
		}

		mockBullmq = {
			Queue: MockQueue,
		};

		whatsappQueue = new WhatsappQueue({ bullmq: mockBullmq });
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	test("should return instance of whatsapp queue", () => {
		const queueInstance = whatsappQueue.getQueue();

		expect(queueInstance).toBeDefined();
		expect(queueInstance).toBeInstanceOf(mockBullmq.Queue);
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
