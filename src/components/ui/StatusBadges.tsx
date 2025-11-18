interface StatusBadgesProps {
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  studentsCount: number;
}

export function StatusBadges({ isLoading, isRefreshing, error, studentsCount }: StatusBadgesProps) {
  return (
    <div className="mt-4 flex gap-4 text-sm">
      {isLoading && (
        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">Loading...</span>
      )}
      {isRefreshing && (
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">Refreshing...</span>
      )}
      {error && (
        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full">Error: {error}</span>
      )}
      {!isLoading && !isRefreshing && !error && (
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
          {studentsCount} students loaded
        </span>
      )}
    </div>
  );
}

