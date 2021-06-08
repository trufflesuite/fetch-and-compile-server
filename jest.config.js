module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: [
    "<rootDir>/src/**/test/*.(ts|js)",
    "<rootDir>/test/**/test/*.(ts|js)",
    "<rootDir>/src/**/*\\.(spec|test)\\.(ts|js)",
    "<rootDir>/test/**/*\\.(spec|test)\\.(ts|js)"
  ]
};
