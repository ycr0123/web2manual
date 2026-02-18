import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CodeBlock } from '@/components/learning/CodeBlock';

describe('CodeBlock', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      writable: true,
      configurable: true,
    });
  });

  it('올바른 language 클래스로 코드를 렌더링한다', () => {
    render(<CodeBlock language="typescript">const x = 1;</CodeBlock>);
    const code = document.querySelector('code');
    expect(code).not.toBeNull();
    expect(code!.className).toContain('language-typescript');
  });

  it('language가 지정되지 않으면 기본값 bash를 사용한다', () => {
    render(<CodeBlock>echo hello</CodeBlock>);
    const code = document.querySelector('code');
    expect(code!.className).toContain('language-bash');
  });

  it('title이 있으면 타이틀 바를 렌더링한다', () => {
    render(<CodeBlock title="example.ts" language="typescript">code</CodeBlock>);
    expect(screen.getByText('example.ts')).toBeDefined();
    expect(screen.getByText('typescript')).toBeDefined();
  });

  // UT-09: 복사 버튼 클릭 시 navigator.clipboard.writeText 호출
  it('UT-09: 복사 버튼 클릭 시 navigator.clipboard.writeText가 호출된다', async () => {
    render(<CodeBlock language="bash">npm install</CodeBlock>);
    const copyButton = screen.getByRole('button', { name: '코드 복사' });
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('npm install');
    });
  });

  it('복사 완료 후 aria-label이 "복사됨"으로 변경된다', async () => {
    render(<CodeBlock language="bash">npm install</CodeBlock>);
    const copyButton = screen.getByRole('button', { name: '코드 복사' });
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '복사됨' })).toBeDefined();
    });
  });

  it('children이 문자열일 때 텍스트를 정확하게 복사한다', async () => {
    render(<CodeBlock>hello world</CodeBlock>);
    const copyButton = screen.getByRole('button', { name: '코드 복사' });
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('hello world');
    });
  });
});
