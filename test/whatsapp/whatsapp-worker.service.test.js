import { vi, describe, beforeEach, afterEach, test } from "vitest";
import { WhatsappWorkerService } from "../../src/whatsapp/whatsapp-worker.service.js";

describe("WhatsappWorkerService", () => {
	let whatsappWorkerService;

	beforeEach(() => {
		const mockWhatsappNotifier = {};

		whatsappWorkerService = new WhatsappWorkerService({
			whatsappNotifier: mockWhatsappNotifier,
		});
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	test("should send whatsapp notification", async () => {
		const jobData = { greeting: "Hello, World!" };

		whatsappWorkerService.sendNotification({ jobData });
	});
});
