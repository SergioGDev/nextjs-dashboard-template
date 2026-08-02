'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getSearchableRoutes } from '@/lib/route-info';
import { cn } from '@/lib/utils';

interface SearchResult {
  href: string;
  label: string;
}

/**
 * Client-side, synchronous route navigator. Reads sidebarConfig (via
 * getSearchableRoutes) instead of a parallel route list — see B13.1 DECISIÓN 1.
 * Labels are i18n keys, so every entry is translated before it's matched
 * against the query — otherwise "usuarios" would never find "sidebar.items.users".
 */
export function TopbarSearch() {
  const t = useTranslations('common');
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const routes = useMemo(() => getSearchableRoutes(), []);

  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return routes
      .map((route) => ({ href: route.href, label: t(route.label) }))
      .filter((route) => route.label.toLowerCase().includes(q));
  }, [query, routes, t]);

  const showDropdown = isOpen && query.trim().length > 0;

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setActiveIndex(0);
  }, []);

  const navigateTo = useCallback(
    (href: string) => {
      router.push(href);
      setQuery('');
      closeDropdown();
    },
    [router, closeDropdown],
  );

  useEffect(() => {
    if (!showDropdown) return;
    function onMouseDown(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        closeDropdown();
      }
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [showDropdown, closeDropdown]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showDropdown || results.length === 0) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (results[activeIndex]) navigateTo(results[activeIndex].href);
        break;
      case 'Escape':
        e.preventDefault();
        closeDropdown();
        break;
    }
  }

  return (
    <div ref={containerRef} className="relative hidden md:block w-56">
      <Input
        role="combobox"
        aria-expanded={showDropdown}
        aria-controls="topbar-search-listbox"
        aria-autocomplete="list"
        placeholder={t('navigation.searchPlaceholder')}
        leftIcon={<Search size={14} />}
        className="h-8 text-xs"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
          setActiveIndex(0);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
      />
      {showDropdown && (
        <div
          id="topbar-search-listbox"
          role="listbox"
          aria-label={t('navigation.searchResultsLabel')}
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-72 overflow-y-auto rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] py-1 shadow-[var(--shadow-pop)]"
        >
          {results.length === 0 ? (
            <p className="px-3 py-2 text-xs text-[var(--text-muted)]">{t('navigation.searchEmpty')}</p>
          ) : (
            results.map((route, i) => (
              <button
                key={route.href}
                type="button"
                role="option"
                tabIndex={-1}
                aria-selected={i === activeIndex}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => navigateTo(route.href)}
                onMouseEnter={() => setActiveIndex(i)}
                className={cn(
                  'flex w-full items-center px-3 py-2 text-left text-sm text-[var(--text-primary)] transition-colors',
                  i === activeIndex ? 'bg-[var(--surface-raised)]' : 'hover:bg-[var(--surface-raised)]',
                )}
              >
                {route.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
