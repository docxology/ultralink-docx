module.exports = {
  transform: {
    '^.+\\.js$': ['babel-jest']
  },
  transformIgnorePatterns: [
    'node_modules/(?!(d3|d3-array|d3-force|d3-hierarchy|d3-selection|d3-zoom|jsdom|sharp|cytoscape|internmap|delaunator)/)'
  ],
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'json'],
  setupFiles: ['<rootDir>/jest.setup.js'],
  testTimeout: 30000,
  verbose: true,
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'lcov'],
  moduleNameMapper: {
    '^d3$': '<rootDir>/node_modules/d3/dist/d3.min.js',
    '^d3-(.*)$': '<rootDir>/node_modules/d3-$1/dist/d3-$1.min.js'
  }
}; 