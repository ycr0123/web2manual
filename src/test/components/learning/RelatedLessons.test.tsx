import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RelatedLessons } from '@/components/learning/RelatedLessons';
import type { LessonMeta } from '@/types/content';

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    className,
    'aria-label': ariaLabel,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
    'aria-label'?: string;
  }) => (
    <a href={href} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  ),
}));

const makeMeta = (overrides: Partial<LessonMeta> & { id: string }): LessonMeta => ({
  id: overrides.id,
  trackId: overrides.trackId ?? 'beginner',
  title: overrides.title ?? `레슨 ${overrides.id}`,
  description: '설명',
  difficulty: overrides.difficulty ?? 'beginner',
  estimatedMinutes: overrides.estimatedMinutes ?? 5,
  order: overrides.order ?? 1,
  objectives: [],
  sourceDocs: [],
  tags: [],
  ...overrides,
});

const lessons: LessonMeta[] = [
  makeMeta({ id: 'lesson-1', title: '첫 번째 레슨', order: 1 }),
  makeMeta({ id: 'lesson-2', title: '두 번째 레슨', order: 2, difficulty: 'intermediate', estimatedMinutes: 15 }),
  makeMeta({ id: 'lesson-3', title: '세 번째 레슨', order: 3, difficulty: 'advanced', estimatedMinutes: 20 }),
  makeMeta({ id: 'lesson-4', title: '네 번째 레슨', order: 4 }),
];

describe('RelatedLessons', () => {
  it('renders related lessons excluding current lesson', () => {
    render(<RelatedLessons lessons={lessons} currentLessonId="lesson-1" />);
    expect(screen.queryByText('첫 번째 레슨')).toBeNull();
    expect(screen.getByText('두 번째 레슨')).toBeDefined();
  });

  it('renders at most 3 related lessons', () => {
    render(<RelatedLessons lessons={lessons} currentLessonId="lesson-1" />);
    // lessons 2, 3, 4 are related; only 3 shown
    expect(screen.getByText('두 번째 레슨')).toBeDefined();
    expect(screen.getByText('세 번째 레슨')).toBeDefined();
    expect(screen.getByText('네 번째 레슨')).toBeDefined();
  });

  it('returns null when no related lessons exist', () => {
    const { container } = render(
      <RelatedLessons lessons={[lessons[0]]} currentLessonId="lesson-1" />
    );
    expect(container.innerHTML).toBe('');
  });

  it('shows correct difficulty labels', () => {
    render(<RelatedLessons lessons={lessons} currentLessonId="lesson-1" />);
    expect(screen.getByText('중급')).toBeDefined();
    expect(screen.getByText('고급')).toBeDefined();
  });

  it('shows estimated minutes', () => {
    render(<RelatedLessons lessons={lessons} currentLessonId="lesson-1" />);
    expect(screen.getByText('15분')).toBeDefined();
    expect(screen.getByText('20분')).toBeDefined();
  });

  it('renders links with correct href including trackId', () => {
    render(
      <RelatedLessons
        lessons={[makeMeta({ id: 'lesson-2', trackId: 'beginner', title: '두 번째 레슨' })]}
        currentLessonId="lesson-1"
      />
    );
    const link = screen.getByRole('link', { name: /두 번째 레슨/ });
    expect(link.getAttribute('href')).toBe('/learn/beginner/lesson-2');
  });

  it('renders nav with correct aria-label', () => {
    render(<RelatedLessons lessons={lessons} currentLessonId="lesson-1" />);
    const nav = screen.getByRole('navigation', { name: '관련 레슨' });
    expect(nav).toBeDefined();
  });

  it('renders section heading', () => {
    render(<RelatedLessons lessons={lessons} currentLessonId="lesson-1" />);
    expect(screen.getByText('관련 레슨')).toBeDefined();
  });

  it('applies custom className', () => {
    const { container } = render(
      <RelatedLessons
        lessons={lessons}
        currentLessonId="lesson-1"
        className="custom-class"
      />
    );
    const nav = container.querySelector('nav');
    expect(nav?.className).toContain('custom-class');
  });

  it('link aria-label includes title, difficulty, and minutes', () => {
    render(
      <RelatedLessons
        lessons={[makeMeta({ id: 'lesson-2', trackId: 'beginner', title: '두 번째 레슨', difficulty: 'intermediate', estimatedMinutes: 15 })]}
        currentLessonId="lesson-1"
      />
    );
    const link = screen.getByRole('link');
    const ariaLabel = link.getAttribute('aria-label') ?? '';
    expect(ariaLabel).toContain('두 번째 레슨');
    expect(ariaLabel).toContain('중급');
    expect(ariaLabel).toContain('15');
  });
});
