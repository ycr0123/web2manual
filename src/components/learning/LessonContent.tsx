import { MDXRemote } from 'next-mdx-remote/rsc';
import type { ReactNode } from 'react';
import { CodeBlock } from './CodeBlock';
import { Callout } from './Callout';
import { CLIExample } from './CLIExample';
import { Collapsible } from './Collapsible';

// MDX 컴포넌트 매핑
const components = {
  // 커스텀 컴포넌트
  CodeBlock: ({
    children,
    language,
    title,
    showLineNumbers,
  }: {
    children: ReactNode;
    language?: string;
    title?: string;
    showLineNumbers?: boolean;
  }) => (
    <CodeBlock language={language} title={title} showLineNumbers={showLineNumbers}>
      {children}
    </CodeBlock>
  ),

  Callout: ({
    type,
    title,
    children,
  }: {
    type: 'warning' | 'tip' | 'note' | 'danger';
    title?: string;
    children: ReactNode;
  }) => (
    <Callout type={type} title={title}>
      {children}
    </Callout>
  ),

  CLIExample: ({
    command,
    description,
    output,
  }: {
    command: string;
    description?: string;
    output?: string;
  }) => <CLIExample command={command} description={description} output={output} />,

  Collapsible: ({ title, children }: { title: string; children: ReactNode }) => (
    <Collapsible title={title}>{children}</Collapsible>
  ),

  // 기본 HTML 요소 스타일링
  h1: ({ children }: { children: ReactNode }) => (
    <h1 className="text-3xl font-bold mt-8 mb-4 scroll-mt-20">{children}</h1>
  ),
  h2: ({ id, children }: { id?: string; children: ReactNode }) => (
    <h2 id={id} className="text-2xl font-bold mt-8 mb-4 scroll-mt-20 border-b border-border pb-2">
      {children}
    </h2>
  ),
  h3: ({ id, children }: { id?: string; children: ReactNode }) => (
    <h3 id={id} className="text-xl font-semibold mt-6 mb-3 scroll-mt-20">
      {children}
    </h3>
  ),
  h4: ({ children }: { children: ReactNode }) => (
    <h4 className="text-lg font-semibold mt-4 mb-2">{children}</h4>
  ),
  p: ({ children }: { children: ReactNode }) => (
    <p className="leading-7 mb-4 text-foreground/90">{children}</p>
  ),
  ul: ({ children }: { children: ReactNode }) => (
    <ul className="list-disc list-outside ml-6 mb-4 space-y-1.5">{children}</ul>
  ),
  ol: ({ children }: { children: ReactNode }) => (
    <ol className="list-decimal list-outside ml-6 mb-4 space-y-1.5">{children}</ol>
  ),
  li: ({ children }: { children: ReactNode }) => (
    <li className="leading-7 text-foreground/90">{children}</li>
  ),
  blockquote: ({ children }: { children: ReactNode }) => (
    <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4">
      {children}
    </blockquote>
  ),
  code: ({ children, className }: { children: ReactNode; className?: string }) => {
    // 코드 블록 vs 인라인 코드 구분
    const isBlock = className?.startsWith('language-');
    if (isBlock) {
      const language = className?.replace('language-', '');
      return (
        <CodeBlock language={language}>
          {children}
        </CodeBlock>
      );
    }
    return (
      <code className="relative rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
        {children}
      </code>
    );
  },
  pre: ({ children }: { children: ReactNode }) => (
    <div className="my-4">{children}</div>
  ),
  table: ({ children }: { children: ReactNode }) => (
    <div className="overflow-x-auto my-4 rounded-lg border border-border">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }: { children: ReactNode }) => (
    <thead className="bg-muted/50">{children}</thead>
  ),
  th: ({ children }: { children: ReactNode }) => (
    <th className="px-4 py-2.5 text-left font-semibold border-b border-border">{children}</th>
  ),
  td: ({ children }: { children: ReactNode }) => (
    <td className="px-4 py-2.5 border-b border-border last:border-b-0">{children}</td>
  ),
  tr: ({ children }: { children: ReactNode }) => (
    <tr className="hover:bg-muted/20 transition-colors">{children}</tr>
  ),
  hr: () => <hr className="my-8 border-border" />,
  a: ({ href, children }: { href?: string; children: ReactNode }) => (
    <a
      href={href}
      className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  ),
  strong: ({ children }: { children: ReactNode }) => (
    <strong className="font-semibold">{children}</strong>
  ),
};

interface LessonContentProps {
  content: string;
}

export function LessonContent({ content }: LessonContentProps) {
  return (
    <div className="prose prose-zinc dark:prose-invert max-w-none">
      <MDXRemote
        source={content}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [],
            rehypePlugins: [],
          },
        }}
      />
    </div>
  );
}
