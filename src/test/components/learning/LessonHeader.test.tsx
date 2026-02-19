import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LessonHeader } from '@/components/learning/LessonHeader';
import type { LessonMeta } from '@/types/content';

const baseMeta: LessonMeta = {
  id: 'lesson-1',
  trackId: 'beginner',
  title: 'Claude Code 소개',
  description: 'Claude Code가 무엇인지 배웁니다.',
  difficulty: 'beginner',
  estimatedMinutes: 10,
  order: 1,
  objectives: ['Claude Code를 이해한다', 'CLI를 설치한다'],
  sourceDocs: [],
  tags: ['기초', 'CLI'],
};

describe('LessonHeader', () => {
  it('renders lesson title and description', () => {
    render(<LessonHeader lesson={baseMeta} trackTitle="입문 트랙" />);
    expect(screen.getByRole('heading', { level: 1 })).toBeDefined();
    expect(screen.getByText('Claude Code 소개')).toBeDefined();
    expect(screen.getByText('Claude Code가 무엇인지 배웁니다.')).toBeDefined();
  });

  it('renders trackTitle as breadcrumb', () => {
    render(<LessonHeader lesson={baseMeta} trackTitle="입문 트랙" />);
    expect(screen.getByText('입문 트랙')).toBeDefined();
  });

  it('renders beginner difficulty badge', () => {
    render(<LessonHeader lesson={baseMeta} trackTitle="입문 트랙" />);
    expect(screen.getByText('입문')).toBeDefined();
  });

  it('renders intermediate difficulty badge', () => {
    render(
      <LessonHeader
        lesson={{ ...baseMeta, difficulty: 'intermediate' }}
        trackTitle="중급 트랙"
      />
    );
    expect(screen.getByText('중급')).toBeDefined();
  });

  it('renders advanced difficulty badge', () => {
    render(
      <LessonHeader
        lesson={{ ...baseMeta, difficulty: 'advanced' }}
        trackTitle="고급 트랙"
      />
    );
    expect(screen.getByText('고급')).toBeDefined();
  });

  it('renders estimated minutes', () => {
    render(<LessonHeader lesson={baseMeta} trackTitle="입문 트랙" />);
    expect(screen.getByText('약 10분')).toBeDefined();
  });

  it('renders lesson order number', () => {
    render(<LessonHeader lesson={baseMeta} trackTitle="입문 트랙" />);
    expect(screen.getByText('레슨 1')).toBeDefined();
  });

  it('renders tags when provided', () => {
    render(<LessonHeader lesson={baseMeta} trackTitle="입문 트랙" />);
    expect(screen.getByText('기초')).toBeDefined();
    expect(screen.getByText('CLI')).toBeDefined();
  });

  it('does not render tag section when tags array is empty', () => {
    render(
      <LessonHeader
        lesson={{ ...baseMeta, tags: [] }}
        trackTitle="입문 트랙"
      />
    );
    // No tag elements
    expect(screen.queryByText('기초')).toBeNull();
  });

  it('renders objectives section when objectives are provided', () => {
    render(<LessonHeader lesson={baseMeta} trackTitle="입문 트랙" />);
    expect(screen.getByText('이 레슨에서 배울 내용')).toBeDefined();
    expect(screen.getByText('Claude Code를 이해한다')).toBeDefined();
    expect(screen.getByText('CLI를 설치한다')).toBeDefined();
  });

  it('does not render objectives section when objectives array is empty', () => {
    render(
      <LessonHeader
        lesson={{ ...baseMeta, objectives: [] }}
        trackTitle="입문 트랙"
      />
    );
    expect(screen.queryByText('이 레슨에서 배울 내용')).toBeNull();
  });

  it('applies custom className', () => {
    const { container } = render(
      <LessonHeader lesson={baseMeta} trackTitle="입문 트랙" className="custom-class" />
    );
    const header = container.querySelector('header');
    expect(header?.className).toContain('custom-class');
  });
});
