import { vi, describe, beforeEach, afterEach, test, expect } from "vitest";
import { SmsWorker } from "../../src/sms/sms-worker.js";

describe("SmsWorker", () => {
	const expectedTopicName = "smsQueue";

	let smsWorker;

	let mockBullmq;
	let mockWorkerOn;

	let mockContainerAdapter;
	let mockRegisterValue;

	const smsWorkerServiceMock = {};
	const redisConnectionMock = {};

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

		smsWorker = new SmsWorker({
			bullmq: mockBullmq,
			containerAdapter: mockContainerAdapter,
			smsWorkerService: smsWorkerServiceMock,
		});
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	test("should return topic name when call method getWorkerTopic", () => {
		const topicName = smsWorker.getWorkerTopic();

		expect(topicName).toBe(expectedTopicName);
	});

	test("should initialize when call method then create new worker instance ", () => {
		const workerOnCompletedEvent = "completed";
		const workerOnFailedEvent = "failed";
		const expectedNameRegister = "smsBullmqWorker";

		smsWorker.initialize(redisConnectionMock);

		expect(mockWorkerOn).toHaveBeenCalledTimes(2);
		expect(mockWorkerOn).toHaveBeenCalledWith(workerOnCompletedEvent, expect.any(Function));
		expect(mockWorkerOn).toHaveBeenCalledWith(workerOnFailedEvent, expect.any(Function));

		expect(mockRegisterValue).toHaveBeenCalledWith(expectedNameRegister, expect.any(Object));
	});
});
