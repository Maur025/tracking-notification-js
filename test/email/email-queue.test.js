import { vi, describe, beforeEach, afterEach, test, expect } from "vitest";
import { EmailQueue } from "../../src/email/email-queue.js";

describe("EmailQueue", () => {
	const expectedQueueName = "emailQueue";
	let emailQueue;

	let mockBullmq;
	let mockQueueAdd;

	beforeEach(() => {
		mockQueueAdd = vi.fn();

		class MockQueue {
			// eslint-disable-next-line no-unused-vars
			constructor(queueName) {}
			add = mockQueueAdd;
		}

		mockBullmq = {
			Queue: MockQueue,
		};

		emailQueue = new EmailQueue({ bullmq: mockBullmq });
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	test("should return instance of email queue", () => {
		const queueInstance = emailQueue.getQueue();

		expect(queueInstance).toBeDefined();
		expect(queueInstance).toBeInstanceOf(mockBullmq.Queue);
	});

	test("should add job to the email queue", async () => {
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

		const jobName = "send.email";
		const payload = { greeting: "Hello, World!" };

		const result = await emailQueue.addToQueue(jobName, payload);

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
