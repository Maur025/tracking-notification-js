import { vi, describe, beforeEach, afterEach, test, expect } from "vitest";
import { RegisterChannelOfDbConfigAction } from "../../../src/channel/action/register-channel-of-db-config.action.js";

describe("Register channel of db config action test", () => {
	/** @type {RegisterChannelOfDbConfigAction} */
	let registerChannelOfDbConfigAction;

	/** @type {import('vitest').Mock} */
	let mockChannelTypeFindAll;

	/** @type {import('vitest').Mock} */
	let mockChannelFindAllWithPagination;

	/** @type {import('vitest').Mock} */
	let mockChannelSaveBulk;

	/** @type {import('vitest').Mock} */
	let mockChannelUpdateBulk;

	/** @type {import('vitest').Mock} */
	let mockAxiosGet;

	beforeEach(() => {
		mockChannelTypeFindAll = vi.fn();
		mockChannelFindAllWithPagination = vi.fn();
		mockChannelSaveBulk = vi.fn();
		mockChannelUpdateBulk = vi.fn();
		mockAxiosGet = vi.fn();

		const mockChannelTypeService = {
			findAll: mockChannelTypeFindAll,
		};
		const mockChannelService = {
			findAllWithPagination: mockChannelFindAllWithPagination,
			saveBulk: mockChannelSaveBulk,
			updateBulk: mockChannelUpdateBulk,
		};
		const mockAxios = {
			get: mockAxiosGet,
		};

		registerChannelOfDbConfigAction = new RegisterChannelOfDbConfigAction({
			channelTypeService: mockChannelTypeService,
			channelService: mockChannelService,
			axios: mockAxios,
		});
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	test("should process configurations in request parameter", async () => {
		// GIVEN
		const configurations = [
			{
				host: "192.168.0.1",
				port: 8080,
				database: "db1",
			},
			{
				host: "192.168.0.1",
				port: 8080,
				database: "db2",
			},
		];
		mockChannelTypeFindAll.mockResolvedValue([
			{ id: 1, code: "mail_smtp" },
			{ id: 2, code: "type2" },
		]);
		mockChannelFindAllWithPagination.mockResolvedValue({
			data: [],
		});
		mockAxiosGet.mockResolvedValueOnce({
			status: 200,
			data: {
				content: [
					{
						id: "channel-1",
						name: "Test channel",
						data: '{ "params":[ {"field":"server","type":"text","value":"example.com"}, {"field":"port","type":"text","value":"1234"}, {"field":"ssl","type":"boolean","value":"true"}, {"field":"username","type":"text","value":"user@example.com"}, {"field":"password","type":"password","value":"password"} ]}',
						cprotocol_id: "protocol-1",
						cprotocol: {
							name: "mail_smtp",
							script: "",
						},
					},
				],
			},
		});
		// WHEN

		await registerChannelOfDbConfigAction.execute({ configurations });

		// THEN

		expect(mockChannelTypeFindAll).toHaveBeenCalled();
		expect(mockChannelFindAllWithPagination).toHaveBeenCalled();
		expect(mockAxiosGet).toHaveBeenCalledTimes(configurations.length);
		expect(mockChannelSaveBulk).toHaveBeenCalledWith(
			expect.arrayContaining([
				expect.objectContaining({
					channelTypeId: 1,
					host: "example.com",
					name: "Test channel",
					password: "password",
					port: 1234,
					referenceId: "channel-1",
					secure: true,
					username: "user@example.com",
				}),
			]),
		);
		expect(mockChannelUpdateBulk).not.toHaveBeenCalled();
	});
});
