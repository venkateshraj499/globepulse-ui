const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1';
const TEMP_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mocked.payload.signature';

const defaultHeaders = () => ({
  Authorization: `Bearer ${TEMP_JWT}`,
});

const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    searchParams.append(key, String(value));
  });

  const query = searchParams.toString();
  return query ? `?${query}` : '';
};

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...defaultHeaders(),
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message = errorBody?.error?.message ?? response.statusText;
    throw new Error(message || 'Request failed');
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const fetchCategories = () => request('/news/categories');

export const fetchStories = ({ category = 'all', limit = 20, includeDescription = true, since } = {}) =>
  request(
    `/news/stories${buildQueryString({ category, limit, includeDescription, since })}`
  );

export const fetchCities = ({ category = 'all', limit = 50 } = {}) =>
  request(`/news/cities${buildQueryString({ category, limit })}`);

export const fetchStoryDetail = (id) => request(`/news/stories/${id}`);

export const fetchHighlights = () => request('/news/stories/highlights');

export const fetchQuickStories = ({ category = 'all', limit = 10 } = {}) =>
  request(`/news/stories${buildQueryString({ category, limit, includeDescription: true })}`);

export const fetchFlashStories = ({ category = 'all' } = {}) =>
  request(`/news/stories/flash${buildQueryString({ category })}`);

