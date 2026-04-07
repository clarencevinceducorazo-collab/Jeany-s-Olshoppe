import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-16 pb-16 animate-in fade-in zoom-in-95 duration-1000">
      {/* Hero Skeleton (Only visible on home page but adds aesthetic loading feel to root) */}
      <section className="container mx-auto px-4 sm:px-6 pt-12 md:pt-20">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Text Side */}
          <div className="w-full md:w-5/12 flex flex-col gap-6 pt-6">
            <Skeleton className="h-5 w-24 rounded-full" />
            <div className="flex flex-col gap-3">
              <Skeleton className="h-14 md:h-20 w-4/5" />
              <Skeleton className="h-14 md:h-20 w-full" />
            </div>
            <Skeleton className="h-6 w-3/4 mt-4" />
            <div className="flex gap-4 pt-6">
              <Skeleton className="h-12 w-32 rounded-full" />
              <Skeleton className="h-12 w-32 rounded-full" />
            </div>
          </div>
          
          {/* Image Side */}
          <div className="w-full md:w-7/12">
            <Skeleton className="w-full max-w-2xl ml-auto aspect-[4/3] md:aspect-[3/2] rounded-[30px]" />
          </div>
        </div>
      </section>

      {/* Grid Skeleton */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col gap-3">
              <Skeleton className="w-full aspect-[4/5] rounded-xl" />
              <div className="flex justify-between items-start mt-2">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-5 w-1/4" />
              </div>
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
