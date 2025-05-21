// Test that the home page renders a h1 heading

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Home from './page';

// Test that the home page renders a h1 heading
describe('Home Page', () => {
  it('renders the home page content', () => {
    render(
      <Home />
    );
    
    const heading = screen.getByRole('heading', { level: 1, name: /home/i });
    expect(heading).toBeInTheDocument();

  });
}); 