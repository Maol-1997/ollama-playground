import { memo } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import {CodeBlock} from "@/components/Markdown/code-block.tsx";

const MarkdownRender = ({ content }: { content: string; children?: React.ReactNode }) => {
  return (
    <ReactMarkdown
      rehypePlugins={[[rehypeRaw]]}
      remarkPlugins={[remarkGfm]}
      allowedElements={[
        'a',
        'p',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'ol',
        'ul',
        'li',
        'code',
        'pre',
        'strong',
        'em',
        'del',
        'u',
        'img',
        'b',
        'i',
        'blockquote',
        'br',
        'hr',
        'span',
        'table',
        'thead',
        'tbody',
        'tr',
        'th',
        'td',
        'caption',
        'colgroup',
        'div'
      ]}
      unwrapDisallowed
      components={{
        code({
          inline,
          className,
          children,
        }: {
          inline?: boolean
          className?: string
          children?: React.ReactNode
        }) {
          return !inline && className ? (
            <CodeBlock language={className?.replaceAll('language-', '')} value={String(children)} />
          ) : (
            <>{String(children)}</>
          )
        }
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

const memoizedMarkdownRender = memo(MarkdownRender)

export { memoizedMarkdownRender as MarkdownRender }
