// Comprehensive, reusable skeleton loaders matching site design
export const DoctorCardSkeleton = () => (
  <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs flex flex-col md:flex-row h-auto md:h-[220px] w-full animate-pulse">
    {/* Left Photo Skeleton */}
    <div className="w-full md:w-[32%] bg-slate-200 min-h-[180px] md:min-h-full shrink-0 relative flex items-center justify-center">
      <div className="w-16 h-16 rounded-full bg-slate-300" />
    </div>
    {/* Right Details Skeleton */}
    <div className="w-full md:w-[68%] p-5 flex flex-col justify-between space-y-4">
      <div className="space-y-2.5">
        <div className="h-5 bg-slate-200 rounded-md w-3/4" />
        <div className="h-3.5 bg-slate-200 rounded-md w-1/2" />
        <div className="h-3 bg-slate-100 rounded-md w-2/3 mt-2" />
      </div>
      <div className="space-y-2 pt-2">
        <div className="h-3 bg-slate-100 rounded-md w-1/3" />
        <div className="flex gap-2 pt-2">
          <div className="h-9 bg-slate-200 rounded-xl flex-1" />
          <div className="h-9 bg-slate-200 rounded-xl flex-1" />
        </div>
      </div>
    </div>
  </div>
);

export const HomeDoctorCardSkeleton = () => (
  <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs flex flex-row h-[235px] w-full animate-pulse">
    <div className="w-[44%] bg-slate-200 flex flex-col justify-between shrink-0">
      <div className="flex-1" />
      <div className="h-10 bg-slate-300 w-full" />
    </div>
    <div className="w-[56%] p-4 flex flex-col justify-between bg-white">
      <div className="space-y-2.5">
        <div className="h-4 bg-slate-200 rounded w-4/5" />
        <div className="h-3 bg-slate-200 rounded w-1/2" />
        <div className="h-3 bg-slate-100 rounded w-3/4 mt-2" />
      </div>
      <div className="h-8 bg-slate-200 rounded-lg w-full" />
    </div>
  </div>
);

export const DepartmentCardSkeleton = () => (
  <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col animate-pulse min-h-[300px] justify-between">
    <div>
      <div className="w-16 h-16 rounded-2xl bg-slate-200 mb-6" />
      <div className="h-6 bg-slate-200 rounded-md w-3/4 mb-4" />
      <div className="space-y-2 mb-6">
        <div className="h-3.5 bg-slate-100 rounded w-full" />
        <div className="h-3.5 bg-slate-100 rounded w-5/6" />
        <div className="h-3.5 bg-slate-100 rounded w-2/3" />
      </div>
    </div>
    <div className="space-y-2 pt-4 border-t border-slate-100">
      <div className="h-10 bg-slate-200 rounded-xl w-full" />
    </div>
  </div>
);

export const BlogCardSkeleton = () => (
  <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden flex flex-col animate-pulse shadow-xs">
    <div className="w-full aspect-[16/10] bg-slate-200 shrink-0" />
    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
      <div>
        <div className="flex gap-3 mb-3">
          <div className="h-3.5 bg-slate-200 rounded-full w-20" />
          <div className="h-3.5 bg-slate-200 rounded-full w-16" />
        </div>
        <div className="h-5 bg-slate-200 rounded-md w-4/5 mb-2" />
        <div className="h-5 bg-slate-200 rounded-md w-3/5 mb-4" />
        <div className="space-y-2">
          <div className="h-3 bg-slate-100 rounded w-full" />
          <div className="h-3 bg-slate-100 rounded w-5/6" />
        </div>
      </div>
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="h-4 bg-slate-200 rounded-full w-24" />
        <div className="h-4 bg-slate-200 rounded-full w-20" />
      </div>
    </div>
  </div>
);

export const GalleryCardSkeleton = ({ span = "col-span-1" }) => (
  <div className={`rounded-[2rem] aspect-[16/10] bg-slate-200 border border-slate-250/60 animate-pulse ${span}`} />
);

export const NavbarDropdownSkeleton = () => (
  <div className="grid grid-cols-3 gap-2 min-w-[580px] p-2 animate-pulse">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
        <div className="w-9 h-9 rounded-xl bg-slate-200 shrink-0" />
        <div className="flex-1 space-y-1.5 min-w-0">
          <div className="h-3 bg-slate-200 rounded w-3/4" />
          <div className="h-2.5 bg-slate-100 rounded w-1/2" />
        </div>
      </div>
    ))}
  </div>
);
