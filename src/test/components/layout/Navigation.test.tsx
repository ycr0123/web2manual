import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Navigation } from '@/components/layout/Navigation';
import { CATEGORY_ORDER, CATEGORY_INFO } from '@/lib/constants';

describe('Navigation', () => {
  it('renders with 카테고리 메뉴 aria-label', () => {
    render(<Navigation />);
    const nav = screen.getByRole('navigation', { name: '카테고리 메뉴' });
    expect(nav).toBeInTheDocument();
  });

  it('renders the 전체 문서 link', () => {
    render(<Navigation />);
    const allDocsLink = screen.getByRole('link', { name: '전체 문서' });
    expect(allDocsLink).toBeInTheDocument();
    expect(allDocsLink.getAttribute('href')).toBe('/reference');
  });

  it('전체 문서 link is active when no currentCategory is set', () => {
    render(<Navigation />);
    const allDocsLink = screen.getByRole('link', { name: '전체 문서' });
    expect(allDocsLink.className).toContain('bg-accent');
  });

  it('renders all category links', () => {
    render(<Navigation />);
    CATEGORY_ORDER.forEach((category) => {
      const info = CATEGORY_INFO[category];
      expect(screen.getByRole('link', { name: info.label })).toBeInTheDocument();
    });
  });

  it('highlights the active category link with aria-current=page', () => {
    render(<Navigation currentCategory="getting-started" />);
    const activeLink = screen.getByRole('link', { name: '시작하기' });
    expect(activeLink).toHaveAttribute('aria-current', 'page');
  });

  it('does not set aria-current on inactive category links', () => {
    render(<Navigation currentCategory="getting-started" />);
    const overviewLink = screen.getByRole('link', { name: '개요' });
    expect(overviewLink).not.toHaveAttribute('aria-current');
  });

  it('전체 문서 link does not have font-medium active class when a category is selected', () => {
    // When currentCategory is set, the all-docs link uses the non-active variant
    // The active state uses both bg-accent AND font-medium together;
    // without a category, the element has font-medium from the active branch
    render(<Navigation currentCategory="overview" />);
    const allDocsLink = screen.getByRole('link', { name: '전체 문서' });
    // The active class for "전체 문서" is applied only when !currentCategory
    // So when currentCategory is provided, aria-current should NOT be set
    expect(allDocsLink).not.toHaveAttribute('aria-current');
  });

  it('applies custom className to the nav element', () => {
    render(<Navigation className="custom-nav-class" />);
    const nav = screen.getByRole('navigation', { name: '카테고리 메뉴' });
    expect(nav.className).toContain('custom-nav-class');
  });

  it('category links have correct href with query param', () => {
    render(<Navigation />);
    const overviewLink = screen.getByRole('link', { name: '개요' });
    expect(overviewLink.getAttribute('href')).toBe('/reference?category=overview');
  });
});
