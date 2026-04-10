function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md">
      <div className="skeleton-block h-44" />
      <div className="p-4">
        <div className="skeleton-block h-4 w-3/4 mb-2 rounded" />
        <div className="skeleton-block h-3 w-1/2 mb-4 rounded" />
        <div className="skeleton-block h-24 w-24 mx-auto mb-4 rounded-lg" />
        <div className="flex gap-2">
          <div className="skeleton-block flex-1 h-9 rounded-lg" />
          <div className="skeleton-block flex-1 h-9 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default SkeletonCard;
