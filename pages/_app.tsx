import React from "react";
import Head from "next/head";

import { SideNav, TableOfContents, TopNav } from "../components";

import "prismjs";
// Import other Prism themes here
import "prismjs/components/prism-bash.min";
import "prismjs/components/prism-javascript.min";
import "prismjs/components/prism-json.min";
import "prismjs/components/prism-yaml.min";
// import "prismjs/themes/prism.css";

import "../public/globals.css";
import "../public/codeStyle.css";

import type { AppProps } from "next/app";
import type { MarkdocNextJsPageProps } from "@markdoc/next.js";

export const TITLE = "FoodManager Documentation";
export const DESCRIPTION = "Documentation for FoodManager";

function collectHeadings(node, sections = []) {
  if (node) {
    if (node.name?.toLowerCase() === "heading") {
      const title = node.children[0];

      if (typeof title === "string") {
        sections.push({
          ...node.attributes,
          title,
        });
      }
    }

    if (node.children) {
      for (const child of node.children) {
        collectHeadings(child, sections);
      }
    }
  }

  return sections;
}

export default function DocumentationApp({
  Component,
  pageProps,
}: AppProps<MarkdocNextJsPageProps>) {
  const { markdoc } = pageProps;

  const title = markdoc?.frontmatter.title ?? TITLE;
  const description = markdoc?.frontmatter.description ?? DESCRIPTION;

  const toc = markdoc?.content ? collectHeadings(markdoc.content) : [];

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="referrer" content="strict-origin" />
        <meta name="title" content={title} />
        <meta name="description" content={description} />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <TopNav />
      <div className="page">
        <SideNav />
        <main className="flex column">
          <Component {...pageProps} />
        </main>
        <TableOfContents toc={toc} />
      </div>
      <style jsx>
        {`
          .page {
            position: fixed;
            top: var(--top-nav-height);
            display: flex;
            width: 100vw;
            flex-grow: 1;
          }
          main {
            overflow: auto;
            height: calc(100vh - var(--top-nav-height));
            flex-grow: 1;
            font-size: 16px;
            padding: 0 2rem 2rem;
          }
        `}
      </style>
    </>
  );
}
