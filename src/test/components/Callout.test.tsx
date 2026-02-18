import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Callout } from '@/components/learning/Callout';

describe('Callout', () => {
  // UT-10: warning 타입이 yellow/warning 스타일로 렌더링된다
  it('UT-10: warning 타입이 warning 스타일로 렌더링된다', () => {
    render(<Callout type="warning">주의 내용</Callout>);
    const note = screen.getByRole('note');
    expect(note.className).toContain('yellow');
    expect(screen.getByText('주의')).toBeDefined();
  });

  it('tip 타입이 green/tip 스타일로 렌더링된다', () => {
    render(<Callout type="tip">팁 내용</Callout>);
    const note = screen.getByRole('note');
    expect(note.className).toContain('green');
    expect(screen.getByText('팁')).toBeDefined();
  });

  it('note 타입이 blue/note 스타일로 렌더링된다', () => {
    render(<Callout type="note">참고 내용</Callout>);
    const note = screen.getByRole('note');
    expect(note.className).toContain('blue');
    expect(screen.getByText('참고')).toBeDefined();
  });

  it('danger 타입이 red/danger 스타일로 렌더링된다', () => {
    render(<Callout type="danger">위험 내용</Callout>);
    const note = screen.getByRole('note');
    expect(note.className).toContain('red');
    expect(screen.getByText('경고')).toBeDefined();
  });

  it('children 콘텐츠를 렌더링한다', () => {
    render(<Callout type="note">이것은 중요한 정보입니다.</Callout>);
    expect(screen.getByText('이것은 중요한 정보입니다.')).toBeDefined();
  });

  it('커스텀 title이 있을 때 기본 label 대신 표시한다', () => {
    render(<Callout type="note" title="커스텀 제목">내용</Callout>);
    expect(screen.getByText('커스텀 제목')).toBeDefined();
    const note = screen.getByRole('note');
    expect(note.getAttribute('aria-label')).toBe('커스텀 제목');
  });

  it('title이 없을 때 기본 label을 aria-label로 사용한다', () => {
    render(<Callout type="warning">내용</Callout>);
    const note = screen.getByRole('note');
    expect(note.getAttribute('aria-label')).toBe('주의');
  });
});
