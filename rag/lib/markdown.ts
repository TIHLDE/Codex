import { readdirSync, readFileSync, statSync } from "fs";
import { extname, join } from "path";


export type MarkdownDocuments = {
  [key: string]: string;
};

export type MarkdownDocument = {
  path: string;
  content: string;
}

const readMarkdownFiles = (dir: string, filesContent: MarkdownDocuments = {}): MarkdownDocuments => {
    const files = readdirSync(dir);
  
    for (const file of files) {
      const filePath = join(dir, file);
      const stat = statSync(filePath);

      if (stat.isDirectory()) {
        readMarkdownFiles(filePath, filesContent);
      } else if (extname(file) === '.md') {
        const content = readFileSync(filePath, 'utf-8');
        filesContent[filePath] = content;
      }
    }
  
    return filesContent;
}


export default readMarkdownFiles;