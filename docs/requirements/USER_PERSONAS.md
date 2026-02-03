# User Personas

**Document Purpose:** Define target users to guide product decisions, design choices, and feature prioritization.

**Last Updated:** February 2, 2025

---

## Primary Persona: Teen Shopper (Maya, 16)

### Demographics
- **Age:** 16 years old
- **Location:** Suburban United States
- **Device:** iPhone 14 (primary), occasionally uses laptop
- **Tech Savvy:** High - grew up with smartphones and social media
- **Income:** Limited personal income ($50-100/month from part-time job/allowance)
- **Shopping Behavior:** Impulse buyer, influenced by social media trends

### Goals & Motivations
1. **Express Identity:** Wants unique items that reflect personality (AI/tech aesthetic appeals)
2. **Social Sharing:** Purchases items to share on Instagram/TikTok
3. **Quick Gratification:** Expects fast browsing, instant cart updates, simple checkout
4. **Value Conscious:** Compares prices, looks for deals, abandons cart if shipping is high
5. **Mobile-First:** Does 90% of browsing on phone, often while multitasking

### Frustrations & Pain Points
- ❌ Slow-loading websites (will bounce after 3 seconds)
- ❌ Complicated checkout forms (too many required fields)
- ❌ Forced account creation before checkout
- ❌ Payment methods parents don't approve (no Venmo = deal-breaker)
- ❌ Unclear return policies (worried about wasting money)
- ❌ No size/product details (can't tell if plushie is 6" or 24")

### Tech Behavior
- **Payment Methods:** Venmo (preferred), parent's credit card, gift cards
- **Device Usage:** 
  - Mobile: 85% of time (browsing, adding to cart)
  - Desktop: 15% (maybe final checkout if parents want to review)
- **Browser:** Safari on iOS, Chrome on Android
- **Social Media:** Instagram, TikTok (discovers products here)
- **Attention Span:** 8-10 seconds to decide if site is worth browsing

### Shopping Journey (Typical)
1. **Discovery:** Sees AI plushie on TikTok or Instagram ad
2. **Browse:** Clicks link, scrolls through products on phone (vertical scrolling)
3. **Decide:** Double-taps product image for details, reads price
4. **Hesitate:** Adds to cart, but doesn't check out immediately
5. **Return:** Comes back 1-3 days later (if cart is saved!)
6. **Checkout:** Uses Venmo or asks parent to enter card
7. **Share:** Posts unboxing video on social media

### Key Quote
> "If I have to create an account just to see shipping costs, I'm leaving. Also, why doesn't this site take Venmo? Everyone uses Venmo."

### Design Implications
- ✅ Mobile-first responsive design (not just "mobile-friendly")
- ✅ Guest checkout option (no forced registration)
- ✅ Persistent cart (saved for 30 days, even without account)
- ✅ Large tap targets (44px minimum for thumbs)
- ✅ Venmo payment option prominently displayed
- ✅ Fast image loading (lazy loading, WebP format)
- ✅ Clear product dimensions in first view
- ✅ Simple return policy (easy to find, written for teens)
- ✅ Social share buttons on product pages

---

## Secondary Persona: Parent/Guardian (Lisa, 42)

### Demographics
- **Age:** 42 years old
- **Relationship:** Parent of teenage shopper
- **Tech Savvy:** Medium - uses smartphone for basics, laptop for work
- **Income:** Household income $75K-150K
- **Role:** Final approval for purchases over $50

### Goals & Motivations
1. **Safety:** Wants to ensure site is legitimate and secure
2. **Value:** Checks if price is reasonable for product quality
3. **Transparency:** Expects clear shipping costs, return policy, contact info
4. **Control:** May review cart before final purchase
5. **Trust:** Looks for professional design, SSL certificate, privacy policy

### Frustrations & Pain Points
- ❌ No visible security indicators (HTTPS, trust badges)
- ❌ Hidden fees at checkout (surprise shipping costs)
- ❌ Unclear return policy or customer service contact
- ❌ Can't find privacy policy or terms of service
- ❌ Suspicious payment methods (no recognizable brands)

### Shopping Journey (Oversight)
1. **Request:** Teen asks to buy plushie
2. **Review:** Parent checks website on laptop or phone
3. **Evaluate:** Looks for trust signals (SSL, about page, reviews)
4. **Decide:** Enters credit card or approves Venmo
5. **Monitor:** Checks email for order confirmation
6. **Track:** Watches for shipping updates

### Key Quote
> "I need to see a return policy and contact information before I let my daughter buy anything. If the site looks sketchy, the answer is no."

### Design Implications
- ✅ Visible trust signals (SSL padlock, "Secure Checkout" badge)
- ✅ Clear "About Us" page
- ✅ Contact information in footer (email, phone if available)
- ✅ Professional, clean design (no sketchy ads)
- ✅ Privacy policy and terms linked in footer
- ✅ Order confirmation emails with tracking
- ✅ Stripe payment option (parents trust established brands)

---

## Tertiary Persona: Site Owner/Admin (Jordan, 28)

### Demographics
- **Age:** 28 years old
- **Role:** Small business owner, sells AI plushies
- **Tech Savvy:** Medium - can use Shopify/Squarespace, not a developer
- **Time:** Limited - manages store part-time alongside day job
- **Budget:** Bootstrap startup, watching costs

### Goals & Motivations
1. **Ease of Use:** Needs to update prices/inventory without developer
2. **Cost Efficiency:** Prefers Google Sheets over expensive database solutions (initially)
3. **Flexibility:** Wants to change product images without re-deploying
4. **Insights:** Needs basic analytics (what's selling, abandoned carts)
5. **Growth:** Plans to scale if business succeeds

### Frustrations & Pain Points
- ❌ Having to email developer for every price change
- ❌ Complex admin panels with too many options
- ❌ Expensive inventory management software
- ❌ No visibility into what customers are doing
- ❌ Slow turnaround for feature requests

### Daily Tasks
1. Check orders each morning
2. Update inventory levels (sold out items)
3. Change prices for sales/promotions
4. Upload new product photos
5. Review customer support emails
6. Check analytics (sales trends)

### Key Quote
> "I love that it's on Google Sheets for now - I can update inventory from my phone during lunch. But I'll need real-time sync when we grow."

### Design Implications
- ✅ Simple admin dashboard (not overwhelming)
- ✅ Google Sheets integration for inventory (MVP)
- ✅ Drag-and-drop image uploads
- ✅ One-click price updates
- ✅ Export orders to CSV
- ✅ Basic analytics dashboard
- ✅ Clear error messages if something breaks
- ✅ Migration path to proper database when ready

---

## Anti-Persona: Who We're NOT Building For

### Adult Collectors (Not Target Audience)
- **Why:** Different needs (bulk ordering, rarity tracking, investment value)
- **Exclusion:** Won't prioritize features like "collector grades" or "mint condition" tags

### Very Young Children (Under 13)
- **Why:** COPPA compliance issues, need parental consent flows
- **Exclusion:** Won't build features that encourage unsupervised browsing by children under 13

### Corporate/Wholesale Buyers
- **Why:** Different needs (bulk pricing, purchase orders, invoicing)
- **Exclusion:** Won't prioritize B2B features in MVP

---

## Persona Usage Guidelines

### When Making Product Decisions:
1. **Feature Request:** "Would Maya (teen shopper) use this feature within 30 days of launch?"
2. **Design Review:** "Can Maya complete checkout in under 60 seconds on her iPhone?"
3. **Copy Writing:** "Is this written in language Maya would understand without googling terms?"
4. **Security Decision:** "Would Lisa (parent) trust this enough to enter her credit card?"
5. **Admin Tool:** "Can Jordan (owner) do this in under 2 minutes without a tutorial?"

### Priority Framework:
- **P0 (Must Have):** Features that directly serve Maya's goals
- **P1 (Should Have):** Features that address Maya's pain points
- **P2 (Nice to Have):** Features that delight Maya but aren't critical
- **P3 (Future):** Features that serve secondary personas (Lisa, Jordan)

---

## Research & Validation

### Data Sources (to validate personas post-launch):
- Google Analytics (device types, page flow, bounce rates)
- Hotjar (heatmaps showing where teens click/scroll)
- User interviews (5-10 teens after soft launch)
- Cart abandonment analysis (where do they drop off?)
- Customer support tickets (common questions/complaints)

### Success Metrics by Persona:
- **Maya:** < 3 sec page load, > 70% mobile traffic, < 60 sec checkout time
- **Lisa:** > 90% checkout completion after cart review, low refund rate
- **Jordan:** < 5 min to update prices, < 24 hrs for image changes

---

**Next Steps:**
- Use these personas when writing user stories (USER_STORIES.md)
- Reference when designing wireframes (WIREFRAMES.md)
- Test designs against persona pain points
- Update personas based on real user behavior post-launch
