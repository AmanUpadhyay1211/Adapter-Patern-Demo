interface StatusBadgesProps {
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  studentsCount: number;
}

export function StatusBadges({ isLoading, isRefreshing, error, studentsCount }: StatusBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2 text-sm">
      {isLoading && (
        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 rounded-full font-medium shadow-sm animate-pulse">
          <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping"></span>
          Loading...
        </span>
      )}
      {isRefreshing && (
        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full font-medium shadow-sm">
          <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Syncing...
        </span>
      )}
      {error && (
        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-red-100 to-rose-100 text-red-800 rounded-full font-medium shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </span>
      )}
      {!isLoading && !isRefreshing && !error && (
        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 rounded-full font-medium shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {studentsCount} {studentsCount === 1 ? 'student' : 'students'} loaded
        </span>
      )}
    </div>
  );
}

