// Test that unauthenticated users see the login button and authenticated users see the user profile icon

import { render, screen } from '@testing-library/react';
import PublicHeader from './PublicHeader';
import { TestProviders, clearAuthMocks, setupAuthenticatedMocks, setupUnauthenticatedMocks } from '@/test-utils/test-providers';

// Mock the UserProfileIcon component
jest.mock('@/components/auth/UserProfileIcon');

describe('PublicHeader', () => {
  beforeEach(() => {
    clearAuthMocks();
  });

  it('shows login button when unauthenticated', () => {
    setupUnauthenticatedMocks();

    render(
      <TestProviders>
        <PublicHeader />
      </TestProviders>
    );

    const loginButton = screen.queryByRole('link', { name: /login/i });
    const userProfileIcon = screen.queryByTestId('user-profile-icon');
    
    expect(loginButton).toBeInTheDocument();
    expect(userProfileIcon).not.toBeInTheDocument();
  });

  it('shows user profile icon when authenticated', () => {
    setupAuthenticatedMocks();

    render(
      <TestProviders>
        <PublicHeader />
      </TestProviders>
    );

    const loginButton = screen.queryByRole('link', { name: /login/i });
    const userProfileIcon = screen.queryByTestId('user-profile-icon');
    
    expect(userProfileIcon).toBeInTheDocument();
    expect(loginButton).not.toBeInTheDocument();
  });
});
