import Link from 'next/link';
import { BookOpen, Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <BookOpen className="h-16 w-16 text-muted-foreground mb-6" aria-hidden="true" />
      <h1 className="text-4xl font-bold mb-3">404</h1>
      <h2 className="text-xl font-semibold mb-3">페이지를 찾을 수 없습니다</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/">
          <Button className="gap-2">
            <Home className="h-4 w-4" aria-hidden="true" />
            홈으로 이동
          </Button>
        </Link>
        <Link href="/reference">
          <Button variant="outline" className="gap-2">
            <Search className="h-4 w-4" aria-hidden="true" />
            레퍼런스 보기
          </Button>
        </Link>
      </div>
    </div>
  );
}
