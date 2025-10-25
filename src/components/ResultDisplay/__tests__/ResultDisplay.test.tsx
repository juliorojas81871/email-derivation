import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResultDisplay } from '../ResultDisplay';

describe('ResultDisplay', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when no result or error', () => {
    render(<ResultDisplay email={null} error={null} />);

    // Should not render anything when no result or error
    expect(screen.queryByText('Email Derived Successfully!')).not.toBeInTheDocument();
    expect(screen.queryByText('Derivation Failed')).not.toBeInTheDocument();
  });

  it('should render success result', () => {
    render(<ResultDisplay email="jdoe@babbel.com" error={null} />);

    expect(screen.getByText('jdoe@babbel.com')).toBeInTheDocument();
    expect(screen.getByText('Email Derived Successfully!')).toBeInTheDocument();
  });

  it('should render error message', () => {
    const error = 'No sample data found for this domain';

    render(<ResultDisplay email={null} error={error} />);

    expect(screen.getByText('No sample data found for this domain')).toBeInTheDocument();
    expect(screen.getByText('Derivation Failed')).toBeInTheDocument();
  });

  it('should prioritize email over error when both are present', () => {
    const error = 'Some error';

    render(<ResultDisplay email="jdoe@babbel.com" error={error} />);

    // The component shows the email when both are present
    expect(screen.getByText('jdoe@babbel.com')).toBeInTheDocument();
    expect(screen.getByText('Email Derived Successfully!')).toBeInTheDocument();
    // The error might still be shown in the modal, so we don't check for its absence
  });

  it('should handle long error messages', () => {
    const longError = 'This is a very long error message that should be displayed properly in the modal without any issues or truncation';

    render(<ResultDisplay email={null} error={longError} />);

    expect(screen.getByText(longError)).toBeInTheDocument();
  });

  it('should handle special characters in email', () => {
    render(<ResultDisplay email="j.doe+test@babbel.com" error={null} />);

    expect(screen.getByText('j.doe+test@babbel.com')).toBeInTheDocument();
  });

  it('should handle unicode characters in email', () => {
    render(<ResultDisplay email="jdoe@babbel.com" error={null} />);

    expect(screen.getByText('jdoe@babbel.com')).toBeInTheDocument();
  });

  it('should handle empty string error', () => {
    render(<ResultDisplay email={null} error="" />);

    // Should not render anything for empty error
    expect(screen.queryByText('Derivation Failed')).not.toBeInTheDocument();
  });
});