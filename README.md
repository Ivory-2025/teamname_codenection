# TripManager by teamname

**Team Members:** Chin Jie, Ivory Liong Jin Earn  
**Problem Statement:** Travel Planner (Lifestyle Track: Planning an Escape)  
**Live UI Prototype:** [TripManager on Vercel](https://tripmanager-eyc0f88ys-aiburi-s-team.vercel.app/)  
**Video Presentation:** [Unlisted YouTube Link]  
**Presentation Slides:** [Canva Pitch Deck](https://canva.link/01rfkue2mepb2tu)  

---

## 1. Project Overview

### 1.1 The Problem
Planning a trip is stressful because travelers must juggle disconnected platforms across booking, budgeting, navigation, and group communication. This fragmentation introduces three critical points of friction:
* **Coordination Chaos:** Aligning distinct schedules, individual spending limits, and differing travel preferences across a group is notoriously difficult.
* **Rigid Itineraries:** Most trip plans are saved in static documents or notes that fail to adapt when unexpected delays, closures, or emergencies occur mid-trip.
* **Fragmented Platforms:** Travelers are forced to assemble a patchwork of single-purpose apps—Wanderlog for visual mapping, TripIt for static reservation storage, Splitwise for shared expenses, and WhatsApp for chat coordination.

When unforeseen disruptions arise, travelers waste critical hours researching alternatives in hotel lobbies, while travel providers face booking abandonment when planning becomes overwhelming.

### 1.2 Target Audience
Our primary target audience consists of **busy youth and young adults who organize group vacations**.
* **Core Frustration:** Wasted time switching across multiple platforms to sync opinions, schedules, and debts.
* **Primary Pain Point:** Inflexible, static itineraries that break under flight delays, bad weather, or sudden venue closures.

### 1.3 Our Solution: TripManager
**TripManager** is an end-to-end, collaborative travel application engineered to centralize the complete travel lifecycle from discovery and booking to on-the-ground navigation and post-trip scrapbooking.

* **Instant Collaboration:** Group members join via a quick QR code or invite link to synchronize preferences and schedules.
* **Smart Consensus Planning:** Aggregates individual numerical budgets and lifestyle "vibe tags" to generate balanced itinerary proposals.
* **All-in-One In-App Booking:** Direct flight, hotel, and transit pass shortlisting and checkout that auto-locks confirmed records into the active route.
* **Smart Fixes:** Real-time disruption handling that cascades itinerary time shifts and serves instant alternative suggestions when delays strike.
* **Optical Expense Tracking:** In-app receipt scanning and automated split logic that computes fair shares without manual bookkeeping.
* **Spatial Synchronization:** "Regroup Beacon" enables opt-in location tracking, designated meetup pins, and synchronized countdown timers during free-exploration windows.
* **Social Community Hub:** An Instagram-style travel feed where travelers can explore verified guides, clone entire itineraries with one click, and auto-distribute group photos using facial detection.

---

## 2. Ideation & Process

### 2.1 Ideas We Considered
During our design phase, we evaluated multiple architectural and feature directions:

| Proposed Feature | Decision | Rationale |
| :--- | :--- | :--- |
| **Collaborative Onboarding & Planning** *(Instant Join, Vibe Tags, Exact Budget Buckets, Smart Suggestions)* | **Implement** | Aligns expectations upfront and establishes transparent financial boundaries before scheduling activities. |
| **In-Trip Dynamic Assistance** *(Live Map Guidance, Smart Fixes for Delays, Emergency Support)* | **Implement** | Transforms static plans into a reactive travel tool that protects groups against transit delays and sudden venue closures. |
| **Integrated Group Chat & Polls** | **Implement** | Serves as a centralized channel for decision-making, poll voting, and in-trip discussions without external messaging apps. |
| **Community Hub** *(Public Explore Feed)* | **Implement** | Allows travelers to discover authentic routes, share blueprints, and clone complete multi-day itineraries in one click. |
| **Smart Bill Splitting** *(Optical Receipt Scanner & Auto-Split)* | **Implement** *(Mentor Suggestion)* | Eliminates manual calculations, ensures cost transparency, and prevents awkward bill-splitting confrontations. |
| **Smart Photo Distribution** *(AI Face Recognition Indexing)* | **Implement** *(Mentor Suggestion)* | Automatically tags group members in shared media albums so everyone can retrieve their individual photos without sorting. |
| **Live Continuous GPS Tracking** | **Refine** *(Shifted to "Regroup Beacon")* | Unrestricted live GPS drains device batteries and can be unreliable in dense indoor spaces. Refined into a targeted gathering beacon with meetup pins and countdown clocks. |
| **Daily Cost Alerts** | **Discarded** | Intrusive budget pings disrupt the vacation experience and do not account for natural day-to-day spending variance. |
| **In-App Direct Money Transfers** | **Discarded** | Operating direct peer-to-peer fiat payments requires complex banking licenses and KYC compliance; users already rely on trusted e-wallets (Apple Pay, GrabPay, TNG eWallet). |

### 2.2 Ideation Artifacts
```
[ Problem Tree: Travel Planning Fragmentation ]
┌─────────────────────────────────────────────────┐
│  Result: Group Stress, Abandonment, Chaos        │
└─────────────────────────▲───────────────────────┘
│
┌─────────────────────────────────┴─────────────────────────────────┐
│                                 │                                 │
┌────────┴─────────────┐       ┌───────────┴────────────┐       ┌────────────┴──────────┐
│ Disconnected Systems │       │  Rigid Static Itinerary│       │ Group Consensus Clashes│
│ (5+ apps required)   │       │  (breaks during delay) │       │ (budget & pace debates)│
└──────────────────────┘       └────────────────────────┘       └───────────────────────┘


[ User Flow: Discovery to Live In-Trip Execution ]
[Group Creation] ──> [QR/Link Invite] ──> [Tag & Budget Entry] ──> [Algorithmic Consensus]
│
[Post-Trip Hub]  <── [Smart Photo Split] <── [Live Regroup Beacon] <── [Route Locked]

```
### 2.3 Mentor Consultation
* **Date:** September 6  
* **Mentor:** Yeong Chiau Wen  

| Feedback Received | How We Incorporated It |
| :--- | :--- |
| **Photo Sharing Management:** Advised using facial recognition to simplify photo sorting and evaluating cloud-backed object storage solutions. | **Smart Photo Distribution:** Integrated client-side face recognition pipelines backed by Firebase Cloud Storage, allowing group members to automatically locate and download only the photos they appear in. |
| **Location & Safety Coordination:** Recommended combining map visibility with structured gathering points rather than reliance on constant background tracking. | **Regroup Beacon:** Built a temporary beacon system that drops a designated meetup coordinate, active navigational breadcrumbs, and a live countdown timer onto the shared map. |
| **Expense Resolution:** Suggested automated receipt parsing to calculate individual shares accurately, similar to modern finance apps. | **Flexible Bill Splitting:** Added an optical receipt reader coupled with custom split allocations (equal split vs. itemized exclusion checkboxes). |

---

## 3. Design & Prototype

**Live Web Application:** [TripManager Deployment on Vercel](https://tripmanager-eyc0f88ys-aiburi-s-team.vercel.app/)  
**Mobile Prototype Build:** [Expo EAS Build Artifact](https://expo.dev/accounts/aiburi/projects/travel-planner/builds/e0c6bd95-5262-438b-b626-f44c6e37a228)

### Key Application Screens
* **Smart Consensus & Route Planner (`plan.tsx` & `itinerary-edit-solo.tsx`):** Drag-and-drop itinerary blocks, opening hours clash detection, and transit time chips.
* **In-App Booking Engine & Voucher Vault:** Flight boarding passes and hotel check-in vouchers complete with scannable QR codes and offline access.
* **Live Trip Space & Regroup Beacon (`_layout.tsx`):** Ambient floating assistive dock providing quick access to in-trip messaging, live radar proximity, and meetup countdowns.
* **Smart Receipt Scanner & Expense Manager:** Direct receipt image uploads, multi-currency conversion, and "Smart Settle" debt simplification.
* **Digital Photo Stream & Face Indexing (`itinerary-detail.tsx`):** Shared media stream featuring individual member avatars powered by face detection.
* **Community Feed & One-Click Clone (`explore.tsx`):** Swipeable multi-photo travel guides with full itinerary cloning into the user's workspace.

---

## 4. What Makes It Different

### 4.1 Our Novelty
1. **Algorithmic Consensus Engine:** Replaces awkward group discussions by cross-referencing individual budget inputs (Stays, Transit, Daily Living) with lifestyle vibe tags, generating a balanced itinerary that fits collective parameters.
2. **Dynamic Schedule Recalibration ("Smart Fixes"):** Replaces static itineraries with real-time disruption handling; cancellations or venue closures automatically recalculate timings and offer nearby alternatives.
3. **Regroup Beacon Synchronization:** Solves communication breakdowns during free-and-easy exploration through focused radar proximity and a shared countdown timer.
4. **Automated Media Distribution:** Scans shared group albums with facial detection to organize photos by individual members automatically.

### 4.2 Standout Features
* **Smart Travel Plan Suggestion:** Combines budget boundaries and preference tags to generate accessible, custom plans.
* **Dynamic Rescheduling:** Shifts remaining stops forward and surfaces instant nearby replacements when activities are canceled.
* **Emergency Support System:** One-tap calling for local emergency services (110/119 in Japan) and routing to nearby verified clinics and embassies.
* **Regroup Beacon:** Designated meetup points paired with synced timers to coordinate group meetups without constant messaging.
* **Flexible Bill Splitting:** Accommodates split bills and custom member exclusions so travelers only pay for what they join.
* **Smart Photo Distribution:** Automatically organizes and distributes group photos from a central shared album.

### 4.3 Competitor Comparison

| Feature / Metric | TripManager | Wanderlog | TripIt |
| :--- | :---: | :---: | :---: |
| **Exact Budget & Tag Blending** | **Yes** | No | No |
| **In-App Booking & Digital Pass Vault** | **Yes** | Affiliate Redirects | Email Scraping |
| **Live Transit Guidance & Clash Buffer** | **Yes** | No | No |
| **Dynamic Schedule Recalibration ("Smart Fixes")** | **Yes** | No | No |
| **Regroup Beacon & Proximity Radar** | **Yes** | No | No |
| **Integrated Trip Workspace Chat** | **Yes** | No | No |
| **Smart Optical Receipt Bill Splitting** | **Yes** | Manual Entry | No |
| **Automated Face-Indexed Photo Distribution** | **Yes** | No | No |
| **Interactive One-Click Itinerary Cloning** | **Yes** | Static Guides | No |

---

## 5. Technical Architecture & Feasibility

### 5.1 Tech Stack
* **Frontend:** React Native with Expo Router (universal web and native compilation), React Native Reanimated, and PanResponder gesture handling.
* **Backend:** Firebase Authentication for secure sign-ups, Cloud Functions for serverless compute, and Firebase Cloud Storage for receipt and media assets.
* **Database:** Cloud Firestore (NoSQL) providing real-time data synchronization for location beacons, chat streams, and shared itineraries.
* **APIs & Integrations:**
  * **Google Maps SDK & Directions API:** Real-time route rendering, transit mode chips, and travel duration estimates.
  * **Google Places API:** Venue ratings, operating hours, and photo integration.
  * **Expo Notifications:** Real-time push notifications for itinerary updates, expense allocations, and beacon triggers.
  * **Custom Deep Link & QR Engine:** Lightweight QR generation paired with Firestore join codes for zero-friction group onboarding.
* **Hosting & Deployment:** Vercel (Production Web Hosting) and EAS Build (Android binary distribution).

### 5.2 System Architecture
```
┌────────────────────────────────────────────────────────────────────────┐
│                        React Native / Expo Client                      │
│   ┌─────────────────────┐  ┌────────────────────┐  ┌───────────────┐   │
│   │ Itinerary Studio    │  │ Live Trip Space    │  │ Expense Hub   │   │
│   │ (Solo/Group Modes)  │  │ (Chat & Radar Dock)│  │ & Receipts    │   │
│   └──────────┬──────────┘  └─────────┬──────────┘  └───────┬───────┘   │
└──────────────┼───────────────────────┼─────────────────────┼───────────┘
│                       │                     │
▼                       ▼                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Firebase Cloud Services                         │
│   ┌─────────────────────┐  ┌────────────────────┐  ┌───────────────┐   │
│   │ Cloud Firestore     │  │ Firebase Storage   │  │ Auth & Rules  │   │
│   │ (Realtime Sync)     │  │ (Receipts, Photos) │  │ (JWT Tokens)  │   │
│   └─────────────────────┘  └────────────────────┘  └───────────────┘   │
└──────────────────┬─────────────────────────────────────────────────────┘
│
▼
┌────────────────────────────────────────────────────────────────────────┐
│                      External APIs & Services                          │
│   ┌───────────────────────────┐     ┌──────────────────────────────┐   │
│   │ Google Maps & Places APIs │     │ Expo Push Notification Engine│   │
│   └───────────────────────────┘     └──────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```
### 5.3 Build Plan & Scope Realism
* **In-Scope (Delivered in MVP):**
  * Collaborative onboarding flow with vibe tags and 3-tier budget parameters.
  * Solo and Group itinerary studios with drag-and-drop ordering, visit time customizers, and clash alerts.
  * Simulated in-app checkout generating digital boarding passes and accommodation check-in folios.
  * Live Trip Space assistive dock housing group messaging, beacon setup, and simulated radar tracking.
  * Social community feed supporting likes, interactive commenting, and one-tap route cloning.
  * Face-indexed digital scrapbook previewing member-specific photo albums.
* **Out-of-Scope (Future Roadmap):**
  * Direct GDS/OTA API integrations (e.g., Amadeus, Sabre) for live ticket issuance and automatic cancellation refunds.
  * Automated Chat-to-Task NLP parser to extract packing lists and reminders from group conversations.
  * Multi-currency ledger with live FX conversions supporting multi-country routes.

### 5.4 Growth Strategy & Scalability
* **Phase 1 (Campus & Early Adopters):** Leverage natural viral referral loops—every trip organizer invites 3–5 friends via QR code or deep links, acquiring new active users organically.
* **Phase 2 (Technical Scaling & Monetization):** Transition Firestore listeners to cached microservices for concurrent real-time traffic. Introduce sponsored placements for local eateries inside the Smart Suggestion algorithm and launch premium tiers for offline navigation.
* **Phase 3 (Enterprise & B2B Expansion):** Expand into corporate retreats, educational travel, and festival logistics, while licensing the Smart Suggestion engine to regional tourism boards.

---

## 6. Repository Setup & Local Development

### Prerequisites
* [Node.js](https://nodejs.org/) (v18.0.0 or higher)
* [Expo CLI](https://docs.expo.dev/get-started/installation/)
* Expo Go app installed on your physical iOS/Android device

### Installation
1. Clone the repository:
   ```bash
   git clone [https://github.com/Ivory-2025/teamname_codenection.git](https://github.com/Ivory-2025/teamname_codenection.git)
   cd teamname_codenection
