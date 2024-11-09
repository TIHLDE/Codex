'use client';

import { usePathname } from 'next/navigation';

import { Navigation, navigation } from '@/lib/navigation';

export function DocsHeader({ title }: { title?: string }) {
  let pathname = usePathname();
  // Recursively find the section that contains the current page
  let section = findDeepestChild(navigation, pathname);

  if (!title && !section) {
    return null;
  }

  return (
    <header className="mb-9 space-y-1">
      {section && (
        <p className="font-display text-sm font-medium text-sky-500">
          {section.title}
        </p>
      )}
      {title && (
        <h1 className="font-display text-3xl tracking-tight text-slate-900 dark:text-white">
          {title}
        </h1>
      )}
    </header>
  );
}

function findDeepestChild(
  roots: Navigation[],
  pathname: string,
): Navigation | null {
  const paths = pathname.split('/').filter((p) => p.length > 0);
  let current: Navigation | undefined;
  let deepestMatch: Navigation | null = null;

  // Start by finding the initial navigation node that matches the first path segment
  for (const root of roots) {
    if (root.href === paths[0]) {
      current = root;
      deepestMatch = root;
      break; // Found the matching root node, no need to check further
    }
  }

  // If no matching root is found, return null early
  if (!current) return null;

  // Traverse each subsequent path segment
  for (let i = 1; i < paths.length; i++) {
    const path = paths[i];
    let found = false;

    // Look for a child that matches the current path segment
    current.children?.forEach((child) => {
      if (child.href === path) {
        current = child;
        deepestMatch = child;
        found = true;
      }
    });

    // If no child matches the current path segment, break the loop
    if (!found) break;
  }

  return deepestMatch;
}
