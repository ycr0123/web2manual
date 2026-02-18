// 레퍼런스 카테고리 타입
export type ReferenceCategory =
  | 'overview'
  | 'getting-started'
  | 'common-workflows'
  | 'cli-reference'
  | 'settings'
  | 'features'
  | 'third-party'
  | 'security'
  | 'troubleshooting';

// 헤딩 타입
export interface Heading {
  level: number;
  text: string;
  id: string;
}

// 레퍼런스 문서 타입
export interface ReferenceDocument {
  slug: string;
  title: string;
  titleKo: string;
  description: string;
  descriptionKo: string;
  category: ReferenceCategory;
  sectionNumber: string;
  sourceUrl: string;
  content: string;
  headings: Heading[];
  readingTime: number;
  fetchedDate: string;
}

// 검색 인덱스 아이템 타입
export interface SearchIndexItem {
  slug: string;
  title: string;
  titleKo: string;
  description: string;
  descriptionKo: string;
  category: ReferenceCategory;
  headings: string[];
  bodyPreview: string;
}

// 카테고리 정보 타입
export interface CategoryInfo {
  id: ReferenceCategory;
  label: string;
  description: string;
  color: string;
}

// 레퍼런스 페이지 네비게이션 타입
export interface ReferenceNavigation {
  prev: {
    slug: string;
    titleKo: string;
  } | null;
  next: {
    slug: string;
    titleKo: string;
  } | null;
}

// 검색 결과 타입
export interface SearchResult {
  item: SearchIndexItem;
  score?: number;
  matches?: readonly {
    indices: readonly [number, number][];
    value?: string;
    key?: string;
    refIndex?: number | undefined;
  }[];
}

// ============================================================
// SPEC-002: 인터랙티브 튜토리얼 시스템 타입
// ============================================================

export interface Track {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  icon: string;
  order: number;
  lessons: LessonMeta[];
}

export interface LessonMeta {
  id: string;
  trackId: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
  order: number;
  objectives: string[];
  sourceDocs: string[];
  prerequisites?: string[];
  tags: string[];
}

export interface Lesson extends LessonMeta {
  content: string;
  quiz: Quiz;
  nextLesson?: LessonNavItem;
  prevLesson?: LessonNavItem;
  tableOfContents: TOCItem[];
}

export interface LessonNavItem {
  id: string;
  trackId: string;
  title: string;
}

export interface TOCItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface Quiz {
  lessonId: string;
  questions: QuizQuestion[];
  passingScore: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice';
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface UserProgress {
  completedLessons: string[];
  quizResults: Record<string, QuizResult>;
  badges: Record<string, Badge>;
  lastVisitedLesson?: string;
  updatedAt: string;
}

export interface Badge {
  trackId: string;
  name: string;
  description: string;
  image: string;
  earned: boolean;
  earnedAt?: string;
}

export interface QuizResult {
  lessonId: string;
  score: number;
  passed: boolean;
  answers: Record<string, string>;
  completedAt: string;
}
