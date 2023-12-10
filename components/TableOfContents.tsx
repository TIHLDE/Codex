import React from "react";
import Link from "next/link";

export function TableOfContents({ toc }) {
  const items = toc.filter(
    (item) => item.id && (item.level === 2 || item.level === 3),
  );

  // if (items.length <= 1) {
  //   return null;
  // }

  return (
    <nav className="toc">
      <div className="heading">Content</div>
      <ul className="flex column">
        {items.map((item) => {
          const href = `#${item.id}`;
          const active =
            typeof window !== "undefined" && window.location.hash === href;
          return (
            <li
              key={item.title}
              className={[
                active ? "active" : undefined,
                item.level === 3 ? "padded" : undefined,
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <Link href={href}>{item.title}</Link>
            </li>
          );
        })}
      </ul>
      <style jsx>
        {`
          nav {
            position: sticky;
            top: calc(2.5rem + var(--top-nav-height));
            max-height: calc(100vh - var(--top-nav-height));
            flex: 0 0 auto;
            align-self: flex-start;
            margin-bottom: 1rem;
            padding: 0.5rem 0 0;
            border-left: 1px solid var(--border-color);
          }
          ul {
            margin: 0;
            padding: 0 1.5rem;
          }
          li {
            list-style-type: none;
            margin: 0 0 1rem;
          }
          li :global(a) {
            text-decoration: none;
            color: var(--text-color);
          }
          li :global(a:hover),
          li.active :global(a) {
            text-decoration: none;
          }
          li.padded {
            padding-left: 1rem;
          }

          .heading {
            font-size: 1.1rem;
            font-weight: 500;
            padding-left: 1.5rem;
            margin-bottom: 1rem;
            min-width: 10rem;
          }
        `}
      </style>
    </nav>
  );
}
