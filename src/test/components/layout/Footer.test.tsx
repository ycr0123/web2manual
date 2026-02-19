import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Footer } from '@/components/layout/Footer';

describe('Footer', () => {
  it('renders with contentinfo role', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('renders the site brand name', () => {
    render(<Footer />);
    expect(screen.getByText('Claude Code 완전정복 가이드')).toBeInTheDocument();
  });

  it('renders footer description text', () => {
    render(<Footer />);
    expect(
      screen.getByText(/Claude Code 공식 문서를 한국어로 번역한/)
    ).toBeInTheDocument();
  });

  it('renders the footer navigation menu', () => {
    render(<Footer />);
    const footerNav = screen.getByRole('navigation', { name: '푸터 메뉴' });
    expect(footerNav).toBeInTheDocument();
  });

  it('renders home and reference links in footer nav', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: '홈' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '레퍼런스' })).toBeInTheDocument();
  });

  it('renders external link to Anthropic docs with noopener', () => {
    render(<Footer />);
    const externalLink = screen.getByRole('link', { name: /Anthropic 공식 문서/ });
    expect(externalLink).toHaveAttribute('target', '_blank');
    expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer');
    expect(externalLink).toHaveAttribute(
      'href',
      'https://docs.anthropic.com/en/docs/claude-code'
    );
  });

  it('renders the copyright year in the footer', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument();
  });

  it('renders the screen reader only text for external link', () => {
    render(<Footer />);
    const srOnly = screen.getByText('(새 탭에서 열림)');
    expect(srOnly).toBeInTheDocument();
  });
});
