import { CssBaseline, ThemeProvider } from '@mui/material';
import { render, screen, waitFor } from '@testing-library/react';
import { forwardRef, useImperativeHandle } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import App from './App';
import theme from './theme';

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

vi.mock('./services/mockNewsApi', () => ({
  fetchCategoryHeadlines: (...args) => fetchCategoryHeadlinesMock(...args),
  getPrimaryStory: (stories) => stories?.[0] ?? null,
}));

describe('App routing', () => {
  const renderWithProviders = (initialEntries = ['/']) =>
    render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MemoryRouter initialEntries={initialEntries}>
          <App />
        </MemoryRouter>
      </ThemeProvider>
    );

  it('displays the GlobePulse sign-in experience on the root route', () => {
    renderWithProviders();

    expect(screen.getByRole('heading', { name: /GlobePulse/i })).toBeInTheDocument();
    expect(
      screen.getByText(/Your 10-minute global news briefing/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 6, name: /sign in/i })).toBeInTheDocument();
  });

  it('renders the newsroom homepage UI on the /home route', () => {
    renderWithProviders(['/home']);

    expect(screen.getByRole('heading', { name: /GlobePulse/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /quick 10 headlines/i })).toBeInTheDocument();
    expect(screen.getByTestId('interactive-globe')).toBeInTheDocument();
    return waitFor(() => expect(fetchCategoryHeadlinesMock).toHaveBeenCalled());
  });
});
