// jest.config.ts
import { pathsToModuleNameMapper } from 'ts-jest';
import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  roots: ['<rootDir>'],
  modulePaths: ['./'], // <-- This will be set to 'baseUrl' value
  moduleNameMapper: pathsToModuleNameMapper(
    {
      '@Application': ['src/application'],
      '@Application/*': ['src/application/*'],
      '@Domain': ['src/domain'],
      '@Domain/*': ['src/domain/*'],
      '@Infrastructure': ['src/infrastructure'],
      '@Infrastructure/*': ['src/infrastructure/*'],
      '@Presentation': ['src/presentation'],
      '@Presentation/*': ['src/presentation/*'],
      '@Utils': ['src/utils'],
      '@Utils/*': ['src/utils/*'],
    },
    {
      prefix: '<rootDir>/',
    },
  ),
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};

export default jestConfig;
