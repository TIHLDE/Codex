import React from "react";
import Image from "next/image";
import Link from "next/link";

interface TopNavProps {
  children?: React.ReactNode;
}

export function TopNav({ children }: TopNavProps) {
  return (
    <nav>
      <Link
        href="/"
        style={{
          height: "fit-content",
          justifyContent: "center",
          display: "flex",
        }}
      >
        <Image
          alt={"FoodManager logo"}
          src={"/assets/food_manager_logo.svg"}
          width={233 / 2}
          height={50 / 2}
        />
      </Link>
      {children && <section>{children}</section>}
      <style jsx>
        {`
          nav {
            top: 0;
            position: fixed;
            width: 100%;
            z-index: 100;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            padding: 1rem 2rem;
            background: white;
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
