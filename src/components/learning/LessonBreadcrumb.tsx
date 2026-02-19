'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { Breadcrumb } from '@/components/common/Breadcrumb';

interface LessonBreadcrumbProps {
  trackId: string;
  trackTitle: string;
  lessonTitle: string;
  className?: string;
}

export function LessonBreadcrumb({ trackId, trackTitle, lessonTitle, className }: LessonBreadcrumbProps) {
  const { t } = useLanguage();

  const breadcrumbItems = [
    { label: t.lesson.breadcrumb_center, href: '/learn' },
    { label: trackTitle, href: `/learn/${trackId}` },
    { label: lessonTitle },
  ];

  return <Breadcrumb items={breadcrumbItems} className={className} />;
}
