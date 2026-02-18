import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LessonNav } from '@/components/learning/LessonNav';
import type { LessonNavItem } from '@/types/content';

// next/link 모킹 (href를 a 태그로 렌더링)
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

const prevLesson: LessonNavItem = {
  id: 'overview',
  trackId: 'beginner',
  title: 'Claude Code란 무엇인가',
};

const nextLesson: LessonNavItem = {
  id: 'desktop-setup',
  trackId: 'beginner',
  title: '데스크톱 앱 & IDE 연동',
};

describe('LessonNav', () => {
  // UT-14: prevLesson이 undefined이면 이전 버튼이 없다
  it('UT-14: prevLesson이 undefined이면 이전 레슨 링크가 렌더링되지 않는다', () => {
    render(<LessonNav nextLesson={nextLesson} />);

    // 다음 링크는 있음
    expect(screen.getByLabelText(`다음 레슨: ${nextLesson.title}`)).toBeDefined();

    // 이전 링크는 없음
    expect(screen.queryByLabelText(/이전 레슨/)).toBeNull();
  });

  // UT-15: nextLesson이 undefined이면 다음 버튼이 없다
  it('UT-15: nextLesson이 undefined이면 다음 레슨 링크가 렌더링되지 않는다', () => {
    render(<LessonNav prevLesson={prevLesson} />);

    // 이전 링크는 있음
    expect(screen.getByLabelText(`이전 레슨: ${prevLesson.title}`)).toBeDefined();

    // 다음 링크는 없음
    expect(screen.queryByLabelText(/다음 레슨/)).toBeNull();
  });

  it('prev와 next가 모두 있으면 양쪽 링크가 올바른 href로 렌더링된다', () => {
    render(<LessonNav prevLesson={prevLesson} nextLesson={nextLesson} />);

    const prevLink = screen.getByLabelText(`이전 레슨: ${prevLesson.title}`);
    expect(prevLink.getAttribute('href')).toBe('/learn/beginner/overview');

    const nextLink = screen.getByLabelText(`다음 레슨: ${nextLesson.title}`);
    expect(nextLink.getAttribute('href')).toBe('/learn/beginner/desktop-setup');
  });

  it('이전 링크에 "이전" 텍스트와 레슨 제목이 표시된다', () => {
    render(<LessonNav prevLesson={prevLesson} nextLesson={nextLesson} />);

    expect(screen.getByText('이전')).toBeDefined();
    expect(screen.getByText('Claude Code란 무엇인가')).toBeDefined();
  });

  it('다음 링크에 "다음" 텍스트와 레슨 제목이 표시된다', () => {
    render(<LessonNav prevLesson={prevLesson} nextLesson={nextLesson} />);

    expect(screen.getByText('다음')).toBeDefined();
    expect(screen.getByText('데스크톱 앱 & IDE 연동')).toBeDefined();
  });

  it('prev와 next 모두 없으면 null을 렌더링한다', () => {
    const { container } = render(<LessonNav />);
    expect(container.innerHTML).toBe('');
  });

  it('nav 요소에 접근성 레이블이 있다', () => {
    render(<LessonNav prevLesson={prevLesson} nextLesson={nextLesson} />);
    const nav = screen.getByRole('navigation');
    expect(nav.getAttribute('aria-label')).toBe('레슨 이동');
  });
});
