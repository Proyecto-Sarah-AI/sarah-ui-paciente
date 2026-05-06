import { useEffect, useState } from 'react'

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
  session_id?: string
  response?: string
  end?: boolean
}

const CHAT_API_URL = 'http://172.105.103.66:8100/chat'
const CHAT_FALLBACK_ERROR_MESSAGE = 'No pude conectar con el chatbot. Intenta de nuevo.'

function timeNow() {
  return new Date().toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

async function postChatMessage(sessionId: string, message: string) {
  const response = await fetch(CHAT_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      session_id: sessionId,
      message,
    }),
  })

  if (!response.ok) {
    throw new Error(`Chat request failed with status ${response.status}`)
  }

  return (await response.json()) as ChatApiResponse
}

export function useChatQuery() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    let isActive = true

    void (async () => {
      try {
        const payload = await postChatMessage('', '')
        if (!isActive) {
          return
        }

        const nextSessionId = payload.session_id?.trim()
        if (nextSessionId) {
          setSessionId(nextSessionId)
        }

        setMessages((currentMessages) => [
          ...currentMessages,
          {
            id: Date.now(),
            kind: 'text',
            role: 'assistant',
            content: payload.response ?? '',
            time: timeNow(),
          },
        ])
      } catch {
        if (!isActive) {
          return
        }

        setMessages((currentMessages) => [
          ...currentMessages,
          {
            id: Date.now(),
            kind: 'text',
            role: 'assistant',
            content: CHAT_FALLBACK_ERROR_MESSAGE,
            time: timeNow(),
          },
        ])
      }
    })()

    return () => {
      isActive = false
    }
  }, [])

  const sendMessage = async (text: string) => {
    const activeSessionId = sessionId ?? ''

    const userMessage: ChatMessage = {
      id: Date.now(),
      kind: 'text',
      role: 'user',
      content: text,
      time: timeNow(),
    }

    setMessages((currentMessages) => [...currentMessages, userMessage])

    try {
      const payload = await postChatMessage(activeSessionId, text)
      const nextSessionId = payload.session_id?.trim()

      if (nextSessionId && nextSessionId !== activeSessionId) {
        setSessionId(nextSessionId)
      }

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