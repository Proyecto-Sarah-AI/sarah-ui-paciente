  import { useState, useEffect } from 'react'
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

  interface InteraccionRead {
    id_interaccion: number
    fecha_hora: string
    emisor: 'paciente' | 'assistant'
    contenido: string
    tipo_mensaje?: string
  }

  const HISTORY_LIMIT = 20
  const CHAT_API_URL = 'http://localhost:8000/interacciones/'
  const CHAT_FALLBACK_ERROR_MESSAGE = 'No pude conectar con el chatbot. Intenta de nuevo.'

  function timeNow() {
    return new Date().toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }

  function formatTime(isoString: string) {
    const date = new Date(isoString)
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }

  //Se convierte la interaccion del backend al formato del frontend
  function interaccionToChatMessage(interaccion: InteraccionRead): ChatMessage {
    return {
      id: interaccion.id_interaccion,
      kind: 'text',
      role: interaccion.emisor === 'paciente' ? 'user' : 'assistant',
      content: interaccion.contenido,
      time: formatTime(interaccion.fecha_hora),
    }
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

  async function fetchChatHistory(token: string, userId: number | null) {
    if (!userId || !token) return []

    try {
      const response = await fetch(
        `${CHAT_API_URL}paciente/${userId}?limit=${HISTORY_LIMIT}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
        }
      )

      if (!response.ok) {
        console.error('Failed to fetch chat history:', response.status)
        return []
      }

      const data = (await response.json()) as InteraccionRead[]
      
      return data.reverse().map(interaccionToChatMessage)
    } catch (error) {
      console.error('Error fetching chat history:', error)
      return []
    }
  }

  export function useChatQuery() {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [isLoadingHistory, setIsLoadingHistory] = useState(true)
    const { user } = useAuth() 
    const token = user?.accessToken ?? ''
    const userId = user?.id_paciente ?? null

    //Cargar histórico
    useEffect(() => {
      const loadHistory = async () => {
      setIsLoadingHistory(true)

      try {
        const history = await fetchChatHistory(token, userId)
        setMessages(history)
      } finally {
        setIsLoadingHistory(false)
      }
    }

      if (token && userId) {
        loadHistory()
      } else {
        setIsLoadingHistory(false)
      }
    }, [token, userId])

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
      isLoadingHistory,
    }
  }