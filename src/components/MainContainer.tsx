import type { ReactNode } from 'react';

interface MainContainerProps {
  children: ReactNode;
}

export function MainContainer({ children }: MainContainerProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">{children}</div>
    </div>
  );
}

