# ARCHITECTURAL DECISIONS - AI Plushie E-commerce App

**Project:** AI-themed Plushie E-commerce Platform  
**Decision Log Started:** February 2, 2026  
**Status:** Planning Phase - Pre-Development

---

## 📋 DECISION LOG FORMAT

Each decision follows this structure:
- **Decision ID:** Unique identifier
- **Date:** When decided
- **Status:** Proposed | Accepted | Superseded | Deprecated
- **Context:** Why this decision was needed
- **Decision:** What was decided
- **Consequences:** Positive and negative impacts
- **Alternatives Considered:** What else was evaluated

---

## DECISION 001: Documentation-First Approach

**Date:** 2026-02-02  
**Status:** Accepted  
**Context:** Starting e-commerce project from scratch with basic frontend. Need clear roadmap before coding backend.

**Decision:**
Create comprehensive planning documentation before writing any backend code. Structure: `/docs` with subdirectories for requirements, architecture, security, payments, testing, operations, admin, and skills.

**Consequences:**
- ✅ **Positive:** Clear requirements, reduced rework, better architecture
- ✅ **Positive:** Easier onboarding for developers (including AI agents)
- ✅ **Positive:** Security and compliance considered upfront
- ⚠️ **Negative:** Longer time to first code
- ⚠️ **Negative:** Documents may need updates as project evolves

**Alternatives Considered:**
- Agile: Start coding immediately, document as we go
- Hybrid: Light documentation, iterate based on learnings

**Why This Decision:**
Teenage e-commerce site requires COPPA compliance, PCI-DSS security, and payment integration. Mistakes in these areas are costly. Better to plan thoroughly upfront.

---

## DECISION 002: Target Audience Focus - Teenagers (13-19)

**Date:** 2026-02-02  
**Status:** Accepted  
**Context:** Product is AI-themed plushies. Need to define primary user base to inform design, security, and compliance decisions.

**Decision:**
Target teenagers aged 13-19 as primary audience. Design for mobile-first, visual-heavy, fast-loading experience. Implement teen-specific usability patterns (swipe gestures, social proof, minimal text).

**Consequences:**
- ✅ **Positive:** Clear design direction (mobile-first, visual)
- ✅ **Positive:** Informed compliance requirements (COPPA for <13, parental consent)
- ✅ **Positive:** Performance targets clear (< 3s load time)
- ⚠️ **Negative:** May exclude older demographics (could be future expansion)
- ⚠️ **Negative:** Additional compliance burden (age verification)

**Alternatives Considered:**
- All ages (broader market, more complex UX)
- Adults only (simpler compliance, smaller market)

**Why This Decision:**
AI plushies appeal to Gen Z. Teens have purchasing power (allowance, part-time jobs, gift requests). Mobile-first aligns with teen behavior (70%+ browse on phones).

---

## DECISION 003: Technology Stack - Next.js + TypeScript

**Date:** 2026-02-02  
**Status:** Accepted  
**Context:** Frontend already uses Next.js. Need to decide on language and whether to continue with Next.js for backend.

**Decision:**
- **Frontend:** Next.js 14+ (App Router), React, TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Backend:** Next.js API routes (collocate with frontend)
- **Language:** TypeScript throughout (type safety, easier maintenance)

**Consequences:**
- ✅ **Positive:** Single codebase (easier deployment, shared types)
- ✅ **Positive:** TypeScript catches errors at compile time
- ✅ **Positive:** Vercel deployment optimized for Next.js
- ✅ **Positive:** shadcn/ui provides accessible components
- ⚠️ **Negative:** Serverless functions have cold start latency
- ⚠️ **Negative:** TypeScript learning curve for some developers

**Alternatives Considered:**
- Separate backend (Express, NestJS): More flexibility, harder deployment
- JavaScript instead of TypeScript: Faster to write, more runtime errors

**Why This Decision:**
Already using Next.js frontend. API routes eliminate need for separate backend deployment. TypeScript essential for maintainability (user's requirement). Vercel hosting simplifies infrastructure.

---

## DECISION 004: Database Choice - PostgreSQL

**Date:** 2026-02-02  
**Status:** Proposed (to be finalized in TRD)  
**Context:** Need database for products, users, orders, cart state. Must support ACID transactions for payments.

**Decision:**
Use PostgreSQL as primary database. Host on Vercel Postgres (easy integration) or Supabase (more features).

**Consequences:**
- ✅ **Positive:** ACID compliance (critical for payment transactions)
- ✅ **Positive:** Relational model fits e-commerce (products, orders, users)
- ✅ **Positive:** Strong TypeScript support (Prisma ORM)
- ✅ **Positive:** JSON support for flexible product attributes
- ⚠️ **Negative:** More complex than Firebase/MongoDB for simple queries
- ⚠️ **Negative:** Requires schema migrations (can be automated)

**Alternatives Considered:**
- MongoDB: Flexible schema, no transactions (risky for payments)
- MySQL: Similar to Postgres, less modern feature set
- Supabase: Postgres + auth + storage (all-in-one, vendor lock-in)

**Why This Decision:**
Payment transactions require ACID guarantees. Relational data (orders have line items, users have addresses). PostgreSQL is industry standard for e-commerce.

---

## DECISION 005: Payment Processing - Stripe Primary, Venmo Secondary

**Date:** 2026-02-02  
**Status:** Accepted  
**Context:** Need payment processing for credit/debit cards and teen-preferred methods. Must be PCI-DSS compliant.

**Decision:**
- **Primary:** Stripe for credit/debit card processing
- **Secondary:** Venmo QR codes for teen-friendly payments
- **Strategy:** Never store card data (use Stripe tokenization)

**Consequences:**
- ✅ **Positive:** Stripe handles PCI-DSS compliance
- ✅ **Positive:** Venmo popular with teens (peer-to-peer payments)
- ✅ **Positive:** Stripe has excellent API and documentation
- ✅ **Positive:** Both support webhooks for order confirmation
- ⚠️ **Negative:** Stripe fees (2.9% + 30¢ per transaction)
- ⚠️ **Negative:** Venmo QR less automated (manual verification)

**Alternatives Considered:**
- PayPal: Well-known, but higher fees and less dev-friendly
- Square: Good for physical retail, less optimal for online-only
- Cryptocurrency: Too volatile, low teen adoption

**Why This Decision:**
Stripe is industry standard for online payments. PCI-DSS compliance built-in. Venmo addresses teen preference for mobile payments. No card data touches our servers = less security risk.

---

## DECISION 006: Authentication Strategy - NextAuth.js

**Date:** 2026-02-02  
**Status:** Proposed (to be finalized in AUTHENTICATION_STRATEGY.md)  
**Context:** Users need to login to view orders, save addresses. Also need guest checkout. Must handle sessions securely.

**Decision:**
Use NextAuth.js (Auth.js) for authentication:
- Email/password login (with bcrypt hashing)
- Guest checkout (no account required for first purchase)
- JWT tokens with 1-hour expiration
- Secure HTTP-only cookies

**Consequences:**
- ✅ **Positive:** Well-maintained, Next.js-optimized library
- ✅ **Positive:** Guest checkout reduces friction (higher conversions)
- ✅ **Positive:** JWT stateless (scales well)
- ✅ **Positive:** HTTP-only cookies prevent XSS attacks
- ⚠️ **Negative:** Need to implement password reset flow
- ⚠️ **Negative:** Short token expiration may annoy users (trade-off for security)

**Alternatives Considered:**
- Clerk: Easier setup, costs money after free tier
- Auth0: Enterprise-grade, overkill for MVP
- Custom auth: Full control, high risk of security mistakes

**Why This Decision:**
NextAuth.js is free, well-documented, and Next.js-native. Guest checkout is critical for e-commerce conversions (50%+ users prefer it). Security best practices built-in.

---

## DECISION 007: Inventory Management - Google Sheets MVP

**Date:** 2026-02-02  
**Status:** Accepted (temporary solution)  
**Context:** Need inventory tracking but want to avoid complex admin UI initially. Site owner needs simple interface.

**Decision:**
**Phase 1 (MVP):** Google Sheets API for inventory tracking
- Sheet columns: product_id, name, price, stock_quantity, image_url
- Sync to database every 5 minutes (cron job)
- Admin edits sheet directly, app reads from database

**Phase 2 (Future):** Custom admin dashboard
- Build proper admin UI with React
- Direct database updates (no Google Sheets)
- Real-time inventory updates

**Consequences:**
- ✅ **Positive:** Fast MVP (no admin UI to build)
- ✅ **Positive:** Familiar interface for non-technical admin
- ✅ **Positive:** Easy price/inventory updates
- ⚠️ **Negative:** 5-minute sync delay (not real-time)
- ⚠️ **Negative:** Google Sheets API rate limits
- ⚠️ **Negative:** No validation (admin could enter invalid data)

**Alternatives Considered:**
- Airtable: Better API, but costs money
- Custom admin dashboard: More robust, takes longer to build
- Contentful CMS: Overkill for simple product data

**Why This Decision:**
Speed to market. Non-technical site owner needs simple interface. Google Sheets is free and familiar. Can migrate to custom admin later without changing customer-facing features.

---

## DECISION 008: Image Management - Public Folder (MVP)

**Date:** 2026-02-02
**Status:** Accepted
**Context:** Need to store and serve product images. Want simplest possible approach for MVP to avoid external dependencies.

**Decision:**
Store product images in `/public` folder for MVP:
- Images stored in existing `/public` folder
- Reference as `/filename.jpg` in database
- Next.js serves directly (no external service)
- Admin adds images by placing files in `/public` folder
- Optimization via Next.js Image component

**Consequences:**
- ✅ **Positive:** Zero setup, no external accounts needed
- ✅ **Positive:** No API keys or configuration required
- ✅ **Positive:** Works immediately, already have 14 plushie images
- ✅ **Positive:** Next.js Image component handles basic optimization
- ✅ **Positive:** Easy migration to CDN later (Cloudinary, Vercel Blob) if needed
- ⚠️ **Negative:** No automatic WebP conversion (Next.js Image handles some)
- ⚠️ **Negative:** No CDN (slower for international users, OK for MVP)
- ⚠️ **Negative:** Images stored in git repo (manageable for ~20 products)

**Alternatives Considered:**
- Cloudinary: Automatic optimization, CDN, but adds complexity and external dependency
- Vercel Blob Storage: Integrated with Vercel, but requires setup
- AWS S3: Industry standard, but overkill and complex for MVP

**Why This Decision:**
Simplicity for MVP. Already have 14 product images in `/public` folder. Next.js Image component provides basic optimization (lazy loading, sizing). Can upgrade to Cloudinary/Vercel Blob post-MVP if traffic requires CDN. Zero external dependencies = faster development.

---

## DECISION 009: Security-First Architecture

**Date:** 2026-02-02  
**Status:** Accepted  
**Context:** E-commerce site handling payments and teen user data. Security breaches = loss of trust, legal liability.

**Decision:**
Security principles embedded in all architecture decisions:
1. **Never store sensitive data:** No credit cards, no plain passwords
2. **Never commit secrets:** .env files in .gitignore, use environment variables
3. **Validate everything:** Client-side + server-side input validation
4. **Encrypt in transit:** HTTPS only, no HTTP allowed
5. **Encrypt at rest:** Database encryption, secure session storage
6. **Principle of least privilege:** Minimal API permissions
7. **Defense in depth:** Multiple security layers

**Consequences:**
- ✅ **Positive:** Reduced risk of data breaches
- ✅ **Positive:** Compliance with PCI-DSS, COPPA, CCPA
- ✅ **Positive:** User trust (security badges, clear policies)
- ⚠️ **Negative:** More complex implementation (validation, encryption)
- ⚠️ **Negative:** Slower development (security reviews required)

**Alternatives Considered:**
- Security as afterthought: Faster initial development, catastrophic if breached
- Minimal security: Non-compliant, liability risk

**Why This Decision:**
User's explicit requirement. Teenage users = COPPA compliance mandatory. Payment processing = PCI-DSS mandatory. Security breach would destroy business. Better to build secure from day one.

---

## DECISION 010: Mobile-First Design

**Date:** 2026-02-02  
**Status:** Accepted  
**Context:** Target audience is teenagers who primarily browse on mobile devices (70%+ of traffic expected).

**Decision:**
Design for mobile FIRST, then adapt to desktop:
- Touch-optimized UI (large tap targets, swipe gestures)
- Vertical scrolling (one-column layouts)
- Bottom navigation (thumb-friendly)
- Fast loading (< 3s on 4G)
- Minimal text (icons and images prioritized)

**Consequences:**
- ✅ **Positive:** Better UX for primary audience (teens on phones)
- ✅ **Positive:** Faster mobile load times (smaller bundles)
- ✅ **Positive:** Higher conversion rates (mobile-optimized checkout)
- ⚠️ **Negative:** Desktop may feel cramped if not adapted well
- ⚠️ **Negative:** More complex responsive design (multiple breakpoints)

**Alternatives Considered:**
- Desktop-first: Traditional approach, but misses primary audience
- Responsive design (equal priority): Compromises on both platforms

**Why This Decision:**
70%+ of teens browse on phones. Google prioritizes mobile in search rankings. Mobile-first forces simplicity (better UX overall). Can always enhance desktop experience later.

---

## DECISION 011: Compliance Requirements - COPPA, PCI-DSS, CCPA, ADA

**Date:** 2026-02-02  
**Status:** Accepted  
**Context:** US-based e-commerce site for teenagers. Must comply with federal and state laws.

**Decision:**
Implement compliance from day one:
- **COPPA:** Age gate (<13), parental consent mechanism
- **PCI-DSS:** Use Stripe (outsource card handling), never store card data
- **CCPA:** Privacy policy, data deletion requests, opt-out of data sales
- **ADA:** WCAG 2.1 AA accessibility (screen readers, keyboard navigation)

**Consequences:**
- ✅ **Positive:** Legal compliance (avoid fines, lawsuits)
- ✅ **Positive:** User trust (clear privacy policies)
- ✅ **Positive:** Accessibility = larger audience (disabled users can shop)
- ⚠️ **Negative:** More features to build (age verification, privacy controls)
- ⚠️ **Negative:** Ongoing maintenance (laws change, need updates)

**Alternatives Considered:**
- Ignore compliance: Illegal, high risk of lawsuits and fines
- Partial compliance: Still exposes to legal risk

**Why This Decision:**
User's explicit requirement. Non-compliance = business-ending lawsuits. COPPA violations can result in $43,280+ per incident (FTC). Better to comply from launch than retrofit later.

---

## DECISION 012: Testing Strategy - Automated + Manual

**Date:** 2026-02-02  
**Status:** Proposed (to be detailed in TEST_STRATEGY.md)  
**Context:** E-commerce site with payment processing. Bugs in checkout = lost revenue and user trust.

**Decision:**
Multi-layered testing approach:
- **Unit tests:** All business logic (Jest/Vitest)
- **Integration tests:** API endpoints (Supertest)
- **E2E tests:** Critical flows (Playwright) - checkout, payment, login
- **Manual testing:** Usability testing with real teenagers
- **Security testing:** Penetration testing before launch

**Consequences:**
- ✅ **Positive:** Catch bugs before production
- ✅ **Positive:** Safe refactoring (tests as safety net)
- ✅ **Positive:** Better code quality (testable = maintainable)
- ⚠️ **Negative:** Slower development (write tests + code)
- ⚠️ **Negative:** Test maintenance overhead (tests can break)

**Alternatives Considered:**
- Manual testing only: Cheaper, but error-prone and slow
- No testing: Fastest development, but catastrophic in production

**Why This Decision:**
Payment flows cannot fail (lost revenue). Security vulnerabilities cannot exist (legal liability). Automated tests catch regressions. Manual testing validates teen usability assumptions.

---

## DECISION 013: Deployment Strategy - Vercel + GitHub Actions

**Date:** 2026-02-02  
**Status:** Accepted  
**Context:** Already deployed on Vercel. Need automated deployment pipeline for reliability.

**Decision:**
- **Hosting:** Vercel (frontend + API routes)
- **CI/CD:** GitHub Actions (run tests on PR, deploy on merge to main)
- **Environments:** 
  - `main` branch → Production (https://my-ai-plushieapp.vercel.app/)
  - `develop` branch → Staging (for testing before production)
  - Feature branches → Preview deployments

**Consequences:**
- ✅ **Positive:** Automated deployments (less human error)
- ✅ **Positive:** Preview URLs for every PR (easy testing)
- ✅ **Positive:** Rollback easy (revert git commit)
- ✅ **Positive:** Vercel optimized for Next.js (fast edge deployments)
- ⚠️ **Negative:** Vercel free tier limits (may need paid plan)

**Alternatives Considered:**
- Netlify: Similar to Vercel, less Next.js optimization
- AWS/Google Cloud: More complex, overkill for MVP
- Manual deployment: Unreliable, error-prone

**Why This Decision:**
Already on Vercel. Vercel + Next.js = best performance. GitHub Actions free for public repos. Automated deployment reduces mistakes. Preview deployments speed up reviews.

---

## DECISION 014: AI Development Tools - Claude Code + Cursor

**Date:** 2026-02-02  
**Status:** Accepted  
**Context:** User wants to use AI tools for development. Need clear division of responsibilities.

**Decision:**
- **Claude Code:** Autonomous backend development, file generation, complex multi-file tasks
- **Cursor:** IDE for manual editing, viewing code, quick UI tweaks
- **Documentation:** All planning docs guide AI agents on what to build

**Consequences:**
- ✅ **Positive:** Faster development (AI handles boilerplate)
- ✅ **Positive:** Consistent code quality (AI follows best practices)
- ✅ **Positive:** Documentation as "source of truth" for AI
- ⚠️ **Negative:** Need to learn AI tool workflows
- ⚠️ **Negative:** AI may make assumptions (need to review generated code)

**Alternatives Considered:**
- No AI tools: Slower, but full human control
- Only Cursor: Good for editing, less autonomous than Claude Code

**Why This Decision:**
User's stated preference. Claude Code excels at autonomous backend scaffolding. Cursor good for manual refinements. Comprehensive docs ensure AI builds correctly.

---

## 🚀 FUTURE DECISIONS TO MAKE

These decisions need to be finalized during document creation:

### Technical Decisions:
- [ ] **Rate limiting strategy:** How to prevent API abuse
- [ ] **Session storage:** Redis vs database vs JWT-only
- [ ] **Email service:** SendGrid vs Resend vs AWS SES
- [ ] **Analytics:** Google Analytics vs privacy-focused alternatives
- [ ] **Error tracking:** Sentry vs LogRocket vs custom
- [ ] **Search functionality:** Algolia vs Typesense vs PostgreSQL full-text

### Business Decisions:
- [ ] **Return policy:** How many days? Refund or store credit?
- [ ] **Shipping strategy:** Flat rate vs calculated vs free over $X
- [ ] **Sales tax:** Nexus states? Use Stripe Tax or custom?
- [ ] **International sales:** US-only initially or global from day one?
- [ ] **Gift cards:** Support or not in MVP?
- [ ] **Discount codes:** Manual vs automated? Percentage vs fixed amount?

### Operations Decisions:
- [ ] **Customer support:** Email only vs live chat vs phone
- [ ] **Order fulfillment:** How does admin know about new orders?
- [ ] **Inventory alerts:** Notify admin when stock low?
- [ ] **Backup frequency:** Daily? Real-time replication?
- [ ] **Monitoring alerts:** Email vs SMS vs Slack?

---

## 📚 DECISION-MAKING PRINCIPLES

When making future architectural decisions, follow these principles:

1. **Security First:** Always consider security implications before features
2. **User Experience:** Optimize for teenage mobile users
3. **Simplicity:** Choose simple solutions over complex ones (YAGNI)
4. **Maintainability:** Future developers (including AI) should understand code
5. **Compliance:** Verify all decisions against COPPA, PCI-DSS, CCPA, ADA
6. **Scalability:** Design for 10 users, but don't break at 10,000
7. **Cost-Effectiveness:** Use free tiers when possible, plan for paid tiers
8. **Vendor Risk:** Avoid single points of failure, plan migration paths

---

## 📝 HOW TO ADD NEW DECISIONS

When adding a new decision to this log:

1. **Assign sequential Decision ID** (e.g., DECISION 015)
2. **Date the decision** (when it was made)
3. **Set status** (Proposed → Accepted or Rejected)
4. **Explain context** (why was this decision needed?)
5. **State the decision** (what was chosen?)
6. **List consequences** (pros and cons)
7. **Document alternatives** (what else was considered?)
8. **Justify the choice** (why this over alternatives?)

**Example template:**

```markdown
## DECISION XXX: [Title]

**Date:** YYYY-MM-DD  
**Status:** Proposed | Accepted | Superseded | Deprecated  
**Context:** [Why this decision was needed]

**Decision:**
[What was decided]

**Consequences:**
- ✅ **Positive:** [Benefits]
- ⚠️ **Negative:** [Drawbacks]

**Alternatives Considered:**
- [Option A]: [Why not chosen]
- [Option B]: [Why not chosen]

**Why This Decision:**
[Rationale for choosing this option]
```

---

## DECISION 015: Testing Framework - Vitest for Unit/Integration

**Date:** 2026-02-02
**Status:** Accepted
**Context:** Need to choose testing framework for unit and integration tests. Must work well with Next.js App Router, TypeScript, and provide fast feedback.

**Decision:**
Use **Vitest** instead of Jest for all unit and integration testing:
- Frontend: Vitest + React Testing Library
- Backend: Vitest for API routes and business logic
- Integration: Vitest with test database
- Coverage: Built-in v8 coverage provider

**Consequences:**
- ✅ **Positive:** 5-10x faster than Jest (hot module reloading, native ESM)
- ✅ **Positive:** Drop-in Jest replacement (same API, easy migration)
- ✅ **Positive:** Better TypeScript support out of the box
- ✅ **Positive:** Built-in UI mode for interactive test debugging
- ✅ **Positive:** Native Next.js App Router compatibility
- ⚠️ **Negative:** Smaller community than Jest (but growing rapidly)
- ⚠️ **Negative:** Some Jest plugins may not work (rare edge cases)

**Alternatives Considered:**
- Jest: More mature, larger community, but slower and ESM issues
- Mocha + Chai: Too old-school, verbose syntax
- Node Test Runner: Too new, limited features

**Why This Decision:**
Speed is critical for developer productivity. Vitest's hot module reloading means tests re-run in milliseconds, not seconds. Native ESM support eliminates Next.js App Router compatibility issues that plague Jest.

---

## DECISION 016: E2E Testing Framework - Playwright

**Date:** 2026-02-02
**Status:** Accepted
**Context:** Need E2E testing framework to test full user flows (checkout, login, etc.) across browsers and devices.

**Decision:**
Use **Playwright** for all end-to-end testing:
- Cross-browser: Chrome, Firefox, Safari
- Mobile: iPhone, Android device emulation
- Features: Auto-waiting, video recording, screenshots
- Parallel execution for speed

**Consequences:**
- ✅ **Positive:** Cross-browser testing out of the box
- ✅ **Positive:** Mobile device emulation (critical for teen users)
- ✅ **Positive:** Auto-waiting reduces flaky tests
- ✅ **Positive:** Video recording on failures (easier debugging)
- ✅ **Positive:** Fast execution (parallel tests)
- ✅ **Positive:** Built-in network interception (mock API calls)
- ⚠️ **Negative:** Slower than Cypress for local development
- ⚠️ **Negative:** Smaller plugin ecosystem than Cypress

**Alternatives Considered:**
- Cypress: Popular, great DX, but no Safari support, slower CI
- Selenium: Old, verbose, slow, brittle tests
- Puppeteer: Chrome-only, lower-level API

**Why This Decision:**
Need Safari testing (iPhone users = 40% of teen market). Playwright's auto-waiting eliminates the flaky test problem that plagues Cypress. Video recording on failures is critical for debugging CI failures.

---

## DECISION 017: Test Database Strategy - Separate Test DB

**Date:** 2026-02-02
**Status:** Accepted
**Context:** Integration tests need to interact with database. Need to decide how to handle test data without affecting development or production databases.

**Decision:**
Use **separate test database** (plushie_test):
- Create dedicated PostgreSQL test database
- Run migrations on test DB
- Clear all tables before each test suite
- Never share with development or production

**Consequences:**
- ✅ **Positive:** Isolated testing (no accidental data corruption)
- ✅ **Positive:** Realistic tests (actual database queries)
- ✅ **Positive:** Test migrations (ensure schema changes work)
- ✅ **Positive:** Safe to wipe clean between tests
- ⚠️ **Negative:** Slower than in-memory database (but more realistic)
- ⚠️ **Negative:** Requires PostgreSQL running locally

**Alternatives Considered:**
- In-memory SQLite: Faster but less realistic (different SQL dialect)
- Mock all DB calls: Fastest but doesn't test actual queries
- Shared dev database: Dangerous (tests can corrupt dev data)

**Why This Decision:**
Payment and inventory logic are critical. Need to test actual SQL queries against real PostgreSQL to catch bugs (e.g., transaction issues, constraint violations). Speed trade-off is worth the confidence.

---

## DECISION 018: CI/CD Testing - GitHub Actions

**Date:** 2026-02-02
**Status:** Accepted
**Context:** Need automated testing on every PR to catch bugs before they reach production.

**Decision:**
Use **GitHub Actions** for continuous testing:
- Run tests on every push and PR
- Block merge if tests fail
- Upload coverage to Codecov
- Upload Playwright reports as artifacts
- Run tests in parallel when possible

**Consequences:**
- ✅ **Positive:** Automated testing (no manual QA before merge)
- ✅ **Positive:** Free for public repos (unlimited minutes)
- ✅ **Positive:** Native GitHub integration (PR status checks)
- ✅ **Positive:** Coverage tracking (Codecov integration)
- ✅ **Positive:** Playwright report artifacts (debug failures)
- ⚠️ **Negative:** Slower than local tests (cold start, no cache)

**Alternatives Considered:**
- Vercel (deployment platform): Limited testing features
- CircleCI: Paid, overkill for MVP
- Jenkins: Self-hosted, too complex

**Why This Decision:**
GitHub Actions is free, well-integrated with PRs, and has excellent Playwright support. Coverage tracking via Codecov ensures quality doesn't regress. Blocking PRs on test failures prevents bugs from reaching production.

---

## DECISION 019: Visual Regression Testing - Deferred to Post-MVP

**Date:** 2026-02-02
**Status:** Accepted
**Context:** Visual regression testing can catch UI bugs, but adds complexity and CI time.

**Decision:**
**Skip visual regression testing for MVP:**
- Focus on functional tests (unit, integration, E2E)
- Manual QA for visual issues
- Add visual regression post-MVP if needed

**Consequences:**
- ✅ **Positive:** Faster CI (no screenshot comparisons)
- ✅ **Positive:** Simpler setup (fewer tools to maintain)
- ✅ **Positive:** Focus on critical paths (functional correctness)
- ⚠️ **Negative:** Visual bugs may slip through (rely on manual QA)
- ⚠️ **Negative:** May need to add later (retrofit cost)

**Alternatives Considered:**
- Percy: Paid service, automatic screenshot diffing
- Chromatic: Free tier limited, good Storybook integration
- Playwright screenshots: Manual diffing, brittle

**Why This Decision:**
Visual bugs are lower priority than functional bugs (broken checkout = lost revenue). Manual QA can catch visual issues during MVP phase. Can add visual regression testing post-launch if UI bugs become a problem.

---

## DECISION 020: Admin Authentication - Key-Based System (MVP)

**Date:** 2026-02-03
**Status:** Accepted
**Context:** Phase 5 requires admin dashboard to manage products and view orders. Need simple authentication that works immediately without complex setup.

**Decision:**
Use **key-based authentication** for MVP admin access:
- Single admin key stored in environment variable (ADMIN_KEY)
- Admin enters key on login page, stored in localStorage
- All admin API routes verify x-admin-key header
- Simple context provider for auth state
- No user accounts, roles, or permissions (single admin only)

**Consequences:**
- ✅ **Positive:** Zero setup (just generate random key)
- ✅ **Positive:** No database tables needed (users, sessions, roles)
- ✅ **Positive:** Fast to implement (works in 30 minutes)
- ✅ **Positive:** Sufficient security for single-admin MVP
- ⚠️ **Negative:** Single key = no audit trail of who did what
- ⚠️ **Negative:** No role-based permissions (all-or-nothing access)
- ⚠️ **Negative:** Key rotation requires redeployment

**Alternatives Considered:**
- NextAuth.js: More robust, but adds complexity and database tables
- Auth0/Clerk: External service, overkill for single admin
- Basic HTTP Auth: Less user-friendly, no logout flow

**Why This Decision:**
MVP with single admin doesn't need complex auth system. Key-based auth works immediately, requires no database changes, and provides sufficient security when key is kept secure. Can migrate to NextAuth.js post-MVP when multiple admin users needed.

---

## DECISION 021: Google Sheets Integration - Optional Admin Feature

**Date:** 2026-02-03
**Status:** Accepted
**Context:** Initially planned Google Sheets as primary admin interface (DECISION 007). After building admin dashboard, Sheets becomes optional backup/reporting tool.

**Decision:**
**Update DECISION 007 status to "Superseded":**
- Google Sheets is now optional feature, not required
- Admin dashboard (Phase 5) provides full product/order management
- Sheets integration useful for:
  - Bulk product updates (import from Sheets)
  - Exporting data for reporting/analysis
  - Non-technical team member access
- Two-way sync: import products from Sheets, export products/orders to Sheets

**Consequences:**
- ✅ **Positive:** Admin can manage products directly in app (no Sheets required)
- ✅ **Positive:** Sheets available as backup/reporting tool when needed
- ✅ **Positive:** Flexibility (use Sheets or dashboard, or both)
- ✅ **Positive:** Order data can be exported to Sheets for analysis
- ⚠️ **Negative:** Sheets setup is optional (may never be configured)
- ⚠️ **Negative:** Two interfaces to maintain (dashboard + Sheets)

**Alternatives Considered:**
- Remove Sheets entirely: Lose bulk import and reporting capabilities
- Sheets-only (no dashboard): Less user-friendly, no real-time updates
- Dashboard-only (current): Works but no bulk operations

**Why This Decision:**
Admin dashboard is more user-friendly than Sheets for day-to-day product management. But Sheets integration provides valuable bulk import and data export capabilities. Making Sheets optional gives best of both worlds.

---

**End of Decisions Log**
**Last Updated:** 2026-02-03
**Next Review:** After Phase 6 (Polish & Deploy)
