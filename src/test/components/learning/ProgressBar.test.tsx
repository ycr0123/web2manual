import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProgressBar } from '@/components/learning/ProgressBar';

describe('ProgressBar', () => {
  it('renders with required value prop and shows percentage', () => {
    render(<ProgressBar value={50} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toBeDefined();
    expect(progressbar.getAttribute('aria-valuenow')).toBe('50');
    expect(screen.getByText('50%')).toBeDefined();
  });

  it('renders label when provided', () => {
    render(<ProgressBar value={75} label="트랙 진행률" />);
    expect(screen.getByText('트랙 진행률')).toBeDefined();
    expect(screen.getByText('75%')).toBeDefined();
  });

  it('hides percentage when showPercent is false', () => {
    render(<ProgressBar value={60} showPercent={false} />);
    expect(screen.queryByText('60%')).toBeNull();
  });

  it('applies aria attributes correctly', () => {
    render(<ProgressBar value={30} label="진행률" />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar.getAttribute('aria-valuemin')).toBe('0');
    expect(progressbar.getAttribute('aria-valuemax')).toBe('100');
    expect(progressbar.getAttribute('aria-valuenow')).toBe('30');
    expect(progressbar.getAttribute('aria-label')).toBe('진행률');
  });

  it('caps value at 100% when value exceeds max', () => {
    render(<ProgressBar value={150} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar.getAttribute('aria-valuenow')).toBe('100');
    expect(screen.getByText('100%')).toBeDefined();
  });

  it('calculates percentage correctly with custom max', () => {
    render(<ProgressBar value={3} max={10} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar.getAttribute('aria-valuenow')).toBe('30');
    expect(screen.getByText('30%')).toBeDefined();
  });

  it('shows 0% when value is 0', () => {
    render(<ProgressBar value={0} />);
    expect(screen.getByText('0%')).toBeDefined();
  });

  it('renders without label or percentage when both are disabled', () => {
    const { container } = render(<ProgressBar value={50} showPercent={false} />);
    // No label, no percentage text
    const labelArea = container.querySelector('.flex.items-center.justify-between');
    expect(labelArea).toBeNull();
  });

  it('applies correct size class for sm size', () => {
    const { container } = render(<ProgressBar value={50} size="sm" />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar.className).toContain('h-1.5');
  });

  it('applies correct size class for lg size', () => {
    render(<ProgressBar value={50} size="lg" />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar.className).toContain('h-3');
  });

  it('shows green color when progress is 100%', () => {
    const { container } = render(<ProgressBar value={100} />);
    const progressFill = container.querySelector('[style*="width: 100%"]');
    expect(progressFill?.className).toContain('bg-green-500');
  });

  it('aria-label defaults to percentage when no label provided', () => {
    render(<ProgressBar value={45} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar.getAttribute('aria-label')).toContain('45%');
  });
});
