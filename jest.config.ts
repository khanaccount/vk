import type { Config } from "jest"
import { pathsToModuleNameMapper } from "ts-jest"
import { compilerOptions } from "./tsconfig.json"

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    moduleNameMapper: {
        ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: "<rootDir>/" }),
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    },
    setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
    testMatch: ["**/__tests__/**/*.test.[jt]s?(x)"],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
    },
    globals: {
        "ts-jest": {
            tsconfig: "tsconfig.json",
        },
    },
}

export default config
