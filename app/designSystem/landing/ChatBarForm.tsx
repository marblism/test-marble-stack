import { InputHTMLAttributes, useState } from 'react'
import { Api } from '~/core/trpc'

interface ChatBarFormProps extends InputHTMLAttributes<HTMLInputElement> {
    onNewMessage: (message: any) => void
}

/**
 * Form component for the chat input bar, allowing users to type and submit messages.
 */
export const ChatBarForm = ({
  className,
  onNewMessage,
  ...remainingProps
}: ChatBarFormProps) => {
    const { mutateAsync:login } = Api.authentication.login.useMutation();
    const { mutateAsync:generateText } = Api.ai.generateText.useMutation();

    const handleLogin = async () => {
        await login({
            email: 'test@test.com',
            password: 'password',
        });
    };
    
    const handleGenerateText = async (promptMessage: string) => {
        return generateText({prompt: promptMessage})
    };

    const [message, setMessage] = useState('')

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        onNewMessage({ ai: false, text: message });
        event.preventDefault()
        await handleLogin();
        // Handle form submission logic here
        await handleGenerateText(message).then((response) => {
            onNewMessage({ ai: true, text: response.answer });
        });
        setMessage('');
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
    };

    return (
        <form onSubmit={handleSubmit} className='flex flex-row max-w-5xl md:mx-auto mx-4 lg:mx-auto'>
            <input
                value={message}
                onChange={handleChange}
                className=" px-4 rounded-l-full border-2 border-solid border-primary-100 flex flex-col items-center w-full"
                    {...remainingProps}
                type='text'
            />
            <button type='submit' className='px-8 py-2 bg-blue-500 text-white rounded-r-full'>Send</button>
        </form>
    )
}
