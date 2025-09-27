🌍 GlobeStream MVP Cut (V1)
🎯 MVP Goal

Deliver a 10-minute world briefing experience anchored by the interactive globe and Quick 10 mode.
👉 Users should log in, explore, and finish a 10-min digest daily.

✅ Must-Have (V1 Core)

These are non-negotiable for MVP.

Authentication (basic)

Email/password or Google login.

Store profile (name, city, preferred categories).

Globe Home Screen

3D globe (rotating slowly).

Event markers (pulsing dots).

Tooltip preview on hover/tap.

Click → opens article card (title, snippet, source, time).

Top Filter Bar

Tabs: All • Sports • Politics • Tech/AI • Markets • Science.

Switching tabs refreshes markers on globe.

Location Selector

Dropdown: World • Country • City.

Globe auto-rotates to selected region.

Quick 10 Headlines Mode

Button: “⚡ Quick 10 Headlines.”

Opens swipeable card deck (React carousel).

Each card: headline + 2 fact bullets + source chip.

Progress bar / timer (“9:30 left”).

Backend Basics

Node APIs for: /articles, /categories, /quick10.

Postgres: Users, Articles, Categories, Locations.

Daily batch job (AWS Lambda) → selects & stores Quick 10 playlist.

Push Notification

Daily at 7 AM local time: “⚡ Your 10-min world update is ready.”

🚀 Nice-to-Have (V2)

Polish/features that can wait until after MVP launch.

Save/share headline cards.

Streaks & badges (“5-day streak”).

Deeper explainer mode (“What/Why/Next”).

Source credibility labels.

Personalized Quick 10 (AI-driven).

Offline “read later.”

Globe timeline scrubber (events over last 24h).

🛑 Not Now (Never Build / Defer Long-Term)

VR/AR globe.

Multiplayer / friend social feeds.

AI voiceover / podcast mode.

Advanced analytics dashboards.

Full-blown news search engine.

🗂️ MVP User Flow

User logs in → Globe loads (default “All” category, world view).

Sees pulsing markers → hovers → preview → clicks → reads snippet.

Switches category tabs (sports, politics).

Selects city (Bangalore) → globe rotates, shows local markers.

Taps “⚡ Quick 10” → carousel opens → reads headlines in 10 min.

Completes → session ends → prompt: “See you tomorrow!”

📏 Success Metrics (MVP only)

DAU / WAU ratio → Are users coming back?

Quick 10 completion rate → % of users finishing all 10 cards.

Avg. session length → Should hover around 8–11 mins.

Category switch rate → Are filters being used, or just “All”?

📌 Strict PM View:
This cut focuses on the promise (globe + 10-min digest) and avoids shiny distractions. If MVP nails habit formation, later features (explainers, streaks, personalization) will feel like value multipliers, not crutches.