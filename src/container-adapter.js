import { asClass, asFunction, asValue } from "awilix";

export class ContainerAdapter {
	#container;

	/**
	 * @param {Object} request
	 * @param {import("awilix").AwilixContainer} request.container
	 */
	constructor({ container }) {
		this.#container = container;
	}

	getContainer() {
		return this.#container;
	}

	/** @param {string} dependencyName */
	resolve(dependencyName) {
		return this.#container.resolve(dependencyName);
	}

	/**
	 * @param {string} key
	 * @param {any} value
	 */
	registerValue(key, value) {
		this.#container.register({
			[key]: asValue(value),
		});
	}

	/**
	 * @param {string} key
	 * @param {Function} value
	 */
	registerFunction(key, fn) {
		this.#container.register({
			[key]: asFunction(fn),
		});
	}

	/**
	 * @param {string} key
	 * @param {class} clazz
	 * @param {string} lifetime
	 */
	registerClass(key, clazz, lifetime = "TRANSIENT") {
		this.#container.register({
			[key]: asClass(clazz).setLifetime(lifetime),
		});
	}
}
