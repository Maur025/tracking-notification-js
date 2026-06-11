import { asClass, asFunction, asValue } from "awilix";

export class ContainerAdapter {
	#container;

	constructor({ container }) {
		this.#container = container;
	}

	getContainer() {
		return this.#container;
	}

	resolve(dependencyName) {
		return this.#container.resolve(dependencyName);
	}

	registerValue(key, value) {
		this.#container.register({
			[key]: asValue(value),
		});
	}

	registerFunction(key, fn) {
		this.#container.register({
			[key]: asFunction(fn),
		});
	}

	registerClass(key, clazz, lifetime = "TRANSIENT") {
		this.#container.register({
			[key]: asClass(clazz).setLifetime(lifetime),
		});
	}
}
