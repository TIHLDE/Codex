import React from "react";
import { useRouter } from "next/router";
import { NavItem, NavItemData } from "./NavItem";

const items: NavItemData[] = [
  {
    title: "Get started",
    href: "",
  },
  {
    title: "Frontend",
    href: "/frontend",
    children: [
      {
        title: "Components",
        href: "/frontend/components",
      },
      {
        title: "Style guide",
        href: "/frontend/style_guide",
      },
    ],
  },
  {
    title: "Backend",
    href: "/backend",
    children: [
      {
        title: "Database",
        href: "/backend/database",
      },
      {
        title: "API Reference",
        href: "/backend/api",
      },
    ],
  },
];

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
            width: 15rem;
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
