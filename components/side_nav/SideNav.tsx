import React from "react";
import { useRouter } from "next/router";
import { NavItem } from "./NavItem";
import { navItems } from "../../constants/navItems";

export function SideNav() {
  const route = useRouter();
  return (
    <nav className="sidenav">
      {navItems.map((item) => (
        <NavItem
          itemData={item}
          indent={0}
          currentRoute={route.pathname}
          key={item.href}
        />
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
            color: var(--text-color);
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
