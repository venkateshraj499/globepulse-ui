# GlobeStream MVP Requirements

## Project Summary
- GlobeStream (internally referred to as GlobePulse) delivers a daily 10-minute global news digest anchored by an interactive 3D globe experience and a Quick 10 headline carousel.
- The React front end authenticates users, renders the globe experience, and orchestrates Quick 10 consumption while integrating with a Node.js API layer and Postgres data store.
- MVP scope prioritizes habit formation around the globe exploration and Quick 10 flow, deferring social or advanced personalization features.

## Objectives & Success Metrics
- Establish a sticky daily ritual: users log in, explore the globe, and complete the Quick 10 briefing.
- Track MVP health via DAU/WAU ratio, Quick 10 completion rate, average session length (target 8–11 minutes), and category switch rate.

## Primary User Flow (MVP)
1. User signs in via email/password or Google.
2. Default globe view (All category, world scope) loads with pulsing event markers.
3. User hovers markers for previews, clicks to open article card with title, snippet, source, and timestamp.
4. User can switch category tabs (All, Sports, Politics, Tech/AI, Markets, Science) to refresh globe markers.
5. User can change location scope (World, Country, City); globe auto-rotates and focuses on selection.
6. User launches ⚡ Quick 10 mode, consumes swipeable headline cards with timer/progress indicator.
7. After finishing the deck, the session closes with a “See you tomorrow!” prompt.

## Functional Requirements

### Authentication & Profile
- Support email/password signup/login and Google OAuth.
- Capture and persist user profile fields: name, city, preferred categories.

### Globe Home Screen
- Render a slowly rotating 3D globe (WebGL/Three.js or equivalent).
- Display pulsing markers representing current events.
- Show tooltip preview on hover (desktop) or tap (mobile).
- On click, open an article card containing title, snippet, source, and published time.

### Filter & Navigation Controls
- Top filter bar with tabs: All, Sports, Politics, Tech/AI, Markets, Science; switching tabs refreshes globe data.
- Location selector with hierarchy World → Country → City; selection triggers globe auto-rotation and marker refresh.

### Quick 10 Headlines Mode
- CTA button labeled “⚡ Quick 10 Headlines.”
- Opens a swipeable card deck (React carousel component) covering 10 curated headlines.
- Each card includes headline, two fact bullets, and a source chip.
- Persistent progress indicator showing card count and countdown timer (e.g., “9:30 left”).
- Completion state transitions back to home with end-of-session prompt.

### Notifications
- Schedule daily push notification at 7 AM local time: “⚡ Your 10-min world update is ready.”

### Backend & Data Contracts
- Node.js APIs: `GET /articles`, `GET /categories`, `GET /quick10`.
- Postgres schema to store Users, Articles, Categories, Locations, Quick 10 playlists.
- Daily AWS Lambda batch job to curate and store Quick 10 playlist for each day.

## Non-Functional Considerations
- Ensure globe interactions remain performant on modern desktop and mobile browsers.
- Provide responsive layouts for desktop, tablet, and mobile; maintain accessibility for key flows (keyboard navigation, screen reader labels for markers and cards).
- Secure authentication flows, encrypt sensitive data in transit, follow best practices for OAuth.

## Future Enhancements (V2 Backlog)
- Save/share headline cards.
- Streak tracking and achievement badges.
- Deeper explainer mode with What/Why/Next structure.
- Source credibility indicators.
- Personalized Quick 10 playlists (AI-driven).
- Offline “read later” capability.
- Globe timeline scrubber to explore last 24 hours of events.

## Explicit Exclusions (Not Now)
- VR/AR globe experiences.
- Multiplayer or social friend feeds.
- AI voiceover or podcast mode.
- Advanced analytics dashboards.
- Full-text news search engine.

## Assumptions & Open Questions
- Canvas reference could not be accessed in this environment; requirements above derive from `mvp.md`. Confirm any canvas-specific UI layouts or interactions once accessible.
- Clarify branding consistency between “GlobeStream” and “GlobePulse” naming before UI implementation.
- Determine content sourcing strategy and refresh cadence for articles beyond Quick 10 playlist.
- Validate push notification channels (web push, mobile push) and supporting infrastructure.

