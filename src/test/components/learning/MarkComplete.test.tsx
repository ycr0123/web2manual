import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MarkComplete } from '@/components/learning/MarkComplete';

// Mock Zustand progress store
const mockIsLessonCompleted = vi.fn();
const mockCompleteLesson = vi.fn();
const mockUncompleteLesson = vi.fn();

vi.mock('@/stores/progressStore', () => ({
  useProgressStore: () => ({
    isLessonCompleted: mockIsLessonCompleted,
    completeLesson: mockCompleteLesson,
    uncompleteLesson: mockUncompleteLesson,
  }),
}));

describe('MarkComplete', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders "완료로 표시" text when lesson is not completed', () => {
    mockIsLessonCompleted.mockReturnValue(false);
    render(<MarkComplete lessonId="lesson-1" trackId="beginner" />);
    expect(screen.getByText('완료로 표시')).toBeDefined();
  });

  it('renders "완료됨" text when lesson is completed', () => {
    mockIsLessonCompleted.mockReturnValue(true);
    render(<MarkComplete lessonId="lesson-1" trackId="beginner" />);
    expect(screen.getByText('완료됨')).toBeDefined();
  });

  it('aria-label is "레슨 완료로 표시" when not completed', () => {
    mockIsLessonCompleted.mockReturnValue(false);
    render(<MarkComplete lessonId="lesson-1" trackId="beginner" />);
    const button = screen.getByRole('button');
    expect(button.getAttribute('aria-label')).toBe('레슨 완료로 표시');
  });

  it('aria-label is "레슨 완료 취소" when completed', () => {
    mockIsLessonCompleted.mockReturnValue(true);
    render(<MarkComplete lessonId="lesson-1" trackId="beginner" />);
    const button = screen.getByRole('button');
    expect(button.getAttribute('aria-label')).toBe('레슨 완료 취소');
  });

  it('aria-pressed is false when not completed', () => {
    mockIsLessonCompleted.mockReturnValue(false);
    render(<MarkComplete lessonId="lesson-1" trackId="beginner" />);
    const button = screen.getByRole('button');
    expect(button.getAttribute('aria-pressed')).toBe('false');
  });

  it('aria-pressed is true when completed', () => {
    mockIsLessonCompleted.mockReturnValue(true);
    render(<MarkComplete lessonId="lesson-1" trackId="beginner" />);
    const button = screen.getByRole('button');
    expect(button.getAttribute('aria-pressed')).toBe('true');
  });

  it('calls completeLesson when clicking uncompleted lesson', () => {
    mockIsLessonCompleted.mockReturnValue(false);
    render(<MarkComplete lessonId="lesson-1" trackId="beginner" />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockCompleteLesson).toHaveBeenCalledWith('lesson-1', 'beginner');
    expect(mockUncompleteLesson).not.toHaveBeenCalled();
  });

  it('calls uncompleteLesson when clicking completed lesson', () => {
    mockIsLessonCompleted.mockReturnValue(true);
    render(<MarkComplete lessonId="lesson-1" trackId="beginner" />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockUncompleteLesson).toHaveBeenCalledWith('lesson-1');
    expect(mockCompleteLesson).not.toHaveBeenCalled();
  });

  it('applies green styling when completed', () => {
    mockIsLessonCompleted.mockReturnValue(true);
    render(<MarkComplete lessonId="lesson-1" trackId="beginner" />);
    const button = screen.getByRole('button');
    expect(button.className).toContain('green');
  });

  it('applies muted styling when not completed', () => {
    mockIsLessonCompleted.mockReturnValue(false);
    render(<MarkComplete lessonId="lesson-1" trackId="beginner" />);
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-muted');
  });

  it('renders as a button element', () => {
    mockIsLessonCompleted.mockReturnValue(false);
    render(
      <MarkComplete
        lessonId="lesson-1"
        trackId="beginner"
      />
    );
    const button = screen.getByRole('button');
    expect(button.tagName).toBe('BUTTON');
  });
});
