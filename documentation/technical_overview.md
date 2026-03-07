# ReelShop Technical Overview

## 1. Introduction
This document serves as an onboarding guide for developers joining the ReelShop project. It outlines the technology stack, project scaffolding, frontend and backend architectures, and key AI integrations required to build and scale the MVP.

## 2. Tech Stack Summary
- **Framework:** Next.js 14 (App Router)
- **Frontend/Styling:** React, Tailwind CSS, shadcn/ui, Custom Design System (Glassmorphism, Dark-native based on `design.json`)
- **Backend & Database:** Supabase (PostgreSQL, Auth, Storage, pgvector)
- **AI Integrations:** HuggingFace Inference API (IDM-VTON model), Gemini 2.0 Flash API (Text/Vision)
- **Payments:** Razorpay
- **Deployment:** Vercel

## 3. Project Scaffolding
The project follows a standard Next.js App Router structure tailored for a modular, component-driven approach:

```text
ReelPick/
├── src/
│   ├── app/              # Next.js App Router (Pages & API Routes)
│   │   ├── api/          # Backend API Routes (tryon, generate-reel, checkout, feed)
│   │   ├── seller/       # Seller Dashboard & Reel Studio views
│   │   └── page.tsx      # Main Shopper Feed (Root)
│   ├── components/       # Shared UI Components
│   │   ├── feed/         # VideoFeed, VideoPlayer, ProductTags
│   │   ├── products/     # ProductCard, ProductDrawer
│   │   ├── ui/           # Generic reusable components (shadcn/ui base)
│   │   └── seller/       # Seller-specific components (Reel Studio)
│   ├── hooks/            # Custom React Hooks (e.g., useFeed, useTryOn)
│   ├── lib/              # Utility functions & Supabase Client configuration
│   └── styles/           # Global styles and Tailwind configuration
├── public/               # Static assets
├── documentation/        # PRD, Design Specs (`design.json`), and Technical Docs
├── next.config.mjs       # Next.js configuration
├── tailwind.config.ts    # Tailwind CSS configuration mapping design.json tokens
└── package.json          # Dependencies and scripts
```

## 4. Frontend Architecture
The frontend is built for a "mobile-first, native-app feel" on the web, acting as a Progressive Web App (PWA).

**Key Design Principles (from `design.json`):**
- **Style:** Fashion-editorial dark-mode native (`bg-[#0A0A0B]`). Avoid white backgrounds.
- **Interaction:** Full-bleed vertical scroll for the feed (`100dvh` with snap scroll). "Physics-based, spring curves" for animations.
- **UI Chrome:** Glassmorphism (`bg-white/[0.06] backdrop-blur-xl`) for floating elements like the navigation pill, top bars, and product drawers. Opaque backgrounds on floating overlays are strictly avoided.
- **Architecture:** Components are highly localized. We use a modular approach where specific features like the Virtual Try-On module or the onboarding swipe flow are encapsulated in their respective architectural boundaries.

## 5. Backend Architecture (Supabase + Next.js APIs)
ReelShop uses a "Backend-as-a-Service" (BaaS) and Serverless model allowing rapid feature delivery without maintaining heavy traditional servers.

**Supabase Serverless Roles:**
- **PostgreSQL Database:** Core relational data (profiles, products, reels, cart_items, orders).
- **pgvector:** Used for the semantic feed recommendation engine (Phase 1 Tag-based Collaborative Filtering).
- **Auth:** Manages shopper and seller sessions via Next.js middleware.
- **Storage:** Direct upload and hosting of seller video files (MP4/MOV).

**Next.js API Routes (`/src/app/api/`):**
- Serve as lightweight orchestrators and secure gateways.
- **`api/tryon`**: Securely proxies images to HuggingFace IDM-VTON and returns the rendered sequence.
- **`api/generate-reel`**: Orchestrates Gemini 2.0 to create scripts, captions, and hashtags. Feeds this data to the client-side Canvas Ken Burns generator.
- **`api/checkout`**: Handles secure order creation and signature verification with Razorpay.

## 6. AI Integrations Detail
- **Virtual Try-On Engine:** Utilizes HuggingFace's Inference API hosting the open-source IDM-VTON model. Takes a user photo + product photo to generate a fused try-on image in under 8 seconds. Includes a confidence score validator overlay.
- **Feed Recommender:** Employs tag-based collaborative filtering utilizing Supabase `pgvector` for fast similarity matching of user tag embeddings and reel embeddings (~70ms retrieval latency).
- **Seller Reel Generator:** Video creation happens entirely client-side utilizing the HTML5 Canvas API (Ken Burns effect panning/zooming over still photos) to avoid heavy API costs, while Gemini 2.0 Flash drives the creative metadata (captions & hashtags).

## 7. Developer Onboarding Steps
1. **Clone the repository:** `git clone https://github.com/karan/ReelPick`
2. **Install dependencies:** `npm install`
3. **Set up Environment Variables:** Copy `.env.example` to `.env.local` and populate:
   - `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `HUGGINGFACE_API_KEY`
   - `GEMINI_API_KEY`
   - `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET`
4. **Database Setup:** Run migrations to ensure your local or preview Supabase project matches the schema (`profiles`, `reels`, `products`, `orders`).
5. **Run Development Server:** `npm run dev`
6. **Review Design Spec:** Always reference `documentation/design.json` when building UI components. The `cursor_ai_implementation_notes` section outlines strict CSS anti-patterns (e.g., "NEVER use sharp corners", "NEVER use solid opaque nav bars").
