import { HTMLAttributes } from 'react'
import { DesignSystemUtility } from '../helpers/utility'
import LandingButton from './LandingButton'
import { LandingAvatar } from './LandingAvatar'

interface Props extends HTMLAttributes<HTMLElement> {
  messages: MessageHistory[]
  title?: string
  subtitle?: string
  buttonText?: string
  buttonLink?: string
}

interface MessageHistory {
  ai: boolean
  text: string
}

export const ChatHistory: React.FC<Props> = ({
  messages,
  title,
  subtitle,
  buttonText,
  buttonLink,
  className,
  ...props
}) => {
  return (
    <section
      className={DesignSystemUtility.buildClassNames('py-16 px-5', className)}
      {...props}
    >
      <div className="max-w-7xl mx-auto ">
        <h1 className='text-center'>{title}</h1>
        <div className="bg-white p-8 md:px-20 md:py-20 mt-10 mx-auto max-w-5xl rounded-lg flex flex-col">
          {messages.map((message,index) => (
              <div key={index} className={message.ai ? 'flex items-start gap-4 mb-4' : 'flex items-end gap-4 mb-4 flex-row-reverse'}>
                <LandingAvatar src={message.ai
                  ? 'https://cdn.prod.website-files.com/67fa24b961e24d76e744a1fd/6954937b22a3a0ff81e3030a_68063e7cdffbc578e4e427c3_PennyColor.webp'
                  : 'https://cdn.prod.website-files.com/67fa24b961e24d76e744a1fd/695494abf67c19d190118ec2_68063e9de81f9044b009103b_SonnyColor.webp'}>
                </LandingAvatar>
                <span className={message.ai ? 'text-blue-500 text-left' : 'text-gray-500 text-right'}>{message.text}</span>
              </div>
          ))}
        </div>
      </div>
    </section>
  )
}
