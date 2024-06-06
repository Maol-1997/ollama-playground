import {useRef, useState} from "react";

export interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

const useChat = ({ initialMessages, model }: { initialMessages?: Message[], model: string }) => {
    const [messages, setMessages] = useState<Message[]>(initialMessages || [])
    const [isLoading, setIsLoading] = useState(false)
    const abortController = useRef<AbortController>(new AbortController())
    let streamMsg = ''

    const fetchData = async (messagesToSend: Message[]) => {

        try{
            const res = await fetch('http://localhost:11434/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                signal: abortController.current.signal,
                body: JSON.stringify({
                    model,
                    messages: messagesToSend
                })
            });

            if (!res.ok) {
                throw new Error(res.statusText); // TODO: handle error
            }

            messagesToSend.push({role: 'assistant', content: ''});

            const decoder = new TextDecoder();
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            for await (const chunk of res.body) {
                const data = decoder.decode(chunk);
                const json = JSON.parse(data);
                streamMsg += json.message.content;
                messagesToSend[messagesToSend.length - 1].content = streamMsg;
                setMessages([...messagesToSend]);
            }
        } catch  { /* empty */ }
    };

    const onSubmit = async (input: string) => {
        setIsLoading(true);
        const msgs = [...messages, { role: 'user', content: input }] as Message[];
        setMessages(msgs);
        await fetchData(msgs);
        setIsLoading(false);
        streamMsg = '';
        abortController.current = new AbortController();
    }

    const reload = async () => {
        const newMessages = messages.slice(0, -1);
        setMessages(newMessages);
        if (newMessages.length > 0) {
            setIsLoading(true);
            await fetchData(newMessages);
            setIsLoading(false);
            streamMsg = '';
            abortController.current = new AbortController();
        }
    }

    const stop = () => {
        setIsLoading(false);
        abortController.current.abort();
        abortController.current = new AbortController();
        streamMsg = '';
    }

    return {
        messages,
        setMessages,
        onSubmit,
        isLoading,
        clear: () => setMessages([]),
        reload,
        stop
    }
}

export { useChat }
