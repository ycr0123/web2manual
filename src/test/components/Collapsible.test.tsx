import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Collapsible } from '@/components/learning/Collapsible';

describe('Collapsible', () => {
  // UT-13: 헤더 클릭 시 콘텐츠 가시성이 토글된다
  it('UT-13: 기본 상태에서 콘텐츠가 숨겨져 있고 클릭 시 표시된다', () => {
    render(
      <Collapsible title="더 알아보기">
        <p>숨겨진 콘텐츠</p>
      </Collapsible>
    );

    const button = screen.getByRole('button', { name: /더 알아보기/ });
    // 기본값: defaultOpen=false -> aria-expanded="false"
    expect(button.getAttribute('aria-expanded')).toBe('false');

    // 콘텐츠 영역이 aria-hidden="true"
    const contentRegion = document.getElementById('collapsible-content-더 알아보기');
    expect(contentRegion).not.toBeNull();
    expect(contentRegion!.getAttribute('aria-hidden')).toBe('true');

    // 클릭하여 열기
    fireEvent.click(button);
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(contentRegion!.getAttribute('aria-hidden')).toBe('false');
  });

  it('두 번 클릭하면 다시 닫힌다', () => {
    render(
      <Collapsible title="토글 테스트">
        <p>콘텐츠</p>
      </Collapsible>
    );

    const button = screen.getByRole('button', { name: /토글 테스트/ });

    // 열기
    fireEvent.click(button);
    expect(button.getAttribute('aria-expanded')).toBe('true');

    // 닫기
    fireEvent.click(button);
    expect(button.getAttribute('aria-expanded')).toBe('false');
  });

  it('defaultOpen=true일 때 초기 상태가 열려 있다', () => {
    render(
      <Collapsible title="열린 섹션" defaultOpen={true}>
        <p>보이는 콘텐츠</p>
      </Collapsible>
    );

    const button = screen.getByRole('button', { name: /열린 섹션/ });
    expect(button.getAttribute('aria-expanded')).toBe('true');

    const contentRegion = document.getElementById('collapsible-content-열린 섹션');
    expect(contentRegion!.getAttribute('aria-hidden')).toBe('false');
  });

  it('화살표 아이콘이 열림 상태에서 rotate-90 클래스를 가진다', () => {
    render(
      <Collapsible title="아이콘 테스트">
        <p>내용</p>
      </Collapsible>
    );

    const button = screen.getByRole('button', { name: /아이콘 테스트/ });
    // SVG 아이콘은 button 내부의 svg 요소
    const icon = button.querySelector('svg');
    expect(icon).not.toBeNull();

    // 닫힌 상태: rotate-90 없음
    expect(icon!.className.baseVal || icon!.getAttribute('class') || '').not.toContain('rotate-90');

    // 열린 상태
    fireEvent.click(button);
    expect(icon!.className.baseVal || icon!.getAttribute('class') || '').toContain('rotate-90');
  });

  it('children 콘텐츠를 렌더링한다', () => {
    render(
      <Collapsible title="섹션" defaultOpen={true}>
        <p>내부 콘텐츠입니다</p>
      </Collapsible>
    );

    expect(screen.getByText('내부 콘텐츠입니다')).toBeDefined();
  });
});
