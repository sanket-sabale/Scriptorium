"use client";

import { isValidElement, type ReactNode, useState } from "react";

type CodeElementProps = { children?: ReactNode; className?: string };

function getTextContent(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getTextContent).join("");
  if (isValidElement<CodeElementProps>(node)) return getTextContent(node.props.children);
  return "";
}

function getLanguage(node: ReactNode): string {
  if (!isValidElement<CodeElementProps>(node)) return "text";
  const match = node.props.className?.match(/language-(\S+)/);
  return match?.[1] ?? "text";
}

export function CodeBlock({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState("Copy");
  const code = getTextContent(children).replace(/\n$/, "");
  const language = getLanguage(children);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setStatus("Copied!");
    } catch {
      setStatus("Unable to copy");
    }
    window.setTimeout(() => setStatus("Copy"), 1600);
  }

  return (
    <div className="markdown-code-shell">
      <div className="markdown-code-toolbar">
        <span>{language}</span>
        <button type="button" onClick={copyCode} disabled={!code} aria-label={`Copy ${language} code`} className="markdown-copy-button">{status}</button>
      </div>
      <pre className="markdown-note-code">{children}</pre>
    </div>
  );
}