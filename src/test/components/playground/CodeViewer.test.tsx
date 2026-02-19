import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CodeViewer } from '@/components/playground/CodeViewer';
import type { ProjectFile } from '@/types/playground';

const mockFile: ProjectFile = {
  path: 'src/index.js',
  name: 'index.js',
  content: 'console.log("Hello, World!");',
  language: 'javascript',
};

const mockFileWithBug: ProjectFile = {
  path: 'src/buggy.py',
  name: 'buggy.py',
  content: 'print("bug here")',
  language: 'python',
  hasBug: true,
  bugDescription: '변수 이름이 잘못되었습니다.',
};

describe('CodeViewer', () => {
  it('renders placeholder when file is null', () => {
    render(<CodeViewer file={null} />);
    expect(
      screen.getByText('파일을 선택하면 코드가 표시됩니다')
    ).toBeInTheDocument();
  });

  it('renders file path in header when file is provided', () => {
    render(<CodeViewer file={mockFile} />);
    expect(screen.getByText('src/index.js')).toBeInTheDocument();
  });

  it('renders language label in header', () => {
    render(<CodeViewer file={mockFile} />);
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
  });

  it('renders file content in code element', () => {
    render(<CodeViewer file={mockFile} />);
    expect(screen.getByText('console.log("Hello, World!");')).toBeInTheDocument();
  });

  it('renders pre element with correct aria-label', () => {
    render(<CodeViewer file={mockFile} />);
    const pre = screen.getByRole('region', { name: 'index.js 코드' });
    expect(pre).toBeInTheDocument();
  });

  it('does not render bug badge when hasBug is false', () => {
    render(<CodeViewer file={mockFile} />);
    expect(screen.queryByText('버그 있음')).not.toBeInTheDocument();
  });

  it('renders bug badge when hasBug is true', () => {
    render(<CodeViewer file={mockFileWithBug} />);
    expect(screen.getByText('버그 있음')).toBeInTheDocument();
  });

  it('renders bug description when hasBug and bugDescription are set', () => {
    render(<CodeViewer file={mockFileWithBug} />);
    expect(screen.getByText('변수 이름이 잘못되었습니다.')).toBeInTheDocument();
  });

  it('renders Python language label for python files', () => {
    render(<CodeViewer file={mockFileWithBug} />);
    expect(screen.getByText('Python')).toBeInTheDocument();
  });

  it('renders TypeScript label for typescript language', () => {
    const tsFile: ProjectFile = {
      ...mockFile,
      language: 'typescript',
      path: 'src/app.ts',
      name: 'app.ts',
    };
    render(<CodeViewer file={tsFile} />);
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('applies custom className to root element', () => {
    const { container } = render(<CodeViewer file={mockFile} className="custom-viewer" />);
    expect(container.firstChild).toHaveClass('custom-viewer');
  });

  it('applies custom className to placeholder when file is null', () => {
    const { container } = render(
      <CodeViewer file={null} className="custom-placeholder" />
    );
    expect(container.firstChild).toHaveClass('custom-placeholder');
  });
});
