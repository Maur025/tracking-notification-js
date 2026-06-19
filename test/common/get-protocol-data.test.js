import { describe, test, expect } from "@jest/globals";
import { getProtocolData } from "../../src/common/get-protocol-data";

describe("getProtocolData", () => {
	test("should return an object with id, name, and script properties", () => {
		const protocolDataInput = {
			id: 1,
			name: "Test Protocol",
			script: "console.log('Hello, World!');",
			greeting: "Hello",
			otherValue: 42,
		};

		const expectedOutput = {
			id: 1,
			name: "Test Protocol",
			script: "console.log('Hello, World!');",
		};

		const protocolData = getProtocolData(protocolDataInput);

		expect(protocolData).toBeDefined();
		expect(protocolData).toEqual(expectedOutput);
	});
});
