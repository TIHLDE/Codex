import React from "react";
import Link from "next/link";
import { ThemeSwitcher } from "./ThemeSwitcher";
import Image from "next/image";
import TihldeLogo from "../../public/assets/tihlde_logo.png";

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
          justifyContent: "flex-start",
          display: "flex",
          width: "10rem",
          alignItems: "center",
          gap: "0.5rem",
          color: "var(--text-color)",
        }}
      >
        <Image src={TihldeLogo} alt={"tihlde_logo"} width={30} height={30} />
        Index Docs
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
            max-height: var(--top-nav-height);
            z-index: 100;
            display: flex;
            align-items: center;
            justify-content: space-between;
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
