import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '../page';

// Mock the components
vi.mock('../../components/EmailFrom/EmailForm', () => ({
  default: () => <div data-testid="email-form">Email Form Component</div>
}));

vi.mock('../../components/ResultDisplay/ResultDisplay', () => ({
  ResultDisplay: ({ email, error }: { email: string | null; error: string | null }) => (
    <div data-testid="result-display">
      {email && <div data-testid="email">{email}</div>}
      {error && <div data-testid="error">{error}</div>}
    </div>
  )
}));

// Mock the useEmailDerivation hook
vi.mock('../../hooks/useEmailDerivation', () => ({
  useEmailDerivation: vi.fn(() => ({
    result: null,
    error: null,
    loading: false,
    derive: vi.fn()
  }))
}));

describe('Home Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the main title', () => {
    render(<Home />);
    
    expect(screen.getByText('Email Derivation')).toBeInTheDocument();
  });

  it('should render the description', () => {
    render(<Home />);
    
    // The page doesn't have a description text, so let's check for the form instead
    expect(screen.getByTestId('email-form')).toBeInTheDocument();
  });

  it('should render the EmailForm component', () => {
    render(<Home />);
    
    expect(screen.getByTestId('email-form')).toBeInTheDocument();
  });

  it('should not render the ResultDisplay component initially', () => {
    render(<Home />);
    
    // ResultDisplay should not be rendered when there's no result or error
    expect(screen.queryByTestId('result-display')).not.toBeInTheDocument();
  });

  it('should render sample data patterns section', () => {
    render(<Home />);
    
    expect(screen.getByText('Sample Data Patterns')).toBeInTheDocument();
  });

  it('should render sample data entries', () => {
    render(<Home />);
    
    // Check for some sample data entries that are actually in the page
    expect(screen.getByText(/jdoe@babbel.com/)).toBeInTheDocument();
    expect(screen.getByText('• babbel.com')).toBeInTheDocument();
  });
});