import { MarkdownDocument } from "./markdown";
import splitContent from "./splitter";


export type Section = {
    title: string;
    url: string;
    content: string;
    index: number;
};

const parseTitle = (content: string): string | null => {
    const titleMatch = content.match(/^---\s*title:\s*(.*?)\s*---/s);
    return titleMatch ? titleMatch[1] : null;
};

const removeTitle = (content: string): string => {
    return content.replace(/^---\s*title:\s*(.*?)\s*---/s, '');
};

const parsePath = (path: string): string => {
    const normalizedPath = path.replace(/\\/g, '/');
    
    const docsIndex = normalizedPath.indexOf('/docs/');

    if (docsIndex !== -1) {
        let docsPath = normalizedPath.substring(docsIndex + 1);
    
        const lastSlashIndex = docsPath.lastIndexOf('/');
        if (lastSlashIndex !== -1) {
          docsPath = docsPath.substring(0, lastSlashIndex);
        }
    
        return docsPath;
    }

    return '';
}

const parseMDFile = (document: MarkdownDocument): Section[] => {
    const title = parseTitle(document.content);
    const content = removeTitle(document.content);

    const sections = splitContent(content);
    const path = parsePath(document.path);

    return sections.map((section, index) => ({
        title: title || path,
        url: path,
        content: section,
        index
    }));
};


export default parseMDFile;