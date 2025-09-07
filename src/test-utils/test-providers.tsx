import { ReactNode } from 'react';
import { ConvexProvider, ConvexReactClient, Authenticated, Unauthenticated } from 'convex/react';

// Create a mock Convex client for testing
const mockConvexClient = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL || "https://test-convex-url.convex.cloud");

interface AuthState {
  isAuthenticated?: boolean;
}

// Export auth mock utilities
export const setupAuthenticatedMocks = () => {
  (Authenticated as jest.Mock).mockImplementation(({ children }) => children);
  (Unauthenticated as jest.Mock).mockImplementation(() => null);
};

export const setupUnauthenticatedMocks = () => {
  (Authenticated as jest.Mock).mockImplementation(() => null);
  (Unauthenticated as jest.Mock).mockImplementation(({ children }) => children);
};

export const clearAuthMocks = () => {
  jest.clearAllMocks();
};

export function TestProviders({ 
  children
}: { 
  children: ReactNode;
  authState?: AuthState;
}) {
  return (
    <ConvexProvider client={mockConvexClient}>
      {children}
    </ConvexProvider>
  );
} 