import * as fs from 'node:fs';
import * as path from 'node:path';

export interface AgentConfig {
  name: string;
  description: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
  systemInstruction?: string;
  fallbackValue?: Record<string, unknown> | unknown;
}

export interface AgentOutput {
  status: 'success' | 'error' | 'timeout';
  data: Record<string, unknown> | unknown;
  metadata: {
    agent: string;
    model: string;
    latency_ms: number;
    tokens_used?: number;
    temperature: number;
  };
}

// Global active request tracking for rate limiting (100 req/min)
class RateLimiter {
  private requests: number[] = [];
  private limit = 100;
  private intervalMs = 60000;

  async throttle(): Promise<void> {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.intervalMs);
    
    if (this.requests.length >= this.limit) {
      const waitTime = this.intervalMs - (now - this.requests[0]);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return this.throttle();
    }
    
    this.requests.push(now);
  }
}

const rateLimiter = new RateLimiter();

export abstract class BaseAgent {
  public name: string;
  public description: string;
  public model: string;
  public temperature: number;
  public maxTokens: number;
  public timeoutMs: number;
  public systemInstruction: string;
  public fallbackValue: Record<string, unknown> | unknown;

  // Circuit breaker state
  private consecutiveFailures = 0;
  private isDegraded = false;
  private degradedUntil = 0;

  constructor(config: AgentConfig) {
    this.name = config.name;
    this.description = config.description;
    this.model = config.model || 'gemini-2.5-flash';
    this.temperature = config.temperature !== undefined ? config.temperature : 0.3;
    this.maxTokens = config.maxTokens || 2000;
    this.timeoutMs = config.timeoutMs || 5000;
    this.systemInstruction = config.systemInstruction || 'You are a helpful assistant.';
    this.fallbackValue = config.fallbackValue || { error: 'Agent execution failed' };
  }

  protected abstract formatPrompt(input: Record<string, unknown>): string;

  public async execute(input: Record<string, unknown>): Promise<AgentOutput> {
    const startTime = Date.now();

    // Check circuit breaker status
    if (this.isDegraded) {
      if (Date.now() > this.degradedUntil) {
        this.isDegraded = false;
        this.consecutiveFailures = 0;
      } else {
        // Return fallback immediately
        return {
          status: 'error',
          data: this.fallbackValue,
          metadata: {
            agent: this.name,
            model: this.model,
            latency_ms: Date.now() - startTime,
            temperature: this.temperature
          }
        };
      }
    }

    const promptText = this.formatPrompt(input);
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return this.handleFailure(new Error('GEMINI_API_KEY is not set'), startTime);
    }

    let attempt = 0;
    let delay = 1000; // start with 1s

    while (attempt < 3) {
      try {
        await rateLimiter.throttle();

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: promptText }]
                }
              ],
              systemInstruction: {
                parts: [{ text: this.systemInstruction }]
              },
              generationConfig: {
                temperature: this.temperature,
                maxOutputTokens: this.maxTokens,
                responseMimeType: 'application/json'
              }
            }),
            signal: controller.signal
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`API returned HTTP ${response.status}: ${response.statusText}`);
        }

        const resData = await response.json();
        const textContent = resData.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!textContent) {
          throw new Error('Empty response from model');
        }

        let parsedData;
        try {
          parsedData = JSON.parse(textContent);
        } catch (jsonErr) {
          // If JSON parsing fails, fallback or try to clean markdown code blocks
          const cleanedText = textContent.replace(/```json\s?([\s\S]*?)```/g, '$1').trim();
          parsedData = JSON.parse(cleanedText);
        }

        // Success: reset circuit breaker
        this.consecutiveFailures = 0;
        
        return {
          status: 'success',
          data: parsedData,
          metadata: {
            agent: this.name,
            model: this.model,
            latency_ms: Date.now() - startTime,
            temperature: this.temperature
          }
        };

      } catch (err: any) {
        attempt++;
        const isTimeout = err.name === 'AbortError';

        // Log warning
        console.warn(`[Agent ${this.name}] Attempt ${attempt} failed: ${err.message}`);

        if (attempt >= 3) {
          // Trigger circuit breaker if we reached max retries
          this.consecutiveFailures++;
          if (this.consecutiveFailures >= 3) {
            this.isDegraded = true;
            this.degradedUntil = Date.now() + 60000; // degrade for 60s
            console.error(`[Agent ${this.name}] Circuit breaker activated. Degraded for 60s.`);
          }

          if (isTimeout) {
            return {
              status: 'timeout',
              data: this.fallbackValue,
              metadata: {
                agent: this.name,
                model: this.model,
                latency_ms: Date.now() - startTime,
                temperature: this.temperature
              }
            };
          }
          return this.handleFailure(err, startTime);
        }

        // Exponential backoff delay
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
      }
    }

    return this.handleFailure(new Error('Unknown execution error'), startTime);
  }

  private handleFailure(error: Error, startTime: number): AgentOutput {
    return {
      status: 'error',
      data: {
        ...this.fallbackValue,
        errorMessage: error.message
      },
      metadata: {
        agent: this.name,
        model: this.model,
        latency_ms: Date.now() - startTime,
        temperature: this.temperature
      }
    };
  }
}
