import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import AnimateHeight from "react-animate-height";

interface NavItemData {
  title: string;
  href: string;
  children?: NavItemData[];
}

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

interface NavItemProps {
  itemData: NavItemData;
  indent: number;
  currentRoute: string;
}

function NavItem({ indent, itemData: parentData, currentRoute }: NavItemProps) {
  const isActive =
    parentData.href !== ""
      ? currentRoute.includes(parentData.href)
      : currentRoute === "/docs";
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div key={parentData.href} style={{ marginTop: "0.4rem" }}>
      <span
        className={
          "material-symbols-outlined icon chevron" +
          (isCollapsed ? "" : " chevron-open")
        }
        style={{
          cursor: "pointer",
          color: parentData.children ? undefined : "transparent",
        }}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        chevron_right
      </span>
      <Link href={`/docs${parentData.href}`}>
        <span style={{ fontWeight: isActive ? "bold" : undefined }}>
          {parentData.title}
        </span>
      </Link>
      {parentData.children && (
        <AnimateHeight height={isCollapsed ? 0 : "auto"} duration={200}>
          <div
            className="nav-parent"
            style={{
              paddingLeft: (indent + 1) * 0.8 + "rem",
            }}
          >
            {parentData.children.map((child) => (
              <NavItem
                itemData={child}
                indent={indent + 1}
                currentRoute={currentRoute}
              />
            ))}
          </div>
        </AnimateHeight>
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
