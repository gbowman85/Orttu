// Test that unauthenticated users see the login button and authenticated users see the user profile icon

import { render, screen } from '@testing-library/react';
import ProtectedHeader from './ProtectedHeader';
import { TestProviders, clearAuthMocks, setupAuthenticatedMocks, setupUnauthenticatedMocks } from '@/test-utils/test-providers';

// Mock the UserProfileIcon component
jest.mock('@/components/auth/UserProfileIcon');

describe('ProtectedHeader', () => {
  beforeEach(() => {
    clearAuthMocks();
  });

  it('shows login button when unauthenticated', () => {
    setupUnauthenticatedMocks();

    render(
      <TestProviders>
        <ProtectedHeader />
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
        <ProtectedHeader />
      </TestProviders>
    );

    const loginButton = screen.queryByRole('link', { name: /login/i });
    const userProfileIcon = screen.queryByTestId('user-profile-icon');
    
    expect(userProfileIcon).toBeInTheDocument();
    expect(loginButton).not.toBeInTheDocument();
  });
});
