import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllTracks, getTrackById } from '@/lib/learn';
import { TrackPageContent } from '@/components/learning/TrackPageContent';

interface TrackPageProps {
  params: Promise<{ trackId: string }>;
}

export async function generateStaticParams() {
  const tracks = getAllTracks();
  return tracks.map((track) => ({ trackId: track.id }));
}

export async function generateMetadata({ params }: TrackPageProps): Promise<Metadata> {
  const { trackId } = await params;
  const track = getTrackById(trackId);

  if (!track) {
    return { title: 'Track not found' };
  }

  return {
    title: track.title,
    description: track.description,
  };
}

export default async function TrackPage({ params }: TrackPageProps) {
  const { trackId } = await params;
  const track = getTrackById(trackId);

  if (!track) notFound();

  return <TrackPageContent track={track} />;
}
