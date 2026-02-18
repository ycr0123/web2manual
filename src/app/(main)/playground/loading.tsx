export default function PlaygroundLoading() {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-background">
      {/* Toolbar skeleton */}
      <div className="flex items-center gap-2 px-4 py-2 border-b animate-pulse">
        <div className="h-5 w-32 rounded-full bg-muted" />
        <div className="flex-1" />
        <div className="h-8 w-28 rounded bg-muted" />
        <div className="h-8 w-16 rounded bg-muted" />
        <div className="h-8 w-16 rounded bg-muted" />
        <div className="h-8 w-8 rounded bg-muted" />
      </div>

      {/* Panels skeleton */}
      <div className="flex flex-1 overflow-hidden">
        {/* File tree */}
        <div className="w-48 border-r p-2 space-y-2 animate-pulse hidden md:block">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-5 rounded bg-muted" style={{ width: `${60 + (i % 3) * 15}%` }} />
          ))}
        </div>

        {/* Terminal */}
        <div className="flex-1 bg-[#0d1117] flex items-center justify-center">
          <div className="text-green-400/50 text-sm font-mono animate-pulse">
            터미널 초기화 중...
          </div>
        </div>

        {/* Code viewer */}
        <div className="w-96 border-l p-4 space-y-3 animate-pulse hidden md:block">
          <div className="h-4 rounded bg-muted w-3/4" />
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-3 rounded bg-muted" style={{ width: `${30 + (i % 5) * 12}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
