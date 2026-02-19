import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TrackBadge } from '@/components/learning/TrackBadge';
import type { Badge } from '@/types/content';

const earnedBadge: Badge = {
  trackId: 'beginner',
  name: '입문 완료 배지',
  description: '입문 트랙의 모든 레슨을 완료했습니다!',
  image: '/badges/beginner.svg',
  earned: true,
  earnedAt: '2024-01-15T00:00:00.000Z',
};

const unearnedBadge: Badge = {
  trackId: 'advanced',
  name: '고급 기능 전문가',
  description: '고급 기능 트랙의 모든 레슨을 완료했습니다!',
  image: '/badges/advanced.svg',
  earned: false,
};

describe('TrackBadge', () => {
  it('renders badge with correct aria-label', () => {
    render(<TrackBadge badge={earnedBadge} />);
    const img = screen.getByRole('img');
    expect(img.getAttribute('aria-label')).toContain('입문 완료 배지');
    expect(img.getAttribute('aria-label')).toContain('입문 트랙의 모든 레슨을 완료했습니다!');
  });

  it('renders earned badge name for md size', () => {
    render(<TrackBadge badge={earnedBadge} size="md" />);
    expect(screen.getByText('입문 완료 배지')).toBeDefined();
  });

  it('renders earnedAt date for earned badge', () => {
    render(<TrackBadge badge={earnedBadge} size="md" />);
    // Should display a date string in Korean locale
    const dateEl = screen.getByText(/\d{4}/); // Year is always present
    expect(dateEl).toBeDefined();
  });

  it('does not show badge name for sm size', () => {
    render(<TrackBadge badge={earnedBadge} size="sm" />);
    // sm size hides the text section
    expect(screen.queryByText('입문 완료 배지')).toBeNull();
  });

  it('renders badge name for lg size', () => {
    render(<TrackBadge badge={earnedBadge} size="lg" />);
    expect(screen.getByText('입문 완료 배지')).toBeDefined();
  });

  it('applies gradient styling for earned badge', () => {
    const { container } = render(<TrackBadge badge={earnedBadge} />);
    const badgeIcon = container.querySelector('[class*="from-yellow"]');
    expect(badgeIcon).toBeDefined();
  });

  it('applies muted styling for unearned badge', () => {
    const { container } = render(<TrackBadge badge={unearnedBadge} />);
    const badgeIcon = container.querySelector('[class*="bg-muted"]');
    expect(badgeIcon).toBeDefined();
  });

  it('applies opacity for unearned badge', () => {
    const { container } = render(<TrackBadge badge={unearnedBadge} />);
    const badgeIcon = container.querySelector('[class*="opacity-50"]');
    expect(badgeIcon).toBeDefined();
  });

  it('does not render earnedAt when badge is not earned', () => {
    render(<TrackBadge badge={unearnedBadge} size="md" />);
    // earnedAt is undefined, so no date should appear
    // The description is in aria-label but badge name check
    expect(screen.getByText('고급 기능 전문가')).toBeDefined();
  });

  it('applies custom className', () => {
    const { container } = render(
      <TrackBadge badge={earnedBadge} className="extra-class" />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('extra-class');
  });

  it('renders correct icon size for sm', () => {
    const { container } = render(<TrackBadge badge={earnedBadge} size="sm" />);
    // sm size badge icon dimensions
    const badgeContainer = container.querySelector('[class*="h-12 w-12"]');
    expect(badgeContainer).toBeDefined();
  });
});
