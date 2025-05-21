// Test that the public layout renders the correct components when unauthenticated and authenticated

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import PublicLayout from './layout';
import Home from './page';
import { TestProviders, clearAuthMocks, setupAuthenticatedMocks, setupUnauthenticatedMocks } from '@/test-utils/test-providers';

// Set up component mocks
jest.mock('@/components/auth/UserProfileIcon');

describe('Public Layout with Home Page', () => {
  beforeEach(() => {
    clearAuthMocks();
  });

  it('renders the complete page structure when unauthenticated', () => {
    setupUnauthenticatedMocks();

    render(
      <TestProviders authState={{ isAuthenticated: false }}>
        <PublicLayout>
          <Home />
        </PublicLayout>
      </TestProviders>
    );

    // Test for banner role (header)
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();

    // Test for main role (main content area)
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();

    // Test for contentinfo role (footer)
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();

  });

  it('renders the complete page structure when authenticated', () => {
    setupAuthenticatedMocks();

    render(
      <TestProviders authState={{ isAuthenticated: true }}>
        <PublicLayout>
          <Home />
        </PublicLayout>
      </TestProviders>
    );

    // Test for banner role (header)
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();

    // Test for main role (main content area)
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();

    // Test for contentinfo role (footer)
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();

  });
}); 