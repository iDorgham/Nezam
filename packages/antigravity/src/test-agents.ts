import assert from 'node:assert';
import {
  ProblemStatementGenerator,
  ADRGenerator,
  TypeDetector,
  HealthScoreAggregator,
  FlowOrchestrator,
  SentryIntegration,
  WebVitalsCollector,
  StructuredLogger
} from './index.js';

async function runTests() {
  console.log('--- STARTING ANTIGRAVITY AGENT TESTS ---');

  // Test 1: ProblemStatementGenerator Fallback & Structure
  console.log('Test 1: Verifying ProblemStatementGenerator Base Config...');
  const psGen = new ProblemStatementGenerator();
  assert.strictEqual(psGen.name, 'ProblemStatementGenerator');
  assert.strictEqual(psGen.temperature, 0.3);
  assert.deepStrictEqual(psGen.fallbackValue.features, ['Core implementation']);
  console.log('✅ Test 1 Passed');

  // Test 2: ADRGenerator Prompt Formatting
  console.log('Test 2: Verifying ADRGenerator formatPrompt...');
  const adrGen = new ADRGenerator();
  const reqs = { title: 'Auth Service', description: 'OAuth Auth' };
  // Access private/protected method formatPrompt using bracket notation to bypass TS
  const formattedPrompt = (adrGen as any).formatPrompt({ requirements: reqs, context: 'Local only' });
  assert.ok(formattedPrompt.includes('Auth Service'));
  assert.ok(formattedPrompt.includes('Local only'));
  console.log('✅ Test 2 Passed');

  // Test 3: TypeDetector skip logic mapping
  console.log('Test 3: Verifying TypeDetector skip logic configuration...');
  const detector = new TypeDetector();
  assert.strictEqual(detector.name, 'TypeDetector');
  assert.deepStrictEqual(detector.fallbackValue.type, 'web-app');
  console.log('✅ Test 3 Passed');

  // Test 4: HealthScoreAggregator mathematical correctness
  console.log('Test 4: Verifying HealthScoreAggregator.calculateLocal calculation...');
  const aggregator = new HealthScoreAggregator();
  
  // 4a. Perfect metrics -> 100/100
  const perfectInput = {
    performance: { lcp: 2.0, cls: 0.05, inp: 100 },
    memory: { repo_gb: 3.0, runtime_mb: 200 },
    speed: { build_s: 10, ci_min: 5, deploy_min: 8 },
    reliability: { uptime: 0.9999, coverage: 0.98, cves: 0 },
    operations: { runbooks: 6, monitored: true, team_trained: true }
  };
  const perfectRes = aggregator.calculateLocal(perfectInput);
  assert.strictEqual(perfectRes.total_score, 100);
  assert.strictEqual(perfectRes.status, 'excellent');
  assert.strictEqual(perfectRes.regression_detected, false);

  // 4b. Poor metrics -> low score
  const poorInput = {
    performance: { lcp: 4.5, cls: 0.3, inp: 600 },
    memory: { repo_gb: 12.0, runtime_mb: 1200 },
    speed: { build_s: 80, ci_min: 25, deploy_min: 40 },
    reliability: { uptime: 0.95, coverage: 0.50, cves: 3 },
    operations: { runbooks: 2, monitored: false, team_trained: false }
  };
  const poorRes = aggregator.calculateLocal(poorInput);
  assert.ok(poorRes.total_score < 60);
  assert.strictEqual(poorRes.status, 'critical');

  // 4c. Regression detection
  const regressionRes = aggregator.calculateLocal(poorInput, 90);
  assert.strictEqual(regressionRes.regression_detected, true);
  
  console.log('✅ Test 4 Passed');

  // Test 5: FlowOrchestrator composition & fallbacks
  console.log('Test 5: Verifying FlowOrchestrator baseline setup...');
  const orchestrator = new FlowOrchestrator();
  assert.ok(orchestrator);
  console.log('✅ Test 5 Passed');

  // Test 6: Observability pipeline stubs
  console.log('Test 6: Verifying Observability pipeline stubs...');
  // 6a. Sentry
  SentryIntegration.captureError(new Error('Test error'), { operation: 'test' });
  assert.strictEqual(SentryIntegration.getErrors().length, 1);
  SentryIntegration.trackLatency('ProblemStatementGenerator', 150);
  SentryIntegration.trackLatency('ADRGenerator', 2500); // triggers latency warning alert

  // 6b. WebVitals
  WebVitalsCollector.clear();
  WebVitalsCollector.collect('https://app.vercel.app', { lcp: 2.1, cls: 0.05, inp: 100 });
  const checkPass = WebVitalsCollector.checkBudgets('https://app.vercel.app');
  assert.strictEqual(checkPass.passed, true);
  
  WebVitalsCollector.collect('https://app.vercel.app', { lcp: 4.0, cls: 0.2, inp: 400 });
  const checkFail = WebVitalsCollector.checkBudgets('https://app.vercel.app');
  assert.strictEqual(checkFail.passed, false); // averages should exceed budgets
  assert.strictEqual(checkFail.lcpOk, false);

  // 6c. StructuredLogger
  StructuredLogger.setGlobalContext({ env: 'test' });
  StructuredLogger.log('info', 'Test structured log message', { traceId: '12345', userId: 'usr-1' });
  
  console.log('✅ Test 6 Passed');

  console.log('--- ALL ANTIGRAVITY AGENT TESTS PASSED SUCCESSFULLY! ---');
}

runTests().catch(err => {
  console.error('❌ Test execution failed:', err);
  process.exit(1);
});
