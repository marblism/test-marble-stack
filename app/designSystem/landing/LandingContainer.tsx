import { HTMLAttributes } from 'react'

interface Props extends HTMLAttributes<HTMLElement> {
  children: React.ReactNode
}

export const LandingContainer: React.FC<Props> = ({
  children,
  ...props
}) => {
  return (
    <main {...props}>
      <div className={'bg-white text-black dark:bg-black dark:text-slate-200'}>
        {children}
      </div>
    </main>
  )
}
