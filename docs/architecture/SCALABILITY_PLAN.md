# Scalability Plan

**Product:** AI Plushie E-commerce Platform
**Current Scale:** MVP (0 users)
**Target Scale:** 10K concurrent users
**Last Updated:** February 2, 2026
**Status:** Draft

---

## Purpose of This Document

This document outlines how the AI Plushie e-commerce platform will scale from MVP (10 concurrent users) to growth (10,000+ concurrent users). It identifies bottlenecks, proposes solutions, and defines scaling milestones.

**Scaling Philosophy:**
- **Design for 10 users, but don't break at 10,000**
- **Horizontal scaling > Vertical scaling**
- **Optimize only when necessary** (premature optimization is evil)
- **Monitor, measure, then scale**

---

## 1. Current Architecture (MVP)

### 1.1 Capacity

| Component | Capacity | Bottleneck |
|-----------|----------|------------|
| **Next.js (Vercel)** | ~1000 concurrent users | Serverless function cold starts |
| **PostgreSQL** | ~100 concurrent connections | Connection pool limit |
| **Stripe API** | 100 req/sec | Rate limits |
| **Vercel Bandwidth** | 100 GB/month (Hobby) | Images from /public folder |

**MVP Target:** 10-50 concurrent users, 500 orders/month

---

### 1.2 Single Points of Failure

| Component | Risk | Mitigation (MVP) |
|-----------|------|------------------|
| **Database** | Single instance failure | Vercel Postgres has auto-backups |
| **Vercel** | Platform outage | No mitigation (accepted risk) |
| **Stripe** | API downtime | Graceful degradation (show error) |
| **Google Sheets** | Sync failure | Email alert to admin |

**Accepted Risk:** MVP assumes 99% uptime (SLA: "best effort")

---

## 2. Scaling Stages

### 2.1 Stage 1: Launch (0-100 users)

**Timeline:** Months 1-3
**Focus:** Validate product-market fit, collect feedback

**Infrastructure:**
- Vercel Hobby plan ($0/month, includes 100 GB bandwidth)
- Vercel Postgres free tier (1 GB storage, 60 hours compute)
- Images served from `/public` folder (no external CDN)
- Stripe standard pricing (2.9% + 30¢)

**Performance Targets:**
- Page load: < 3s
- API response: < 500ms
- Uptime: 99% (best effort)

**Monitoring:**
- Vercel Analytics (built-in)
- Manual error checking (Vercel logs)

**When to Upgrade:** 50+ concurrent users, 80% database capacity

---

### 2.2 Stage 2: Growth (100-1,000 users)

**Timeline:** Months 4-12
**Focus:** Optimize critical paths, improve reliability

**Infrastructure Changes:**
- ✅ Upgrade to Vercel Pro ($20/month) - Better performance, analytics, 1 TB bandwidth
- ✅ Upgrade Vercel Postgres to Starter ($10/month) - 5 GB storage, 120 hours compute
- ✅ Add connection pooling (PgBouncer) - Handle more concurrent queries
- ⚠️ Consider image CDN if bandwidth exceeds 500 GB/month (Cloudinary or Vercel Blob)
- ✅ Add CDN caching (Vercel Edge) - Reduce origin requests

**Performance Targets:**
- Page load: < 2.5s
- API response: < 300ms
- Uptime: 99.5%

**Monitoring:**
- Add error tracking (Sentry - $26/month)
- Add uptime monitoring (UptimeRobot - $7/month)
- Set up alerts (Slack, email)

**Database Optimizations:**
1. **Indexes:** Add indexes on frequently queried columns
   ```sql
   CREATE INDEX idx_orders_user_id ON orders(user_id);
   CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
   CREATE INDEX idx_products_status ON products(status);
   ```

2. **Query Optimization:** Select only needed fields
   ```typescript
   // Before (fetches all columns)
   const products = await prisma.product.findMany();

   // After (fetches only needed columns)
   const products = await prisma.product.findMany({
     select: { id: true, name: true, price: true, image_url: true },
   });
   ```

3. **Connection Pooling:** Add `?pgbouncer=true` to DATABASE_URL

**Caching Strategy:**
- **Static pages:** ISR (Incremental Static Regeneration) with 60-second revalidation
- **API responses:** 5-minute cache (stale-while-revalidate)
- **Images:** CDN cache (1 year expiry)

**When to Upgrade:** 800+ concurrent users, 5,000 orders/month

---

### 2.3 Stage 3: Scale (1,000-10,000 users)

**Timeline:** Year 2+
**Focus:** High availability, performance, global reach

**Infrastructure Changes:**
- ✅ Upgrade Vercel to Enterprise ($custom) - Dedicated support, SLA
- ✅ Upgrade database to Production tier ($50-200/month) - Read replicas, auto-scaling
- ✅ Add Redis cache (Upstash - $20/month) - Session store, rate limiting
- ✅ Add message queue (Inngest - $20/month) - Background jobs (emails, sync)
- ✅ Multi-region deployment (Vercel Edge Functions) - Lower latency globally

**Performance Targets:**
- Page load: < 2s
- API response: < 200ms
- Uptime: 99.9% (SLA)

**Architecture Changes:**

#### 1. Read Replicas (Database)
```
Primary (Write)  ──┐
                   ├──> Load Balancer
Read Replica 1  ───┤
Read Replica 2  ───┘
```

**Benefits:**
- Distribute read load (90% of queries)
- Faster queries (less contention)
- Zero downtime for backups

**Implementation:**
```typescript
// Write to primary
await prisma.$primary.order.create({ data: orderData });

// Read from replica
const products = await prisma.$replica.product.findMany();
```

---

#### 2. Redis Caching Layer

**Use Cases:**
- **Session store:** User sessions (faster than database)
- **Rate limiting:** Prevent API abuse
- **Cart cache:** Reduce database reads
- **Hot data:** Frequently accessed products

**Example:**
```typescript
// Check cache first
const cachedProducts = await redis.get('products:active');
if (cachedProducts) return JSON.parse(cachedProducts);

// Cache miss: fetch from DB
const products = await prisma.product.findMany();
await redis.set('products:active', JSON.stringify(products), { ex: 300 }); // 5min TTL
return products;
```

---

#### 3. Background Jobs (Message Queue)

**Current Problem:** Synchronous operations block responses
- Sending emails (200-500ms)
- Google Sheets sync (2-5 seconds)
- Image processing (1-3 seconds)

**Solution:** Move to background queue

```typescript
// Before (blocks response)
await sendOrderConfirmationEmail(order);
return NextResponse.json({ success: true });

// After (non-blocking)
await queue.enqueue('send-email', { orderId: order.id });
return NextResponse.json({ success: true }); // Instant response
```

**Benefits:**
- Faster API responses
- Retry failed operations automatically
- Scale workers independently

---

#### 4. Multi-Region Edge Functions

**Problem:** Users far from server experience high latency
- US East user → Server in California: 100ms latency
- Australia user → Server in California: 300ms latency

**Solution:** Deploy to multiple Vercel regions

```javascript
// vercel.json
{
  "functions": {
    "api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 10,
      "regions": ["sfo1", "iad1", "syd1"] // San Francisco, Virginia, Sydney
    }
  }
}
```

**Benefits:**
- Lower latency (users hit nearest region)
- Higher availability (multi-region redundancy)

---

#### 5. Database Sharding (Future: 10K+ users)

**When:** Database becomes bottleneck (>10K writes/sec)

**Strategy:** Shard by user_id

```
Users 1-10,000    → Database Shard 1
Users 10,001-20,000 → Database Shard 2
Users 20,001-30,000 → Database Shard 3
```

**Challenge:** Cross-shard queries (analytics, admin dashboard)
**Solution:** Separate analytics database (replicated)

---

## 3. Performance Optimization Roadmap

### 3.1 Phase 1 Optimizations (Launch → Growth)

| Optimization | Impact | Effort | Priority |
|--------------|--------|--------|----------|
| **Image optimization (WebP, lazy load)** | High | Low | ✅ MVP |
| **Code splitting (dynamic imports)** | Medium | Low | ✅ MVP |
| **Database indexes** | High | Low | 🟡 Stage 2 |
| **API response caching** | Medium | Medium | 🟡 Stage 2 |
| **Connection pooling** | High | Low | 🟡 Stage 2 |

---

### 3.2 Phase 2 Optimizations (Growth → Scale)

| Optimization | Impact | Effort | Priority |
|--------------|--------|--------|----------|
| **Redis caching** | High | Medium | 🔴 Stage 3 |
| **Read replicas** | High | Medium | 🔴 Stage 3 |
| **Background jobs** | Medium | High | 🔴 Stage 3 |
| **Multi-region deployment** | Medium | Low | 🟡 Stage 3 |
| **CDN for static assets** | Low | Low | ✅ MVP (Vercel default) |

---

## 4. Cost Projections

### 4.1 MVP (0-100 users)

| Service | Plan | Cost |
|---------|------|------|
| Vercel | Hobby | $0 |
| Vercel Postgres | Free | $0 |
| Resend (Email) | Free tier | $0 |
| Stripe | 2.9% + 30¢ | Variable |
| **Total** | | **~$0/month** + Stripe fees |

**Note:** Images served from `/public` folder (no external CDN cost)

**Revenue to Break Even:** ~$0 (bootstrapped)

---

### 4.2 Growth (100-1,000 users)

| Service | Plan | Cost |
|---------|------|------|
| Vercel | Pro | $20 |
| Vercel Postgres | Starter | $10 |
| Resend | Pro | $20 |
| Sentry | Team | $26 |
| UptimeRobot | Pro | $7 |
| Stripe | 2.9% + 30¢ | Variable |
| **Total** | | **~$83/month** + Stripe fees |

**Note:** Add image CDN (Cloudinary/Vercel Blob ~$99/mo) if bandwidth exceeds 500 GB/month
**Revenue to Break Even:** ~$250/month (1-2 orders/day @ $25 avg)

---

### 4.3 Scale (1,000-10,000 users)

| Service | Plan | Cost |
|---------|------|------|
| Vercel | Enterprise | $500 (est) |
| Vercel Postgres | Production | $100 |
| Redis (Upstash) | Pro | $20 |
| Image CDN (optional) | Cloudinary/Vercel Blob | $99-249 |
| Inngest (Queue) | Pro | $20 |
| Resend | Business | $150 |
| Sentry | Business | $99 |
| UptimeRobot | Pro | $7 |
| Stripe | 2.9% + 30¢ | Variable |
| **Total** | | **~$896-1,046/month** + Stripe fees |

**Note:** Image CDN needed only if bandwidth exceeds Vercel limits (~1 TB)
**Revenue to Break Even:** ~$2,500-3,000/month (3-4 orders/day @ $25 avg)

---

## 5. Monitoring & Metrics

### 5.1 Key Performance Indicators (KPIs)

**Technical Metrics:**
- **Uptime:** 99.9% target
- **API Latency (p95):** < 200ms
- **Page Load (LCP):** < 2.5s
- **Error Rate:** < 0.1%
- **Database Query Time (p95):** < 50ms

**Business Metrics:**
- **Concurrent Users:** Track peak daily
- **Orders per Hour:** Identify peak times
- **Cart Abandonment Rate:** < 40%
- **Conversion Rate:** > 2%

---

### 5.2 Alerting Thresholds

| Alert | Threshold | Action |
|-------|-----------|--------|
| **High Error Rate** | > 1% errors for 5 min | Page on-call engineer |
| **Slow API** | p95 > 500ms for 10 min | Investigate database |
| **High CPU** | > 80% for 15 min | Scale up or optimize |
| **Database Full** | > 90% capacity | Upgrade plan immediately |
| **Payment Failures** | > 5 failures in 1 hour | Check Stripe status |

**Alert Channels:**
- Slack #alerts
- Email to team@example.com
- SMS for critical (uptime < 99%)

---

## 6. Load Testing Plan

### 6.1 Testing Tools

**Tool:** k6 (open-source load testing)

**Install:**
```bash
npm install -D k6
```

**Test Script:**
```javascript
// load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },  // Ramp up to 100 users
    { duration: '5m', target: 100 },  // Stay at 100 users
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests < 500ms
    http_req_failed: ['rate<0.01'],   // < 1% errors
  },
};

export default function () {
  // Test homepage
  const res = http.get('https://staging.myaiplushieshop.com/shop');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'load time < 3s': (r) => r.timings.duration < 3000,
  });
  sleep(1);
}
```

**Run:**
```bash
k6 run load-test.js
```

---

### 6.2 Testing Scenarios

**Scenario 1: Product Browsing**
- 1000 concurrent users
- Browse shop, view products, add to cart
- Duration: 10 minutes
- Success: p95 < 500ms, 0 errors

**Scenario 2: Checkout Spike**
- 500 concurrent checkouts
- Complete full checkout flow
- Duration: 5 minutes
- Success: All orders created, p95 < 1s

**Scenario 3: Black Friday Simulation**
- 5000 concurrent users
- 50% browse, 30% add to cart, 20% checkout
- Duration: 1 hour
- Success: No errors, p95 < 2s

**Run Tests:** Before every major release, monthly in production

---

## 7. Disaster Recovery

### 7.1 Backup Strategy

**Database Backups:**
- **Frequency:** Automatic daily backups (Vercel Postgres)
- **Retention:** 7 days (free tier), 30 days (paid)
- **Test Restores:** Monthly (verify backups work)

**Code Backups:**
- **Source:** Git (GitHub)
- **Frequency:** Every commit
- **Redundancy:** Cloud-hosted (GitHub)

**Environment Variables:**
- **Storage:** 1Password (encrypted vault)
- **Backup:** Quarterly export to secure location

---

### 7.2 Rollback Plan

**Deployment Rollback:**
1. Identify bad deployment (error spike in Vercel Analytics)
2. Open Vercel dashboard → Deployments
3. Click "Rollback" on previous stable deployment
4. Verify in staging
5. Promote to production

**Time to Rollback:** < 5 minutes

**Database Rollback (schema migration):**
1. Identify failed migration
2. Run Prisma rollback: `npx prisma migrate resolve --rolled-back [migration-name]`
3. Deploy previous code version
4. Restore from backup if data corruption

**Time to Rollback:** 10-30 minutes

---

## 8. Scaling Checklist

### Before Launch
- [ ] Load test with 100 concurrent users
- [ ] Setup monitoring (Vercel Analytics, Sentry)
- [ ] Configure alerts (Slack, email)
- [ ] Document rollback procedure
- [ ] Test database backups
- [ ] Set up staging environment

### At 50 Users (Prepare for Growth)
- [ ] Review performance metrics (identify bottlenecks)
- [ ] Add database indexes
- [ ] Enable connection pooling
- [ ] Upgrade to Vercel Pro
- [ ] Load test with 500 concurrent users

### At 500 Users (Prepare for Scale)
- [ ] Add Redis cache
- [ ] Implement read replicas
- [ ] Move emails to background queue
- [ ] Upgrade database plan
- [ ] Load test with 2000 concurrent users

### At 5000 Users (Enterprise Scale)
- [ ] Multi-region deployment
- [ ] Advanced monitoring (APM, tracing)
- [ ] Dedicated support (Vercel Enterprise)
- [ ] Disaster recovery drills (quarterly)
- [ ] Consider database sharding

---

## 9. Bottleneck Analysis

### 9.1 Potential Bottlenecks

| Bottleneck | Symptoms | Solution |
|------------|----------|----------|
| **Database connections** | Connection errors, timeouts | Add connection pooling, read replicas |
| **Serverless cold starts** | Slow first requests | Keep functions warm, edge functions |
| **Image bandwidth** | Slow image loads, high costs | Optimize images, migrate to CDN (Cloudinary/Vercel Blob) |
| **API rate limits (Stripe)** | Payment failures during spikes | Implement retry logic, queue |
| **Google Sheets sync** | Inventory delays, API quota | Cache sheet data, reduce sync frequency |

---

### 9.2 Performance Budget

**Don't exceed:**
- **First Load JS:** 300 KB
- **Total Page Weight:** 1.5 MB
- **Database Queries per Request:** 3
- **API Calls to Third Parties:** 2 per request

**Monitor:** Bundle size on every PR (GitHub Action)

---

## 10. Future Optimizations (Beyond 10K Users)

**If we're successful:**
- **GraphQL API:** More efficient data fetching
- **Service-Oriented Architecture:** Separate services (payments, inventory, auth)
- **Kubernetes:** Container orchestration (vs serverless)
- **Global CDN:** Cloudflare or Fastly for edge caching
- **Dedicated Infrastructure:** Move off shared hosting

**When:** Revenue > $50K/month, 10K+ concurrent users

---

**Document History:**
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-02 | Planning Session | Initial scalability plan |

**Related Documents:**
- [TRD.md](./TRD.md) - Technical requirements
- [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md) - Current architecture
- [MONITORING.md](../operations/MONITORING.md) - Monitoring setup

---

**End of Scalability Plan Document**
