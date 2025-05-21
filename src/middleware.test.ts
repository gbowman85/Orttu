// Test that the middleware is protecting the correct routes

import fs from 'fs';
import path from 'path';
import { PROTECTED_ROUTES } from './lib/protected-routes';

describe('Middleware Protected Routes', () => {
  const getProtectedRoutes = () => {
    const protectedDir = path.join(process.cwd(), 'src', 'app', '(protected)');
    return fs.readdirSync(protectedDir)
      .filter(item => {
        const itemPath = path.join(protectedDir, item);
        return fs.statSync(itemPath).isDirectory() && item !== '__tests__';
      })
      .map(dir => `/${dir}`);
  };

  it('has all filesystem routes in middleware config', () => {
    const fsProtectedRoutes = getProtectedRoutes();

    // Check that all filesystem routes are in middleware
    fsProtectedRoutes.forEach(route => {
      expect(PROTECTED_ROUTES).toContain(route);
    });

    // Check that all middleware routes exist in filesystem
    PROTECTED_ROUTES.forEach(route => {
      expect(fsProtectedRoutes).toContain(route);
    });
  });

  it('has correct route format', () => {
    PROTECTED_ROUTES.forEach(route => {
      expect(route).toMatch(/^\/[a-z-]+$/); // Should start with / and contain only lowercase letters and hyphens
    });
  });
}); 