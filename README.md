<div align="center">

# 🛍️ NextStore — Full-Stack E-Commerce Platform

**A production-ready e-commerce solution built with Next.js 14 App Router, featuring server-side rendering, real-time payments, and enterprise-grade authentication.**

[![Next.js](https://img.shields.io/badge/Next.js_14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)
[![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.dev/)

[Live Demo]((https://nextjs-store-project-alpha.vercel.app/))

</div>

---

## 📌 Overview

**NextStore** is a full-stack, production-grade e-commerce platform architected around the **Next.js 15 App Router** paradigm. It integrates a modern, type-safe data layer (Prisma + Supabase), enterprise-grade user authentication (Clerk), and seamless payment processing (Stripe) — all orchestrated with performance and scalability in mind.

This project demonstrates real-world engineering decisions: server components for reduced client bundle size, webhook-driven payment confirmation for reliability, and a decoupled database layer using Prisma as an ORM over a managed PostgreSQL backend.

> Built as a showcase of senior-level full-stack architecture — not a tutorial clone.

---

## ✨ Features

### Core Commerce
- 🛒 **Shopping cart** with persistent state across sessions
- 🔍 **Product catalog** with filtering, sorting, and search
- 📦 **Order management** with real-time status tracking
- 🖼️ **Product image uploads** via Supabase Storage

### Payments & Security
- 💳 **Stripe Checkout** with webhook-driven order confirmation
- 🔒 **Clerk authentication** — social login, MFA-ready, session management
- 🛡️ **Protected routes** via Next.js middleware + Clerk auth guards
- ✅ **Idempotent payment handling** to prevent duplicate orders

### Developer Experience
- 🔄 **Prisma ORM** with type-safe database queries and auto-generated client
- 🗄️ **Supabase** as managed PostgreSQL with Row-Level Security policies
- ⚡ **Server Components** by default — minimal client-side JavaScript
- 🎨 **Tailwind CSS** with a consistent design system
- 📱 **Responsive design** across all device breakpoints

---

## 🏗️ Architecture

```
nextjs-store-project/
├── app/                        # Next.js 14 App Router
│   ├── (auth)/                 # Clerk auth routes (sign-in, sign-up)
│   ├── (store)/                # Public storefront
│   │   ├── products/           # Product listing & detail pages
│   │   └── cart/               # Shopping cart
│   ├── (dashboard)/            # Protected user dashboard
│   │   └── orders/             # Order history & tracking
│   ├── admin/                  # Admin panel (role-gated)
│   └── api/                    # API Route Handlers
│       ├── webhooks/stripe/    # Stripe webhook listener
│       └── checkout/           # Checkout session creation
├── components/
│   ├── ui/                     # Reusable primitives (shadcn/ui)
│   └── store/                  # Domain-specific components
├── lib/
│   ├── db.ts                   # Prisma client singleton
│   ├── stripe.ts               # Stripe SDK singleton
│   └── supabase.ts             # Supabase client
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Development seed data
└── middleware.ts               # Clerk auth + route protection
```

---

## 🔧 Tech Stack & Technical Decisions

| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | Next.js 15 (App Router) | Server Components reduce JS bundle; built-in SSR/SSG/ISR strategies |
| **Language** | TypeScript | End-to-end type safety across API, DB, and UI layers |
| **Auth** | Clerk | Production-grade auth with social providers, webhooks, and session management out of the box |
| **ORM** | Prisma | Type-safe queries, schema-as-code, auto-generated migrations |
| **Database** | Supabase (PostgreSQL) | Managed Postgres with RLS policies; scalable from day one |
| **Payments** | Stripe | Industry-standard checkout with webhook-based confirmation (not redirect-only) |
| **Styling** | Tailwind CSS | Utility-first with zero unused CSS in production |
| **Deployment** | Vercel | Zero-config Next.js deployment with edge network and preview environments |

### Key Architectural Decisions

**Server-first rendering**: Product pages and the catalog use React Server Components, meaning product data is fetched at the server level with zero hydration cost. Only interactive elements (cart button, search input) are client components.

**Webhook-confirmed payments**: Rather than trusting redirect URLs post-checkout (which can be spoofed or interrupted), order records are only created and confirmed after receiving and validating a `checkout.session.completed` event from Stripe's webhook system.

**Prisma over direct SQL**: Using Prisma as an abstraction over Supabase's PostgreSQL means the schema is version-controlled, migrations are automated, and all queries are type-checked at compile time — eliminating an entire class of runtime errors.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Clerk](https://clerk.dev) application
- A [Stripe](https://stripe.com) account
- [Stripe CLI](https://stripe.com/docs/stripe-cli) (for local webhook testing)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Mohamed-samy0/nextjs-store-project.git
cd nextjs-store-project

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local

# 4. Push schema to database
npx prisma db push

# 5. Seed development data
npx prisma db seed

# 6. Start development server
npm run dev
```

### Environment Variables

```env
# Supabase
DATABASE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
```

### Stripe Webhook (Local Development)

```bash
# Forward Stripe events to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## 🗄️ Database Schema

```prisma
model User {
  id        String   @id @default(cuid())
  clerkId   String   @unique
  email     String   @unique
  orders    Order[]
  createdAt DateTime @default(now())
}

model Product {
  id          String      @id @default(cuid())
  name        String
  description String
  price       Int         // stored in cents
  imageUrl    String
  stock       Int         @default(0)
  orderItems  OrderItem[]
  createdAt   DateTime    @default(now())
}

model Order {
  id              String      @id @default(cuid())
  userId          String
  user            User        @relation(fields: [userId], references: [id])
  stripePaymentId String      @unique
  status          OrderStatus @default(PENDING)
  total           Int
  items           OrderItem[]
  createdAt       DateTime    @default(now())
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id])
  productId String
  product   Product @relation(fields: [productId], references: [id])
  quantity  Int
  price     Int
}

enum OrderStatus {
  PENDING
  PAID
  SHIPPED
  DELIVERED
  CANCELLED
}
```

---

## 📸 Screenshots

<img width="1700" height="887" alt="image" src="https://github.com/user-attachments/assets/451095a4-b505-4f8e-93db-47b8de08ca91" />

---

## 🤝 Contributing

Contributions are welcome. Please open an issue first to discuss what you'd like to change, then submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 👤 Author

**Mohamed Samy**

[![GitHub](https://img.shields.io/badge/GitHub-Mohamed--samy0-181717?style=flat&logo=github)](https://github.com/Mohamed-samy0)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat&logo=linkedin)](https://linkedin.com/in/mohamed-samy-886516377/)

---

<div align="center">
  <sub>Built with ☕ and a commitment to writing software that scales.</sub>
</div>
