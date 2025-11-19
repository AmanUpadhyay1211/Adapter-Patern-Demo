interface FooterProps {
  showing: number;
  total: number;
}

export function Footer({ showing, total }: FooterProps) {
  return (
    <div className="px-6 py-4 bg-gradient-to-r from-gray-50/80 via-indigo-50/30 to-gray-50/80 border-t border-gray-200/50 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-600">
          Showing <span className="font-semibold text-indigo-600">{showing}</span> of{" "}
          <span className="font-semibold text-indigo-600">{total}</span> students
        </p>
        {showing < total && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Filtered results</span>
          </div>
        )}
      </div>
    </div>
  );
}

