import { describe, expect, it, vi } from 'vitest';
import { fetchCategoryHeadlines, getPrimaryStory, __TEST_DATA__ } from './mockNewsApi';

vi.useFakeTimers();

describe('mockNewsApi', () => {
  it('resolves stories for a requested category', async () => {
    const fetchPromise = fetchCategoryHeadlines('Sports');

    await vi.runAllTimersAsync();
    const result = await fetchPromise;

    expect(result.category).toBe('Sports');
    expect(result.stories).toEqual(__TEST_DATA__.Sports);
    expect(result.stories).toHaveLength(3);
  });

  it('falls back to All when category is not available', async () => {
    const fetchPromise = fetchCategoryHeadlines('Unknown');

    await vi.runAllTimersAsync();
    const result = await fetchPromise;

    expect(result.category).toBe('All');
    expect(result.stories).toEqual(__TEST_DATA__.All);
  });

  it('returns the first story as the primary story helper', () => {
    const stories = __TEST_DATA__['Tech/AI'];
    expect(getPrimaryStory(stories)).toBe(stories[0]);
    expect(getPrimaryStory([])).toBeNull();
  });
});
