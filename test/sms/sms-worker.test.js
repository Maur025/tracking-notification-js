import { jest } from "@jest/globals";
import { SmsWorker } from "../../src/sms/sms-worker";

describe("SmsWorker", () => {
	const expectedTopicName = "smsQueue";

	let smsWorker;

	let mockBullmq;
	let mockWorkerOn;
	let mockWorker;

	let mockContainerAdapter;
	let mockRegisterValue;

	const smsWorkerServiceMock = {};
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

		smsWorker = new SmsWorker({
			bullmq: mockBullmq,
			containerAdapter: mockContainerAdapter,
			smsWorkerService: smsWorkerServiceMock,
		});
	});

	afterEach(() => {
		jest.resetAllMocks();
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
