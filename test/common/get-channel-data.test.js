import { getChannelData } from "../../src/common/get-channel-data";

describe("getChannelData", () => {
	const channelDataResponseJson = {
		params: [
			{
				field: "server",
				type: "text",
				value: "correo.kernotec.com",
			},
			{
				field: "port",
				type: "text",
				value: "465",
			},
			{
				field: "ssl",
				type: "boolean",
				value: "true",
			},
			{
				field: "username",
				type: "text",
				value: "soporte",
			},
			{
				field: "password",
				type: "password",
				value: "12345",
			},
		],
		userparams: [
			{
				field: "tomail",
				description: "A",
				type: "mail",
				default: "",
			},
			{
				field: "title",
				description: "Titulo",
				type: "text",
				default: "",
			},
			{
				field: "message",
				description: "Mensaje",
				type: "text",
				default: "",
			},
		],
	};

	beforeEach(() => {});

	afterEach(() => {});

	test("should return channel data with params and userParams", () => {
		const channelDataResponse = JSON.stringify(channelDataResponseJson);

		const channelData = getChannelData(channelDataResponse);

		expect(channelData).toBeDefined();
		expect(channelData.params).toEqual(channelDataResponseJson.params);
		expect(channelData.userParams).toEqual(channelDataResponseJson.userparams);
	});

	test("should return empty array for userParams if userparams is not present", () => {
		const channelDataResponse = JSON.stringify({
			params: channelDataResponseJson.params,
		});

		const channelData = getChannelData(channelDataResponse);
		expect(channelData.userParams).toEqual([]);
	});
});
