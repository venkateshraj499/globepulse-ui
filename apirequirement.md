# GlobePulse API Requirements

## Overview

The GlobePulse frontend consumes a news aggregation API that delivers geo-tagged headlines, category filters, and story metadata for interactive globe visualisation. The backend must expose a versioned REST surface (recommended base path: `/api/v1`) that returns JSON responses, supports low-latency globe updates (<400 ms target), and supplies sufficient metadata for UI treatments such as city pins, tooltips, spotlight panels, and modal dialogs.

### Core Functional Goals

- Provide curated news stories with geographic coordinates and descriptive context.
- Surface a consistent category taxonomy used by the navigation rail (`All`, `Sports`, `Politics`, `Tech/AI`, `Markets`, `Science`).
- Allow the UI to retrieve all active cities with live stories for the Autocomplete selector.
- Return extended copy (headline + description) used in the story modal.
- Support spotlight logic by flagging primary stories per category.
- Enable expansion for future features such as a "Quick 10 Headlines" flash feed.

### Cross-Cutting Requirements

- **Authentication:** bearer token (JWT) in `Authorization` header. Anonymous access should be rejected with HTTP 401.
- **Content Type:** Requests and responses use `application/json; charset=utf-8`.
- **Localization:** Default locale `en-US`; allow future locale override via `Accept-Language` header.
- **Rate Limiting:** Minimum 120 requests/min per token to support fast client interactions.
- **Caching:** Include `ETag` and `Cache-Control` headers; safe responses may be cached by CDNs for up to 60 seconds.
- **Error Format:**
  ```json
  {
    "error": {
      "code": "resource_not_found",
      "message": "Human readable sentence",
      "details": {}
    }
  }
  ```

## Authentication Endpoints

| Method | Path            | Purpose                                |
|--------|-----------------|----------------------------------------|
| `POST` | `/auth/login`   | Exchange credentials for access token. |
| `POST` | `/auth/logout`  | Invalidate active session/token.       |
| `POST` | `/auth/refresh` | Rotate tokens before expiry.           |

### `POST /auth/login`

- **Body**
  ```json
  {
    "email": "user@example.com",
    "password": "string"
  }
  ```
- **Response** `200 OK`
  ```json
  {
    "accessToken": "jwt-token",
    "expiresIn": 3600,
    "refreshToken": "jwt-refresh-token",
    "user": {
      "id": "uuid",
      "name": "GlobePulse Editor"
    }
  }
  ```

## Taxonomy & Location Data

### `GET /news/categories`

Returns the ordered list of selectable categories.

- **Query Params:** none.
- **Response** `200 OK`
  ```json
  {
    "categories": [
      {
        "id": "all",
        "label": "All",
        "description": "Mixed feed across all beats"
      },
      {
        "id": "sports",
        "label": "Sports",
        "description": "Global sports technology and events"
      }
    ]
  }
  ```

### `GET /news/cities`

Supplies the list of cities with active stories, used to populate the Autocomplete dropdown.

- **Query Params**
  - `category` *(optional)* — filter to a specific category ID; default `all`.
- **Response** `200 OK`
  ```json
  {
    "cities": [
      {
        "city": "San Francisco",
        "country": "USA",
        "latitude": 37.7749,
        "longitude": -122.4194,
        "storyId": "tech-ai-spotlight"
      }
    ]
  }
  ```

## Story Retrieval

### `GET /news/stories`

Primary feed powering the globe markers, spotlight card, and modal content.

- **Query Params**
  - `category` *(optional)* — category ID; omit or use `all` for the blended feed.
  - `limit` *(optional, default 20, max 50)* — used by features like "Quick 10 Headlines".
  - `includeDescription` *(optional boolean, default `true`)* — toggle extended copy for lightweight map-only views.
  - `since` *(optional ISO8601 timestamp)* — incremental refresh support.
- **Response** `200 OK`
  ```json
  {
    "category": "all",
    "stories": [
      {
        "id": "tech-ai-spotlight",
        "category": "Tech/AI",
        "city": "San Francisco",
        "country": "USA",
        "latitude": 37.7749,
        "longitude": -122.4194,
        "headline": "Generative AI leaders unveil safety consortium roadmap",
        "description": "Global AI firms commit to shared guardrails...",
        "publishedAt": "2024-05-12T08:24:00Z",
        "source": "GlobePulse Wire",
        "spotlight": true,
        "tags": ["ai", "policy"],
        "thumbnailUrl": "https://cdn.example.com/story/tech-ai-spotlight.jpg"
      }
    ]
  }
  ```

### `GET /news/stories/{id}`

Fetches a single story with full detail for modal deep links or shareable URLs.

- **Path Param:** `id` — story identifier.
- **Response** `200 OK`
  ```json
  {
    "id": "tech-ai-spotlight",
    "category": "Tech/AI",
    "city": "San Francisco",
    "country": "USA",
    "latitude": 37.7749,
    "longitude": -122.4194,
    "headline": "Generative AI leaders unveil safety consortium roadmap",
    "description": "Global AI firms ...",
    "publishedAt": "2024-05-12T08:24:00Z",
    "source": "GlobePulse Wire",
    "content": "Optional long-form copy",
    "related": [
      {
        "id": "tech-cloud-hubs",
        "headline": "Quantum-ready cloud regions announce interoperable standards"
      }
    ]
  }
  ```

### `GET /news/stories/highlights`

Returns one "spotlight" story per category for hero promotion and quick transitions.

- **Response** `200 OK`
  ```json
  {
    "highlights": {
      "sports": "sports-data-athletes",
      "politics": "politics-climate-accord",
      "tech-ai": "tech-ai-spotlight",
      "markets": "markets-asia",
      "science": "science-space"
    }
  }
  ```

## Future-Facing Endpoints

### `GET /news/stories/flash`

Supports the "⚡ Quick 10 Headlines" CTA with a trimmed response (10 most recent stories across beats).

- **Response** `200 OK`
  ```json
  {
    "stories": [
      {
        "id": "markets-shift",
        "headline": "Pound strengthens as markets price slower rate cuts",
        "category": "Markets",
        "publishedAt": "2024-05-12T07:00:00Z"
      }
    ]
  }
  ```

### `POST /news/stories/feedback`

Captures user feedback or save actions for analytics.

- **Body**
  ```json
  {
    "storyId": "tech-ai-spotlight",
    "action": "bookmark",
    "context": {
      "source": "modal",
      "category": "Tech/AI"
    }
  }
  ```
- **Response** `202 Accepted`
  ```json
  {
    "status": "queued"
  }
  ```

## Data Contracts

| Field           | Type      | Notes                                                      |
|-----------------|-----------|------------------------------------------------------------|
| `id`            | string    | Stable UUID/slug used across endpoints.                    |
| `category`      | string    | Matches IDs from `/news/categories`.                       |
| `city`          | string    | Human-readable city name for display.                      |
| `country`       | string    | Optional ISO country name; useful for grouping.            |
| `latitude`      | number    | Decimal degrees, WGS84.                                    |
| `longitude`     | number    | Decimal degrees, WGS84.                                    |
| `headline`      | string    | Primary line shown in the globe tooltip & spotlight card.  |
| `description`   | string    | Secondary copy for modal; may be omitted if `includeDescription=false`. |
| `publishedAt`   | string    | ISO8601 timestamp.                                         |
| `spotlight`     | boolean   | Indicates whether the story should animate the globe ring. |
| `tags`          | string[]  | Optional keywords for client-side filtering/search.        |
| `thumbnailUrl`  | string    | Optional hero image.                                       |
| `source`        | string    | Human-readable origin (e.g., "Reuters").                  |

## Non-Functional Expectations

- **Latency:** ≤250 ms p95 for `/news/stories` from edge POP.
- **Availability:** 99.5% monthly for read endpoints.
- **Paging & Limits:** Provide `nextCursor` when `limit` is hit to support infinite scroll features.
- **Security:** HTTPS only; enable CORS for the frontend origin(s).
- **Monitoring:** Emit structured logs (request ID, category, payload size) and instrument Prometheus metrics for request counts and latencies.

