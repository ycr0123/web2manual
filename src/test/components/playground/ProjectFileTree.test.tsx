import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProjectFileTree } from '@/components/playground/ProjectFileTree';
import type { ProjectFile } from '@/types/playground';

const files: ProjectFile[] = [
  { path: 'index.js', name: 'index.js', language: 'javascript', content: 'code', hasBug: true },
  { path: 'routes/todos.js', name: 'todos.js', language: 'javascript', content: 'code2' },
  { path: 'package.json', name: 'package.json', language: 'json', content: '{}' },
];

describe('ProjectFileTree', () => {
  it('renders root-level files', () => {
    render(
      <ProjectFileTree files={files} selectedFile={null} onSelectFile={vi.fn()} />
    );
    expect(screen.getByText('index.js')).toBeInTheDocument();
    expect(screen.getByText('package.json')).toBeInTheDocument();
  });

  it('renders directory folders', () => {
    render(
      <ProjectFileTree files={files} selectedFile={null} onSelectFile={vi.fn()} />
    );
    expect(screen.getByText('routes')).toBeInTheDocument();
  });

  it('shows bug indicator for files with hasBug', () => {
    render(
      <ProjectFileTree files={files} selectedFile={null} onSelectFile={vi.fn()} />
    );
    // Bug warning icon should be visible
    const bugIcon = screen.getAllByLabelText('버그 있음');
    expect(bugIcon.length).toBeGreaterThan(0);
  });

  it('calls onSelectFile when file is clicked', () => {
    const onSelect = vi.fn();
    render(
      <ProjectFileTree files={files} selectedFile={null} onSelectFile={onSelect} />
    );
    fireEvent.click(screen.getByText('index.js'));
    expect(onSelect).toHaveBeenCalledWith('index.js');
  });

  it('marks selected file with aria-current', () => {
    render(
      <ProjectFileTree files={files} selectedFile="index.js" onSelectFile={vi.fn()} />
    );
    const btn = screen.getByLabelText('파일: index.js (버그 있음)');
    expect(btn).toHaveAttribute('aria-current', 'true');
  });

  it('toggles directory open/close on click', () => {
    render(
      <ProjectFileTree files={files} selectedFile={null} onSelectFile={vi.fn()} />
    );
    const folder = screen.getByText('routes');
    // Folder should start open
    expect(screen.getByText('todos.js')).toBeInTheDocument();
    // Close
    fireEvent.click(folder);
    expect(screen.queryByText('todos.js')).not.toBeInTheDocument();
    // Re-open
    fireEvent.click(folder);
    expect(screen.getByText('todos.js')).toBeInTheDocument();
  });
});
