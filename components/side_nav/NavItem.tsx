import React, { useState } from "react";
import Link from "next/link";
import AnimateHeight from "react-animate-height";

export interface NavItemData {
  title: string;
  href: string;
  children?: NavItemData[];
}

export interface NavItemProps {
  itemData: NavItemData;
  indent: number;
  currentRoute: string;
}

export function NavItem({
  indent,
  itemData: parentData,
  currentRoute,
}: NavItemProps) {
  const isActive =
    parentData.href !== ""
      ? currentRoute.includes(parentData.href)
      : currentRoute === "/docs";
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div key={parentData.href} style={{ marginTop: "0.4rem" }}>
      <span
        className={
          "material-symbols-outlined icon chevron not-selectable" +
          (isCollapsed ? "" : " chevron-open")
        }
        style={{
          cursor: "pointer",
          color: parentData.children ? "var(--text-color)" : "transparent",
        }}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        chevron_right
      </span>
      <Link href={`/docs${parentData.href}`} className={"side-link"}>
        <span
          style={{
            fontWeight: isActive ? "bold" : undefined,
            color: "var(--text-color)",
          }}
        >
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
