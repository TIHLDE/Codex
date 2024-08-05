import { join } from "path";
import readMarkdownFiles from "./lib/markdown";
import parseMDFile from "./lib/markdownParser";
import uploadSections from "./lib/supabase";


const createEmbeddings = async () => {
    const startFolder = join(__dirname, '..', 'src', 'app', '(private)', '(docs)', 'docs');

    const documents = readMarkdownFiles(startFolder);

    for (const [key, value] of Object.entries(documents)) {
        console.log('Processing: ', key);
        const sections = parseMDFile({ path: key, content: value });
        await uploadSections(sections);
    }
};


createEmbeddings();