import { vi, describe, beforeEach, afterEach, test, expect } from "vitest";
import { transformDevicesSubscriptionsInMap } from "../../src/common/transform-devices-subscriptions-in-map.js";

describe("Transform devices subscriptions in map test", () => {
	const validSubscriptions = [
		{
			backend: {
				uuid: "backend-uuid-1",
				info: { address: "192.168.1.1", apiPort: "8000" },
				databases: [{ name: "db1" }, { name: "db2" }],
			},
		},
	];

	beforeEach(() => {});

	afterEach(() => {
		vi.clearAllMocks();
	});

	test.each([
		{ cases: "input is undefined", input: undefined, expectedSize: 0 },
		{ cases: "input is empty array", input: [], expectedSize: 0 },
		{
			cases: "input has one valid subscription",
			input: validSubscriptions,
			expectedSize: 1,
		},
		{
			cases: "input has two identical valid subscriptions",
			input: [...validSubscriptions, ...validSubscriptions],
			expectedSize: 1,
		},
		{
			cases: "input has one valid and one invalid subscription",
			input: [...validSubscriptions, { backend: { uuid: "backend-uuid-2" } }],
			expectedSize: 1,
		},
	])("should return a map with $expectedSize items when $cases", ({ input, expectedSize }) => {
		// WHEN
		const resourcesMap = transformDevicesSubscriptionsInMap(input);

		// THEN
		expect(resourcesMap).toBeDefined();
		expect(resourcesMap.size).toBe(expectedSize);
	});

	test("should return a map  with union databases of inputs", () => {
		// GIVEN
		const subscriptions = [
			...validSubscriptions,
			{
				...validSubscriptions[0],
				backend: { ...validSubscriptions[0].backend, databases: [{ name: "db3" }] },
			},
		];

		// WHEN
		const resourceMap = transformDevicesSubscriptionsInMap(subscriptions);
		const backendData = resourceMap.get("backend-uuid-1");

		// THEN
		expect(resourceMap).toBeDefined();
		expect(resourceMap.size).toBe(1);
		expect(backendData).toBeDefined();
		expect(backendData.databases).toEqual(expect.arrayContaining(["db1", "db2", "db3"]));
	});
});
