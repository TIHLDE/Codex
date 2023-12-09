import React from "react";
import Link from "next/link";
import { ThemeSwitcher } from "./ThemeSwitcher";
import FoodManagerLogo from "../FoodManagerLogo";

interface TopNavProps {
  children?: React.ReactNode;
}

export function TopNav({ children }: TopNavProps) {
  return (
    <nav>
      <Link
        href="/"
        style={{
          height: "auto",
          justifyContent: "center",
          display: "flex",
          width: "8rem",
        }}
      >
        <FoodManagerLogo
          style={{ fill: "var(--text-color)", transitionDuration: "500ms" }}
        />
      </Link>
      {children && <section>{children}</section>}
      <ThemeSwitcher />
      <style jsx>
        {`
          nav {
            transition-duration: 500ms;
            top: 0;
            position: fixed;
            width: 100%;
            z-index: 100;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            padding: 1rem 2rem;
            background: var(--card-color);
            border-bottom: 1px solid var(--border-color);
          }
          nav :global(a) {
            text-decoration: none;
          }
          section {
            display: flex;
            gap: 1rem;
            padding: 0;
          }
        `}
      </style>
    </nav>
  );
}
