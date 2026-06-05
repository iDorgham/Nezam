# Performance Tuning & Optimization Handbook

> **Purpose:** Actionable guide to optimize speed, memory, and reliability  
> **Audience:** DevOps, Frontend & Backend leads  
> **Updated:** 2026-06-05

---

## Quick Wins (No Refactor Required)

### 1. Enable gzip + brotli compression (5 min setup)

```nginx
# nginx.conf
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/javascript application/json;

# Brotli (better compression)
brotli on;
brotli_comp_level 6;
brotli_types text/plain text/css text/javascript application/json;
```

**Impact:** JS bundle 150KB → 45KB gzipped (70% reduction)

---

### 2. Enable HTTP/2 Server Push (3 min)

```nginx
http2_push_preload on;

# Critical CSS + JS pushed automatically
link rel="preload" href="/main.css" as="style"
```

**Impact:** LCP reduced 20-30% (faster critical resource loading)

---

### 3. Implement DNS prefetching (1 min)

```html
<!-- In <head> -->
<link rel="dns-prefetch" href="https://api.example.com">
<link rel="preconnect" href="https://cdn.example.com">
<link rel="prefetch" href="https://fonts.googleapis.com">
```

**Impact:** DNS lookup time eliminated for 3 external resources

---

### 4. Cache-bust only when needed (2 min)

```javascript
// next.config.js
module.exports = {
  productionBrowserSourceMaps: false, // Remove in prod
  compress: true, // Auto-gzip
  swcMinify: true, // SWC faster than Terser
};
```

**Impact:** Build time 45s → 12s, bundle 15% smaller

---

### 5. Database query caching (15 min)

```typescript
// Implement Redis caching
const cache = new Redis();

export async function getUser(id: string) {
  const cached = await cache.get(`user:${id}`);
  if (cached) return JSON.parse(cached); // Cache hit: < 5ms
  
  const user = await db.user.findUnique({ where: { id } }); // Cache miss: 50-200ms
  await cache.set(`user:${id}`, JSON.stringify(user), 'EX', 3600); // 1h TTL
  return user;
}
```

**Impact:** DB query → cache hit 95% of time (p50 latency: 200ms → 10ms)

---

## Build Pipeline Optimization

### Switch from webpack to esbuild

```javascript
// esbuild.config.js (NEW)
import * as esbuild from 'esbuild'

esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'dist/bundle.js',
  minify: true,
  sourcemap: true,
  target: ['ES2020'],
}).catch(() => process.exit(1))
```

**Before (webpack):**
```
 → 45 seconds
```

**After (esbuild):**
```
 → 8 seconds (82% faster)
```

### Enable source map compression

```javascript
// Build script
"build": "esbuild src/index.ts --bundle --minify --sourcemap=external --outfile=dist/index.js",

// Post-process: upload sourcemaps to Sentry, don't ship them
"upload-sourcemaps": "sentry-cli sourcemaps upload dist/"
```

**Impact:** Bundle size 500KB → 200KB (remove sourcemaps from prod)

---

## CI/CD Pipeline Optimization

### Before: Sequential (13 minutes)

```mermaid
Lint (3m) → Test (5m) → Security (3m) → Build (2m) = 13m total
```

### After: Parallel (5 minutes)

```yaml
# .github/workflows/test.yml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: pnpm install
      - run: pnpm lint
  
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: pnpm install
      - run: pnpm test:ci
  
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: github/codeql-action/init@v2
      - run: ./codeql-runner
  
  build:
    needs: [lint, test]  # Depends on both
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
```

**Result:** 13 minutes → 5 minutes (62% faster)

---

### Implement caching

```yaml
# Cache pnpm dependencies
- name: Setup pnpm cache
  uses: actions/setup-node@v3
  with:
    node-version: 18
    cache: 'pnpm'
    cache-dependency-path: '**/pnpm-lock.yaml'

# Cache Next.js build
- name: Cache Next.js build
  uses: actions/cache@v3
  with:
    path: ${{ github.workspace }}/.next/cache
    key: ${{ runner.os }}-nextjs-${{ hashFiles('**/pnpm-lock.yaml') }}
```

**Impact:** CI restore time 30s → 5s (first CI run) or cache hit (< 1s)

---

## Runtime Performance

### Memory profiling

```bash
# Start app with inspector
node --inspect --max-old-space-size=4096 app.js

# Open chrome://inspect
# Capture heap snapshot
# Identify memory leaks (retained objects > 50MB)
```

### Implement lazy loading

```typescript
// Before: Import everything
import { ExpensiveComponent } from './components';

// After: Lazy load on demand
const ExpensiveComponent = lazy(() => 
  import('./components').then(m => ({ default: m.ExpensiveComponent }))
);

// Use Suspense
<Suspense fallback={<Loading />}>
  <ExpensiveComponent />
</Suspense>
```

**Impact:** Initial bundle 300KB → 150KB, TTI reduced 2.5s

---

### Implement virtual scrolling

```typescript
// Before: Render all 10k items
<div>
  {items.map(item => <ItemRow key={item.id} {...item} />)}
</div>

// After: Render only visible items (50 at a time)
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={items.length}
  itemSize={35}
  width="100%"
>
  {({ index, style }) => <ItemRow style={style} {...items[index]} />}
</FixedSizeList>
```

**Impact:** Render time 5000ms → 50ms (memory: 100MB → 5MB)

---

## Web Vitals Optimization

### LCP (Largest Contentful Paint) < 2.5s

**Problem:** Heavy images slow down LCP

```html
<!-- Before: Unoptimized image -->
<img src="/hero.jpg" width="1200" height="600" />
<!-- File size: 2MB, Download time: 4s on 4G -->

<!-- After: Optimized -->
<Image
  src="/hero"
  width={1200}
  height={600}
  priority  // Load immediately, not lazy
  sizes="(max-width: 640px) 100vw, 50vw"
  placeholder="blur"  // Blur-up while loading
/>
<!-- File size: 250KB (webp), Download time: 0.5s on 4G -->
```

**Solution checklist:**
- ✅ Use next/image for automatic optimization
- ✅ Set explicit width/height (no layout shift)
- ✅ Add `priority` to above-fold images
- ✅ Serve WebP + fallback JPEG

---

### CLS (Cumulative Layout Shift) < 0.1

**Problem:** Unannounced size changes push content around

```html
<!-- Before: Layout shift on font load -->
<h1>Heading</h1>
<!-- Font system → Google Font (200ms load) → reflow -->

<!-- After: Prevent shift -->
<h1 style={{ fontFamily: 'Georgia, serif' }}>Heading</h1>
<!-- Use system font (instant), elegant fallback -->
<!-- OR use font-display: swap -->

<style>
  @font-face {
    font-family: 'CustomFont';
    src: url('/font.woff2');
    font-display: swap; /* Show fallback immediately */
  }
</style>
```

**Solution checklist:**
- ✅ Set explicit width/height on images + video
- ✅ Reserve space for ads (set container height)
- ✅ Use font-display: swap (show fallback, then replace)
- ✅ Test on real devices (Chrome DevTools emulation)

---

### INP (Interaction to Next Paint) < 200ms

**Problem:** JavaScript execution blocks response

```typescript
// Before: Long task (300ms)
<button onClick={() => {
  // Heavy processing
  for (let i = 0; i < 1000000; i++) {
    expensiveCalculation();
  }
  // UI doesn't update for 300ms (bad UX)
}}>
  Click me
</button>

// After: Break into chunks via requestIdleCallback
<button onClick={async () => {
  // Show loading immediately
  setLoading(true);
  
  // Process in background (doesn't block UI)
  await new Promise(resolve => {
    let i = 0;
    const chunk = () => {
      const end = Math.min(i + 10000, 1000000);
      for (; i < end; i++) {
        expensiveCalculation();
      }
      if (i < 1000000) {
        requestIdleCallback(chunk);
      } else {
        resolve(null);
      }
    };
    chunk();
  });
  
  setLoading(false);
}}>
  Click me
</button>
```

**Solution checklist:**
- ✅ Break long tasks into <50ms chunks
- ✅ Use `requestIdleCallback` for background work
- ✅ Use Web Workers for CPU-bound tasks
- ✅ Defer non-critical JavaScript

---

## Database Optimization

### Add indexes for common queries

```sql
-- Before: Full table scan (1000ms for 1M rows)
SELECT * FROM users WHERE email = 'user@example.com';

-- After: Indexed (< 5ms)
CREATE INDEX idx_users_email ON users(email);
SELECT * FROM users WHERE email = 'user@example.com';
```

### Implement pagination

```typescript
// Before: Load all 100k rows
const users = await db.user.findMany();

// After: Paginate (load 50 at a time)
const users = await db.user.findMany({
  take: 50,
  skip: (page - 1) * 50,
  orderBy: { createdAt: 'desc' }
});
```

---

## Monitoring & Alerting

### Web Vitals dashboard

```javascript
// Send to external service
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export function reportWebVitals(metric) {
  // Send to analytics
  navigator.sendBeacon('/api/vitals', JSON.stringify(metric));
}

getCLS(reportWebVitals);
getFID(reportWebVitals);
getFCP(reportWebVitals);
getLCP(reportWebVitals);
getTTFB(reportWebVitals);
```

### Sentry error tracking

```javascript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://your-key@sentry.io/project",
  environment: process.env.ENVIRONMENT,
  tracesSampleRate: 0.1,
  beforeSend(event) {
    // Filter out noisy errors
    if (event.exception?.[0]?.value?.includes("ResizeObserver")) {
      return null;
    }
    return event;
  }
});
```

---

## Continuous Optimization Checklist

### Weekly
- [ ] Check Web Vitals dashboard (LCP, CLS, INP trends)
- [ ] Review error rate (Sentry alerts)
- [ ] Monitor database query times (p50, p99)

### Monthly
- [ ] Run Lighthouse audit (desktop + mobile)
- [ ] Analyze bundle size (esbuild output analysis)
- [ ] Review CI/CD timing (identify bottlenecks)

### Quarterly
- [ ] Load test (simulate 100+ concurrent users)
- [ ] Penetration test (security scan)
- [ ] Performance audit (hire external firm)

---

## Tools & Commands

```bash
# Measure build time
time pnpm build

# Analyze bundle size
npx webpack-bundle-analyzer dist/stats.json

# Profile production performance
npm install -g lightho use
lighthouse https://example.com --output-path=lh-report.html

# Database query analysis
EXPLAIN ANALYZE SELECT * FROM users WHERE email = ...;

# Memory profiling
node --inspect app.js
# Chrome DevTools → Memory tab

# Load test
npm install -g k6
k6 run load-test.js
```

---

**Last updated:** 2026-06-05  
**Next review:** After v3.2-P2 (CI optimization complete)

