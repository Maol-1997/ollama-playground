import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { ReloadIcon, StopIcon } from '@radix-ui/react-icons'
import { MoveRightIcon, TrashIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export function MessageTextarea({
  onSubmit,
  clearChat,
  reload,
  isLoading,
  lastMessageIsFromAssistant,
  stop,
  classNames
}: {
  onSubmit: (input: string) => void
  clearChat: () => void
  reload: () => void
  isLoading: boolean
  lastMessageIsFromAssistant: boolean
  stop: () => void
  classNames?: string
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [value, setValue] = useState('')

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [value])

  const handleSubmit = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (value.length === 0) return
      onSubmit(value)
      setValue('')

      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
      if (textareaRef.current && isMobile) {
        textareaRef.current.blur()
      }
    }
  }

  const buttonClasses = 'flex gap-1 bg-background'

  return (
    <div
      className={cn(
        'absolute bottom-0 mx-auto flex w-full items-center justify-center p-2',
        classNames
      )}
    >
      <div className='relative flex w-full flex-col items-center gap-0.5 transition-all duration-200 md:w-[80vw] md:max-w-[800px]'>
        <div className='absolute -top-10 right-0 flex w-fit gap-1.5'>
          {lastMessageIsFromAssistant && !isLoading ? (
            <>
              <Button
                onClick={() => reload()}
                size='sm'
                variant='outline'
                className={buttonClasses}
              >
                <ReloadIcon className='w-4 shrink-0' />
                <span>Reload</span>
              </Button>
              <Button
                onClick={() => clearChat()}
                size='sm'
                variant='outline'
                className={buttonClasses}
              >
                <TrashIcon className='w-4 shrink-0' />
                <span>Clear</span>
              </Button>
            </>
          ) : null}
          {isLoading ? (
            <Button onClick={() => stop()} size='sm' variant='outline' className={buttonClasses}>
              <StopIcon className='w-4 shrink-0' />
              <span>Stop</span>
            </Button>
          ) : null}
        </div>

        <Textarea
          ref={textareaRef}
          className='flex h-auto max-h-[125px] w-full text-left transition-all duration-200 md:w-[80vw] md:max-w-[800px]'
          placeholder='Type a message...'
          autoFocus
          value={value}
          onKeyDown={handleSubmit}
          onChange={(e) => setValue(e.target.value)}
          endContent={
            <Button
              size='icon'
              variant='ghost'
              className='rounded-md'
              onClick={() => onSubmit(value)}
              disabled={isLoading}
            >
              <MoveRightIcon className='w-4 shrink-0' />
            </Button>
          }
        />
      </div>
    </div>
  )
}
