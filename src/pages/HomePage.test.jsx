import { CssBaseline, ThemeProvider } from '@mui/material';
import { render, screen, waitFor } from '@testing-library/react';
import { forwardRef, useImperativeHandle } from 'react';
import { vi } from 'vitest';
import HomePage from './HomePage';
import theme from '../theme';

const mockStories = [
  {
    id: 'story-1',
    category: 'Tech/AI',
    city: 'San Francisco',
    headline: 'AI labs coordinate new safety disclosures',
    lat: 37.7749,
    lng: -122.4194,
    color: '#6366F1',
  },
  {
    id: 'story-2',
    category: 'Markets',
    city: 'London',
    headline: 'Markets set quarterly gains on energy sector',
    lat: 51.5072,
    lng: -0.1276,
    color: '#2563EB',
  },
];

const fetchCategoryHeadlinesMock = vi.fn(() =>
  Promise.resolve({ category: 'All', stories: mockStories })
);

vi.mock('react-globe.gl', () => ({
  __esModule: true,
  default: forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
      controls: () => ({ autoRotate: false, autoRotateSpeed: 0 }),
      pointOfView: vi.fn(),
    }));

    const {
      'data-testid': dataTestId = 'mocked-globe',
      className,
      style,
    } = props;

    return <div data-testid={dataTestId} className={className} style={style} />;
  }),
}));

vi.mock('../services/mockNewsApi', () => ({
  fetchCategoryHeadlines: (...args) => fetchCategoryHeadlinesMock(...args),
  getPrimaryStory: (stories) => stories?.[0] ?? null,
}));

describe('HomePage', () => {
  const renderPage = () =>
    render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <HomePage />
      </ThemeProvider>
    );

  it('shows brand, categories, and quick headlines action', async () => {
    renderPage();

    await waitFor(() => expect(fetchCategoryHeadlinesMock).toHaveBeenCalled());
    expect(screen.getByText('GlobePulse')).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(6);
    expect(screen.getByRole('button', { name: /quick 10 headlines/i })).toBeInTheDocument();
  });

  it('renders the interactive globe and surfaces the top story spotlight once data resolves', async () => {
    renderPage();

    await waitFor(() => expect(fetchCategoryHeadlinesMock).toHaveBeenCalledWith('All'));
    expect(screen.getByTestId('interactive-globe')).toBeInTheDocument();
    expect(await screen.findByTestId('top-story-panel')).toBeInTheDocument();
    expect(screen.getByText(/AI labs coordinate/i)).toBeInTheDocument();
  });
});
