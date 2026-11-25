'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FaqAccordion({
  items,
}: {
  items: Array<{ question: string; answer: string }>;
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
      {items.map((item, idx) => {
        const isOpen = openIdx === idx;
        return (
          <div key={item.question} className="px-5 py-4">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenIdx(isOpen ? null : idx)}
              className="flex w-full items-center justify-between gap-4 text-left text-sm font-semibold text-slate-900 dark:text-white cursor-pointer"
            >
              <span>{item.question}</span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200',
                  isOpen && 'rotate-180 text-indigo-600'
                )}
              />
            </button>
            {isOpen && (
              <p className="mt-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {item.answer}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
