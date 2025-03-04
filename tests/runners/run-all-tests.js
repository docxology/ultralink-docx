const { spawn } = require('child_process');
const path = require('path');

// Configuration for test sequence
const TEST_SEQUENCE = [
  {
    name: 'Unit Tests',
    command: 'npm',
    args: ['run', 'test:unit'],
    required: true
  },
  {
    name: 'Integration Tests',
    command: 'npm',
    args: ['run', 'test:integration'],
    required: true
  },
  {
    name: 'System Export Tests',
    command: 'npm',
    args: ['run', 'test:exports'],
    required: true
  },
  {
    name: 'End-to-End Tests',
    command: 'npm',
    args: ['run', 'test:e2e'],
    required: true
  },
  {
    name: 'Performance Tests',
    command: 'npm',
    args: ['run', 'test:performance'],
    required: false
  }
];

// Test results storage
const results = {
  startTime: new Date(),
  endTime: null,
  tests: [],
  summary: {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0
  }
};

// Execute a single test command
function runTest(test) {
  return new Promise((resolve, reject) => {
    console.log(`\n🚀 Running ${test.name}...`);
    
    const startTime = new Date();
    const process = spawn(test.command, test.args, {
      stdio: 'inherit',
      shell: true
    });

    process.on('close', (code) => {
      const endTime = new Date();
      const duration = endTime - startTime;

      const result = {
        name: test.name,
        status: code === 0 ? 'passed' : 'failed',
        duration,
        startTime,
        endTime
      };

      results.tests.push(result);
      
      if (code === 0) {
        results.summary.passed++;
        console.log(`✅ ${test.name} passed (${duration}ms)`);
        resolve(result);
      } else if (!test.required) {
        results.summary.skipped++;
        console.log(`⚠️ ${test.name} failed but was not required`);
        console.log(`   Test command: ${test.command} ${test.args.join(' ')}`);
        resolve(result);
      } else {
        results.summary.failed++;
        console.log(`❌ ${test.name} failed with exit code ${code}`);
        console.log(`   Test command: ${test.command} ${test.args.join(' ')}`);
        
        // Detailed logging for failed tests
        result.error = {
          code,
          message: `Test '${test.name}' failed with exit code ${code}`
        };
        
        reject(new Error(`${test.name} failed with exit code ${code}`));
      }
    });
  });
}

// Main test execution function
async function runAllTests() {
  console.log('🧪 Starting UltraLink Test Suite\n');
  console.log('📋 Tests will run in the following order:');
  TEST_SEQUENCE.forEach((test, index) => {
    console.log(`   ${index + 1}. ${test.name} (${test.required ? 'required' : 'optional'})`);
  });
  console.log('\n');

  try {
    for (const test of TEST_SEQUENCE) {
      results.summary.total++;
      try {
        await runTest(test);
      } catch (error) {
        console.error(`   ❌ Error details: ${error.message}`);
        
        if (test.required) {
          throw error; // Re-throw if it's a required test
        }
      }
    }

    results.endTime = new Date();
    const totalDuration = results.endTime - results.startTime;

    // Print final summary
    console.log('\n📊 Test Suite Summary');
    console.log('===================');
    console.log(`Total Duration: ${totalDuration}ms`);
    console.log(`Total Tests: ${results.summary.total}`);
    console.log(`Passed: ${results.summary.passed}`);
    console.log(`Failed: ${results.summary.failed}`);
    console.log(`Skipped: ${results.summary.skipped}`);
    
    // Print detailed results
    console.log('\n📝 Test Results:');
    results.tests.forEach(test => {
      const statusIcon = test.status === 'passed' ? '✅' : test.status === 'failed' ? '❌' : '⚠️';
      console.log(`${statusIcon} ${test.name}: ${test.status.toUpperCase()} (${test.duration}ms)`);
    });

    // Save test report
    const reportPath = path.join(__dirname, '../../output/test-report.json');
    require('fs').writeFileSync(
      reportPath,
      JSON.stringify(results, null, 2)
    );
    console.log(`\n📝 Full test report saved to ${reportPath}`);

    // Exit with success if all required tests passed
    const requiredTestsFailed = results.tests
      .filter(t => TEST_SEQUENCE.find(seq => seq.name === t.name).required)
      .some(t => t.status === 'failed');

    process.exit(requiredTestsFailed ? 1 : 0);

  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
    
    // Create a test report even if the suite fails
    results.endTime = new Date();
    results.error = error.message;
    
    const reportPath = path.join(__dirname, '../../output/test-report-failed.json');
    require('fs').writeFileSync(
      reportPath,
      JSON.stringify(results, null, 2)
    );
    console.log(`\n📝 Failure report saved to ${reportPath}`);
    
    process.exit(1);
  }
}

// Run the test suite
runAllTests(); 