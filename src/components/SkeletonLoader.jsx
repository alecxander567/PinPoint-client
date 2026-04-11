import SkeletonCard from "./SkeletonCard";

function SkeletonLoader() {
  return (
    <div className="w-full min-h-screen">
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-500 to-blue-400 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-2xl bg-white/20 shrink-0" />
            <div className="flex-1">
              <div className="skeleton-block h-7 w-56 mb-2 rounded bg-white/40" />
              <div className="skeleton-block h-4 w-44 rounded bg-white/30" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-white/20 rounded-xl p-4 text-center">
                <div className="skeleton-block h-7 w-10 mx-auto mb-2 rounded bg-white/40" />
                <div className="skeleton-block h-3 w-16 mx-auto rounded bg-white/30" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-10">
        <div className="skeleton-block h-7 w-40 mb-6 rounded bg-indigo-100" />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
          {[0, 1, 2].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default SkeletonLoader;
