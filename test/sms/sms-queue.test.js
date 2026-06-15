import { jest } from "@jest/globals";
import { SmsQueue } from "../../src/sms/sms-queue";

describe("SmsQueue", () => {
	const expectedQueueName = "smsQueue";
	let smsQueue;

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

		smsQueue = new SmsQueue({ bullmq: mockBullmq });
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	test("should return instance of sms queue", () => {
		const queueInstance = smsQueue.getQueue();

		expect(queueInstance).toBeDefined();
		expect(mockQueue).toHaveBeenCalledWith(expectedQueueName);
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
