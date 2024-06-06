import { Check, Clipboard, Download } from 'lucide-react'
import { FC, memo, useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'

import { generateRandomString, programmingLanguages } from './tools/codeblock'

interface Props {
  language: string

  value: string
}

export const CodeBlock: FC<Props> = memo(({ language, value }) => {

  const [isCopied, setIsCopied] = useState<Boolean>(false)

  const copyToClipboard = () => {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      return
    }

    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true)

      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    })
  }

  const downloadAsFile = () => {
    const fileExtension = programmingLanguages[language] || '.file'

    const suggestedFileName = `file-${generateRandomString(
      3,

      true
    )}${fileExtension}`

    const fileName = window.prompt('Enter file name', suggestedFileName)

    if (!fileName) {
      // user pressed cancel on prompt

      return
    }

    const blob = new Blob([value], { type: 'text/plain' })

    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')

    link.download = fileName

    link.href = url

    link.style.display = 'none'

    document.body.appendChild(link)

    link.click()

    document.body.removeChild(link)

    URL.revokeObjectURL(url)
  }

  return (
    <div className='codeblock relative w-[38rem] whitespace-pre-wrap break-words font-sans'>
      <div className='flex items-center justify-between px-4 py-1.5'>
        <span className='text-xs lowercase'>{language}</span>

        <div className='flex items-center'>
          <button
            className='flex items-center gap-1.5 rounded bg-none p-1 text-xs'
            onClick={copyToClipboard}
          >
            {isCopied ? <Check size={18} /> : <Clipboard size={18} />}

            {isCopied ? 'Copied!' : 'Copy code'}
          </button>

          <button
            className='flex items-center rounded bg-none p-1 text-xs'
            onClick={downloadAsFile}
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{ margin: 0,  background: 'transparent' }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  )
})

CodeBlock.displayName = 'CodeBlock'
