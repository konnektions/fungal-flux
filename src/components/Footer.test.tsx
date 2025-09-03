import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Footer from './Footer';

describe('Footer', () => {
  it('calls onNavigate with "growing-guides" when "Growing Guides" is clicked', () => {
    const handleNavigate = vi.fn();
    render(<Footer onNavigate={handleNavigate} />);

    const growingGuidesButton = screen.getByText('Growing Guides');
    fireEvent.click(growingGuidesButton);

    expect(handleNavigate).toHaveBeenCalledWith('growing-guides');
  });

  it('calls onNavigate with "shipping-info" when "Shipping Info" is clicked', () => {
    const handleNavigate = vi.fn();
    render(<Footer onNavigate={handleNavigate} />);

    const shippingInfoButton = screen.getByText('Shipping Info');
    fireEvent.click(shippingInfoButton);

    expect(handleNavigate).toHaveBeenCalledWith('shipping-info');
  });
});
