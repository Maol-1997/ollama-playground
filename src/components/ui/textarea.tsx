import { cn } from '@/lib/utils'
import * as React from 'react'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    startContent?: React.ReactNode
    endContent?: React.ReactNode
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, startContent, endContent, ...props }, ref) => {
        const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            if (e.target === e.currentTarget && ref?.current) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                ref?.current?.focus()
            }
        }

        return (
            <div
                onClick={handleClick}
                className={cn(
                    'relative flex min-h-[20px] w-full items-center justify-center gap-2 overflow-y-hidden rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-within:border-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
                    className
                )}
            >
                {startContent}
                <textarea
                    className='my-[10px] h-fit max-h-[125px] w-full resize-none overflow-y-auto border-0 bg-transparent placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0'
                    ref={ref}
                    rows={1}
                    {...props}
                />
                {endContent}
            </div>
        )
    }
)
Textarea.displayName = 'Textarea'

export { Textarea }
