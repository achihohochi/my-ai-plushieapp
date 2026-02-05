# Usability Testing Protocol - Teenage Users

**Product:** AI Plushie E-commerce Platform
**Target Audience:** Teenagers (13-19 years old)
**Last Updated:** February 4, 2026
**Status:** ⏳ Pending Implementation (P2 - After Launch)

---

## Purpose of This Document

This document outlines the protocol for conducting usability testing with real teenage users. Usability testing helps validate design decisions, uncover UX issues, and ensure the site meets the needs of our target audience.

**Goals:**
- Identify usability problems before launch
- Observe real teen behavior (not assumptions)
- Measure task completion rates
- Gather qualitative feedback
- Validate mobile-first design decisions

---

## 1. Usability Testing Overview

### 1.1 When to Test

| Phase | Timing | Focus |
|-------|--------|-------|
| **Prototype Testing** | Week 3-4 | Low-fidelity wireframes, navigation structure |
| **Alpha Testing** | Week 6-7 | Working features (product browsing, cart) |
| **Beta Testing** | Week 8 | Full checkout flow, edge cases |
| **Pre-Launch** | Week 9 | Final validation, regression testing |
| **Post-Launch** | Monthly | Ongoing optimization, new features |

---

### 1.2 Test Types

**Moderated Testing:**
- Researcher observes participant in real-time
- Can ask follow-up questions
- More expensive but richer insights

**Unmoderated Testing:**
- Participant completes tasks alone
- Records screen and audio
- Cheaper, scales better
- Use for Beta testing

**Recommendation:** Moderated for Alpha, Unmoderated for Beta

---

## 2. Participant Recruitment

### 2.1 Target Participants

**Demographics:**
- Age: 13-19 years old
- Gender: Mix (50% female, 40% male, 10% non-binary)
- Tech proficiency: Mix (beginner to advanced)
- Shopping habits: Mix (frequent online shoppers vs. rarely shop online)

**Sample Size:**
- **Alpha Testing:** 5-8 participants (enough to find 85% of issues)
- **Beta Testing:** 15-20 participants (broader sample)

---

### 2.2 Recruitment Channels

**Where to Find Teens:**
- Local high schools (permission required)
- Youth groups, clubs (coding clubs, gaming communities)
- Family and friends (ask for referrals)
- Social media (Instagram, TikTok ads)
- UserTesting.com (professional panel)

**Incentives:**
- $25 gift card (Amazon, Venmo) for 30-minute session
- $50 for 60-minute session
- Free plushie after launch (if budget allows)

---

### 2.3 Screening Questions

**Pre-Screening Survey:**

1. **Age:** How old are you? _[13-19 required]_

2. **Device Usage:** What device do you use most for browsing websites?
   - [ ] iPhone
   - [ ] Android phone
   - [ ] Tablet
   - [ ] Desktop/laptop

3. **Online Shopping:** How often do you shop online?
   - [ ] Weekly
   - [ ] Monthly
   - [ ] A few times a year
   - [ ] Rarely or never

4. **Payment Methods:** How do you usually pay for things online? (Select all that apply)
   - [ ] Parent's credit card
   - [ ] My own debit/credit card
   - [ ] Venmo/Cash App
   - [ ] PayPal
   - [ ] Gift cards
   - [ ] Other

5. **Tech Proficiency:** How comfortable are you with using websites and apps?
   - [ ] Very comfortable (I figure things out quickly)
   - [ ] Comfortable (I can use most sites easily)
   - [ ] Somewhat comfortable (I sometimes need help)
   - [ ] Not comfortable (I often need help)

**Selection Criteria:**
- Aim for diversity in device usage, shopping frequency, and tech proficiency
- Exclude participants who work in e-commerce or web design (too biased)

---

## 3. Test Setup

### 3.1 Equipment Needed

**For Moderated In-Person Testing:**
- Participant's own phone (most realistic) or test device (iPhone/Android)
- Screen recording software (QuickTime, AZ Screen Recorder)
- External camera to record participant's face/hands (optional)
- Quiet room with good WiFi
- Note-taking device (laptop)

**For Remote Moderated Testing:**
- Zoom or Google Meet (screen sharing)
- Recording permission (ask for consent)
- Backup: Loom for screen recording

**For Unmoderated Testing:**
- UserTesting.com or Maze.co (handles recording)
- Task list uploaded to platform

---

### 3.2 Environment Setup

**Test Environment:**
- Use staging site (not production)
- Seed test data (products, inventory)
- Enable Stripe test mode (4242 4242 4242 4242)
- Disable analytics (don't pollute production data)

**URL:** https://staging.myaiplushieshop.vercel.app

---

## 4. Test Protocol (Moderated)

### 4.1 Welcome & Consent (5 minutes)

**Script:**

> Hi [Name], thanks for joining! I'm [Your Name] and I'll be guiding you through this session today.
>
> **What we're doing:** We're testing a new website for buying plushies. I want to see how easy it is to use and get your honest feedback.
>
> **Important things to know:**
> - We're testing the site, not you. There are no right or wrong answers.
> - Think out loud as you go. Tell me what you're thinking, what confuses you, what you like.
> - Be honest! If something sucks, say so. That helps us improve.
> - I'll be recording the screen and audio to share with the team. Is that okay?
>
> [Wait for consent. If under 18, parental consent required.]
>
> Any questions before we start?

---

### 4.2 Background Questions (5 minutes)

**Ask:**

1. "Tell me a bit about yourself. What do you like to do for fun?"
   - [Builds rapport, gets them talking]

2. "Do you collect anything? Plushies, figures, stickers?"
   - [Understand if they're target audience]

3. "When's the last time you bought something online? What was it?"
   - [Understand shopping behavior]

4. "Show me how you usually shop online. Walk me through it."
   - [Observe their natural behavior, baseline UX expectations]

---

### 4.3 Tasks (30 minutes)

**Task 1: Browse & Explore (5 min)**

**Prompt:**
> Imagine you're looking for a cute plushie for your desk. Go to the website and browse around. Tell me what you see.

**Observe:**
- Where do they look first? (Logo, nav, products, images?)
- Do they scroll or click immediately?
- What do they say about the design? (colors, layout, vibe)
- Any confusion about navigation?

**Follow-up Questions:**
- "What's your first impression?"
- "Is anything confusing or unclear?"
- "What would you click on first?"

---

**Task 2: Find a Specific Product (3 min)**

**Prompt:**
> Let's say you want to find a pink bunny plushie that's under $30. How would you do that?

**Observe:**
- Do they use search or browse categories?
- Do they find filters easily?
- Do they understand sorting options?
- How long does it take?

**Success Criteria:**
- ✅ Finds pink bunny within 60 seconds
- ❌ Takes > 2 minutes or gives up

---

**Task 3: View Product Details (3 min)**

**Prompt:**
> Click on that product and tell me what you learn about it.

**Observe:**
- Do they read the description or just look at images?
- Do they try to zoom the image?
- Do they check dimensions/size?
- Do they look for reviews?

**Follow-up Questions:**
- "Is there enough information to decide if you want it?"
- "What else would you want to know?"
- "Is the price clear?"

---

**Task 4: Add to Cart (2 min)**

**Prompt:**
> Let's say you want to buy this. Go ahead and add it to your cart.

**Observe:**
- Do they find the "Add to Cart" button easily?
- Do they notice the quantity selector?
- Do they see the cart badge update?
- Do they open the cart sidebar automatically or need prompting?

**Success Criteria:**
- ✅ Adds to cart within 30 seconds
- ✅ Notices cart badge
- ❌ Can't find button or confused

---

**Task 5: Update Cart (2 min)**

**Prompt:**
> Actually, you want to buy 2 of these. How would you do that?

**Observe:**
- Do they go to cart or product page?
- Can they find the quantity +/- buttons?
- Do they notice the price update?

---

**Task 6: Checkout (10 min) - MOST IMPORTANT**

**Prompt:**
> Great! Now let's say you're ready to buy this. Go ahead and check out. Use this fake info:
> - Email: test@example.com
> - Name: Test User
> - Address: 123 Main St, San Francisco, CA 94102
> - Card: 4242 4242 4242 4242, Exp: 12/30, CVC: 123
>
> [Hand them a card with this info printed]

**Observe:**
- Is "Checkout" button easy to find?
- Guest vs. Login: Do they understand the option?
- Form fields: Any confusion? Too many fields?
- Validation: Do errors make sense?
- Payment: Comfortable entering card details?
- Loading: Do they know it's processing?
- Confirmation: Do they know the order succeeded?

**Success Criteria:**
- ✅ Completes checkout within 3 minutes
- ✅ No errors or frustration
- ❌ Gets stuck, frustrated, or gives up

**Follow-up Questions:**
- "Was that easy or hard? Why?"
- "Did you feel comfortable entering payment info?"
- "Is there anything that would have made it faster?"

---

**Task 7: Find Order Confirmation (2 min)**

**Prompt:**
> Let's say you just bought this but want to check your order details. How would you find them?

**Observe:**
- Do they look for email confirmation?
- Do they look for "My Orders" in account?
- Do they expect an order number?

---

### 4.4 Post-Task Questions (5 minutes)

**Ask:**

1. **Overall Impression:**
   - "On a scale of 1-10, how easy was that? Why?"
   - "What did you like most?"
   - "What frustrated you the most?"

2. **Design:**
   - "What did you think of the colors and style? Too childish? Too boring?"
   - "Did it feel trustworthy? Would you actually buy from this site?"

3. **Mobile:**
   - "Did it feel good on your phone? Anything awkward?"

4. **Comparison:**
   - "Have you used Amazon, Etsy, or other shopping sites? How does this compare?"

5. **Features:**
   - "Was anything missing that you expected to see?"
   - "If you could change one thing, what would it be?"

6. **Final Question:**
   - "Would you recommend this site to a friend? Why or why not?"

---

### 4.5 Wrap-Up (2 minutes)

**Thank them:**
> Thanks so much for your time! Your feedback is super helpful. We'll send you a $25 gift card within 24 hours. And when we launch, I'll send you a link so you can check out the final version!

**Send gift card:** Email or Venmo within 24 hours (keep your word!)

---

## 5. Data Collection

### 5.1 Metrics to Track

**Quantitative:**
- Task completion rate (%)
- Time on task (seconds)
- Number of clicks to complete
- Number of errors/wrong turns
- Cart abandonment (at which step?)

**Qualitative:**
- Quotes (positive and negative)
- Pain points (what confused them?)
- Delighters (what wowed them?)
- Feature requests (what's missing?)

---

### 5.2 Observation Template

**For each participant:**

```markdown
## Participant: [ID, e.g., P01]

**Demographics:**
- Age: 16
- Gender: Female
- Device: iPhone 13
- Shopping frequency: Monthly
- Tech proficiency: Very comfortable

### Task 1: Browse & Explore
- Time: 45 seconds
- Success: ✅ Completed
- Observations: "Love the pink colors! Really cute." Scrolled immediately, didn't read text.
- Issues: None

### Task 2: Find Specific Product
- Time: 90 seconds
- Success: ✅ Completed
- Observations: Used filters (price, color). Didn't use search.
- Issues: Didn't notice filter button at first (small icon).

### Task 3: View Product Details
- Time: 30 seconds
- Success: ✅ Completed
- Observations: Zoomed image by pinching. Read bullets, skipped paragraph.
- Issues: None

### Task 4: Add to Cart
- Time: 20 seconds
- Success: ✅ Completed
- Observations: "Oh it's right there, easy!" Cart badge animated, she noticed.
- Issues: None

### Task 5: Update Cart
- Time: 45 seconds
- Success: ✅ Completed
- Observations: Went to cart, clicked +, saw price update.
- Issues: None

### Task 6: Checkout
- Time: 2 minutes 30 seconds
- Success: ✅ Completed
- Observations: Chose guest checkout. Filled form quickly. Paused at payment (said "Is this secure?").
- Issues: Wasn't sure if payment went through (loading indicator too subtle).

### Overall Feedback:
- Rating: 9/10
- Liked: "Super cute design, really easy to use"
- Disliked: "Wanted to see reviews from other people"
- Would recommend: Yes

### Key Quotes:
- "I love the pink colors, it's so cute!"
- "Is this secure? How do I know my card is safe?" [during payment]
- "Can I see what other people said about this plushie?"
```

---

## 6. Analysis & Reporting

### 6.1 Synthesize Findings

**After 5 participants, analyze:**

1. **Task Success Rates:**
   - Which tasks had < 80% success rate? (Need improvement)
   - Which tasks took too long? (> 2x expected time)

2. **Common Pain Points:**
   - What did 3+ participants struggle with?
   - Quote them (shows patterns)

3. **Surprising Insights:**
   - What did we not expect?
   - What assumptions were wrong?

4. **Prioritize Issues:**
   - **Critical:** Blocks task completion (fix immediately)
   - **High:** Causes frustration (fix before launch)
   - **Medium:** Minor annoyance (fix if time)
   - **Low:** Nice-to-have (backlog)

---

### 6.2 Report Template

**Usability Testing Report**

**Date:** [Date]
**Participants:** 5 teenagers (ages 14-18)
**Tasks:** 7 (browse, find, add to cart, checkout)

---

**Executive Summary:**
- Overall, participants found the site easy to use (avg. rating: 8.2/10)
- Checkout was the biggest pain point (40% took > 3 minutes)
- All participants loved the design ("cute", "fun")
- Key missing feature: Product reviews (requested by 4/5)

---

**Key Findings:**

**1. Checkout Loading Indicator is Too Subtle**
- **Issue:** 3/5 participants weren't sure if payment went through
- **Impact:** Anxiety, nearly clicked "Complete Purchase" twice
- **Recommendation:** Add prominent loading spinner + "Processing payment..." text
- **Priority:** HIGH (affects trust)

**2. Product Reviews Missing**
- **Issue:** 4/5 participants looked for reviews
- **Quote:** "Can I see what other people said about this plushie?" - P02
- **Recommendation:** Add review section (can be fake for MVP)
- **Priority:** MEDIUM (doesn't block purchase)

**3. Filter Button Not Obvious**
- **Issue:** 2/5 participants didn't notice filter icon (small funnel icon)
- **Recommendation:** Add "Filter" text label next to icon
- **Priority:** MEDIUM (workaround: browse without filtering)

---

**Positive Feedback:**
- "I love the pink colors, it's so cute!" - P01
- "Way easier than Amazon honestly" - P04
- "I'd definitely buy from this" - P03

---

**Task Completion Rates:**
| Task | Success Rate | Avg. Time |
|------|--------------|-----------|
| Browse | 100% (5/5) | 45s |
| Find product | 100% (5/5) | 90s |
| View details | 100% (5/5) | 30s |
| Add to cart | 100% (5/5) | 20s |
| Update cart | 100% (5/5) | 45s |
| **Checkout** | **100% (5/5)** | **2m 45s** ⚠️ |
| Find order | 80% (4/5) | 60s |

---

**Recommendations:**
1. **Fix loading indicator** (HIGH) - Before launch
2. **Add "Filter" text label** (MEDIUM) - Before launch if time
3. **Add product reviews section** (MEDIUM) - Post-MVP
4. **Improve order lookup** (LOW) - Post-MVP

---

## 7. Iteration & Re-Testing

**After fixing issues:**
1. Update staging site with improvements
2. Test with 2-3 new participants
3. Verify issues are resolved
4. If new issues found, repeat cycle

**Goal:** 90%+ task completion on all critical paths before launch

---

## 8. Continuous Usability Testing (Post-Launch)

**Monthly Testing:**
- Recruit 3-5 new teen users
- Test new features before releasing
- Track metrics over time (are we getting better?)

**A/B Testing:**
- Test design variations (button colors, layouts)
- Measure conversion rates
- Roll out winners

---

## 9. Ethical Considerations

### 9.1 Parental Consent (Under 18)

**If participant is under 18:**
- Parent/guardian must provide written consent
- Parent can observe session (but should not help)
- Compensation goes to parent (not teen directly)

**Consent Form Template:**
```
I, [Parent Name], give permission for my child [Teen Name] to participate in a usability testing session for [Company Name]. I understand:
- The session will be recorded (screen and audio)
- My child can stop at any time
- My child will receive a $25 gift card
- The recording will only be used for internal research

Parent Signature: ________________
Date: ________________
```

---

### 9.2 Privacy & Anonymity

**Protect participants:**
- Use participant IDs (P01, P02), not real names in reports
- Don't share video/audio publicly without explicit consent
- Blur faces if sharing screenshots
- Delete recordings after analysis (or store securely for 1 year max)

---

## 10. Usability Testing Checklist

**Before Testing:**
- [ ] Recruit 5-8 participants (diverse demographics)
- [ ] Schedule sessions (30-60 min each)
- [ ] Prepare staging site (test data seeded)
- [ ] Write task list and script
- [ ] Test recording equipment
- [ ] Obtain parental consent (if under 18)
- [ ] Prepare incentive payment method

**During Testing:**
- [ ] Record screen and audio
- [ ] Take notes (direct quotes)
- [ ] Observe without interrupting (unless stuck)
- [ ] Ask follow-up questions
- [ ] Thank participant

**After Testing:**
- [ ] Send gift card within 24 hours
- [ ] Transcribe key quotes
- [ ] Calculate task success rates
- [ ] Identify patterns (3+ participants)
- [ ] Write report with recommendations
- [ ] Prioritize issues (Critical/High/Medium/Low)
- [ ] Share findings with team
- [ ] Implement fixes
- [ ] Re-test (if major issues)

---

**Document History:**
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-02 | Planning Session | Initial protocol |

**Related Documents:**
- [USER_PERSONAS.md](../requirements/USER_PERSONAS.md) - Target audience profiles
- [USABILITY_GUIDELINES.md](../design/USABILITY_GUIDELINES.md) - Teen UX patterns
- [TEST_PLAN.md](./TEST_PLAN.md) - Overall testing strategy

---

**End of Usability Testing Protocol**


## ⚠️ Implementation Note (Feb 4, 2026)

Usability testing with real users is planned for post-launch. Current focus is on automated functional testing.

**Current Status:**
- ✅ Automated E2E tests covering user flows (42 tests)
- ✅ Manual testing by development team
- ⏳ Formal usability testing sessions pending
- ⏳ User feedback collection pending

**Why Post-Launch:**
- Need real users to gather meaningful usability data
- Automated tests validate functionality, usability testing validates UX
- Will iterate based on actual user behavior patterns

**Next Steps (After Launch):**
1. Recruit 5-10 teenage users
2. Conduct moderated usability sessions
3. Analyze session recordings and feedback
4. Prioritize UX improvements based on findings

**Priority:** P2 (After functional testing + initial launch)

