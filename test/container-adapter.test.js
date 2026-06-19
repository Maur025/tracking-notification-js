import { jest, describe, beforeEach, test, expect } from "@jest/globals";
import { ContainerAdapter } from "../src/container-adapter";

describe("ContainerAdapter", () => {
	let containerMock;
	let containerDependencies;
	let containerAdapter;

	let containerResolveMock;
	let containerRegisterMock;

	beforeEach(() => {
		containerDependencies = { greeting: "Hello, World!" };

		containerResolveMock = jest.fn();
		containerRegisterMock = jest.fn();

		containerMock = {
			resolve: containerResolveMock,
			register: containerRegisterMock,
		};

		containerAdapter = new ContainerAdapter({ container: containerMock });
	});

	test("should return the container instance", () => {
		const containerInstance = containerAdapter.getContainer();

		expect(containerInstance).toBeDefined();
		expect(containerInstance).toBe(containerMock);
	});

	test("should resolve a dependency", () => {
		const dependencyName = "greeting";
		containerResolveMock.mockReturnValue(containerDependencies.greeting);

		const resolvedValue = containerAdapter.resolve(dependencyName);

		expect(resolvedValue).toBeDefined();
		expect(resolvedValue).toBe(containerDependencies.greeting);
	});

	test("should register a value", () => {
		const key = "username";
		const value = "testUser";

		containerAdapter.registerValue(key, value);

		expect(containerRegisterMock).toHaveBeenCalledWith({
			[key]: expect.any(Object),
		});
	});

	test("should register a function", () => {
		const key = "greet";
		const fn = () => "Hello!";

		containerAdapter.registerFunction(key, fn);

		expect(containerRegisterMock).toHaveBeenCalledWith({
			[key]: expect.any(Object),
		});
	});

	test("should register a class with default lifetime", () => {
		class TestClass {}
		const key = "TestClass";

		containerAdapter.registerClass(key, TestClass);

		expect(containerRegisterMock).toHaveBeenCalledWith({
			[key]: expect.any(Object),
		});
	});

	test("should register a class with specified lifetime", () => {
		class TestClass {}
		const key = "TestClass";
		const lifetime = "SINGLETON";

		containerAdapter.registerClass(key, TestClass, lifetime);

		expect(containerRegisterMock).toHaveBeenCalledWith({
			[key]: expect.any(Object),
		});
	});
});
