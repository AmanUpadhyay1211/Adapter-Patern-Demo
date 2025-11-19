import { RefreshButton } from './ui/RefreshButton';
import { SearchBar } from './ui/SearchBar';
import { StatusBadges } from './ui/StatusBadges';

interface HeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  studentsCount: number;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export function Header({
  onRefresh,
  isLoading,
  isRefreshing,
  error,
  studentsCount,
  searchTerm,
  onSearchChange,
}: HeaderProps) {
  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 md:p-8 mb-6 animate-slide-in">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Students Management
          </h1>
          <p className="text-sm text-gray-500">Real-time collaboration enabled</p>
        </div>
        <RefreshButton
          onRefresh={onRefresh}
          isLoading={isLoading}
          isRefreshing={isRefreshing}
        />
      </div>

      <div className="mb-4">
        <SearchBar searchTerm={searchTerm} onSearchChange={onSearchChange} />
      </div>

      <StatusBadges
        isLoading={isLoading}
        isRefreshing={isRefreshing}
        error={error}
        studentsCount={studentsCount}
      />
    </div>
  );
}

