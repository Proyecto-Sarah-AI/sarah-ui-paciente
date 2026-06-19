  import { useState } from 'react'
  import { useAuth } from './auth'
  export type ChatRole = 'assistant' | 'user'

  export interface BaseMessage {
    id: number
    time: string
  }

  export interface TextMessage extends BaseMessage {
    kind: 'text'
    role: ChatRole
    content: string
  }

  export interface ReminderMessage extends BaseMessage {
    kind: 'reminder'
    role: 'assistant'
    content: string
    selection?: 'yes' | 'no'
  }

  export type ChatMessage = TextMessage | ReminderMessage

  interface ChatApiResponse {
    response?: string
  }

  const CHAT_API_URL = 'http://localhost:8000/interacciones/'
  const CHAT_FALLBACK_ERROR_MESSAGE = 'No pude conectar con el chatbot. Intenta de nuevo.'

  function timeNow() {
    return new Date().toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }

  async function postChatMessage(token: string, time: string, userId: number | null, message: string) {
    const response = await fetch(CHAT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        fecha_hora: time,
        emisor: 'paciente',
        tipo_mensaje: "consulta",
        contenido: message,
        feedback_paciente: "no",
        id_paciente: userId
      }),
    })

    if (!response.ok) {
      throw new Error(`Chat request failed with status ${response.status}`)
    }

    return (await response.json()) as ChatApiResponse
  }

  export function useChatQuery() {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const { user } = useAuth() 
    const token = user?.accessToken ?? ''
    const userId = user?.id_paciente ?? null

    const sendMessage = async (text: string) => {
      if (!token) return
      
      const userMessage: ChatMessage = {
        id: Date.now(),
        kind: 'text',
        role: 'user',
        content: text,
        time: timeNow(),
      }

      setMessages((currentMessages) => [...currentMessages, userMessage])

      try {
        const horaUTC = new Date().toISOString()
        const payload = await postChatMessage(token, horaUTC, userId, text)

        setMessages((currentMessages) => [
          ...currentMessages,
          {
            id: Date.now() + 1,
            kind: 'text',
            role: 'assistant',
            content: payload.response ?? '',
            time: timeNow(),
          },
        ])
      } catch {
        setMessages((currentMessages) => [
          ...currentMessages,
          {
            id: Date.now() + 1,
            kind: 'text',
            role: 'assistant',
            content: CHAT_FALLBACK_ERROR_MESSAGE,
            time: timeNow(),
          },
        ])
      }
    }

    return {
      messages,
      setMessages,
      sendMessage,
    }
  }