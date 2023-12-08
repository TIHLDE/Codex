import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";

interface NavItemData {
  title: string;
  href: string;
  children?: NavItemData[];
}

const items: NavItemData[] = [
  {
    title: "Get started",
    href: "/docs",
  },
  {
    title: "Frontend",
    href: "/docs/frontend/index.md",
    children: [
      {
        title: "Components",
        href: "/docs/frontend/components.md",
      },
      {
        title: "Style guide",
        href: "/docs/frontend/style_guide.md",
      },
    ],
  },
  {
    title: "Backend",
    href: "/docs/backend/index.md",
    children: [
      {
        title: "Overview",
        href: "/docs/backend/overview.md",
      },
      {
        title: "Database",
        href: "/docs/backend/database.md",
      },
      {
        title: "API Reference",
        href: "/docs/backend/api.md",
      },
    ],
  },
];

interface NavItemProps {
  itemData: NavItemData;
  indent: number;
  currentRoute: string;
}

function NavItem({ indent, itemData: parentData, currentRoute }: NavItemProps) {
  return (
    <div key={parentData.href}>
      <Link href={parentData.href}>
        <span>{parentData.title}</span>
      </Link>
      {parentData.children?.length && (
        <ul className="flex column">
          {parentData.children.map((child) => {
            const active = currentRoute === child.href;
            return (
              <li key={child.href} className={active ? "active" : ""}>
                <NavItem
                  itemData={child}
                  indent={indent + 1}
                  currentRoute={currentRoute}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function SideNav() {
  const route = useRouter();
  return (
    <nav className="sidenav">
      {items.map((item) => (
        <NavItem itemData={item} indent={0} currentRoute={route.pathname} />
      ))}
      <style jsx>
        {`
          nav {
            position: sticky;
            top: var(--top-nav-height);
            height: calc(100vh - var(--top-nav-height));
            flex: 0 0 auto;
            overflow-y: auto;
            padding: 2.5rem 2rem 2rem;
            border-right: 1px solid var(--border-color);
          }
          span {
            font-size: larger;
            font-weight: 500;
            padding: 0.5rem 0 0.5rem;
          }
          ul {
            padding: 0;
          }
          li {
            list-style: none;
            margin: 0;
          }
          li :global(a) {
            text-decoration: none;
          }
          li :global(a:hover),
          li.active :global(a) {
            text-decoration: underline;
          }
        `}
      </style>
    </nav>
  );
}
