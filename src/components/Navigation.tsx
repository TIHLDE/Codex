import { usePathname } from 'next/navigation';
import clsx from 'clsx';

import { navigation, type Navigation } from '@/lib/navigation';
import React from 'react';
import Link from 'next/link';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

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
  const [expanded, setExpanded] = React.useState<boolean>(false);

  return (
    <li key={navigation.href} className="pl-2">
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
      )
    }
    </li>
  );
}


interface NavigationExpandableProps {
  navigation: Navigation;
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  onLinkClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

function NavigationExpandable({
  navigation,
  expanded,
  setExpanded,
  onLinkClick,
}: NavigationExpandableProps) {
  const pathname = usePathname();

  const Icon = expanded ? ChevronDownIcon : ChevronRightIcon;

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  if (navigation.href) {
    return (
      <div className='flex items-center justify-between w-full space-x-2'>
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

        {navigation.children && (
          <button onClick={handleExpand} className='p-1 rounded-full hover:bg-gray-200'>
            <Icon className='w-5 h-5'/>
          </button>
        )}
      </div>
    );
  };

  return (
    <div className='flex items-center justify-between w-full space-x-2'>
      <p>
        {navigation.title}
      </p>

      <button onClick={handleExpand} className='p-1 rounded-full hover:bg-gray-200'>
        <Icon className='w-5 h-5'/>
      </button>
    </div>
  );
};

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
