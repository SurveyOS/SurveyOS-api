/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  moduleFileExtensions: ['js', 'json', 'ts'],
  roots: ['src'],
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
  ],
  coverageDirectory: '../coverage',
  modulePaths: ["<rootDir>/src/"],
  moduleDirectories: ["node_modules", "src", __dirname],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  }
};