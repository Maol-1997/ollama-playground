import { MarkdownRender } from '@/components/Markdown/markdown.tsx'
import { MessageTextarea } from '@/components/message-textarea.tsx'
import OllamaIcon from '@/components/ui/ollama-icon.tsx'
import { useChat } from '@/hooks/useChat.ts'
import { useIntersectionObserver } from '@react-hooks-library/core'
import { User } from 'lucide-react'
import { useEffect, useRef } from 'react'

function App() {
  const model = 'llama3:8b'

  const { messages, isLoading, onSubmit, reload, stop, clear } = useChat({
    model
  })

  const onReload = () => {
    const initialMessages = JSON.parse(localStorage.getItem('initialMessages') || '[]')
    localStorage.setItem('initialMessages', JSON.stringify(initialMessages.slice(0, -1)))
    reload()
  }

  const lastMessageIsFromAssistant = messages[messages.length - 1]?.role === 'assistant'

  //////////////////////////////////////////////////////////////////////
  const ref = useRef(null)
  const { inView } = useIntersectionObserver(ref)

  const needToCheck = messages[messages.length - 1]?.content?.length

  useEffect(() => {
    if (ref.current && inView && isLoading) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      ref.current?.scrollIntoView({ behavior: 'auto' })
    }
  }, [messages.length, needToCheck, inView, isLoading])
  //////////////////////////////////////////////////////////////////////

  return (
    <div className='min-h-vh min-h-svh bg-background font-sans antialiased'>
      <div className='flex flex-col gap-2'>
        <section className='markdown mx-auto h-[calc(100vh-180px)] w-full overflow-y-auto px-4 py-2 md:px-0 md:py-6'>
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <div
                className='m-auto md:max-w-2xl lg:max-w-2xl'
                style={{ overflowWrap: 'anywhere' }}
                key={'msg-' + index}
              >
                <div
                  className={`message relative flex flex-col gap-3 ${index !== messages.length - 1 && 'border-b border-border'} p-3 text-[14px] sm:flex-row sm:gap-0 md:gap-6 md:py-6 lg:px-0`}
                >
                  <div className='flex min-w-[40px] text-right font-bold'>
                    {message.role === 'assistant' ? <OllamaIcon size={30} /> : <User size={30} />}
                  </div>

                  <div className='prose dark:prose-invert mt-[-2px] w-full max-w-[608px]'>
                    {message.role === 'user' ? (
                      <div className='flex w-full'>
                        <div className='prose dark:prose-invert flex-1 whitespace-pre-wrap'>
                          {message.content}
                        </div>
                      </div>
                    ) : (
                      <div className='flex flex-col gap-1'>
                        <MarkdownRender content={message.content} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className='flex h-full flex-col items-center justify-center'>
              <div className='flex flex-col items-center justify-center'>
                <div className='flex items-center justify-center'>
                  <OllamaIcon
                    size={80}
                    className='h-16 w-16 sm:h-24 sm:w-24 md:h-32 md:w-32 lg:h-40 lg:w-40 xl:h-48 xl:w-48'
                  />
                </div>
                <div className='flex items-center justify-center'>
                  <p className='text-2xl font-bold'>Welcome to the chat!</p>
                </div>
                <div className='flex items-center justify-center'>
                  <p className='text-lg'>Ask me anything!</p>
                </div>
              </div>
            </div>
          )}
          <div
            style={{
              background: 'transparent',
              height: '4px'
            }}
            className='mb-24 md:mb-0'
            ref={ref}
          />
        </section>
        <MessageTextarea
          onSubmit={onSubmit}
          clearChat={clear}
          reload={onReload}
          isLoading={isLoading}
          lastMessageIsFromAssistant={lastMessageIsFromAssistant}
          stop={stop}
        />
      </div>
    </div>
  )
}

export default App
