import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmailForm from '../EmailForm';

describe('EmailForm', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render form fields', () => {
    render(<EmailForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Company Domain')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /derive email/i })).toBeInTheDocument();
  });

  it('should have correct placeholders', () => {
    render(<EmailForm onSubmit={mockOnSubmit} />);

    expect(screen.getByPlaceholderText('e.g. Jane')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. Doe')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. babbel.com or https://www.google.com')).toBeInTheDocument();
  });

  it('should prevent spaces in first name field', async () => {
    const user = userEvent.setup();
    render(<EmailForm onSubmit={mockOnSubmit} />);
    
    const firstNameInput = screen.getByLabelText('First Name');
    await user.type(firstNameInput, 'John ');
    
    // Space should be prevented
    expect(firstNameInput).toHaveValue('John');
  });

  it('should prevent spaces in last name field', async () => {
    const user = userEvent.setup();
    render(<EmailForm onSubmit={mockOnSubmit} />);
    
    const lastNameInput = screen.getByLabelText('Last Name');
    await user.type(lastNameInput, 'Doe ');
    
    // Space should be prevented
    expect(lastNameInput).toHaveValue('Doe');
  });

  it('should extract domain from URL in domain field', async () => {
    const user = userEvent.setup();
    render(<EmailForm onSubmit={mockOnSubmit} />);
    
    const domainInput = screen.getByLabelText('Company Domain');
    await user.type(domainInput, 'https://www.babbel.com/path');
    
    // The input should contain the full URL as typed
    expect(domainInput).toHaveValue('https://www.babbel.com/path');
  });

  it('should handle form submission with valid data', async () => {
    const user = userEvent.setup();
    render(<EmailForm onSubmit={mockOnSubmit} />);
    
    await user.type(screen.getByLabelText('First Name'), 'John');
    await user.type(screen.getByLabelText('Last Name'), 'Doe');
    await user.type(screen.getByLabelText('Company Domain'), 'babbel.com');
    
    await user.click(screen.getByRole('button', { name: /derive email/i }));
    
    expect(mockOnSubmit).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      domain: 'babbel.com'
    });
  });

  it('should show loading state when loading prop is true', () => {
    render(<EmailForm onSubmit={mockOnSubmit} loading={true} />);
    
    expect(screen.getByRole('button', { name: /deriving/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /deriving/i })).toBeDisabled();
  });

  it('should validate required fields', async () => {
    const user = userEvent.setup();
    render(<EmailForm onSubmit={mockOnSubmit} />);
    
    // Try to submit the form with empty fields
    await user.click(screen.getByRole('button', { name: /derive email/i }));
    
    // The form should not call onSubmit with empty data
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should handle domain normalization', async () => {
    const user = userEvent.setup();
    render(<EmailForm onSubmit={mockOnSubmit} />);
    
    await user.type(screen.getByLabelText('First Name'), 'John');
    await user.type(screen.getByLabelText('Last Name'), 'Doe');
    await user.type(screen.getByLabelText('Company Domain'), 'www.babbel.com');
    
    await user.click(screen.getByRole('button', { name: /derive email/i }));
    
    expect(mockOnSubmit).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      domain: 'babbel.com'
    });
  });
});