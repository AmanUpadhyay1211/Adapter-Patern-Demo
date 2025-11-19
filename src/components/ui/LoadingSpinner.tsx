export function LoadingSpinner() {
  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-16 text-center animate-fade-in">
      <div className="relative mx-auto w-16 h-16 mb-6">
        <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute inset-2 border-4 border-purple-300 rounded-full border-r-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>
      <p className="text-lg font-medium text-gray-700">Loading students...</p>
      <p className="text-sm text-gray-500 mt-2">Please wait while we fetch the data</p>
    </div>
  );
}

