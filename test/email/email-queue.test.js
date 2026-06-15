import { jest } from "@jest/globals";
import { EmailQueue } from "../../src/email/email-queue";

describe("EmailQueue", () => {
	const expectedQueueName = "emailQueue";
	let emailQueue;

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

		emailQueue = new EmailQueue({ bullmq: mockBullmq });
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	test("should return instance of email queue", () => {
		const queueInstance = emailQueue.getQueue();

		expect(queueInstance).toBeDefined();
		expect(mockQueue).toHaveBeenCalledWith(expectedQueueName);
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
