const { compilerOptions } = require("./tsconfig.json");

const fromPairs = pairs =>
    pairs.reduce((res, [key, value]) => ({ ...res, [key]: value }), {});

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest}} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/**/*.test.ts"],
    verbose: true,
    forceExit: true,
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
    moduleNameMapper: fromPairs(
        Object.entries(compilerOptions.paths).map(([k, [v]]) => [
            k.replace(/\*/, "(.*)"),
            `<rootDir>/src/${v.replace(/\*/, "$1")}`
        ])
    )
};
