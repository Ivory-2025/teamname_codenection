# TripManager by teamname

**Team Members:** Chin Jie, Ivory Liong Jin Earn  
**Problem Statement:** Travel Planner (Lifestyle Track: Planning an Escape)  
**Live UI Prototype:** [TripManager on Vercel](https://tripmanager-eyc0f88ys-aiburi-s-team.vercel.app/)  
**Video Presentation:** [Unlisted YouTube Link]  
**Presentation Slides:** [Canva Pitch Deck](https://canva.link/01rfkue2mepb2tu)  

---

## 1. Project Overview

### 1.1 The Problem
Planning a trip is stressful because travelers must juggle disconnected apps for booking, budgeting, and scheduling. As a result, travelers waste time and easily panic when plans change, while businesses lose potential revenue when overwhelmed users abandon the planning process entirely. Existing solutions fall short because they only focus on specific niches. This creates several major pain points:
* **Coordination Chaos:**  It is extremely difficult to align multiple schedules, budgets, and opinions for group trips.
* **Rigid Itineraries:** Plans are usually recorded on static documents that cannot adapt to unexpected real-world delays.
* **Fragmented Platforms:** Travelers are forced to use a messy combination of tools like Wanderlog for maps, TripIt for flights, Splitwise for money, and WhatsApp for communication.

### 1.2 Target Audience
Our primary target audience consists of **busy youth and young adults who organize group vacations**.
* **Core Frustration:** Wasted time switching across multiple platforms to align schedules and shared expenses.
* **Primary Pain Point:** Inflexible, static itineraries that break under flight delays, bad weather, or sudden venue closures.

### 1.3 Our Solution: TripManager
TripManager is an end-to-end, collaborative travel platform designed to make planning centralized and dynamic.
Feeatures:

* **Instant Collaboration:** Group members join via a quick QR code or invite link to synchronize preferences and schedules.
* **Smart Consensus Planning:** Aggregates individual numerical budgets and lifestyle "vibe tags" to generate balanced itinerary proposals.
* **All-in-One In-App Booking:** Direct flight, hotel, and transit pass shortlisting and checkout that auto-locks confirmed records into the active route.
* **Smart Fixes:** Real-time disruption handling that cascades itinerary time shifts and serves instant alternative suggestions when delays strike.
* **Smart Expense Tracking:** In-app receipt scanning and automated split logic that computes fair shares without manual bookkeeping.
* **Spatial Synchronization:** "Regroup Beacon" enables opt-in location tracking, designated meetup pins, and synchronized countdown timers during free-exploration windows.
* **Social Community Hub:** An Instagram-style travel feed where travelers can explore verified guides, clone entire itineraries with one click, and auto-distribute group photos using facial detection.

---

## 2. Ideation & Process

### 2.1 Ideas We Considered
Before landing on our final idea, we evaluated several distinct approaches:

| Proposed Feature | Decision | Rationale |
| :--- | :--- | :--- |
| **Collaborative Onboarding & Planning** *(Instant Join, Vibe Tags, Exact Budget Buckets, Smart Suggestions)* | **Implement** | Streamlines group planning by aligning members’ travel expectations and establishing clear financial boundaries from day one. |
| **In-Trip Dynamic Assistance** *(Live Map Guidance, Smart Fixes for Delays, Emergency Support)* | **Implement** | Transforms static plans into a reactive travel tool that protects groups against transit delays and sudden venue closures. |
| **Integrated Group Chat & Polls** | **Implement** | Serves as a centralized channel for decision-making, poll voting, and in-trip discussions without external messaging apps. |
| **Community Hub** *(Public Explore Feed)* | **Implement** | Allows travelers to discover authentic routes, share blueprints, and clone complete multi-day itineraries in one click. |
| **Smart Bill Splitting** *(Receipt Scanner & Auto-Split)* | **Implement** *(Mentor Suggestion)* | Eliminates manual calculations, ensures cost transparency, and prevents awkward bill-splitting confrontations. |
| **Smart Photo Distribution** *(AI Face Recognition)* | **Implement** *(Mentor Suggestion)* | Provides an automated way for group members to instantly find and download only the photos they are in, saving time and energy. |
| **Live GPS Tracking** | **Refine** *(Shifted to "Regroup Beacon")* | Live GPS is unreliable in confined areas. We refined this into a Regroup Beacon together with live GPS tracking that notifies all members of a designated time and location to gather after independent exploration. |
| **Daily Cost Alerts** | **Discarded** | Intrusive budget pings disrupt the vacation experience and do not account for natural day-to-day spending variance. |
| **In-App Direct Money Transfers** | **Discarded** | Operating direct peer-to-peer fiat payments requires complex banking licenses and KYC compliance; users already rely on trusted e-wallets (Apple Pay, GrabPay, TNG eWallet). |

### 2.2 Ideation Artifacts
![* **Problem Tree**  ](https://github.com/Ivory-2025/teamname_codenection/blob/main/Problem%20Tree.jpg)
![* **Mindmap**  ](https://github.com/Ivory-2025/teamname_codenection/blob/main/mindmap.jpg)
!([User Flow.jpg](https://github.com/Ivory-2025/teamname_codenection/blob/main/User%20Flow.jpg)


### 2.3 Mentor Consultation
* **Date:** September 6  
* **Mentor:** Yeong Chiau Wen  

| Feedback Received | How We Incorporated It |
| :--- | :--- |
| **Photo Sharing:** Advised using facial recognition to simplify photo sorting and evaluating cloud-backed object storage solutions. | **Smart Photo Distribution:** Integrated an auto-scan feature for shared trip albums that allows members to instantly find and download only the photos they appear in. All images will be securely hosted using Firebase Cloud Storage.  |
| **Location & Safety Coordination:** Recommended combining constant live GPS tracking with a specific gathering feature to prevent anyone from being left behind | **Regroup Beacon:** Instead of constant tracking, members can now drop a designated "Meetup Point" pin on the map. This activates a countdown timer and temporary live pins to easily guide everyone back to the group. |
| **Expense Resolution:** Suggested incorporating an AI-powered automated bill-splitting feature, referencing existing tools like Ryt Groups. | **Flexible Bill Splitting:** We integrated an optical receipt scanner that instantly reads receipts and auto-calculates everyone's exact share, eliminating manual math and ensuring fairness. |

---

## 3. Design & Prototype

**Live Web Application:** [TripManager Deployment on Vercel](https://tripmanager-eyc0f88ys-aiburi-s-team.vercel.app/)  
**Mobile Prototype Build:** [Expo EAS Build Artifact](https://expo.dev/accounts/aiburi/projects/travel-planner/builds/e0c6bd95-5262-438b-b626-f44c6e37a228)

### Key Application Screens
![* **Smart Suggestions and Fixes for itinerary planning**  ](<img width="562" height="595" alt="Screenshot 2026-09-13 231315" src="https://github.com/user-attachments/assets/1df36528-4a0d-4d65-88c6-bad49426797a" />)
![* **In app flight and hotel-booking**  ](<img width="546" height="547" alt="Screenshot 2026-09-13 231427" src="https://github.com/user-attachments/assets/ffed494d-c708-4b22-bd85-759537e47894" />)
![* **Smart Photo Distribution**  ](<img width="300" height="605" alt="Screenshot 2026-09-13 231515" src="https://github.com/user-attachments/assets/d254266f-07eb-4fc5-be70-e4487598508f" />
)
![* **Smart Bill Splitting**  ](<img width="602" height="618" alt="Screenshot 2026-09-13 231546" src="https://github.com/user-attachments/assets/e4aba459-fb26-43fd-819b-efb8af8e81e5" />
)
![* **Live Regroup Beacon**  ](<img width="484" height="508" alt="Screenshot 2026-09-13 231622" src="https://github.com/user-attachments/assets/24f9a881-c083-4d65-aebb-66e3c490ceed" />
)
![* **Community Hub**  ](<img width="290" height="632" alt="Screenshot 2026-09-13 231724" src="https://github.com/user-attachments/assets/d24ef1d5-546e-4860-b5b9-e331274508ec" />
)

---

## 4. What Makes It Different

### 4.1 Our Novelty
1. **Algorithmic Consensus (Smart Travel Plan Suggestion):** Eliminates group conflict by calculating each member's exact budget limits and travel preferences (vibe tags) to automatically generate a perfectly balanced itinerary that works for everyone.
2. **Dynamic Rescheduling (Smart Fixes):** If unexpected delays or sudden closures occur, the app instantly cascades time shifts and suggests nearby alternative recommendations.
3. **Spatial Synchronization (Regroup Beacon):** Unlike standard travel apps that leave users to navigate independently, this feature provides real-time tracking and synchronizes a meeting point with a countdown timer, ensuring members can explore independently without being left out.
4. **Automated Media Sorting (Smart Photo Distribution)** Employs facial recognition technology to automatically identify each member and deliver their respective photos directly, eliminating the hassle of manual sorting.

### 4.2 Standout Features
* **Smart Travel Plan Suggestion:** Blends everyone's tags and budgets to suggest spots everyone actually likes and can afford.
* **Smart Fixes:** Dynamically cascading time shifts and suggesting nearby swaps treats travel or other suitable solution as a live, unpredictable event rather than a static PDF.
* **Emergency Support:** Shows instant directions to nearby clinics/hospitals and 1-tap emergency calling
* **Regroup Beacon:** A centralized "Meetup Point" pin with a countdown timer keeps the group tethered without requiring constant texting and reduces members stress.
* **Flexible Bill Splitting:** Split bills equally or select only the specific people involved so members never pay for activities they skipped.
* **Smart Photo Distribution:** Automatically find and distribute every group member's pictures from a single shared pool.

### 4.3 Competitor Comparison

| Feature / Metric | TripManager | Wanderlog | TripIt |
| :--- | :---: | :---: | :---: |
| **Exact Budget & Tag Blending** | **Yes** | No | No |
| **In-App Booking** | **Yes** | Affiliate Redirects | Email Scraping |
| **Live Transit Navigation** | **Yes** | No | No |
| **Dynamic Rescheduling** | **Yes** | No | No |
| **Regroup Beacon** | **Yes** | No | No |
| **Integrated Group Chat** | **Yes** | No | No |
| **Smart Bill Splitting** | **Yes** | Manual Entry | No |
| **Smart Photo Distribution** | **Yes** | No | No |
| **Community Hub** | **Yes** | Static Guides | No |

---

## 5. Technical Architecture & Feasibility

**Frontend**
* React Native & Expo: Powers the cross-platform mobile application. We utilize Expo for instant UI previews and rapid on-device testing via QR codes/links without needing native build steps.
* Build Strategy: While prototyping relies on Expo Go, the production environment utilizes EAS (Expo Application Services) Development/Production Builds. This transition is necessary to support the custom native modules required for core features like live maps, background push notifications, and camera/QR scanning.

**Backend & Database (Serverless)**
* Firebase (JS SDK): Replaces traditional custom server architecture. We leverage Firebase Authentication for seamless sign-ups, Cloud Storage for receipt and photo uploads, and Cloud Functions for server-side logic.
> Constraint Note: Cloud Functions that make outbound network calls require the Firebase Blaze (pay-as-you-go) plan from day one.

* Cloud Firestore (NoSQL): The backbone of our collaborative features. Firestore’s real-time listeners are crucial for powering live location pins, group chats, and instant itinerary updates without requiring a custom WebSocket layer.
> Constraint Note: Relational style queries (e.g. "all expenses for this trip, split by this member, sorted by date") need careful upfront data modeling using subcollections rather than SQL joins. Read/write costs also scale with usage, so poorly structured listeners can get expensive as user count grows.

**APIs & Integrations**
* Google Maps SDK + Directions API
> Powers live map guidance and route updates.
> Constraint: usage-based billing after a free monthly credit and needs an API key restricted to our app's package name to avoid abuse.

* Google Places API 
> Supplies ratings and photos when adding a spot to the trip.
> Constraint: same billing model as Maps which response includes limited photos per place on the free tier.

* Expo Notifications 
> Push alerts for expense updates and chat notification
> Constraint: works well for basic push, but doesn't support the more advanced targeting/analytics a dedicated push service.

* QR-based join 
> Custom built using Firestore-stored join codes + a lightweight QR-generation library.
> Constraint: Requires the app to already be installed on the joining member's device, since this method doesn't handle routing a new user through an app-store install before joining.

* Booking Architecture (MVP vs. Production 
> MVP: Currently built as a "browse and shortlist" experience.
> Constraint: Real integration requires partner approval and commercial agreements that take weeks to months to secure and planned as a post-launch milestone once partner access is in place.

**APIs & Integrations**
* Backend Infrastructure: Fully hosted via the Firebase project, requiring zero manual server provisioning or maintenance.
* App Distribution: EAS Build operates as our cloud build service, producing the installable Android binaries (APK/AAB). This eliminates the need for local Android Studio/Gradle environment setups on team members' machines.

### 5.2 System Architecture
![System architecture diagram ](<img width="2752" height="1536" alt="Gemini_Generated_Image_j41aj8j41aj8j41a" src="https://github.com/user-attachments/assets/e982e4ae-ca73-4fc0-b8e3-0322b8ca32fd" />
)

### 5.3 Build Plan & Scope Realism

* **In-Scope (MVP)**
For our Minimum Viable Product, we focused on establishing the core user experience of an end-to-end trip. 
Note: To demonstrate the complete user flow without executing live backend transactions, certain complex integrations (like bookings) are currently implemented as "browse and shortlist" interfaces.

* Group Setup & Smart Matching 
> Instant Join
> Tag Preferences
> Exact Budget Buckets
> Smart Suggestions

* Direct Booking
> In-App Booking (Mockup only)
> Google Reviews

* In-Trip Live Navigation & Emergency Backup
> Live Map Guidance (UI Mockup only)
> Smart Fixes
> Emergency Support
> Regroup Beacon

* Team Chat & Expense Splitting
> Group Chat Channel
> Flexible Bill Splitting

* Travel Journal & Community Feed
> Community Hub (Mockup only)
> Smart Photo Distribution.

* **Out-of-Scope (Future Roadmap)**
Future iterations will transition our mockups into fully functional integrations and expand upon the MVP foundation to further enhance user engagement:

* Live Direct Booking: Transitioning the booking mockup into executing real transactions via airline and hotel partner APIs.
* Advanced Chat Features: Implementing "Chat to Checklist" allowing the app to auto extract to do items directly from the group chat.
* Global Budgeting: Adding Multi-Currency Expense Splitting with live exchange rates for international travel.
* Expanded Social Features: Launching the fully interactive Community Hub and a Digital Diary for personal trip logging and reflection.

### 5.4 Reach & Scalability
**Phase 1: Initial Launch (MVP & Viral Growth)** 
* **Target Audience:** University students and young adult friend groups planning budget-conscious local trips.
* **The Viral Loop:** Our primary growth engine. When an organizer creates a trip board, they share an invite link or QR code, naturally onboarding 3 to 5 new users who must download the app to participate in group planning and expense splitting.
* **Go to Market Strategy:** We will leverage campus networks, student organizations, and social media to onboard early adopters. By encouraging users to share their visually appealing itineraries from the "Community Feed" to platforms like Instagram and TikTok, we aim to drive strong organic downloads.

**Phase 2: Growth (Technical Scaling & Monetization)** 
* **Architecture Scaling:** As user volume increases, we will transition to scalable microservices. We will implement robust caching layers to support high concurrent traffic for real-time features (Team Chat, Regroup Beacon) while minimizing external API costs.
* **Sponsored Placements:** Deepening monetization by offering targeted visibility for local restaurants and attractions within the "Smart Suggestions" algorithm.
* **B2B Partnerships:** Negotiating exclusive group discounts directly with travel vendors, hotels, and tour operators.
* **Premium Tier:** Introducing an optional paid subscription for advanced tools like offline maps and AI-driven automated receipt scanning.

**Phase 3: Wider Impact (Global & B2B Expansion)** 
* **Demographic Expansion:** Scaling beyond young adults to accommodate the specific needs of families, corporate retreats, and digital nomad communities.
* **Geographic Scaling:** Expanding from domestic to international travel by introducing multi-currency expense splitting and localized emergency APIs.
* **B2B Licensing:** Packaging the "Smart Suggestions" logic to be licensed or integrated into adjacent industries. This includes event organizers managing music festivals, or local tourism boards seeking to direct group travelers toward hidden gems and locally owned businesses.

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
