import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from '../Modal';

describe('Modal', () => {
  const mockOnClose = vi.fn();
  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render when open', () => {
    render(<Modal {...defaultProps}><div>Modal Content</div></Modal>);

    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(<Modal {...defaultProps} isOpen={false}><div>Modal Content</div></Modal>);

    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });

  it('should call onClose when clicking close button', async () => {
    const user = userEvent.setup();
    render(<Modal {...defaultProps}><div>Modal Content</div></Modal>);

    const closeButton = screen.getByLabelText('Close modal');
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when pressing Escape key', async () => {
    const user = userEvent.setup();
    render(<Modal {...defaultProps}><div>Modal Content</div></Modal>);

    await user.keyboard('{Escape}');

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should not call onClose when pressing other keys', async () => {
    const user = userEvent.setup();
    render(<Modal {...defaultProps}><div>Modal Content</div></Modal>);

    await user.keyboard('{Enter}');
    await user.keyboard('{Space}');
    await user.keyboard('a');

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should render children correctly', () => {
    const customContent = (
      <div>
        <h2>Custom Title</h2>
        <p>Custom description</p>
        <button>Custom Button</button>
      </div>
    );

    render(<Modal {...defaultProps}>{customContent}</Modal>);

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom description')).toBeInTheDocument();
    expect(screen.getByText('Custom Button')).toBeInTheDocument();
  });

  it('should handle multiple Escape key presses', async () => {
    const user = userEvent.setup();
    render(<Modal {...defaultProps}><div>Modal Content</div></Modal>);

    await user.keyboard('{Escape}');
    await user.keyboard('{Escape}');
    await user.keyboard('{Escape}');

    expect(mockOnClose).toHaveBeenCalledTimes(3);
  });

  it('should handle onClose being undefined', () => {
    // This should not throw an error
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => render(<Modal isOpen={true} onClose={undefined as any}><div>Test</div></Modal>)).not.toThrow();
  });

  it('should handle empty children', () => {
    render(<Modal {...defaultProps}><></></Modal>);

    // Modal should still render the structure
    expect(screen.getByLabelText('Close modal')).toBeInTheDocument();
  });
});