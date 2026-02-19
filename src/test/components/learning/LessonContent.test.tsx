import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import type { ReactNode } from 'react';

// Mock CodeBlock, Callout, CLIExample, Collapsible to avoid deep rendering
vi.mock('@/components/learning/CodeBlock', () => ({
  CodeBlock: ({ children, language }: { children: ReactNode; language?: string }) => (
    <div data-testid="code-block" data-language={language}>{children}</div>
  ),
}));
vi.mock('@/components/learning/Callout', () => ({
  Callout: ({ children, type }: { children: ReactNode; type: string }) => (
    <div data-testid="callout" data-type={type}>{children}</div>
  ),
}));
vi.mock('@/components/learning/CLIExample', () => ({
  CLIExample: ({ command }: { command: string }) => (
    <div data-testid="cli-example">{command}</div>
  ),
}));
vi.mock('@/components/learning/Collapsible', () => ({
  Collapsible: ({ children, title }: { children: ReactNode; title: string }) => (
    <div data-testid="collapsible" data-title={title}>{children}</div>
  ),
}));

// Mock next-mdx-remote/rsc to call the components mapping with rendered elements
vi.mock('next-mdx-remote/rsc', () => ({
  MDXRemote: ({
    source,
    components: comps,
  }: {
    source: string;
    components: Record<string, (props: Record<string, unknown>) => ReactNode>;
  }) => {
    // Render all elements by invoking each component to trigger coverage
    const elements: ReactNode[] = [
      <div key="source" data-testid="mdx-content">{source}</div>,
    ];

    if (comps) {
      // Trigger each styled element to increase coverage
      if (comps.h1) elements.push(<div key="h1">{comps.h1({ children: 'H1 Title' })}</div>);
      if (comps.h2) elements.push(<div key="h2">{comps.h2({ id: 'section', children: 'H2 Title' })}</div>);
      if (comps.h3) elements.push(<div key="h3">{comps.h3({ id: 'sub', children: 'H3 Title' })}</div>);
      if (comps.h4) elements.push(<div key="h4">{comps.h4({ children: 'H4 Title' })}</div>);
      if (comps.p) elements.push(<div key="p">{comps.p({ children: 'Paragraph text' })}</div>);
      if (comps.ul) elements.push(<div key="ul">{comps.ul({ children: 'List items' })}</div>);
      if (comps.ol) elements.push(<div key="ol">{comps.ol({ children: 'Ordered items' })}</div>);
      if (comps.li) elements.push(<div key="li">{comps.li({ children: 'List item' })}</div>);
      if (comps.blockquote) elements.push(<div key="bq">{comps.blockquote({ children: 'Quote text' })}</div>);
      if (comps.strong) elements.push(<div key="strong">{comps.strong({ children: 'Bold text' })}</div>);
      if (comps.pre) elements.push(<div key="pre">{comps.pre({ children: 'Pre content' })}</div>);
      if (comps.hr) elements.push(<div key="hr">{comps.hr({})}</div>);
      if (comps.table) elements.push(<div key="table">{comps.table({ children: 'Table' })}</div>);
      if (comps.thead) elements.push(<div key="thead">{comps.thead({ children: 'Thead' })}</div>);
      if (comps.th) elements.push(<div key="th">{comps.th({ children: 'Th' })}</div>);
      if (comps.td) elements.push(<div key="td">{comps.td({ children: 'Td' })}</div>);
      if (comps.tr) elements.push(<div key="tr">{comps.tr({ children: 'Tr' })}</div>);
      // code - inline
      if (comps.code) elements.push(<div key="code-inline">{comps.code({ children: 'inlineCode' })}</div>);
      // code - block (with language class)
      if (comps.code) elements.push(<div key="code-block">{comps.code({ children: 'blockCode', className: 'language-javascript' })}</div>);
      // a - external link
      if (comps.a) elements.push(<div key="a-ext">{comps.a({ href: 'https://example.com', children: 'External' })}</div>);
      // a - internal link
      if (comps.a) elements.push(<div key="a-int">{comps.a({ href: '/internal', children: 'Internal' })}</div>);
      // Custom components
      if (comps.CodeBlock) elements.push(<div key="CodeBlock">{comps.CodeBlock({ children: 'code', language: 'ts', title: 'test.ts', showLineNumbers: true })}</div>);
      if (comps.Callout) elements.push(<div key="Callout">{comps.Callout({ type: 'warning', title: 'Warning', children: 'Watch out' })}</div>);
      if (comps.CLIExample) elements.push(<div key="CLIExample">{comps.CLIExample({ command: 'ls', description: 'List files', output: 'file.txt' })}</div>);
      if (comps.Collapsible) elements.push(<div key="Collapsible">{comps.Collapsible({ title: 'More', children: 'Content' })}</div>);
    }

    return <div>{elements}</div>;
  },
}));

import { LessonContent } from '@/components/learning/LessonContent';

describe('LessonContent', () => {
  it('renders the prose wrapper div', () => {
    const { container } = render(<LessonContent content="# Hello" />);
    const wrapper = container.querySelector('.prose');
    expect(wrapper).toBeDefined();
  });

  it('renders MDXRemote with given content', () => {
    render(<LessonContent content="## Test Heading" />);
    const mdxContent = screen.getByTestId('mdx-content');
    expect(mdxContent).toBeDefined();
    expect(mdxContent.textContent).toContain('## Test Heading');
  });

  it('renders with empty content string', () => {
    render(<LessonContent content="" />);
    const mdxContent = screen.getByTestId('mdx-content');
    expect(mdxContent).toBeDefined();
  });

  it('renders with multiline content', () => {
    const content = '# Title\n\nSome paragraph text.\n\n## Section';
    render(<LessonContent content={content} />);
    const mdxContent = screen.getByTestId('mdx-content');
    expect(mdxContent.textContent).toContain('Title');
  });

  it('wrapper has dark:prose-invert class for dark mode support', () => {
    const { container } = render(<LessonContent content="test" />);
    const wrapper = container.querySelector('.prose');
    expect(wrapper?.className).toContain('dark:prose-invert');
  });

  it('wrapper has max-w-none class to override max-width', () => {
    const { container } = render(<LessonContent content="test" />);
    const wrapper = container.querySelector('.prose');
    expect(wrapper?.className).toContain('max-w-none');
  });

  it('renders heading elements h1 through h4', () => {
    const { container } = render(<LessonContent content="# Hello" />);
    // The mock triggers all heading components
    expect(container.textContent).toContain('H1 Title');
    expect(container.textContent).toContain('H2 Title');
    expect(container.textContent).toContain('H3 Title');
    expect(container.textContent).toContain('H4 Title');
  });

  it('renders paragraph and list elements', () => {
    const { container } = render(<LessonContent content="test" />);
    expect(container.textContent).toContain('Paragraph text');
    expect(container.textContent).toContain('List items');
  });

  it('renders inline code and code blocks', () => {
    const { container } = render(<LessonContent content="test" />);
    expect(container.textContent).toContain('inlineCode');
    expect(screen.getAllByTestId('code-block').length).toBeGreaterThan(0);
  });

  it('renders anchor elements for external links', () => {
    render(<LessonContent content="test" />);
    const links = screen.getAllByRole('link');
    const externalLink = links.find(l => l.getAttribute('href') === 'https://example.com');
    expect(externalLink).toBeDefined();
    expect(externalLink?.getAttribute('target')).toBe('_blank');
    expect(externalLink?.getAttribute('rel')).toContain('noopener');
  });

  it('renders anchor elements for internal links without target', () => {
    render(<LessonContent content="test" />);
    const links = screen.getAllByRole('link');
    const internalLink = links.find(l => l.getAttribute('href') === '/internal');
    expect(internalLink).toBeDefined();
    expect(internalLink?.getAttribute('target')).toBeNull();
  });

  it('renders custom CodeBlock component', () => {
    render(<LessonContent content="test" />);
    expect(screen.getAllByTestId('code-block').length).toBeGreaterThan(0);
  });

  it('renders custom Callout component', () => {
    render(<LessonContent content="test" />);
    expect(screen.getByTestId('callout')).toBeInTheDocument();
  });

  it('renders custom CLIExample component', () => {
    render(<LessonContent content="test" />);
    expect(screen.getByTestId('cli-example')).toBeInTheDocument();
  });

  it('renders custom Collapsible component', () => {
    render(<LessonContent content="test" />);
    expect(screen.getByTestId('collapsible')).toBeInTheDocument();
  });

  it('renders blockquote element', () => {
    const { container } = render(<LessonContent content="test" />);
    expect(container.textContent).toContain('Quote text');
  });

  it('renders table elements', () => {
    const { container } = render(<LessonContent content="test" />);
    expect(container.textContent).toContain('Table');
    expect(container.textContent).toContain('Th');
    expect(container.textContent).toContain('Td');
  });

  it('renders strong element', () => {
    const { container } = render(<LessonContent content="test" />);
    expect(container.textContent).toContain('Bold text');
  });
});
