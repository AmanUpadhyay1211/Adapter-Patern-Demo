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
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Students Table</h1>
        <RefreshButton
          onRefresh={onRefresh}
          isLoading={isLoading}
          isRefreshing={isRefreshing}
        />
      </div>

      <SearchBar searchTerm={searchTerm} onSearchChange={onSearchChange} />

      <StatusBadges
        isLoading={isLoading}
        isRefreshing={isRefreshing}
        error={error}
        studentsCount={studentsCount}
      />
    </div>
  );
}

