-- Seed data for the March 2026 magazine issue
-- Run this AFTER magazine-schema.sql has been applied

-- Insert the March 2026 issue
INSERT INTO public.magazine_issues (id, title, slug, description, month, year, cover_image_url, published, featured)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Your Spring Guide to Israeli Property',
  'march-2026',
  'As spring arrives in Israel, our experts break down the latest legal requirements for foreign buyers, explore new mortgage options, guide you through international money transfers, spotlight exciting new developments, and share insider tips from top realtors across the country.',
  3,
  2026,
  'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1600&q=80',
  true,
  true
);

-- Editorial / Editor's Note
INSERT INTO public.magazine_articles (issue_id, title, slug, excerpt, content, category, author_name, image_url, display_order, published)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Welcome to Our March 2026 Issue',
  'march-2026-editors-note',
  'A warm welcome from the editor as we explore the vibrant Israeli property market this spring.',
  '## Welcome, Readers!

Spring is in the air in Israel, and the property market is buzzing with activity. Whether you''re a first-time buyer eyeing an apartment in Tel Aviv, a family considering a move to the suburbs of Jerusalem, or an investor looking at the booming tech corridor, this issue is packed with insights to help you make informed decisions.

### What''s Inside This Month

In this issue, we bring together five of Israel''s leading property professionals to share their expertise:

- **Legal Corner** — Our legal expert walks you through the critical steps of the property purchase process, including the often-misunderstood "Tabu" land registry system
- **Mortgage Insights** — Discover the latest mortgage products available to foreign buyers and how recent Bank of Israel policies affect your borrowing power
- **Money Transfers** — Moving large sums internationally can be daunting. Our specialist explains how to get the best rates and avoid common pitfalls
- **Developer Spotlight** — We tour an exciting new development in Herzliya that''s attracting international buyers
- **Realtor''s Corner** — Market trends, neighbourhood guides, and practical advice from a top-performing realtor

### A Market in Motion

The Israeli property market continues to show resilience and growth. With new infrastructure projects, expanding tech hubs, and improved international connectivity, there has never been a more exciting time to explore property opportunities in the Holy Land.

> "The best time to start your property journey is when you have the right information. That''s exactly what this magazine aims to provide." — The Editorial Team

We hope you enjoy reading this issue as much as we enjoyed putting it together. As always, our experts are available for consultations through the IsraelProperty360 platform.

Happy reading!

**The Israel Property Magazine Team**',
  'editorial',
  'Editorial Team',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  1,
  true
);

-- Legal Corner Article
INSERT INTO public.magazine_articles (issue_id, title, slug, excerpt, content, category, author_name, image_url, display_order, published)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Understanding the Tabu: Israel''s Land Registry System Explained',
  'march-2026-tabu-land-registry',
  'Foreign buyers often find Israel''s land registration system confusing. Here''s your complete guide to navigating the Tabu and ensuring your property rights are fully protected.',
  '## The Foundation of Property Ownership in Israel

When purchasing property in Israel, one of the most critical steps is understanding how property ownership is recorded and protected. The **Tabu** (Land Registry Office) is Israel''s official property registration system, and it plays a central role in every real estate transaction.

### What Is the Tabu?

The Tabu, officially known as the **Lishkat Rishum HaMekarkein** (Land Registration Office), is operated by the Ministry of Justice. It maintains records of property ownership, mortgages, liens, and other rights related to real estate across Israel.

> Think of the Tabu as the ultimate proof of ownership. Once your property is registered there, your rights are protected by law.

### Key Things Foreign Buyers Must Know

1. **Not all properties are registered in the Tabu** — Some properties, particularly newer ones or those on Israel Land Authority (ILA) land, may be registered with the ILA or through the housing company (Chevrat Meshakenet) instead
2. **The registration process takes time** — After signing the final contract, registration can take several weeks to months
3. **Your lawyer handles registration** — Never attempt to handle Tabu registration yourself; always work with a qualified Israeli real estate lawyer
4. **Check for encumbrances** — Before purchasing, your lawyer should obtain a **Nesach Tabu** (registry extract) to verify there are no liens, mortgages, or legal claims on the property

### The Purchase Process: Step by Step

Here''s what the legal process typically looks like:

1. **Due Diligence** — Your lawyer obtains and reviews the Tabu extract, planning permits, and building approvals
2. **Contract Drafting** — Both parties'' lawyers negotiate the purchase agreement
3. **Deposit Payment** — Typically 10-15% upon signing, held in trust
4. **Tax Clearances** — Purchase tax (Mas Rechisha) declarations and payments
5. **Final Payment & Handover** — Remaining balance paid, keys received
6. **Tabu Registration** — Your lawyer registers the property in your name

### Purchase Tax for Foreign Buyers

As a foreign buyer, you should be aware that purchase tax rates differ from Israeli residents:

- Israeli residents buying their first property pay reduced rates starting at 0%
- Foreign buyers (non-residents) pay a flat rate starting at **8%** on the full purchase price
- There are specific exemptions for new immigrants (Olim) within certain timeframes

### Common Pitfalls to Avoid

- **Don''t skip the lawyer** — Israeli property law is complex and different from most Western systems
- **Verify the seller''s authority** — Ensure the seller is actually authorised to sell the property
- **Check planning permissions** — Make sure any renovations or extensions were properly approved
- **Understand the timeline** — The process typically takes 3-6 months from start to finish

### Our Recommendation

Always engage a specialist Israeli real estate lawyer who has experience working with foreign buyers. They should be fluent in your language and understand the specific concerns of international purchasers.

*For a free consultation with a verified property lawyer, visit the Experts section on IsraelProperty360.*',
  'legal',
  'Adv. Sarah Cohen',
  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
  2,
  true
);

-- Mortgage Insights Article
INSERT INTO public.magazine_articles (issue_id, title, slug, excerpt, content, category, author_name, image_url, display_order, published)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Mortgage Options for Foreign Buyers: What''s New in 2026',
  'march-2026-mortgage-options-foreign-buyers',
  'The Israeli mortgage landscape is evolving. From new lender products to updated Bank of Israel regulations, here''s what foreign buyers need to know about financing their Israeli property.',
  '## The Israeli Mortgage Landscape in 2026

Financing a property purchase in Israel as a foreign buyer has become increasingly accessible, though it remains different from what you may be used to in your home country. Let''s break down everything you need to know.

### How Much Can You Borrow?

The Bank of Israel sets maximum loan-to-value (LTV) ratios:

- **Israeli residents** — Up to 75% LTV for first property
- **Foreign buyers** — Typically up to **50% LTV**, meaning you need at least 50% as a down payment
- **New immigrants (Olim)** — May qualify for up to 75% LTV within their first 7 years in Israel

> While 50% LTV may seem restrictive compared to other countries, Israeli mortgage rates are often very competitive, and the stability of the Israeli banking system provides added security.

### Types of Mortgages Available

Israeli mortgages (Mashkanta) come in several formats, and most borrowers use a combination:

1. **Prime-linked (Variable)** — Tracks the Bank of Israel prime rate. Currently attractive but carries interest rate risk
2. **Fixed Rate** — Locked in for the full term. Provides certainty but typically starts higher than prime
3. **CPI-linked (Madad)** — Interest rate is fixed but the principal adjusts with Israel''s Consumer Price Index. Can be cost-effective but adds inflation risk
4. **Foreign Currency** — Some banks offer USD or EUR-denominated mortgages for foreign buyers

### New in 2026

Several developments have made mortgages more accessible for foreign buyers this year:

- **Digital mortgage applications** — Most Israeli banks now accept online applications with digital document submission
- **Extended terms** — Some lenders now offer terms up to 25 years for foreign buyers (previously limited to 15-20 years)
- **Competitive rates** — With the Bank of Israel holding rates steady, fixed-rate mortgages are available from around 4.5-5.5%

### Required Documentation

To apply for an Israeli mortgage as a foreign buyer, you''ll typically need:

- Valid passport and visa
- Proof of income (last 3 years of tax returns)
- Bank statements (last 6 months)
- Employment verification letter
- Credit report from your home country
- Property details and signed purchase agreement
- Proof of down payment funds

### Tips for Getting the Best Deal

- **Shop around** — Different banks offer significantly different rates. Don''t settle for the first offer
- **Use a mortgage broker** — An experienced Israeli mortgage broker who works with foreign buyers can access deals not available directly
- **Consider the currency** — If you earn in USD/EUR/GBP, think carefully about currency risk when taking a Shekel-denominated mortgage
- **Lock in rates early** — Once approved, try to lock your rate quickly as market conditions can change
- **Factor in all costs** — Beyond the mortgage, budget for purchase tax, lawyer fees, agent fees, and currency conversion costs

### Our Top Tip

Start the mortgage pre-approval process **before** you start viewing properties. Knowing your budget will save time and prevent heartbreak.

*Connect with a verified mortgage advisor on IsraelProperty360 to start your pre-approval today.*',
  'mortgage',
  'Daniel Levy',
  'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
  3,
  true
);

-- Money Transfers Article
INSERT INTO public.magazine_articles (issue_id, title, slug, excerpt, content, category, author_name, image_url, display_order, published)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Moving Money to Israel: Best Practices for Property Purchases',
  'march-2026-money-transfers-best-practices',
  'Transferring large sums internationally for a property purchase requires careful planning. Learn how to save thousands on exchange rates and fees.',
  '## The Hidden Cost of International Property Purchases

When buying property in Israel, the price tag on the listing is just the beginning. One of the most overlooked costs is the **currency exchange** — and getting it wrong can cost you thousands, or even tens of thousands, of dollars.

### Why This Matters

Let''s put this in perspective. On a property costing 2,000,000 NIS (approximately $550,000):

- A bank''s typical exchange rate margin: **2-3%** = $11,000 - $16,500 in hidden fees
- A specialist FX provider''s margin: **0.3-0.5%** = $1,650 - $2,750
- **Potential savings: $8,250 - $13,750**

> Most buyers focus on negotiating the property price down by a few thousand dollars while losing far more on poor exchange rates. Don''t make this mistake.

### Your Transfer Options

1. **Your high-street bank** — Convenient but expensive. Banks typically add a 2-3% margin to the exchange rate plus transfer fees
2. **Specialist FX providers** — Companies like IsraTransfer specialise in international transfers for property purchases and offer significantly better rates
3. **Online platforms** — Services like Wise or OFX can be cost-effective for smaller amounts but may not suit large property transactions
4. **Forward contracts** — Lock in today''s exchange rate for a transfer happening in the future. Essential for managing budget certainty

### How to Get the Best Rate

- **Never use your bank''s default rate** — Always get a quote from a specialist provider first
- **Compare like-for-like** — Ask each provider for the total cost including ALL fees and the exchange rate margin
- **Consider timing** — Currency markets fluctuate daily. A forward contract can protect you from adverse movements
- **Plan ahead** — Last-minute transfers often get worse rates. Start the process weeks before you need to send money
- **Send in stages** — For deposits and milestone payments, consider whether sending smaller amounts at different times might average out a better rate

### The Property Purchase Payment Timeline

Understanding when you''ll need to send money helps you plan:

1. **Initial deposit** (signing) — Usually 10-15% of purchase price
2. **Purchase tax** — Due within 50 days of signing
3. **Progress payments** — For off-plan purchases, payments tied to construction milestones
4. **Final balance** — Due at handover/completion

### Tax Implications

Be aware of tax reporting requirements:

- **US buyers** — FBAR reporting for Israeli bank accounts over $10,000. FATCA compliance
- **UK buyers** — HMRC may need to be notified of overseas property purchases
- **EU buyers** — Anti-money laundering regulations may require proof of source of funds

### Our Top Tip

Set up your Israeli bank account and your preferred FX provider **before** you sign any contracts. This gives you time to compare rates and ensures you can move money quickly when needed.

*IsraTransfer specialises in money transfers for Israeli property purchases. Visit isratransfer.com for a free rate comparison.*',
  'money_transfer',
  'Michael Roberts',
  'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80',
  4,
  true
);

-- Developer Spotlight Article
INSERT INTO public.magazine_articles (issue_id, title, slug, excerpt, content, category, author_name, image_url, display_order, published)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Spotlight: New Developments Transforming Israel''s Coastal Cities',
  'march-2026-coastal-developments-spotlight',
  'From Herzliya to Netanya, a wave of new residential developments is reshaping Israel''s Mediterranean coastline. We explore the most exciting projects for international buyers.',
  '## A New Era for Israel''s Coastline

Israel''s Mediterranean coast has always been prime real estate territory, but 2026 is seeing an unprecedented wave of new development that''s creating exciting opportunities for international buyers.

### The Coastal Development Boom

Several factors are driving the current construction boom along Israel''s coast:

- **Government incentives** for high-density residential development
- **Infrastructure improvements** including the new light rail extensions
- **Growing demand** from both local and international buyers
- **Modern building standards** that match the highest global benchmarks

### Featured Development: Marina Heights, Herzliya

One of the most talked-about projects this spring is **Marina Heights**, a boutique residential tower in Herzliya Pituach, one of Israel''s most prestigious neighbourhoods.

**Key Details:**
- 25-storey tower with 120 luxury apartments
- 2-5 bedroom units ranging from 90 to 300 sqm
- Prices starting from 3.5M NIS (approx. $965,000)
- Expected completion: Q3 2027
- Developer: A leading Israeli construction firm with 30+ years of experience

**What Makes It Special:**
- Walking distance to Herzliya Marina and the beach
- State-of-the-art amenities including rooftop pool, gym, and concierge service
- Smart home technology in every unit
- Underground parking with EV charging
- High-spec finishes including imported stone, premium appliances, and floor-to-ceiling windows

> "International buyers make up about 30% of our purchasers at Marina Heights. They''re attracted by the lifestyle, the investment potential, and the quality of construction." — Project Sales Director

### What to Look For When Buying Off-Plan

Purchasing a property that hasn''t been built yet comes with unique considerations:

1. **Developer track record** — Research their previous projects. Visit completed developments if possible
2. **Bank guarantees** — Israeli law requires developers to provide bank guarantees for your deposits. Verify these are in place
3. **Payment schedule** — Typically linked to construction milestones (foundation, structure, finishing, handover)
4. **Specification details** — Get everything in writing. What''s included? What''s extra?
5. **Completion timeline** — Build in a buffer. Delays are common in construction
6. **Penalty clauses** — What happens if the developer is late? What are your remedies?

### Other Developments to Watch

- **Netanya Promenade Towers** — Three towers with sea views, starting from 2.2M NIS
- **Ashdod Marina Quarter** — Mixed-use development with residential, retail, and restaurants
- **Haifa Carmel Terraces** — Hillside luxury apartments with panoramic bay views

### Investment Potential

Coastal properties in Israel have historically shown strong appreciation:

- Average annual price increase over the last decade: **6-8%**
- Rental yields for coastal properties: **3-4%** annually
- Strong demand from both long-term tenants and holiday rentals

### Our Recommendation

If you''re considering an off-plan purchase, visit Israel to see the location in person, meet the developer''s team, and view their completed projects. Nothing replaces seeing it with your own eyes.

*Browse new developments on IsraelProperty360 and connect with verified developers.*',
  'developer',
  'Yael Goldstein',
  'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=800&q=80',
  5,
  true
);

-- Realtor's Corner Article
INSERT INTO public.magazine_articles (issue_id, title, slug, excerpt, content, category, author_name, image_url, display_order, published)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Spring 2026 Market Report: Where to Buy Right Now',
  'march-2026-spring-market-report',
  'Our market report covers the hottest neighbourhoods, emerging areas, and best value locations for property buyers in Israel this spring.',
  '## The Israeli Property Market: Spring 2026 Snapshot

The first quarter of 2026 has been an active period for the Israeli property market. Here''s our comprehensive overview of where the opportunities are.

### Market Overview

Key statistics for Q1 2026:

- **Average property prices** rose 4.2% year-on-year nationally
- **Transaction volume** increased by 12% compared to Q1 2025
- **Foreign buyer activity** up 18%, driven by strong USD and renewed interest post-election
- **New housing starts** at their highest level in 5 years
- **Mortgage interest rates** holding steady at 4.5-5.5% for foreign buyers

### Hot Neighbourhoods

Here are the areas we''re watching closely this spring:

**Tel Aviv — Florentin & Neve Tzedek**
- Still the most sought-after areas for international buyers
- Average price per sqm: 65,000-85,000 NIS
- Strong rental demand from tech workers and young professionals
- Limited new supply keeping prices firm

**Jerusalem — Baka & German Colony**
- Growing appeal among Anglo buyers
- Average price per sqm: 45,000-60,000 NIS
- Excellent schools and community infrastructure
- New light rail making commuting easier

**Herzliya Pituach**
- Israel''s "Silicon Beach" — home to tech company HQs
- Average price per sqm: 55,000-75,000 NIS
- Premium lifestyle with marina, beaches, and restaurants
- Strong demand for both purchase and rental

### Emerging Areas to Watch

These areas offer value today with strong growth potential:

1. **Be''er Sheva** — Israel''s "Capital of the Negev" is undergoing massive development. New high-tech park, Ben-Gurion University expansion, and train connections to Tel Aviv in under an hour. Average price per sqm: 15,000-25,000 NIS
2. **Hadera** — Positioned between Tel Aviv and Haifa on the coast. New developments, good transport links, and prices 40-50% below Tel Aviv
3. **Modiin** — Family-friendly planned city between Tel Aviv and Jerusalem. Excellent infrastructure and schools. Rising steadily
4. **Nahariya** — Northern coastal city with beautiful beaches. Most affordable Mediterranean coastline in Israel

### Buyer Tips for Spring 2026

- **Act decisively** — Good properties in popular areas sell within days. Have your financing in order before viewing
- **Consider renovation projects** — Older apartments in prime locations can offer significant value if you''re willing to renovate
- **Don''t overlook ground floor** — In Israel, ground-floor apartments with gardens (''garden apartments'') are highly sought after, especially for families
- **Think about resale** — Even if you''re buying for personal use, consider how easy it will be to sell later. Location and transport links matter most
- **Visit in person** — While virtual tours are helpful, nothing replaces walking the neighbourhood at different times of day

### Seasonal Considerations

Spring is traditionally a busy period in the Israeli property market:

- Families want to be settled before the new school year in September
- Longer daylight hours make property viewing easier
- New developments often launch marketing campaigns in spring
- The holiday season (Pesach) can slow transactions temporarily

### Rental Market Update

For investors, the rental market remains strong:

- Average rental yields nationally: 3-4%
- Tel Aviv center: 2.5-3.5% yield but strong capital appreciation
- Peripheral cities: 4-6% yield with moderate appreciation
- Short-term rentals (Airbnb): Higher yields but more management required and subject to local regulations

### Our Top Prediction

Watch the corridor between Tel Aviv and Herzliya. The planned light rail extension will transform this area, making it more accessible and driving property values up significantly.

*Find your perfect property on IsraelProperty360. Search by city, budget, and property type to discover opportunities across Israel.*',
  'realtor',
  'David Mizrachi',
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
  6,
  true
);
