import ProductSkeletonV2 from '@/components/ProductSkeletonV2';

export default function RingsLoading() {
  return (
    <div className="min-h-screen bg-[#f5f3ea]">
      <div className="w-full py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="h-10 bg-gray-200 animate-pulse w-1/3 mx-auto mb-4 rounded"></div>
          <div className="h-6 bg-gray-200 animate-pulse w-2/3 mx-auto rounded"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[4px] auto-rows-min">
          {Array.from({ length: 12 }).map((_, i) => (
            <ProductSkeletonV2 key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
