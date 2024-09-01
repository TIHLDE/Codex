import { usePathname } from 'next/navigation';
import clsx from 'clsx';

import { navigation, type Navigation } from '@/lib/navigation';
import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

interface NavigationProps {
  className?: string;
  onLinkClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export function Navigation({ className, onLinkClick }: NavigationProps) {
  return (
    <nav className={clsx('text-base lg:text-sm', className)}>
      <ul role="list" className="space-y-9">
        {navigation.map((section) => (
          <NavigationSection
            key={section.title}
            onLinkClick={onLinkClick}
            section={section}
          />
        ))}
      </ul>
    </nav>
  );
}

interface RecursiveLinkProps {
  navigation: Navigation;
  onLinkClick?: React.MouseEventHandler<HTMLAnchorElement>;
  level?: number;
}

function RecursiveLink({
  navigation,
  onLinkClick,
  level = 0,
}: RecursiveLinkProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <li key={navigation.href} className="pl-3">
      <NavigationExpandable
        navigation={navigation}
        expanded={expanded}
        setExpanded={setExpanded}
      />

      {navigation.children && expanded && (
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

interface NavigationExpandableProps {
  navigation: Navigation;
  expanded: boolean;
  setExpanded: (value: boolean) => void;
  onLinkClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

function NavigationExpandable({
  navigation,
  expanded,
  setExpanded,
  onLinkClick,
}: NavigationExpandableProps) {
  const pathname = usePathname();

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  if (navigation.href) {
    return (
      <div className="flex w-full items-center justify-between space-x-2">
        <Link
          href={navigation.href ?? ''}
          onClick={onLinkClick}
          className={clsx(
            'block',
            navigation.href === pathname
              ? 'font-semibold text-sky-500 underline'
              : 'text-slate-500 hover:text-slate-600 hover:underline dark:text-slate-400 dark:hover:text-slate-300',
          )}
        >
          {navigation.title}
        </Link>

        {navigation.children && (
          <ExpandButton expanded={expanded} onClick={handleExpand} />
        )}
      </div>
    );
  }

  return (
    <div className="flex w-full items-center justify-between space-x-2">
      <p>{navigation.title}</p>
      <ExpandButton expanded={expanded} onClick={handleExpand} />
    </div>
  );
}

interface ExpandButtonProps {
  expanded: boolean;
  onClick: () => void;
}

function ExpandButton({ expanded, onClick }: ExpandButtonProps) {
  const Icon = expanded ? ChevronDownIcon : ChevronRightIcon;

  return (
    <button
      onClick={onClick}
      className="rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}

interface NavigationSectionProps {
  onLinkClick?: React.MouseEventHandler<HTMLAnchorElement>;
  section: Navigation;
}

function NavigationSection({ section, onLinkClick }: NavigationSectionProps) {
  const pathname = usePathname();

  return (
    <ul role="list" className="space-y-9">
      <Link
        href={section.href ?? ''}
        className={clsx(
          'font-display font-medium',
          section.href === pathname
            ? 'font-semibold text-sky-500 underline'
            : 'text-slate-900 dark:text-white',
          !!section.href ? 'hover:underline' : 'pointer-events-none',
        )}
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
