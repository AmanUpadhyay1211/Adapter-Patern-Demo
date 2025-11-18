interface FooterProps {
  showing: number;
  total: number;
}

export function Footer({ showing, total }: FooterProps) {
  return (
    <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
      Showing {showing} of {total} students
    </div>
  );
}

