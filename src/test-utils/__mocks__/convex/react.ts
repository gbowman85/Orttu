import { ReactNode } from 'react';

const Authenticated = jest.fn();
const Unauthenticated = jest.fn();
const ConvexProvider = ({ children }: { children: ReactNode }) => children;

module.exports = {
  ...jest.requireActual('convex/react'),
  Authenticated,
  Unauthenticated,
  ConvexProvider
}; 