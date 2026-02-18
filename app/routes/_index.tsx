import { useState } from 'react'
import {
  LandingContainer,
  ChatHistory,
  ChatBarForm
} from '~/designSystem'

type ChatMessage = {
  ai: boolean
  text: string
}

export default function LandingPage() {

  const handleNewMessage = (newMessage: ChatMessage) => {
    console.log('New message:', newMessage);
    setMessages((chats) => {
      chats.push(newMessage)
      return [...chats]
    });
    console.log('Updated messages:', messages);
    document.getElementById('chat-history')?.scrollTo(0, document.getElementById('chat-history')?.scrollHeight || 0);
    // Here you can add the logic to send the message to your AI service and update the chat history with the response.
  }

  const [messages, setMessages] = useState<ChatMessage[]>([
    { ai: true, text: 'Hello! How can I assist you today?' }
  ])

  return (
    <LandingContainer>
      <ChatHistory
        title={`Legal Assistant Chat`}
        messages={messages}
      />
      <ChatBarForm placeholder='Type your message here...' onNewMessage={handleNewMessage}></ChatBarForm>
    </LandingContainer>
  )
}
