export type Locale = 'ko' | 'en';

export const translations = {
  ko: {
    // Navigation
    nav: {
      home: '홈',
      reference: '레퍼런스',
      playground: '플레이그라운드',
      learn: '학습',
      menu_open: '메뉴 열기',
      menu_close: '메뉴 닫기',
      all_docs: '전체 문서',
    },
    // Home Page
    home: {
      badge: 'Claude Code 완전정복 가이드',
      hero_title: 'Claude Code를 완전히 마스터하세요',
      hero_desc: (count: number) =>
        `${count}개의 Claude Code 공식 문서를 한국어로 번역했습니다. 실시간 검색으로 원하는 내용을 바로 찾아보세요.`,
      btn_start: '레퍼런스 시작하기',
      btn_search: '문서 검색',
      features_title: '왜 이 가이드를 선택해야 할까요?',
      categories_title: '카테고리별 탐색',
      categories_desc: '관심있는 주제부터 시작해보세요',
      btn_all_docs: '전체 문서 보기',
    },
    // Features
    features: {
      search: {
        title: '빠른 검색',
        desc: 'Fuse.js를 활용한 실시간 전문 검색. 200ms 이내 결과 제공.',
      },
      localization: {
        title: '한국어 완전 지원',
        desc: '56개 Claude Code 공식 문서를 한국어로 번역하여 제공합니다.',
      },
      performance: {
        title: '최적화된 성능',
        desc: 'Next.js 15 정적 생성으로 빠른 로딩. Lighthouse 90+ 달성.',
      },
      accessibility: {
        title: '접근성 준수',
        desc: 'WCAG 2.1 AA 기준 준수. 키보드 내비게이션, 스크린 리더 지원.',
      },
    },
    // Reference Page
    reference: {
      title: '레퍼런스',
      desc: (count: number) =>
        `Claude Code 공식 문서 ${count}개를 한국어로 번역했습니다.`,
      all: (count: number) => `전체 (${count})`,
      no_docs_title: '문서가 없습니다',
      no_docs_desc:
        'claude-code-docs 디렉토리에 마크다운 파일을 추가해주세요.',
    },
    // Learn Page
    learn: {
      title: '인터랙티브 학습 센터',
      desc: 'Claude Code를 체계적으로 마스터하세요. 입문부터 기업 환경 적용까지, 단계별 인터랙티브 튜토리얼로 학습합니다.',
      lessons: (n: number) => `총 ${n}개 레슨`,
      hours: (n: number) => `총 ${n}+ 시간`,
      tracks: (n: number) => `${n}개 트랙`,
      progress_title: '학습 진행 상황이 저장됩니다',
      progress_desc:
        '퀴즈를 통과하고 레슨을 완료하면 진행 상황이 자동으로 저장됩니다. 트랙을 완료하면 배지를 획득할 수 있습니다.',
      difficulty: {
        beginner: '입문',
        intermediate: '중급',
        advanced: '고급',
      },
      lesson_count: (n: number) => `${n}개 레슨`,
      est_hours: (n: number) => `약 ${n}시간`,
      first_lesson: '첫 번째 레슨',
    },
    // Footer
    footer: {
      desc: 'Claude Code 공식 문서를 한국어로 번역한 인터랙티브 학습 플랫폼입니다.',
      links: '바로가기',
      home: '홈',
      reference: '레퍼런스',
      official: '공식 문서',
      official_link: 'Anthropic 공식 문서',
      copyright: (year: number) =>
        `© ${year} Claude Code 완전정복 가이드. 학습 목적으로 제작되었습니다.`,
      original: '원본 문서:',
    },
    // Category Info
    categories: {
      overview: { label: '개요', description: 'Claude Code 소개 및 기본 개념' },
      'getting-started': {
        label: '시작하기',
        description: '설치 및 초기 설정 가이드',
      },
      'common-workflows': {
        label: '일반 워크플로우',
        description: '자주 사용하는 개발 워크플로우',
      },
      'cli-reference': {
        label: 'CLI 레퍼런스',
        description: '커맨드라인 인터페이스 명령어 참조',
      },
      settings: { label: '설정', description: '환경 설정 및 구성 옵션' },
      features: { label: '기능', description: '주요 기능 설명 및 사용법' },
      'third-party': { label: '서드파티', description: '외부 도구 및 통합' },
      security: {
        label: '보안',
        description: '보안 관련 정책 및 설정',
      },
      troubleshooting: {
        label: '문제 해결',
        description: '일반적인 문제 해결 가이드',
      },
    },
    // Common
    common: {
      reading_time: (min: number) =>
        min < 1 ? '1분 미만' : min === 1 ? '약 1분' : `약 ${min}분`,
      new_tab: '(새 탭에서 열림)',
    },
  },
  en: {
    // Navigation
    nav: {
      home: 'Home',
      reference: 'Reference',
      playground: 'Playground',
      learn: 'Learn',
      menu_open: 'Open menu',
      menu_close: 'Close menu',
      all_docs: 'All Documents',
    },
    // Home Page
    home: {
      badge: 'Claude Code Complete Mastery Guide',
      hero_title: 'Master Claude Code Completely',
      hero_desc: (count: number) =>
        `Explore ${count} official Claude Code documents. Find what you need instantly with real-time search.`,
      btn_start: 'Start Reference',
      btn_search: 'Search Docs',
      features_title: 'Why choose this guide?',
      categories_title: 'Browse by Category',
      categories_desc: 'Start with a topic that interests you',
      btn_all_docs: 'View All Docs',
    },
    // Features
    features: {
      search: {
        title: 'Fast Search',
        desc: 'Real-time full-text search powered by Fuse.js. Results in under 200ms.',
      },
      localization: {
        title: 'Full Localization',
        desc: 'All 56 official Claude Code documents fully translated.',
      },
      performance: {
        title: 'Optimized Performance',
        desc: 'Next.js 15 static generation for fast loading. Lighthouse 90+.',
      },
      accessibility: {
        title: 'Accessibility Compliant',
        desc: 'WCAG 2.1 AA compliant. Full keyboard navigation and screen reader support.',
      },
    },
    // Reference Page
    reference: {
      title: 'Reference',
      desc: (count: number) => `${count} official Claude Code documents.`,
      all: (count: number) => `All (${count})`,
      no_docs_title: 'No documents found',
      no_docs_desc:
        'Please add markdown files to the claude-code-docs directory.',
    },
    // Learn Page
    learn: {
      title: 'Interactive Learning Center',
      desc: 'Master Claude Code systematically. Step-by-step interactive tutorials from beginner to enterprise.',
      lessons: (n: number) => `${n} lessons total`,
      hours: (n: number) => `${n}+ hours total`,
      tracks: (n: number) => `${n} tracks`,
      progress_title: 'Your progress is saved',
      progress_desc:
        'Complete quizzes and lessons to save your progress automatically. Earn badges when you complete a track.',
      difficulty: {
        beginner: 'Beginner',
        intermediate: 'Intermediate',
        advanced: 'Advanced',
      },
      lesson_count: (n: number) => `${n} lessons`,
      est_hours: (n: number) => `~${n} hours`,
      first_lesson: 'First lesson',
    },
    // Footer
    footer: {
      desc: 'An interactive learning platform with Claude Code official documentation.',
      links: 'Links',
      home: 'Home',
      reference: 'Reference',
      official: 'Official Docs',
      official_link: 'Anthropic Official Docs',
      copyright: (year: number) =>
        `© ${year} Claude Code Complete Mastery Guide. For educational purposes.`,
      original: 'Original docs:',
    },
    // Category Info
    categories: {
      overview: {
        label: 'Overview',
        description: 'Introduction and core concepts of Claude Code',
      },
      'getting-started': {
        label: 'Getting Started',
        description: 'Installation and initial setup guide',
      },
      'common-workflows': {
        label: 'Common Workflows',
        description: 'Frequently used development workflows',
      },
      'cli-reference': {
        label: 'CLI Reference',
        description: 'Command-line interface command reference',
      },
      settings: {
        label: 'Settings',
        description: 'Environment settings and configuration options',
      },
      features: {
        label: 'Features',
        description: 'Key features explanation and usage',
      },
      'third-party': {
        label: 'Third-Party',
        description: 'External tools and integrations',
      },
      security: {
        label: 'Security',
        description: 'Security policies and settings',
      },
      troubleshooting: {
        label: 'Troubleshooting',
        description: 'General troubleshooting guide',
      },
    },
    // Common
    common: {
      reading_time: (min: number) =>
        min < 1 ? 'Under 1 min' : min === 1 ? '~1 min' : `~${min} min`,
      new_tab: '(opens in new tab)',
    },
  },
} as const;

export type Translations = typeof translations;
export type TranslationKeys = typeof translations.ko;
