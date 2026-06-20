import { jest, describe, beforeEach, afterEach, test, expect } from "@jest/globals";
import { EmailWorker } from "../../src/email/email-worker";

describe("EmailWorker", () => {
	const expectedTopicName = "emailQueue";

	let emailWorker;

	let mockBullmq;
	let mockWorkerOn;
	let mockWorker;

	let mockContainerAdapter;
	let mockRegisterValue;

	const emailWorkerServiceMock = {};
	const redisConnectionMock = {};

	beforeEach(() => {
		mockWorkerOn = jest.fn();
		mockWorker = jest.fn().mockImplementation(() => ({
			on: mockWorkerOn,
		}));
		mockBullmq = {
			Worker: mockWorker,
		};

		mockRegisterValue = jest.fn();
		mockContainerAdapter = {
			registerValue: mockRegisterValue,
		};

		emailWorker = new EmailWorker({
			bullmq: mockBullmq,
			containerAdapter: mockContainerAdapter,
			emailWorkerService: emailWorkerServiceMock,
		});
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	test("should return topic name when call method getWorkerTopic", () => {
		const topicName = emailWorker.getWorkerTopic();

		expect(topicName).toBe(expectedTopicName);
	});

	test("should initialize when call method then create new worker instance ", () => {
		const workerOnCompletedEvent = "completed";
		const workerOnFailedEvent = "failed";
		const expectedNameRegister = "emailBullmqWorker";

		emailWorker.initialize(redisConnectionMock);

		expect(mockWorker).toHaveBeenCalledWith(
			expectedTopicName,
			expect.any(Function),
			expect.objectContaining({
				connection: redisConnectionMock,
				concurrency: 15,
			}),
		);

		expect(mockWorkerOn).toHaveBeenCalledTimes(2);
		expect(mockWorkerOn).toHaveBeenCalledWith(workerOnCompletedEvent, expect.any(Function));
		expect(mockWorkerOn).toHaveBeenCalledWith(workerOnFailedEvent, expect.any(Function));

		expect(mockRegisterValue).toHaveBeenCalledWith(expectedNameRegister, expect.any(Object));
	});
});
