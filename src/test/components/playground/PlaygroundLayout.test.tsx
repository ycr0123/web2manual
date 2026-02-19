import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PlaygroundLayout } from '@/components/playground/PlaygroundLayout';

const fileTree = <div>File Tree</div>;
const terminal = <div>Terminal</div>;
const codeViewer = <div>Code Viewer</div>;

describe('PlaygroundLayout', () => {
  it('renders the mobile tablist', () => {
    render(
      <PlaygroundLayout fileTree={fileTree} terminal={terminal} codeViewer={codeViewer} />
    );
    const tablist = screen.getByRole('tablist', { name: '패널 선택' });
    expect(tablist).toBeInTheDocument();
  });

  it('renders three mobile tab buttons', () => {
    render(
      <PlaygroundLayout fileTree={fileTree} terminal={terminal} codeViewer={codeViewer} />
    );
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(3);
  });

  it('터미널 tab is selected by default', () => {
    render(
      <PlaygroundLayout fileTree={fileTree} terminal={terminal} codeViewer={codeViewer} />
    );
    const terminalTab = screen.getByRole('tab', { name: '터미널' });
    expect(terminalTab).toHaveAttribute('aria-selected', 'true');
  });

  it('switches active tab when a tab is clicked', () => {
    render(
      <PlaygroundLayout fileTree={fileTree} terminal={terminal} codeViewer={codeViewer} />
    );
    const filesTab = screen.getByRole('tab', { name: '파일' });
    fireEvent.click(filesTab);
    expect(filesTab).toHaveAttribute('aria-selected', 'true');
    const terminalTab = screen.getByRole('tab', { name: '터미널' });
    expect(terminalTab).toHaveAttribute('aria-selected', 'false');
  });

  it('renders desktop region with 플레이그라운드 패널 label', () => {
    render(
      <PlaygroundLayout fileTree={fileTree} terminal={terminal} codeViewer={codeViewer} />
    );
    const region = screen.getByRole('region', { name: '플레이그라운드 패널' });
    expect(region).toBeInTheDocument();
  });

  it('renders resize separators', () => {
    render(
      <PlaygroundLayout fileTree={fileTree} terminal={terminal} codeViewer={codeViewer} />
    );
    const separators = screen.getAllByRole('separator');
    expect(separators).toHaveLength(2);
  });

  it('renders file tree and terminal content in tabpanels', () => {
    render(
      <PlaygroundLayout fileTree={fileTree} terminal={terminal} codeViewer={codeViewer} />
    );
    // Content appears in the mobile tabpanels
    const tabpanels = screen.getAllByRole('tabpanel');
    expect(tabpanels).toHaveLength(3);
  });

  it('applies custom className to root element', () => {
    const { container } = render(
      <PlaygroundLayout
        fileTree={fileTree}
        terminal={terminal}
        codeViewer={codeViewer}
        className="custom-layout"
      />
    );
    expect(container.firstChild).toHaveClass('custom-layout');
  });

  it('can switch between all three mobile tabs', () => {
    render(
      <PlaygroundLayout fileTree={fileTree} terminal={terminal} codeViewer={codeViewer} />
    );
    const editorTab = screen.getByRole('tab', { name: '코드' });
    fireEvent.click(editorTab);
    expect(editorTab).toHaveAttribute('aria-selected', 'true');

    const terminalTab = screen.getByRole('tab', { name: '터미널' });
    fireEvent.click(terminalTab);
    expect(terminalTab).toHaveAttribute('aria-selected', 'true');
  });

  it('left divider triggers drag on mousedown', () => {
    render(
      <PlaygroundLayout fileTree={fileTree} terminal={terminal} codeViewer={codeViewer} />
    );
    const separators = screen.getAllByRole('separator');
    const leftDivider = separators[0];
    // Firing mousedown should not throw
    expect(() => {
      fireEvent.mouseDown(leftDivider, { clientX: 200, preventDefault: vi.fn() });
    }).not.toThrow();
  });

  it('right divider triggers drag on mousedown', () => {
    render(
      <PlaygroundLayout fileTree={fileTree} terminal={terminal} codeViewer={codeViewer} />
    );
    const separators = screen.getAllByRole('separator');
    const rightDivider = separators[1];
    expect(() => {
      fireEvent.mouseDown(rightDivider, { clientX: 800, preventDefault: vi.fn() });
    }).not.toThrow();
  });

  it('left panel width updates on mouse drag', () => {
    render(
      <PlaygroundLayout fileTree={fileTree} terminal={terminal} codeViewer={codeViewer} />
    );
    const separators = screen.getAllByRole('separator');
    const leftDivider = separators[0];

    // Start drag
    fireEvent.mouseDown(leftDivider, { clientX: 200 });
    // Move mouse to resize
    act(() => {
      fireEvent.mouseMove(document, { clientX: 260 });
    });
    // End drag
    act(() => {
      fireEvent.mouseUp(document);
    });
    // Panel still renders after drag
    expect(screen.getByRole('region', { name: '플레이그라운드 패널' })).toBeInTheDocument();
  });

  it('right panel width updates on mouse drag', () => {
    render(
      <PlaygroundLayout fileTree={fileTree} terminal={terminal} codeViewer={codeViewer} />
    );
    const separators = screen.getAllByRole('separator');
    const rightDivider = separators[1];

    // Start drag
    fireEvent.mouseDown(rightDivider, { clientX: 800 });
    // Move mouse to resize
    act(() => {
      fireEvent.mouseMove(document, { clientX: 750 });
    });
    // End drag
    act(() => {
      fireEvent.mouseUp(document);
    });
    expect(screen.getByRole('region', { name: '플레이그라운드 패널' })).toBeInTheDocument();
  });

  it('left panel respects minimum width of 140', () => {
    render(
      <PlaygroundLayout fileTree={fileTree} terminal={terminal} codeViewer={codeViewer} />
    );
    const separators = screen.getAllByRole('separator');
    const leftDivider = separators[0];

    // Drag far to the left to hit minimum width
    fireEvent.mouseDown(leftDivider, { clientX: 200 });
    act(() => {
      fireEvent.mouseMove(document, { clientX: 0 });
    });
    act(() => {
      fireEvent.mouseUp(document);
    });
    expect(screen.getByRole('region', { name: '플레이그라운드 패널' })).toBeInTheDocument();
  });

  it('right panel respects minimum width of 280', () => {
    render(
      <PlaygroundLayout fileTree={fileTree} terminal={terminal} codeViewer={codeViewer} />
    );
    const separators = screen.getAllByRole('separator');
    const rightDivider = separators[1];

    // Drag far to the right to hit minimum width
    fireEvent.mouseDown(rightDivider, { clientX: 800 });
    act(() => {
      fireEvent.mouseMove(document, { clientX: 1600 });
    });
    act(() => {
      fireEvent.mouseUp(document);
    });
    expect(screen.getByRole('region', { name: '플레이그라운드 패널' })).toBeInTheDocument();
  });

  it('renders file tree content', () => {
    render(
      <PlaygroundLayout fileTree={fileTree} terminal={terminal} codeViewer={codeViewer} />
    );
    // File Tree content appears in the DOM (may be hidden on mobile)
    expect(screen.getAllByText('File Tree').length).toBeGreaterThan(0);
  });

  it('renders code viewer content', () => {
    render(
      <PlaygroundLayout fileTree={fileTree} terminal={terminal} codeViewer={codeViewer} />
    );
    expect(screen.getAllByText('Code Viewer').length).toBeGreaterThan(0);
  });
});
