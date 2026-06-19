/** @type {import('jest').Config} */
const config = {
	testEnvironment: "node",
	watchPathIgnorePatterns: ["<rootDir>/node_modules/"],
	coveragePathIgnorePatterns: ["/node_modules/"],

	injectGlobals: false,
};

export default config;
