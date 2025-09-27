# GlobePulse API Reference

This document highlights the REST surface exposed by the GlobePulse backend. It is intended for the UI team to understand available endpoints, required headers, query parameters, and representative payloads.

## Conventions
- **Base URL:** `https://<api-host>/api/v1`
- **Authentication:** All versioned endpoints require a bearer token in the `Authorization` header (`Authorization: Bearer <jwt>`). The `/metrics` and `/healthz` probes are unauthenticated.
- **Content Type:** Requests and responses use `application/json; charset=utf-8`.
- **Caching:** Responses include `ETag` plus short-lived `Cache-Control` headers (30–300 seconds depending on endpoint).
- **Pagination:** `/news/stories` exposes a `nextCursor` ISO timestamp when the requested `limit` is hit.

## Endpoints

### 1. List Categories
- **Method:** `GET`
- **Path:** `/news/categories`
- **Purpose:** Retrieve the navigation taxonomy (ordered list).
- **Caching:** 5 minutes (`max-age=300`).

**Sample Request**
```http
GET /api/v1/news/categories HTTP/1.1
Host: api.globepulse.local
Authorization: Bearer <jwt>
```

**Sample Response**
```json
{
  "categories": [
    { "id": "all", "label": "All", "description": "Mixed feed across all beats" },
    { "id": "tech-ai", "label": "Tech/AI", "description": "Innovation, AI, and emerging tech" },
    { "id": "markets", "label": "Markets", "description": "Global markets and economic news" },
    { "id": "sports", "label": "Sports", "description": "Global sports technology and events" },
    { "id": "politics", "label": "Politics", "description": "Worldwide political developments" },
    { "id": "science", "label": "Science", "description": "Science and space exploration highlights" }
  ]
}
```

### 2. List Cities with Active Stories
- **Method:** `GET`
- **Path:** `/news/cities`
- **Purpose:** Populate the autocomplete with geo-tagged story cities.
- **Query Parameters:**
  | Name | Type | Default | Description |
  |------|------|---------|-------------|
  | `category` | string | `all` | Limit to a single category (`all`, `tech-ai`, `markets`, `sports`, `politics`, `science`). |
  | `limit` | number | 50 | Cap the number of stories scanned for unique cities (1–50). |
- **Caching:** 60 seconds.

**Sample Request**
```http
GET /api/v1/news/cities?category=tech-ai HTTP/1.1
Host: api.globepulse.local
Authorization: Bearer <jwt>
```

**Sample Response**
```json
{
  "cities": [
    {
      "city": "San Francisco",
      "country": "United States",
      "latitude": 37.7749,
      "longitude": -122.4194,
      "storyId": "aHR0cHM6Ly9leGFtcGxlLmNvbS9hcnRpY2xlL3RlY2gtc3BvdGxpZ2h0"
    },
    {
      "city": "Tokyo",
      "country": "Japan",
      "latitude": 35.6762,
      "longitude": 139.6503,
      "storyId": "aHR0cHM6Ly9leGFtcGxlLmNvLmpwL25ld3MvdGVjaC1haS10b2t5bw"
    }
  ]
}
```

### 3. Fetch Story Feed
- **Method:** `GET`
- **Path:** `/news/stories`
- **Purpose:** Primary feed for globe markers, tooltips, spotlight panel, and modal content.
- **Query Parameters:**
  | Name | Type | Default | Notes |
  |------|------|---------|-------|
  | `category` | string | `all` | Category filter (`all`, `tech-ai`, `markets`, `sports`, `politics`, `science`). |
  | `limit` | number | 20 | 1–50. Also determines `nextCursor` emission. |
  | `includeDescription` | boolean | `true` | When `false`, omits the `description` field to reduce payload. |
  | `since` | ISO timestamp | _none_ | Refresh feed with articles seen at/after the supplied UTC timestamp (ISO 8601). |
- **Caching:** 60 seconds.

**Sample Request**
```http
GET /api/v1/news/stories?category=tech-ai&limit=6&includeDescription=true HTTP/1.1
Host: api.globepulse.local
Authorization: Bearer <jwt>
```

**Sample Response**
```json
{
  "category": "tech-ai",
  "stories": [
    {
      "id": "aHR0cHM6Ly9leGFtcGxlLmNvbS9uZXdzL2dlbmVyYXRpdmUtYWktZ3VhcmRz",
      "category": "tech-ai",
      "city": "San Francisco",
      "country": "United States",
      "latitude": 37.7749,
      "longitude": -122.4194,
      "headline": "Generative AI leaders unveil safety consortium roadmap",
      "description": "Global AI firms commit to shared guardrails aimed at safer model deployment across industries.",
      "publishedAt": "2024-05-12T08:24:00.000Z",
      "source": "GlobePulse Wire",
      "spotlight": true,
      "tags": ["tech-ai"],
      "thumbnailUrl": "https://cdn.example.com/story/tech-ai-spotlight.jpg"
    },
    {
      "id": "aHR0cHM6Ly9leGFtcGxlLmNvbS9uZXdzL3F1YW50dW0tY29tcHV0ZQ",
      "category": "tech-ai",
      "city": "Zurich",
      "country": "Switzerland",
      "latitude": 47.3769,
      "longitude": 8.5417,
      "headline": "Quantum-ready cloud regions announce interoperable standards",
      "description": "European research labs agree on a shared blueprint for hybrid quantum-classical compute clusters.",
      "publishedAt": "2024-05-12T07:55:00.000Z",
      "source": "SwissTech Journal",
      "spotlight": false,
      "tags": ["tech-ai"],
      "thumbnailUrl": "https://cdn.example.com/story/quantum-cloud.jpg"
    }
  ],
  "nextCursor": "2024-05-12T07:55:00.000Z"
}
```

### 4. Fetch Story Detail
- **Method:** `GET`
- **Path:** `/news/stories/{id}`
- **Purpose:** Deep link or modal detail view for a single story.
- **Notes:** `id` is a base64url-encoded source URL. If the story has been seen via `/news/stories`, cached geo metadata is reused.
- **Caching:** 60 seconds.

**Sample Request**
```http
GET /api/v1/news/stories/aHR0cHM6Ly9leGFtcGxlLmNvbS9uZXdzL2dlbmVyYXRpdmUtYWktZ3VhcmRz HTTP/1.1
Host: api.globepulse.local
Authorization: Bearer <jwt>
```

**Sample Response**
```json
{
  "id": "aHR0cHM6Ly9leGFtcGxlLmNvbS9uZXdzL2dlbmVyYXRpdmUtYWktZ3VhcmRz",
  "category": "tech-ai",
  "city": "San Francisco",
  "country": "United States",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "headline": "Generative AI leaders unveil safety consortium roadmap",
  "description": "Global AI firms commit to shared guardrails aimed at safer model deployment across industries.",
  "publishedAt": "2024-05-12T08:24:00.000Z",
  "source": "GlobePulse Wire",
  "content": "Long-form copy or extended excerpt fetched from GDELT.",
  "tags": ["tech-ai"],
  "thumbnailUrl": "https://cdn.example.com/story/tech-ai-spotlight.jpg"
}
```

### 5. Fetch Category Highlights
- **Method:** `GET`
- **Path:** `/news/stories/highlights`
- **Purpose:** Surface one spotlight story ID per category for hero transitions.
- **Caching:** 60 seconds.

**Sample Request**
```http
GET /api/v1/news/stories/highlights HTTP/1.1
Host: api.globepulse.local
Authorization: Bearer <jwt>
```

**Sample Response**
```json
{
  "highlights": {
    "tech-ai": "aHR0cHM6Ly9leGFtcGxlLmNvbS9uZXdzL2dlbmVyYXRpdmUtYWktZ3VhcmRz",
    "markets": "aHR0cHM6Ly9tYXJrZXRwdWxzZS5jb20vbmV3cy9hc2lhLW1hcmtldHM",
    "sports": "aHR0cHM6Ly9zcG9ydHNjaXJjbGUuY29tL2FyY2hpdmVzL2RhdGEtc3RhY2tz",
    "politics": "aHR0cHM6Ly9wb2xpdGljc3dvcmxkLmNvbS9kZWVwLWNsaW1hdGU",
    "science": "aHR0cHM6Ly9zY2llbmNlaHViLmNvbS9uZXdzL3NwYWNlLXNpZ25hbA"
  }
}
```

### 6. Fetch Quick Flash Stories
- **Method:** `GET`
- **Path:** `/news/stories/flash`
- **Purpose:** Lightweight feed for the "⚡ Quick 10 Headlines" CTA (title + essential metadata only).
- **Caching:** 30 seconds.

**Sample Request**
```http
GET /api/v1/news/stories/flash HTTP/1.1
Host: api.globepulse.local
Authorization: Bearer <jwt>
```

**Sample Response**
```json
{
  "stories": [
    {
      "id": "aHR0cHM6Ly9tYXJrZXRwdWxzZS5jb20vbmV3cy9hc2lhLWZsdXNo",
      "category": "markets",
      "city": "London",
      "country": "United Kingdom",
      "headline": "Pound strengthens as markets price slower rate cuts",
      "publishedAt": "2024-05-12T07:00:00.000Z",
      "source": "MarketPulse",
      "spotlight": false
    },
    {
      "id": "aHR0cHM6Ly9zY2llbmNlaHViLmNvbS9uZXdzL2Rpc2NvdmVyeS1taWNyb2JpYWw",
      "category": "science",
      "city": "Berlin",
      "country": "Germany",
      "headline": "Neuromorphic chips promise dramatic energy savings",
      "publishedAt": "2024-05-12T06:48:00.000Z",
      "source": "ScienceHub",
      "spotlight": false
    }
  ]
}
```

### 7. Submit Story Feedback
- **Method:** `POST`
- **Path:** `/news/stories/feedback`
- **Purpose:** Capture bookmark/like/dismiss interactions for analytics. Payload is validated and enqueued for async processing.
- **Caching:** Non-cacheable (`202 Accepted`).

**Sample Request**
```http
POST /api/v1/news/stories/feedback HTTP/1.1
Host: api.globepulse.local
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "storyId": "aHR0cHM6Ly9leGFtcGxlLmNvbS9uZXdzL2dlbmVyYXRpdmUtYWktZ3VhcmRz",
  "action": "bookmark",
  "context": {
    "surface": "modal",
    "reason": "ReadLater"
  }
}
```

**Sample Response**
```json
{
  "status": "queued"
}
```

## Non-Versioned Utility Endpoints
While primarily used by operational tooling, the UI may find these useful during development.

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| `GET` | `/healthz` | Liveness/readiness probe returning environment and request ID. | No |
| `GET` | `/metrics` | Prometheus exposition format with request counters/durations. | No |

**/healthz Sample**
```json
{
  "status": "ok",
  "environment": "development",
  "requestId": "4f4b99f7-86de-4dc2-9029-8d5a5f4d2b9e"
}
```

## Error Envelope
All error responses share the following structure:

```json
{
  "error": {
    "code": "resource_not_found",
    "message": "Human readable sentence",
    "details": {
      "requestId": "4f4b99f7-86de-4dc2-9029-8d5a5f4d2b9e",
      "additional": "context"
    }
  }
}
```

Common error codes:
- `auth_missing_token`: Missing `Authorization` header (401).
- `auth_invalid_token`: Malformed or unverifiable JWT (401).
- `invalid_query`: Query parameter validation failed (400).
- `invalid_payload`: Feedback body validation failed (400).
- `resource_not_found`: Story or route not found (404).
- `rate_limit_exceeded`: Too many requests in the configured window (429).
- `upstream_error` / `upstream_unreachable`: GDELT API failures (502).

## Rate Limits
Each authenticated token is limited to **120 requests per rolling minute**. Exceeding the limit yields HTTP 429 with the standard error envelope.

---
This reference will be updated as new endpoints are introduced or payloads evolve.
