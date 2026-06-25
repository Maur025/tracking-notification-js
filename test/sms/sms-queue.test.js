import { vi, describe, beforeEach, afterEach, test, expect } from "vitest";
import { SmsQueue } from "../../src/sms/sms-queue.js";

describe("SmsQueue", () => {
	const expectedQueueName = "smsQueue";
	let smsQueue;

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

		smsQueue = new SmsQueue({ bullmq: mockBullmq });
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	test("should return instance of sms queue", () => {
		const queueInstance = smsQueue.getQueue();

		expect(queueInstance).toBeDefined();
		expect(queueInstance).toBeInstanceOf(mockBullmq.Queue);
	});

	test("should add job to the sms queue", async () => {
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

		const jobName = "send.sms";
		const payload = { greeting: "Hello, World!" };

		const result = await smsQueue.addToQueue(jobName, payload);

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
