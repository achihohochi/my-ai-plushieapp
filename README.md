# 🧸 AI Plushie E-commerce App

A fully-functional e-commerce platform for AI-themed plushies, built with Next.js, TypeScript, PostgreSQL, and Stripe. Features include product catalog, shopping cart with persistence, secure checkout with Stripe payments, admin dashboard, and Google Sheets integration.

**Live Demo:** [https://my-ai-plushieapp.vercel.app/](https://my-ai-plushieapp.vercel.app/)

---

## ✨ Features

### Customer Features
- 🛍️ **Product Catalog** - Browse 14 adorable AI-themed plushies
- 🛒 **Persistent Shopping Cart** - Cart saved to database, survives page refreshes
- 💳 **Stripe Payments** - Secure checkout with credit/debit cards
- 📦 **Guest Checkout** - No account required to make purchases
- 📱 **Mobile-Friendly** - Optimized for teenagers on mobile devices
- 🎨 **Dark Mode** - Toggle between light and dark themes

### Admin Features
- 📊 **Admin Dashboard** - View stats, revenue, and order counts
- 📝 **Order Management** - View all orders with full details
- 💰 **Product Management** - Edit prices, stock levels, and status
- 📄 **Google Sheets Sync** - Optional bulk import/export via Google Sheets
- 🔐 **Secure Access** - Key-based authentication for admin

### Technical Features
- ⚡ **Next.js 16 App Router** - Modern React framework with server components
- 🗄️ **PostgreSQL Database** - Robust relational database with Prisma ORM
- 💳 **Stripe Integration** - PCI-compliant payment processing
- 🔒 **Secure Sessions** - HTTP-only cookies for guest cart management
- 📦 **Inventory Tracking** - Real-time stock updates with audit logging
- 🌐 **API Routes** - RESTful backend API for all operations

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **PostgreSQL** ([Download](https://www.postgresql.org/download/) or use [Postgres.app](https://postgresapp.com/) for macOS)
- **Stripe Account** (free test account: [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register))

Check installations:
```bash
node --version  # Should be v18+
psql --version  # Should be 12+
```

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd my-ai-plushieapp
   npm install
   ```

2. **Create PostgreSQL database:**
   ```bash
   # Start PostgreSQL (if not running)
   # macOS with Postgres.app: Just open the app
   # macOS with Homebrew: brew services start postgresql
   # Linux: sudo systemctl start postgresql

   # Create database
   createdb plushie_app

   # Verify
   psql -l | grep plushie_app
   ```

3. **Set up environment variables:**
   ```bash
   # Copy example environment file
   cp .env.example .env

   # Edit .env and add your values
   # At minimum, update:
   # - DATABASE_URL (your PostgreSQL connection)
   # - STRIPE_SECRET_KEY (from Stripe dashboard)
   # - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (from Stripe dashboard)
   ```

4. **Run database migrations and seed:**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

5. **Set up Stripe webhooks (separate terminal):**
   ```bash
   # Install Stripe CLI (if not installed)
   brew install stripe/stripe-cli/stripe  # macOS
   # OR visit: https://stripe.com/docs/stripe-cli

   # Login to Stripe
   stripe login

   # Start webhook forwarding
   stripe listen --forward-to localhost:3002/api/webhooks/stripe

   # Copy the webhook secret (whsec_...) to .env
   ```

6. **Start development server:**
   ```bash
   npm run dev -- --port 3002
   ```

7. **Visit the app:**
   - **Shop:** http://localhost:3002/shop
   - **Cart:** http://localhost:3002/cart
   - **Admin:** http://localhost:3002/admin/login

---

## 📖 Detailed Setup Guides

- **Stripe Integration:** See [docs/STRIPE_SETUP.md](docs/STRIPE_SETUP.md)
- **Google Sheets (Optional):** See [docs/GOOGLE_SHEETS_SETUP.md](docs/GOOGLE_SHEETS_SETUP.md)
- **Project Documentation:** See [docs/00_PROJECT_INDEX.md](docs/00_PROJECT_INDEX.md)

---

## 🧪 Testing

### Test the Shopping Flow

1. **Browse products:** http://localhost:3002/shop
2. **Add to cart:** Click "Add to Cart" on any plushie
3. **View cart:** Click cart icon in header
4. **Checkout:** Click "Proceed to Checkout"
5. **Fill shipping info:**
   - Email: test@example.com
   - Name: Test User
   - Address: 123 Main St, San Francisco, CA, 94102
6. **Pay with Stripe test card:**
   - Card: `4242 4242 4242 4242`
   - Expiration: Any future date (12/25)
   - CVC: Any 3 digits (123)
   - ZIP: Any 5 digits (12345)
7. **Verify order created:**
   ```bash
   psql -U chiho -d plushie_app -c "SELECT * FROM orders ORDER BY created_at DESC LIMIT 1;"
   ```

### Test Admin Dashboard

1. **Login:** http://localhost:3002/admin/login
2. **Enter admin key:** (default: `change-this-to-a-secure-random-key`)
3. **View dashboard:** See revenue, order count, product count
4. **Manage orders:** View all orders with details
5. **Edit products:** Update prices, stock levels

---

## 📁 Project Structure

```
my-ai-plushieapp/
├── app/
│   ├── api/                      # Backend API routes
│   │   ├── products/             # GET /api/products, /api/products/[id]
│   │   ├── cart/                 # Cart CRUD (add, get, update, delete)
│   │   ├── checkout/             # POST /api/checkout (legacy)
│   │   ├── create-checkout-session/ # Stripe checkout session
│   │   ├── webhooks/stripe/      # Stripe webhook handler
│   │   └── admin/                # Admin API routes (protected)
│   ├── shop/                     # Product listing page
│   ├── products/[id]/            # Product detail pages
│   ├── cart/                     # Shopping cart page
│   ├── checkout/                 # Checkout flow
│   │   ├── success/              # Payment success page
│   │   └── cancel/               # Payment cancelled page
│   └── admin/                    # Admin dashboard
│       ├── login/                # Admin login
│       ├── dashboard/            # Admin overview
│       ├── orders/               # Order management
│       └── products/             # Product management
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── cart-context.tsx          # Shopping cart state
│   ├── admin-context.tsx         # Admin auth state
│   └── *.tsx                     # Feature components
├── lib/
│   ├── prisma.ts                 # Database client
│   ├── stripe.ts                 # Stripe client
│   ├── google-sheets.ts          # Google Sheets API (optional)
│   └── utils.ts                  # Utility functions
├── prisma/
│   ├── schema.prisma             # Database schema (7 tables)
│   └── seed.ts                   # Seed data (14 products)
├── docs/                         # Comprehensive documentation
│   ├── 00_PROJECT_INDEX.md       # Documentation index
│   ├── SESSION_NOTES.md          # Development progress
│   ├── DECISIONS.md              # Architectural decisions
│   ├── STRIPE_SETUP.md           # Stripe integration guide
│   └── GOOGLE_SHEETS_SETUP.md    # Google Sheets guide
├── .env                          # Environment variables (not committed)
├── .env.example                  # Environment template
├── CLAUDE.md                     # AI development guide
└── SKILLS.md                     # Reusable code patterns
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16.0.7 (App Router)
- **Language:** TypeScript 5
- **UI Library:** React 19.2.0
- **Styling:** Tailwind CSS 4
- **Components:** shadcn/ui + Radix UI
- **Icons:** Lucide React
- **State:** React Context API

### Backend
- **Runtime:** Node.js (Next.js API routes)
- **Database:** PostgreSQL
- **ORM:** Prisma 7.3.0 with @prisma/adapter-pg
- **Payments:** Stripe
- **Sessions:** HTTP-only cookies
- **Validation:** Zod

### Infrastructure
- **Hosting:** Vercel
- **Database:** Local PostgreSQL (can deploy to Vercel Postgres)
- **CDN:** Vercel Edge Network
- **Analytics:** Vercel Analytics

---

## 🗄️ Database Schema

7 tables with full referential integrity:

- **products** - Product catalog (id, name, description, price, stock, image, category)
- **cart_items** - Guest cart items (session_id, product_id, quantity)
- **orders** - Customer orders (order_number, email, shipping address, payment info)
- **order_items** - Order line items (order_id, product_id, quantity, price_at_time)
- **addresses** - Shipping addresses (future use)
- **users** - User accounts (future use)
- **inventory_log** - Stock change audit trail

See `prisma/schema.prisma` for full schema.

---

## 🔐 Security Features

- ✅ **PCI-DSS Compliant** - No card data stored (Stripe handles all payment data)
- ✅ **Environment Variables** - All secrets in .env (never committed)
- ✅ **HTTP-only Cookies** - Session cookies inaccessible to JavaScript
- ✅ **Input Validation** - Server-side validation on all inputs
- ✅ **SQL Injection Protection** - Parameterized queries via Prisma
- ✅ **Webhook Signature Verification** - Stripe webhooks verified
- ✅ **Admin Key Authentication** - Protected admin routes

---

## 📊 API Routes

### Public Endpoints
- `GET /api/products` - List all products
- `GET /api/products/[id]` - Get single product
- `POST /api/cart` - Add item to cart
- `GET /api/cart` - Get cart items
- `PUT /api/cart/[id]` - Update cart item quantity
- `DELETE /api/cart/[id]` - Remove cart item
- `POST /api/create-checkout-session` - Create Stripe checkout
- `POST /api/webhooks/stripe` - Stripe webhook handler

### Admin Endpoints (require x-admin-key header)
- `POST /api/admin/sync-sheets` - Import/export Google Sheets
- `GET /api/admin/orders` - List all orders
- `POST /api/admin/orders` - Export orders to Sheets
- `PUT /api/admin/products/[id]` - Update product

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Visit [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel auto-detects Next.js

3. **Add environment variables in Vercel dashboard:**
   - `DATABASE_URL` (use Vercel Postgres or external DB)
   - `STRIPE_SECRET_KEY` (live key: sk_live_...)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (pk_live_...)
   - `STRIPE_WEBHOOK_SECRET` (create production webhook)
   - `NEXT_PUBLIC_BASE_URL` (your Vercel domain)
   - `ADMIN_KEY` (generate secure key)

4. **Create production Stripe webhook:**
   - Go to: https://dashboard.stripe.com/webhooks
   - Add endpoint: `https://your-domain.vercel.app/api/webhooks/stripe`
   - Select events: `checkout.session.completed`, `payment_intent.payment_failed`
   - Copy webhook secret to Vercel environment variables

5. **Deploy!**
   - Click "Deploy" in Vercel
   - Automatic deployments on every push to main

### Database Migration for Production

```bash
# Generate migration
npx prisma migrate dev --name init

# Push to production database
npx prisma db push

# Seed production database
npx prisma db seed
```

---

## 📝 Development Workflow

### Phase-Based Development

This project was built incrementally in phases:

1. **Phase 1: Foundation** - Database, API, seed data
2. **Phase 2: Product Catalog** - Shop page, product details
3. **Phase 3: Shopping Cart** - Persistent cart with sessions
4. **Phase 4: Checkout** - Order creation, inventory management
5. **Phase 5: Admin & Sheets** - Admin dashboard, Google Sheets
6. **Phase 6: Polish & Deploy** - Stripe payments, email, testing (current)

See [docs/SESSION_NOTES.md](docs/SESSION_NOTES.md) for detailed progress.

### Making Changes

```bash
# Start dev server
npm run dev -- --port 3002

# Make changes to code
# Hot reload updates instantly

# Test changes
# Visit http://localhost:3002

# Update database schema
# Edit prisma/schema.prisma, then:
npx prisma db push
npx prisma generate

# Commit changes
git add .
git commit -m "feat: description of changes"
git push
```

---

## 🧑‍💻 Available Scripts

```bash
# Development
npm run dev              # Start dev server (port 3000)
npm run dev -- --port 3002  # Start on specific port

# Build
npm run build            # Create production build
npm run start            # Start production server

# Database
npx prisma generate      # Generate Prisma client
npx prisma db push       # Push schema to database
npx prisma db seed       # Seed database with products
npx prisma studio        # Open Prisma Studio GUI

# Linting
npm run lint             # Run ESLint

# Stripe (requires Stripe CLI)
stripe login             # Authenticate Stripe CLI
stripe listen --forward-to localhost:3002/api/webhooks/stripe
```

---

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
pg_isready

# Test connection
psql -U chiho -d plushie_app -c "SELECT 1"

# Reset database
dropdb plushie_app
createdb plushie_app
npx prisma db push
npx prisma db seed
```

### Stripe Issues
- See [docs/STRIPE_SETUP.md](docs/STRIPE_SETUP.md#-troubleshooting)
- Verify environment variables are set
- Check webhook listener is running
- Use Stripe test cards only in development

### Port Already in Use
```bash
# Find process using port 3002
lsof -ti:3002

# Kill process
kill -9 $(lsof -ti:3002)

# Or use different port
npm run dev -- --port 3003
```

---

## 📚 Documentation

Comprehensive documentation in `/docs`:

- [00_PROJECT_INDEX.md](docs/00_PROJECT_INDEX.md) - Documentation hub
- [SESSION_NOTES.md](docs/SESSION_NOTES.md) - Development progress
- [DECISIONS.md](docs/DECISIONS.md) - Architectural decisions
- [STRIPE_SETUP.md](docs/STRIPE_SETUP.md) - Stripe integration
- [GOOGLE_SHEETS_SETUP.md](docs/GOOGLE_SHEETS_SETUP.md) - Sheets setup
- [CLAUDE.md](CLAUDE.md) - AI development guide
- [SKILLS.md](SKILLS.md) - Reusable code patterns

---

## 🤝 Contributing

This is a personal project, but contributions are welcome!

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is private and for educational purposes.

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Payments powered by [Stripe](https://stripe.com/)
- Database ORM by [Prisma](https://www.prisma.io/)
- Developed with assistance from [Claude Code](https://claude.ai/claude-code)

---

## 📞 Support

- **Documentation:** [docs/00_PROJECT_INDEX.md](docs/00_PROJECT_INDEX.md)
- **Stripe Issues:** [docs/STRIPE_SETUP.md](docs/STRIPE_SETUP.md)
- **Database Issues:** Check PostgreSQL logs
- **Deployment Issues:** [Vercel Docs](https://vercel.com/docs)

---

Made with 💕 for AI plushie lovers everywhere! 🧸✨

**Co-Authored-By:** Claude Sonnet 4.5 <noreply@anthropic.com>
