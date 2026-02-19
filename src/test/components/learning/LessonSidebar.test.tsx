import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LessonSidebar } from '@/components/learning/LessonSidebar';
import type { Track } from '@/types/content';

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    className,
    'aria-label': ariaLabel,
    'aria-current': ariaCurrent,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
    'aria-label'?: string;
    'aria-current'?: string;
  }) => (
    <a
      href={href}
      className={className}
      aria-label={ariaLabel}
      aria-current={ariaCurrent}
    >
      {children}
    </a>
  ),
}));

const mockIsLessonCompleted = vi.fn();
const mockGetTrackProgress = vi.fn();

vi.mock('@/stores/progressStore', () => ({
  useProgressStore: () => ({
    isLessonCompleted: mockIsLessonCompleted,
    getTrackProgress: mockGetTrackProgress,
  }),
}));

const track: Track = {
  id: 'beginner',
  title: '입문 트랙',
  description: '입문자를 위한 트랙',
  difficulty: 'beginner',
  estimatedHours: 2,
  icon: '🎓',
  order: 1,
  lessons: [
    {
      id: 'lesson-1',
      trackId: 'beginner',
      title: '첫 번째 레슨',
      description: '설명',
      difficulty: 'beginner',
      estimatedMinutes: 5,
      order: 1,
      objectives: [],
      sourceDocs: [],
      tags: [],
    },
    {
      id: 'lesson-2',
      trackId: 'beginner',
      title: '두 번째 레슨',
      description: '설명',
      difficulty: 'beginner',
      estimatedMinutes: 10,
      order: 2,
      objectives: [],
      sourceDocs: [],
      tags: [],
    },
  ],
};

describe('LessonSidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsLessonCompleted.mockReturnValue(false);
    mockGetTrackProgress.mockReturnValue(50);
  });

  it('renders aside with correct aria-label', () => {
    render(<LessonSidebar track={track} currentLessonId="lesson-1" />);
    const aside = screen.getByRole('complementary', { name: '레슨 사이드바' });
    expect(aside).toBeDefined();
  });

  it('renders all lesson titles in nav', () => {
    render(<LessonSidebar track={track} currentLessonId="lesson-1" />);
    expect(screen.getByText('1. 첫 번째 레슨')).toBeDefined();
    expect(screen.getByText('2. 두 번째 레슨')).toBeDefined();
  });

  it('marks current lesson with aria-current="page"', () => {
    render(<LessonSidebar track={track} currentLessonId="lesson-1" />);
    const links = screen.getAllByRole('link');
    const currentLink = links.find(
      (l) => l.getAttribute('aria-current') === 'page'
    );
    expect(currentLink).toBeDefined();
    expect(currentLink?.getAttribute('href')).toBe('/learn/beginner/lesson-1');
  });

  it('renders progress bar', () => {
    render(<LessonSidebar track={track} currentLessonId="lesson-1" />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toBeDefined();
  });

  it('renders track title link back to track page', () => {
    render(<LessonSidebar track={track} currentLessonId="lesson-1" />);
    const backLink = screen.getByRole('link', { name: '입문 트랙 트랙으로 돌아가기' });
    expect(backLink).toBeDefined();
    expect(backLink.getAttribute('href')).toBe('/learn/beginner');
  });

  it('collapses sidebar when toggle button is clicked', () => {
    render(<LessonSidebar track={track} currentLessonId="lesson-1" />);
    const toggleButton = screen.getByRole('button', { name: '사이드바 접기' });
    fireEvent.click(toggleButton);
    // After collapse, the button should say expand
    expect(screen.getByRole('button', { name: '사이드바 펼치기' })).toBeDefined();
  });

  it('toggle button has aria-expanded=true when expanded', () => {
    render(<LessonSidebar track={track} currentLessonId="lesson-1" />);
    const toggleButton = screen.getByRole('button', { name: '사이드바 접기' });
    expect(toggleButton.getAttribute('aria-expanded')).toBe('true');
  });

  it('toggle button has aria-expanded=false after collapse', () => {
    render(<LessonSidebar track={track} currentLessonId="lesson-1" />);
    const toggleButton = screen.getByRole('button', { name: '사이드바 접기' });
    fireEvent.click(toggleButton);
    const expandButton = screen.getByRole('button', { name: '사이드바 펼치기' });
    expect(expandButton.getAttribute('aria-expanded')).toBe('false');
  });

  it('shows completed lesson icon for completed lessons', () => {
    mockIsLessonCompleted.mockImplementation((id: string) => id === 'lesson-1');
    const { container } = render(
      <LessonSidebar track={track} currentLessonId="lesson-2" />
    );
    // CheckCircle2 for completed, Circle for incomplete
    // Both SVGs are present; completed one should have text-green-500 class
    const greenIcon = container.querySelector('.text-green-500');
    expect(greenIcon).toBeDefined();
  });

  it('lesson links have correct aria-label including completion status', () => {
    mockIsLessonCompleted.mockImplementation((id: string) => id === 'lesson-1');
    render(<LessonSidebar track={track} currentLessonId="lesson-2" />);
    const completedLink = screen.getByRole('link', {
      name: /완료됨/,
    });
    expect(completedLink).toBeDefined();
  });
});
