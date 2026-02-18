import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InteractiveQuiz } from '@/components/learning/InteractiveQuiz';
import type { Quiz } from '@/types/content';

const mockSaveQuizResult = vi.fn();
const mockCompleteLesson = vi.fn();

vi.mock('@/stores/progressStore', () => ({
  useProgressStore: vi.fn(() => ({
    saveQuizResult: mockSaveQuizResult,
    completeLesson: mockCompleteLesson,
  })),
}));

const mockQuiz: Quiz = {
  lessonId: 'test-lesson',
  passingScore: 70,
  questions: [
    {
      id: 'q1',
      question: 'Claude Code는 무엇인가요?',
      type: 'multiple-choice',
      options: [
        { id: 'a', text: 'AI 코딩 도구' },
        { id: 'b', text: '웹 브라우저' },
        { id: 'c', text: '텍스트 에디터' },
      ],
      correctOptionId: 'a',
      explanation: 'Claude Code는 터미널 기반 AI 코딩 도구입니다.',
    },
    {
      id: 'q2',
      question: 'Claude Code의 실행 환경은?',
      type: 'multiple-choice',
      options: [
        { id: 'a', text: 'GUI' },
        { id: 'b', text: '터미널' },
        { id: 'c', text: '브라우저' },
      ],
      correctOptionId: 'b',
      explanation: '터미널에서 실행됩니다.',
    },
  ],
};

describe('InteractiveQuiz', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('퀴즈 제목과 진행 상황을 렌더링한다', () => {
    render(<InteractiveQuiz quiz={mockQuiz} trackId="beginner" />);
    expect(screen.getByText('퀴즈 1 / 2')).toBeDefined();
    expect(screen.getByText('Claude Code는 무엇인가요?')).toBeDefined();
  });

  it('모든 선택지를 렌더링한다', () => {
    render(<InteractiveQuiz quiz={mockQuiz} trackId="beginner" />);
    expect(screen.getByText('AI 코딩 도구')).toBeDefined();
    expect(screen.getByText('웹 브라우저')).toBeDefined();
    expect(screen.getByText('텍스트 에디터')).toBeDefined();
  });

  // UT-11: 선택지 클릭 시 선택 상태가 변경된다
  it('UT-11: 선택지 클릭 시 선택 상태가 시각적으로 표시된다', () => {
    render(<InteractiveQuiz quiz={mockQuiz} trackId="beginner" />);

    const optionButton = screen.getByRole('button', {
      name: /A\. AI 코딩 도구/,
    });
    fireEvent.click(optionButton);

    // 선택 후 aria-pressed가 true로 변경됨
    expect(optionButton.getAttribute('aria-pressed')).toBe('true');
  });

  it('선택 후 설명이 표시된다', () => {
    render(<InteractiveQuiz quiz={mockQuiz} trackId="beginner" />);

    const optionButton = screen.getByRole('button', {
      name: /A\. AI 코딩 도구/,
    });
    fireEvent.click(optionButton);

    expect(screen.getByText('정답입니다!')).toBeDefined();
    expect(screen.getByText('Claude Code는 터미널 기반 AI 코딩 도구입니다.')).toBeDefined();
  });

  it('오답 선택 시 오답 메시지가 표시된다', () => {
    render(<InteractiveQuiz quiz={mockQuiz} trackId="beginner" />);

    const wrongOption = screen.getByRole('button', {
      name: /B\. 웹 브라우저/,
    });
    fireEvent.click(wrongOption);

    expect(screen.getByText('아쉽네요, 정답은 다른 것입니다.')).toBeDefined();
  });

  it('선택 후 다음 문제 버튼이 표시된다', () => {
    render(<InteractiveQuiz quiz={mockQuiz} trackId="beginner" />);

    const optionButton = screen.getByRole('button', {
      name: /A\. AI 코딩 도구/,
    });
    fireEvent.click(optionButton);

    expect(screen.getByText('다음 문제')).toBeDefined();
  });

  it('마지막 문제에서는 "결과 보기" 버튼이 표시된다', () => {
    render(<InteractiveQuiz quiz={mockQuiz} trackId="beginner" />);

    // 첫 번째 문제 답
    fireEvent.click(screen.getByRole('button', { name: /A\. AI 코딩 도구/ }));
    fireEvent.click(screen.getByText('다음 문제'));

    // 두 번째 문제 (마지막)
    fireEvent.click(screen.getByRole('button', { name: /B\. 터미널/ }));
    expect(screen.getByText('결과 보기')).toBeDefined();
  });

  // UT-12: 제출 후 정답/오답 표시와 설명이 보인다
  it('UT-12: 모든 문제 정답 후 완료 시 통과 화면이 표시된다', () => {
    const mockOnPass = vi.fn();
    render(
      <InteractiveQuiz quiz={mockQuiz} trackId="beginner" onPass={mockOnPass} />
    );

    // 첫 번째 문제 정답
    fireEvent.click(screen.getByRole('button', { name: /A\. AI 코딩 도구/ }));
    fireEvent.click(screen.getByText('다음 문제'));

    // 두 번째 문제 정답
    fireEvent.click(screen.getByRole('button', { name: /B\. 터미널/ }));
    fireEvent.click(screen.getByText('결과 보기'));

    // 완료 화면
    expect(screen.getByText('퀴즈 통과!')).toBeDefined();
    expect(screen.getByText(/2문제 중 2문제 정답/)).toBeDefined();
    expect(mockSaveQuizResult).toHaveBeenCalled();
    expect(mockCompleteLesson).toHaveBeenCalledWith('test-lesson', 'beginner');
    expect(mockOnPass).toHaveBeenCalled();
  });

  it('불합격 시 다시 도전 화면이 표시된다', () => {
    render(<InteractiveQuiz quiz={mockQuiz} trackId="beginner" />);

    // 모두 오답
    fireEvent.click(screen.getByRole('button', { name: /B\. 웹 브라우저/ }));
    fireEvent.click(screen.getByText('다음 문제'));

    fireEvent.click(screen.getByRole('button', { name: /A\. GUI/ }));
    fireEvent.click(screen.getByText('결과 보기'));

    expect(screen.getByText('다시 도전해보세요')).toBeDefined();
    expect(screen.getByText(/2문제 중 0문제 정답/)).toBeDefined();
  });

  it('다시 풀기 버튼으로 퀴즈를 리셋할 수 있다', () => {
    render(<InteractiveQuiz quiz={mockQuiz} trackId="beginner" />);

    // 완료까지 진행
    fireEvent.click(screen.getByRole('button', { name: /A\. AI 코딩 도구/ }));
    fireEvent.click(screen.getByText('다음 문제'));
    fireEvent.click(screen.getByRole('button', { name: /B\. 터미널/ }));
    fireEvent.click(screen.getByText('결과 보기'));

    // 다시 풀기
    fireEvent.click(screen.getByText('다시 풀기'));

    // 첫 문제로 돌아감
    expect(screen.getByText('퀴즈 1 / 2')).toBeDefined();
    expect(screen.getByText('Claude Code는 무엇인가요?')).toBeDefined();
  });
});
