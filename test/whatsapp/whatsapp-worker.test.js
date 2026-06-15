import { jest } from "@jest/globals";
import { WhatsappWorker } from "../../src/whatsapp/whatsapp-worker";

describe("WhatsappWorker", () => {
	const expectedTopicName = "whatsappQueue";

	let whatsappWorker;

	let mockBullmq;
	let mockWorkerOn;
	let mockWorker;

	let mockContainerAdapter;
	let mockRegisterValue;

	const whatsappWorkerServiceMock = {};
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

		whatsappWorker = new WhatsappWorker({
			bullmq: mockBullmq,
			containerAdapter: mockContainerAdapter,
			whatsappWorkerService: whatsappWorkerServiceMock,
		});
	});

	afterEach(() => {
		jest.resetAllMocks();
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

		expect(mockWorker).toHaveBeenCalledWith(
			expectedTopicName,
			expect.any(Function),
			expect.objectContaining({
				connection: redisConnectionMock,
			}),
		);

		expect(mockWorkerOn).toHaveBeenCalledTimes(2);
		expect(mockWorkerOn).toHaveBeenCalledWith(workerOnCompletedEvent, expect.any(Function));
		expect(mockWorkerOn).toHaveBeenCalledWith(workerOnFailedEvent, expect.any(Function));

		expect(mockRegisterValue).toHaveBeenCalledWith(expectedNameRegister, expect.any(Object));
	});
});
