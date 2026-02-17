import { InputHTMLAttributes, useState } from 'react'
import { Api } from '~/core/trpc'

interface ChatBarFormProps extends InputHTMLAttributes<HTMLInputElement> {}

/**
 * Form component for the chat input bar, allowing users to type and submit messages.
 */
export const ChatBarForm = ({
  className,
  ...remainingProps
}: ChatBarFormProps) => {
    const login = Api.authentication.login.useMutation()
    
    const generateText = Api.ai.generateText.useMutation()

    const [message, setMessage] = useState('')

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const user = await login.mutateAsync({
            email: 'test@test.com',
            password: 'password',
        }, {
            onSuccess: (data) => {
                console.log('Login successful:', data)}
        });

        console.log(JSON.stringify(user))
        console.log(message)
        generateText.context = {
            userId: '12345',
            sessionId: 'abcde',
        }
        console.log(generateText.context)
        await generateText.mutateAsync({
            prompt: message,
            attachmentUrls: [],
            provider: 'openai'
        }).then((response) => {
            console.log('AI response:', response)
        }).catch((error) => {
            console.error('Error generating text:', error)
        });
        // Handle form submission logic here
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
