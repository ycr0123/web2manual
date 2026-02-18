import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SimulationBadge } from '@/components/playground/SimulationBadge';

describe('SimulationBadge', () => {
  it('renders the simulation mode label', () => {
    render(<SimulationBadge />);
    expect(screen.getByText('시뮬레이션 모드')).toBeInTheDocument();
  });

  it('has correct role and aria-label', () => {
    render(<SimulationBadge />);
    const badge = screen.getByRole('status');
    expect(badge).toHaveAttribute('aria-label', '시뮬레이션 모드 활성화');
  });

  it('applies custom className', () => {
    const { container } = render(<SimulationBadge className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('is always visible (not hidden)', () => {
    render(<SimulationBadge />);
    const badge = screen.getByRole('status');
    expect(badge).not.toHaveAttribute('hidden');
    expect(badge).not.toHaveAttribute('aria-hidden', 'true');
  });
});
