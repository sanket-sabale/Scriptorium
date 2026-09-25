import ReactMarkdown, { type Components } from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "@/components/notes/code-block";

const markdownComponents: Components = {
  h1: ({ children, ...props }) => <h1 className="markdown-note-heading markdown-note-heading-1" {...props}>{children}</h1>,
  h2: ({ children, ...props }) => <h2 className="markdown-note-heading markdown-note-heading-2" {...props}>{children}</h2>,
  h3: ({ children, ...props }) => <h3 className="markdown-note-heading markdown-note-heading-3" {...props}>{children}</h3>,
  h4: ({ children, ...props }) => <h4 className="markdown-note-heading markdown-note-heading-4" {...props}>{children}</h4>,
  p: ({ children, ...props }) => <p className="markdown-note-paragraph" {...props}>{children}</p>,
  ul: ({ children, ...props }) => <ul className="markdown-note-list markdown-note-list-unordered" {...props}>{children}</ul>,
  ol: ({ children, ...props }) => <ol className="markdown-note-list markdown-note-list-ordered" {...props}>{children}</ol>,
  blockquote: ({ children, ...props }) => <blockquote className="markdown-note-blockquote" {...props}>{children}</blockquote>,
  pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
  code: ({ className, children, ...props }) => <code className={className ? `markdown-note-code-inline ${className}` : "markdown-note-code-inline"} {...props}>{children}</code>,
  hr: (props) => <hr className="markdown-note-divider" {...props} />,
  table: ({ children, ...props }) => <div className="markdown-note-table-wrap"><table className="markdown-note-table" {...props}>{children}</table></div>,
  th: ({ children, ...props }) => <th scope="col" {...props}>{children}</th>,
  a: ({ children, href, ...props }) => <a href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel={href?.startsWith("http") ? "noreferrer" : undefined} {...props}>{children}</a>,
};

export function MarkdownRenderer({ content }: { content: string }) {
  return <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[[rehypeHighlight, { detect: false, plainText: ["text", "plaintext"] }], rehypeSlug]} components={markdownComponents}>{content}</ReactMarkdown>;
}