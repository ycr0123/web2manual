import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import type { BreadcrumbItem } from '@/components/common/Breadcrumb';

describe('Breadcrumb', () => {
  it('renders with breadcrumb aria-label', () => {
    render(<Breadcrumb items={[{ label: '문서' }]} />);
    const nav = screen.getByRole('navigation', { name: 'breadcrumb' });
    expect(nav).toBeInTheDocument();
  });

  it('always renders the home link', () => {
    render(<Breadcrumb items={[]} />);
    const homeLink = screen.getByRole('link', { name: '홈으로' });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink.getAttribute('href')).toBe('/');
  });

  it('renders breadcrumb items as text spans', () => {
    const items: BreadcrumbItem[] = [{ label: '레퍼런스' }, { label: '개요' }];
    render(<Breadcrumb items={items} />);
    expect(screen.getByText('레퍼런스')).toBeInTheDocument();
    expect(screen.getByText('개요')).toBeInTheDocument();
  });

  it('renders intermediate items with href as links', () => {
    const items: BreadcrumbItem[] = [
      { label: '레퍼런스', href: '/reference' },
      { label: '개요' },
    ];
    render(<Breadcrumb items={items} />);
    const refLink = screen.getByRole('link', { name: '레퍼런스' });
    expect(refLink).toBeInTheDocument();
    expect(refLink.getAttribute('href')).toBe('/reference');
  });

  it('renders the last item as a span with aria-current=page', () => {
    const items: BreadcrumbItem[] = [
      { label: '레퍼런스', href: '/reference' },
      { label: '현재 페이지' },
    ];
    render(<Breadcrumb items={items} />);
    const current = screen.getByText('현재 페이지');
    expect(current.tagName).toBe('SPAN');
    expect(current).toHaveAttribute('aria-current', 'page');
  });

  it('renders single item without a link', () => {
    const items: BreadcrumbItem[] = [{ label: '단독 항목' }];
    render(<Breadcrumb items={items} />);
    const span = screen.getByText('단독 항목');
    expect(span.tagName).toBe('SPAN');
    expect(span).toHaveAttribute('aria-current', 'page');
  });

  it('applies custom className to nav element', () => {
    render(<Breadcrumb items={[{ label: 'item' }]} className="custom-breadcrumb" />);
    const nav = screen.getByRole('navigation', { name: 'breadcrumb' });
    expect(nav.className).toContain('custom-breadcrumb');
  });

  it('renders separator icons between items', () => {
    const items: BreadcrumbItem[] = [{ label: 'A' }, { label: 'B' }];
    const { container } = render(<Breadcrumb items={items} />);
    // ChevronRight icons are rendered with aria-hidden="true"
    const separators = container.querySelectorAll('[aria-hidden="true"]');
    expect(separators.length).toBeGreaterThan(0);
  });
});
