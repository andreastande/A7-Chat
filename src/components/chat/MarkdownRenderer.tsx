"use client"

import "katex/dist/katex.min.css" // keep this once globally
import ReactMarkdown from "react-markdown"
import rehypeKatex from "rehype-katex"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        li: ({ children }) => <li className="my-2 pl-[6px]">{children}</li>,
        p: ({ children }) => <p className="mt-5">{children}</p>,
        ul: ({ children }) => <ul className="mt-5 pl-[26px] list-disc">{children}</ul>,
        ol: ({ children }) => <ul className="mt-5 pl-[26px] list-decimal">{children}</ul>,
        table: ({ children }) => <table className="my-7">{children}</table>,
        h1: ({ children }) => <h1 className="mb-8 mt-4 text-4xl font-medium">{children}</h1>,
        h2: ({ children }) => <h2 className="mt-12 mb-6 text-3xl font-medium">{children}</h2>,
        h3: ({ children }) => <h3 className="mb-3 text-3xl font-medium">{children}</h3>,
        h4: ({ children }) => <h4 className="mb-2 font-medium">{children}</h4>,
        h5: ({ children }) => <h5>{children}</h5>,
        h6: ({ children }) => <h6>{children}</h6>,
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
