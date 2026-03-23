'use client';

import { useState } from 'react';
import { FilterTrigger } from './FilterTrigger';
import { FilterPanel } from './FilterPannel';

export function ExpandableSearch(props: any) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* 👉 Nằm trong Sticky */}
      <FilterTrigger 
        isExpanded={isExpanded} 
        setIsExpanded={setIsExpanded} 
      />

      {/* 👉 Panel tách riêng */}
      <FilterPanel 
        {...props}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
      />
    </>
  );
}