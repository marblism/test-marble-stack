import {
  LandingContainer,
  ChatHistory,
  ChatBarForm
} from '~/designSystem'

export default function LandingPage() {

  const messages = [
    { ai: true, text: 'Hello! How can I assist you today?' },
    { ai: false, text: 'I need help with my legal case.' },
    { ai: true, text: 'Sure! Can you provide more details about your case?' },
    { ai: false, text: 'I was involved in a car accident and I want to know my legal options.' },
  ]

  return (
    <LandingContainer>
      <ChatHistory
        title={`Legal Assistant Chat`}
        messages={messages}
      />
      <ChatBarForm placeholder='Type your message here...'></ChatBarForm>
    </LandingContainer>
  )
}
