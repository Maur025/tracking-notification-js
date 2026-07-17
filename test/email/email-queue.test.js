import { vi, describe, beforeEach, afterEach, test, expect } from "vitest";
import { EmailQueue } from "../../src/email/email-queue.js";

describe("EmailQueue", () => {
	const expectedQueueName = "emailQueue";
	let emailQueue;

	let mockBullmq;
	let mockQueueAdd;

	const mockEnvironments = {
		EMAIL_QUEUE_ATTEMPTS: 6,
		EMAIL_QUEUE_BACKOFF_DELAY: 5000,
	};

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

		emailQueue = new EmailQueue({ bullmq: mockBullmq, environments: mockEnvironments });
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
				attempts: mockEnvironments.EMAIL_QUEUE_ATTEMPTS,
				backoff: {
					type: "exponential",
					delay: mockEnvironments.EMAIL_QUEUE_BACKOFF_DELAY,
				},
			}),
		);
		expect(result).toEqual(expectedQueueReturn);
	});
});
