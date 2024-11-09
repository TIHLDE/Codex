import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";


interface MarkdownRendererProps {
    content: string;
};

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
    return (
        <Markdown
            className='prose dark:prose-invert'
            components={{
                h1: H1,
                h2: H2,
                h3: H3,
                strong: Strong,

            }}
            rehypePlugins={[rehypeRaw]}
        >
            {content}
        </Markdown>
    );
};


function H1({ children }: { children?: React.ReactNode }) {
    return <h1 className={'text-2xl font-bold'}>{children}</h1>;
}
function H2({ children }: { children?: React.ReactNode }) {
    return <h1 className={'text-xl font-bold'}>{children}</h1>;
}
function H3({ children }: { children?: React.ReactNode }) {
    return <h1 className={'text-lg font-bold'}>{children}</h1>;
}
function Strong({ children }: { children?: React.ReactNode }) {
    return <strong className={'font-bold'}>{children}</strong>;
}