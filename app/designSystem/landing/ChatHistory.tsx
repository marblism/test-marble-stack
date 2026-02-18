import { HTMLAttributes } from 'react'
import { DesignSystemUtility } from '../helpers/utility'
import LandingButton from './LandingButton'
import { LandingAvatar } from './LandingAvatar'
import { jsPDF } from 'jspdf'

interface Props extends HTMLAttributes<HTMLElement> {
  messages: MessageHistory[]
  title?: string
  subtitle?: string
  buttonText?: string
  buttonLink?: string
}

interface MessageHistory {
  ai: boolean
  text: string,
  pdfFile?: string
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

  const handleDownload = (index) => {
    const pdfFile = messages[index].pdfFile;
    if (pdfFile) {
      const doc = new jsPDF();
      doc.text(pdfFile, 10, 10);
      const pdfBlob = doc.output('blob');
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.click();
      window.URL.revokeObjectURL(url);
    }
  }

  return (
    <section
      className={DesignSystemUtility.buildClassNames('py-16 px-5', className)}
      {...props}
    >
      <div className="max-w-7xl mx-auto">
        <h1 className='text-center font-bold text-2xl'>{title}</h1>
        <div 
        id='chat-history'
        className="bg-white p-8 md:px-20 md:py-20 mt-10 mx-auto max-w-5xl rounded-lg flex flex-col overflow-y-scroll max-h-[60vh] border-2 border-solid border-primary-100">
          {messages.map((message,index) => (
              <div key={index} className={message.ai ? 'flex items-start gap-4 mb-4 items-center' : 'flex items-end gap-4 mb-4 flex-row-reverse items-center'}>
                <LandingAvatar src={message.ai
                  ? 'https://cdn.prod.website-files.com/67fa24b961e24d76e744a1fd/6954937b22a3a0ff81e3030a_68063e7cdffbc578e4e427c3_PennyColor.webp'
                  : 'https://cdn.prod.website-files.com/67fa24b961e24d76e744a1fd/695494abf67c19d190118ec2_68063e9de81f9044b009103b_SonnyColor.webp'}>
                </LandingAvatar>
                <div className='flex flex-col'>
                  <span className={message.ai ? 'text-blue-500 text-left bg-blue-100 py-2 px-4 rounded-lg' : 'text-gray-500 text-right bg-gray-100 py-2 px-4 rounded-lg'}>{message.text}</span>
                  {message.pdfFile && (
                    <a onClick={() => handleDownload(index)} className="bg-green-500 text-white px-4 py-2 rounded-lg mt-2 self-start">
                      Download PDF
                    </a>
                  )}
                </div>
                
              </div>
          ))}
        </div>
      </div>
    </section>
  )
}
