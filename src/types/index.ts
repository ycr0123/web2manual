export * from './content';

// 공통 유틸리티 타입
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// 페이지 Props 타입
export interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

// 에러 타입
export interface AppError {
  message: string;
  code?: string;
  status?: number;
}
