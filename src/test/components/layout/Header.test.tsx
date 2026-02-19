import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Header } from '@/components/layout/Header';

// SearchBar is complex; mock it to isolate Header behavior
vi.mock('@/components/search/SearchBar', () => ({
  SearchBar: () => <div data-testid="search-bar">SearchBar</div>,
}));

describe('Header', () => {
  it('renders the logo link with aria-label', () => {
    render(<Header />);
    const logo = screen.getByRole('link', { name: '홈으로 이동' });
    expect(logo).toBeInTheDocument();
    expect(logo.getAttribute('href')).toBe('/');
  });

  it('renders the desktop navigation links', () => {
    render(<Header />);
    const navLinks = screen.getAllByRole('link', { name: '레퍼런스' });
    // At least one reference link should exist (desktop nav)
    expect(navLinks.length).toBeGreaterThan(0);
  });

  it('renders the playground navigation link', () => {
    render(<Header />);
    const playgroundLinks = screen.getAllByRole('link', { name: '플레이그라운드' });
    expect(playgroundLinks.length).toBeGreaterThan(0);
  });

  it('renders the mobile menu toggle button', () => {
    render(<Header />);
    const menuButton = screen.getByRole('button', { name: '메뉴 열기' });
    expect(menuButton).toBeInTheDocument();
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('toggles mobile menu open on button click', () => {
    render(<Header />);
    const menuButton = screen.getByRole('button', { name: '메뉴 열기' });
    fireEvent.click(menuButton);
    expect(screen.getByRole('button', { name: '메뉴 닫기' })).toBeInTheDocument();
  });

  it('closes mobile menu when a mobile nav link is clicked', () => {
    render(<Header />);
    // Open the menu first
    const menuButton = screen.getByRole('button', { name: '메뉴 열기' });
    fireEvent.click(menuButton);
    // The mobile menu links are the 3rd and 4th reference/playground links
    // Find the mobile nav area
    const mobileNav = screen.getByRole('navigation', { name: '모바일 메뉴' });
    const refLink = mobileNav.querySelector('a[href="/reference"]');
    expect(refLink).not.toBeNull();
    fireEvent.click(refLink!);
    // After click, the close button should revert back to open button
    expect(screen.getByRole('button', { name: '메뉴 열기' })).toBeInTheDocument();
  });

  it('renders the SearchBar component', () => {
    render(<Header />);
    const searchBars = screen.getAllByTestId('search-bar');
    expect(searchBars.length).toBeGreaterThan(0);
  });

  it('header element has sticky positioning class', () => {
    const { container } = render(<Header />);
    const header = container.querySelector('header');
    expect(header).toBeInTheDocument();
    expect(header?.className).toContain('sticky');
  });
});
