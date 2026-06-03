import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

interface MarkdownProps {
  content: string;
}

export function Markdown({ content }: MarkdownProps) {
  if (!content) return null;

  // Split content by code blocks: ```[lang] code ```
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-3 text-sm md:text-base leading-relaxed break-words font-sans text-[var(--text-primary)]">
      {parts.map((part, index) => {
        if (part.startsWith("```")) {
          // It's a code block
          const lines = part.split("\n");
          const firstLine = lines[0].replace("```", "").trim();
          const language = firstLine || "code";
          const code = lines.slice(1, lines.length - 1).join("\n");

          return <CodeBlock key={index} code={code} language={language} />;
        } else {
          // Standard text block. Parse for line-breaks, lists, bold elements, inline code.
          return <TextBlock key={index} text={part} />;
        }
      })}
    </div>
  );
}

interface CodeBlockProps {
  key?: React.Key;
  code: string;
  language: string;
}

function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Xatolik nusxalashda:", err);
    }
  };

  return (
    <div className="my-3 border border-outline-dark rounded bg-[#0b0c10] overflow-hidden font-mono text-xs">
      <div className="flex items-center justify-between px-4 py-2 border-b border-outline-dark bg-[#121317]">
        <span className="text-gray-400 capitalize tracking-wider">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-outline-muted rounded active:scale-95 transition-all"
        >
          {copied ? (
            <>
              <Check size={13} className="text-emerald-400" />
              <span className="text-emerald-400">Nusxalandi</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span>Nusxa olish</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="text-gray-300 leading-5">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

interface TextBlockProps {
  key?: React.Key;
  text: string;
}

function TextBlock({ text }: TextBlockProps) {
  // Split block by lines to parse lists and paragraphs
  const lines = text.split("\n");

  return (
    <div className="space-y-2">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();

        // 1. Check for Headings: e.g. ### Title or ## Title
        if (trimmed.startsWith("### ")) {
          return (
            <h4 key={lineIdx} className="text-base md:text-lg font-semibold text-[var(--text-primary)] pt-2 pb-1 border-b border-[var(--border-color)] font-sans tracking-tight">
              {parseInline(trimmed.substring(4))}
            </h4>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h3 key={lineIdx} className="text-lg md:text-xl font-bold text-[var(--text-primary)] pt-3 pb-1 border-b border-[var(--border-color)] font-sans tracking-tight">
              {parseInline(trimmed.substring(3))}
            </h3>
          );
        }
        if (trimmed.startsWith("# ")) {
          return (
            <h2 key={lineIdx} className="text-xl md:text-2xl font-extrabold text-[var(--text-primary)] pt-4 pb-2 border-b border-[var(--border-color)] font-sans tracking-tight">
              {parseInline(trimmed.substring(2))}
            </h2>
          );
        }

        // 2. Check for Bullet Lists
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          return (
            <div key={lineIdx} className="flex gap-2 pl-3 py-0.5">
              <span className="text-[var(--accent-light)]">•</span>
              <p className="flex-1 text-[var(--text-primary)]">{parseInline(trimmed.substring(2))}</p>
            </div>
          );
        }

        // 3. Check for Numbered Lists
        const numMatch = trimmed.match(/^(\d+)\.\s(.*)/);
        if (numMatch) {
          const num = numMatch[1];
          const rest = numMatch[2];
          return (
            <div key={lineIdx} className="flex gap-2 pl-3 py-0.5">
              <span className="text-[var(--accent-light)] font-mono">{num}.</span>
              <p className="flex-1 text-[var(--text-primary)]">{parseInline(rest)}</p>
            </div>
          );
        }

        // 4. Check for Image Markdown: ![alt](url)
        const imgMatch = trimmed.match(/!\[(.*?)\]\((.*?)\)/);
        if (imgMatch) {
          const alt = imgMatch[1];
          const src = imgMatch[2];
          return (
            <div key={lineIdx} className="my-3 overflow-hidden rounded border border-[var(--border-color)] bg-[#121317]/50 max-w-xl shadow-lg">
              <div className="relative w-full h-[320px] bg-black/60 flex items-center justify-center">
                <img
                  src={src}
                  alt={alt}
                  className="max-w-full max-h-[300px] object-contain hover:scale-[1.02] transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="px-3.5 py-2 border-t border-[var(--border-color)] bg-black/40 text-[10px] font-mono text-[var(--text-muted)] flex justify-between items-center">
                <span>Sintezlangan Portret / Rasm</span>
                <span className="text-emerald-400 font-semibold">{alt || "AI Image"}</span>
              </div>
            </div>
          );
        }

        // 5. Default Paragraph
        if (trimmed === "") {
          return <div key={lineIdx} className="h-2" />;
        }

        return (
          <p key={lineIdx} className="text-[var(--text-primary)]">
            {parseInline(line)}
          </p>
        );
      })}
    </div>
  );
}

// Inline element parser for bold `**` and inline-code `` ` ``
function parseInline(text: string) {
  if (!text) return "";

  // Split by bold patterns **word**
  const boldParts = text.split(/(\*\*[\s\S]*?\*\*)/g);

  return boldParts.map((boldPart, idx) => {
    if (boldPart.startsWith("**") && boldPart.endsWith("**")) {
      const boldText = boldPart.slice(2, -2);
      return (
        <strong key={idx} className="font-bold text-[var(--text-primary)]">
          {parseInlineCode(boldText)}
        </strong>
      );
    }
    return <span key={idx}>{parseInlineCode(boldPart)}</span>;
  });
}

function parseInlineCode(text: string) {
  if (!text) return "";

  // Split by inline code pattern `code`
  const codeParts = text.split(/(`[^`]+`)/g);

  return codeParts.map((codePart, idx) => {
    if (codePart.startsWith("`") && codePart.endsWith("`")) {
      const codeText = codePart.slice(1, -1);
      return (
        <code
          key={idx}
          className="px-1.5 py-0.5 mx-0.5 bg-[var(--surface-card-hover)] border border-[var(--border-color)] text-[var(--accent-light)] rounded font-mono text-xs select-all"
        >
          {codeText}
        </code>
      );
    }
    return codePart;
  });
}
