import React from 'react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const MockedApp = () => <div data-testid="app-component" />;
MockedApp.displayName = 'MockedApp';

vi.mock('./App', () => ({
  default: MockedApp,
}));

describe('main entrypoint', () => {
  beforeEach(() => {
    vi.resetModules();
    document.body.innerHTML = '<div id="root"></div>';
  });

  it('creates the React root and renders the themed application tree', async () => {
    const render = vi.fn();
    const createRoot = vi.fn(() => ({ render }));

    vi.doMock('react-dom/client', () => ({
      default: { createRoot },
      createRoot,
    }));

    await import('./main.jsx');

    const rootElement = document.getElementById('root');
    expect(createRoot).toHaveBeenCalledWith(rootElement);
    expect(render).toHaveBeenCalledTimes(1);

    const [renderedTree] = render.mock.calls[0];
    expect(renderedTree.type).toBe(React.StrictMode);

    const themeProvider = renderedTree.props.children;
    expect(themeProvider.type).toBe(ThemeProvider);

    const providedTheme = themeProvider.props.theme;
    expect(providedTheme.palette.primary.main).toBe('#0D173D');
    expect(providedTheme.typography.fontFamily).toContain('Inter');

    const directChildren = React.Children.toArray(themeProvider.props.children).filter(
      React.isValidElement
    );

    const hasCssBaseline = directChildren.some((child) => child.type === CssBaseline);
    expect(hasCssBaseline).toBe(true);

    const containsApp = directChildren.some((child) =>
      React.Children.toArray(child.props?.children).some(
        (grandChild) => grandChild.type === MockedApp
      ) || child.type === MockedApp
    );

    expect(containsApp).toBe(true);
  });
});
