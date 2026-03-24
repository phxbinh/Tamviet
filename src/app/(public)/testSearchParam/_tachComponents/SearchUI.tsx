'use client';

import { useState } from 'react';
import { FilterTrigger } from './FilterTrigger';
import { FilterPanel } from './FilterPanel';
import { StickyFilterWrapper } from '../_scrollsticky/StickyFilterWrapper';

interface Props {
  productTypes: any[];
  categoryTree: any[];
  path: string;
}

export function SearchUI({
  productTypes,
  categoryTree,
  path
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>   <div className="relative">
      {/* 🔥 Sticky */}
      <StickyFilterWrapper>
        <FilterTrigger
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
        />
      </StickyFilterWrapper>

      {/* 🔥 Panel */}
      <FilterPanel
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        productTypes={productTypes}
        categoryTree={categoryTree}
        path={path}
      /> </div>
    </>
  );
}