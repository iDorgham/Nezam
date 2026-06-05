import * as crypto from 'node:crypto';
import * as fs from 'node:fs';
import * as path from 'node:path';

export interface WebVitals {
  lcp: number; // Largest Contentful Paint (s)
  cls: number; // Cumulative Layout Shift
  inp: number; // Interaction to Next Paint (ms)
}

export interface BudgetReport {
  url: string;
  lcpOk: boolean;
  clsOk: boolean;
  inpOk: boolean;
  passed: boolean;
}

export class SentryIntegration {
  private static errors: Array<{ error: Error; context?: Record<string, any>; timestamp: string }> = [];

  static captureError(error: Error, context?: Record<string, any>): void {
    const errorLog = {
      error,
      context,
      timestamp: new Date().toISOString()
    };
    this.errors.push(errorLog);
    console.error(`[Sentry Alert] Captured error: "${error.message}"`, JSON.stringify(context || {}));
  }

  static trackLatency(operation: string, latencyMs: number): void {
    // p50/p99 alerts simulation
    const thresholdP99 = 2000; // 2 seconds threshold
    if (latencyMs > thresholdP99) {
      console.warn(`[Sentry Alert] Latency threshold exceeded for "${operation}": ${latencyMs}ms (Threshold: ${thresholdP99}ms)`);
    } else {
      console.log(`[Sentry Telemetry] Operation "${operation}" completed in ${latencyMs}ms`);
    }
  }

  static getErrors() {
    return this.errors;
  }
}

export class WebVitalsCollector {
  private static metricsStore: Record<string, WebVitals[]> = {};
  
  // Budgets
  private static budgets: WebVitals = {
    lcp: 2.5, // Good threshold
    cls: 0.1,  // Good threshold
    inp: 200   // Good threshold
  };

  static collect(url: string, metrics: WebVitals): void {
    if (!this.metricsStore[url]) {
      this.metricsStore[url] = [];
    }
    this.metricsStore[url].push(metrics);
    console.log(`[WebVitals Telemetry] Collected for ${url}: LCP=${metrics.lcp}s, CLS=${metrics.cls}, INP=${metrics.inp}ms`);
  }

  static checkBudgets(url: string): BudgetReport {
    const records = this.metricsStore[url];
    if (!records || records.length === 0) {
      return { url, lcpOk: true, clsOk: true, inpOk: true, passed: true };
    }
    
    // Average metrics
    const avg = records.reduce(
      (acc, r) => {
        acc.lcp += r.lcp;
        acc.cls += r.cls;
        acc.inp += r.inp;
        return acc;
      },
      { lcp: 0, cls: 0, inp: 0 }
    );
    
    avg.lcp /= records.length;
    avg.cls /= records.length;
    avg.inp /= records.length;

    const lcpOk = avg.lcp <= this.budgets.lcp;
    const clsOk = avg.cls <= this.budgets.cls;
    const inpOk = avg.inp <= this.budgets.inp;
    const passed = lcpOk && clsOk && inpOk;

    if (!passed) {
      console.warn(`[WebVitals Alert] Budget exceeded for ${url}: LCP=${avg.lcp.toFixed(2)}s (budget: ${this.budgets.lcp}s), CLS=${avg.cls.toFixed(3)} (budget: ${this.budgets.cls}), INP=${avg.inp.toFixed(0)}ms (budget: ${this.budgets.inp}ms)`);
    }

    return { url, lcpOk, clsOk, inpOk, passed };
  }

  static clear() {
    this.metricsStore = {};
  }
}

export class StructuredLogger {
  private static defaultContext: Record<string, any> = {};

  static setGlobalContext(context: Record<string, any>): void {
    this.defaultContext = { ...this.defaultContext, ...context };
  }

  static log(level: 'info' | 'warn' | 'error', message: string, context?: Record<string, any>): void {
    const traceId = context?.traceId || crypto.randomUUID();
    const userId = context?.userId || this.defaultContext.userId || 'anonymous';
    
    const structuredLog = {
      timestamp: new Date().toISOString(),
      level: level.toUpperCase(),
      message,
      traceId,
      userId,
      ...this.defaultContext,
      ...context
    };

    const logStr = JSON.stringify(structuredLog);
    
    // Output log
    if (level === 'error') {
      console.error(logStr);
    } else if (level === 'warn') {
      console.warn(logStr);
    } else {
      console.log(logStr);
    }
    
    // Write locally to file simulated Grafana ingestion
    try {
      const logsDir = path.join(process.cwd(), '.nezam/logs');
      fs.mkdirSync(logsDir, { recursive: true });
      fs.appendFileSync(path.join(logsDir, 'structured.log'), logStr + '\n', 'utf8');
    } catch {
      // Ignore write errors in environments without write access
    }
  }
}
