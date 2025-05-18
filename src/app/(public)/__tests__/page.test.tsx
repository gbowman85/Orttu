import { render, screen } from '@testing-library/react';
import Home from '../page';
import PublicLayout from '../layout';

describe('Home Page', () => {
  it('renders the home page with correct structure', () => {
    render(
      <PublicLayout>
        <Home />
      </PublicLayout>
    );
    
    // Check if the semantic elements are present
    const header = document.querySelector('header');
    const main = document.querySelector('main');
    const footer = document.querySelector('footer');
    
    expect(header).toBeInTheDocument();
    expect(main).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
    
    // Ensure there's exactly one of each
    expect(document.querySelectorAll('header')).toHaveLength(1);
    expect(document.querySelectorAll('main')).toHaveLength(1);
    expect(document.querySelectorAll('footer')).toHaveLength(1);
  });
}); 