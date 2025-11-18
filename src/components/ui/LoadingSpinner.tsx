export function LoadingSpinner() {
  return (
    <div className="bg-white rounded-lg shadow-md p-12 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading students...</p>
    </div>
  );
}

