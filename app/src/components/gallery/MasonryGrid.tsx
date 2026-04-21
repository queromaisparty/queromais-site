import type { ReactNode } from 'react';

interface MasonryGridProps {
  children: ReactNode;
  className?: string;
}

export function MasonryGrid({ children, className = '' }: MasonryGridProps) {
  return (
    <div
      className={`masonry-grid ${className}`}
      style={{
        columns: '1',
        columnGap: '12px',
      }}
    >
      {children}

      <style>{`
        @media (min-width: 640px) {
          .masonry-grid {
            columns: 2 !important;
            column-gap: 14px !important;
          }
        }
        @media (min-width: 1024px) {
          .masonry-grid {
            columns: 3 !important;
            column-gap: 16px !important;
          }
        }
        @media (min-width: 1440px) {
          .masonry-grid {
            columns: 4 !important;
            column-gap: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}
