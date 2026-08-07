import React from 'react';
import { Loader2 } from 'lucide-react';

const LazyLoader = () => {
  return (
    <div className="min-h-[50vh] w-full flex flex-col items-center justify-center py-16 px-4">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-9 h-9 animate-spin text-[#4A97E4]" />
        <span className="text-sm font-medium text-slate-500 tracking-wide">
          Loading content...
        </span>
      </div>
    </div>
  );
};

export default LazyLoader;
