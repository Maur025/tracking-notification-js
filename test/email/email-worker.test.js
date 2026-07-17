import { vi, describe, beforeEach, afterEach, test, expect } from "vitest";
import { EmailWorker } from "../../src/email/email-worker.js";

describe("EmailWorker", () => {
	const expectedTopicName = "emailQueue";

	let emailWorker;

	let mockBullmq;
	let mockWorkerOn;

	let mockContainerAdapter;
	let mockRegisterValue;

	const emailWorkerServiceMock = {};
	const redisConnectionMock = {};

	const mockEnvironments = {};

	beforeEach(() => {
		mockWorkerOn = vi.fn();
		class MockWorker {
			// eslint-disable-next-line no-unused-vars
			constructor(topic, callback, options) {}
			on = mockWorkerOn;
		}

		mockBullmq = {
			Worker: MockWorker,
		};

		mockRegisterValue = vi.fn();
		mockContainerAdapter = {
			registerValue: mockRegisterValue,
		};

		emailWorker = new EmailWorker({
			bullmq: mockBullmq,
			containerAdapter: mockContainerAdapter,
			emailWorkerService: emailWorkerServiceMock,
			environments: mockEnvironments,
		});
	});

	afterEach(() => {
		vi.clearAllMocks();
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

		expect(mockWorkerOn).toHaveBeenCalledTimes(2);
		expect(mockWorkerOn).toHaveBeenCalledWith(workerOnCompletedEvent, expect.any(Function));
		expect(mockWorkerOn).toHaveBeenCalledWith(workerOnFailedEvent, expect.any(Function));

		expect(mockRegisterValue).toHaveBeenCalledWith(expectedNameRegister, expect.any(Object));
	});
});
