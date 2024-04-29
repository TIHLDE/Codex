import { usePathname } from 'next/navigation';
import clsx from 'clsx';

import { navigation, type Navigation } from '@/lib/navigation';
import React from 'react';
import Link from 'next/link';

export function Navigation({
  className,
  onLinkClick,
}: {
  className?: string;
  onLinkClick?: React.MouseEventHandler<HTMLAnchorElement>;
}) {
  return (
    <nav className={clsx('text-base lg:text-sm', className)}>
      <ul role="list" className="space-y-9">
        {navigation.map((section) => (
          <NavigationSection
            key={section.title}
            section={section}
            onLinkClick={onLinkClick}
          />
        ))}
      </ul>
    </nav>
  );
}

interface NavigationSectionProps {
  section: Navigation;
  onLinkClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

function RecursiveLink({
  navigation,
  onLinkClick,
  level = 0,
}: {
  navigation: Navigation;
  onLinkClick?: React.MouseEventHandler<HTMLAnchorElement>;
  level?: number;
}) {
  const pathname = usePathname();

  return (
    <li key={navigation.href} className="pl-2">
      {navigation.href ? (
        <Link
          href={navigation.href ?? ''}
          onClick={onLinkClick}
          className={clsx(
            'block',
            navigation.href === pathname
              ? 'font-semibold text-sky-500'
              : 'text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300',
          )}
        >
          {navigation.title}
        </Link>
      ) : (
        <span
          className={clsx(
            'block',
            navigation.href === pathname
              ? 'font-semibold text-sky-500'
              : 'text-slate-500 dark:text-slate-400',
          )}
        >
          {navigation.title}
        </span>
      )}

      {navigation.children && (
        <ul
          role="list"
          className="mt-2 space-y-2 border-l-2 border-slate-100 lg:mt-4 lg:space-y-4 lg:border-slate-200 dark:border-slate-800"
        >
          {navigation.children.map((child) => (
            <div style={{ marginLeft: '0.25rem' }} key={child.title}>
              <RecursiveLink
                key={child.title}
                navigation={child}
                onLinkClick={onLinkClick}
                level={level + 1}
              />
            </div>
          ))}
        </ul>
      )}
    </li>
  );
}

function NavigationSection({ section, onLinkClick }: NavigationSectionProps) {
  return (
    <ul role="list" className="space-y-9">
      <Link
        href={section.href ?? ''}
        className="font-display font-medium text-slate-900 dark:text-white"
      >
        {section.title}
      </Link>
      {section.children && (
        <ul
          role="list"
          className="mt-2 space-y-2 border-l-2 border-slate-100 lg:mt-4 lg:space-y-4 lg:border-slate-200 dark:border-slate-800"
        >
          {section.children.map((child) => (
            <RecursiveLink
              key={child.title}
              navigation={child}
              onLinkClick={onLinkClick}
            />
          ))}
        </ul>
      )}
    </ul>
  );
}
