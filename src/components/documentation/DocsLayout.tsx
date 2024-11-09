import { type Node } from '@markdoc/markdoc';

import { DocsHeader } from '@/components/documentation/DocsHeader';
import { PrevNextLinks } from '@/components/documentation/PrevNextLinks';
import { Prose } from '@/components/documentation/Prose';
import { TableOfContents } from '@/components/documentation/TableOfContents';
import { collectSections } from '@/lib/sections';

export function DocsLayout({
  children,
  frontmatter: { title },
  nodes,
}: {
  children: React.ReactNode;
  frontmatter: { title?: string };
  nodes: Array<Node>;
}) {
  let tableOfContents = collectSections(nodes);

  return (
    <>
      <div className="min-w-0 max-w-2xl flex-auto px-4 py-16 lg:max-w-none lg:pl-8 lg:pr-0 xl:px-16">
        <article>
          <DocsHeader title={title} />
          <Prose>{children}</Prose>
        </article>
        <PrevNextLinks />
      </div>
      <TableOfContents tableOfContents={tableOfContents} />
    </>
  );
}
