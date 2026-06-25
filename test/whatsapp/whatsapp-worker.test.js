import { vi, describe, beforeEach, afterEach, test, expect } from "vitest";
import { WhatsappWorker } from "../../src/whatsapp/whatsapp-worker.js";

describe("WhatsappWorker", () => {
	const expectedTopicName = "whatsappQueue";

	let whatsappWorker;

	let mockBullmq;
	let mockWorkerOn;

	let mockContainerAdapter;
	let mockRegisterValue;

	const whatsappWorkerServiceMock = {};
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

		whatsappWorker = new WhatsappWorker({
			bullmq: mockBullmq,
			containerAdapter: mockContainerAdapter,
			whatsappWorkerService: whatsappWorkerServiceMock,
		});
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	test("should return topic name when call method getWorkerTopic", () => {
		const topicName = whatsappWorker.getWorkerTopic();

		expect(topicName).toBe(expectedTopicName);
	});

	test("should initialize when call method then create new worker instance ", () => {
		const workerOnCompletedEvent = "completed";
		const workerOnFailedEvent = "failed";
		const expectedNameRegister = "whatsappBullmqWorker";

		whatsappWorker.initialize(redisConnectionMock);

		expect(mockWorkerOn).toHaveBeenCalledTimes(2);
		expect(mockWorkerOn).toHaveBeenCalledWith(workerOnCompletedEvent, expect.any(Function));
		expect(mockWorkerOn).toHaveBeenCalledWith(workerOnFailedEvent, expect.any(Function));

		expect(mockRegisterValue).toHaveBeenCalledWith(expectedNameRegister, expect.any(Object));
	});
});
