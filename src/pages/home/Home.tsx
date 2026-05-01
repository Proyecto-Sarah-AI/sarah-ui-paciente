import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell,
  Camera,
  Check,
  ChevronDown,
  LogOut,
  Mic,
  Moon,
  Plus,
  Send,
  Settings,
  Sparkles,
  Sun,
  Upload,
  User,
  X,
} from 'lucide-react'
import {
  Avatar,
  Button,
  Field,
  Input,
  Menu,
  Tooltip,
} from '@base-ui/react'
import {
  createThemeVars,
  getEffectiveTheme,
  getStoredTheme,
  setStoredTheme,
  THEME_PALETTES,
  type ThemeMode,
} from '../../styles/theme.ts'

type ChatRole = 'assistant' | 'user'
type ReminderChoice = 'yes' | 'no'

interface BaseMessage {
  id: number
  time: string
}

interface TextMessage extends BaseMessage {
  kind: 'text'
  role: ChatRole
  content: string
}

interface ReminderMessage extends BaseMessage {
  kind: 'reminder'
  role: 'assistant'
  content: string
  selection?: ReminderChoice
}

type ChatMessage = TextMessage | ReminderMessage

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    kind: 'text',
    role: 'assistant',
    content:
      'Hola, soy Sarah. Puedo ayudarte a revisar medicamentos, sintomas y recomendaciones basicas de seguimiento.',
    time: '09:12',
  },
  {
    id: 2,
    kind: 'text',
    role: 'assistant',
    content:
      'Escribe tu duda o usa un acceso rapido para revisar tratamiento, interacciones o recordatorios.',
    time: '09:12',
  },
]


function timeNow() {
  return new Date().toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

function MessageBubble({
  message,
  onReminderChoice,
}: {
  message: ChatMessage
  onReminderChoice: (messageId: number, choice: ReminderChoice) => void
}) {
  if (message.kind === 'reminder') {
    return (
      <div className="w-full space-y-2">
        <div className="w-full overflow-hidden rounded-[1.75rem] border border-[var(--ca-teal)]/30 bg-[var(--ca-bg-secondary)] px-4 py-4 text-sm leading-6 text-[var(--ca-navy)] shadow-[0_18px_50px_rgba(13,177,127,0.18)] md:px-5 md:py-5 md:text-[15px]">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--ca-teal)]/20 text-[var(--ca-teal)]">
              <Bell className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--ca-teal)]">
                Notificacion de Sarah
              </p>
              <p className="mt-1 text-base font-semibold text-[var(--ca-navy)] md:text-lg">
                {message.content}
              </p>
            </div>
          </div>

          {message.selection ? (
            <div className="mt-4 rounded-2xl border border-[var(--ca-bg)] bg-[var(--ca-bg)] px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ca-text-secondary)]">
                Estado
              </p>
              <p className="mt-1 text-sm font-semibold text-[var(--ca-navy)] md:text-base">
                {message.selection === 'yes'
                  ? 'Confirmado: ya tomaste tu remedio.'
                  : 'Registrado: aun no tomas el remedio.'}
              </p>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Button
                type="button"
                onClick={() => onReminderChoice(message.id, 'yes')}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-[var(--ca-teal)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--ca-teal-dark)]"
              >
                Si, ya lo tome
              </Button>
              <Button
                type="button"
                onClick={() => onReminderChoice(message.id, 'no')}
                className="inline-flex w-full items-center justify-center rounded-2xl border border-[var(--ca-bg-secondary)] bg-[var(--ca-bg)] px-4 py-3 text-sm font-semibold text-[var(--ca-navy)] transition hover:bg-[var(--ca-bg-secondary)]"
              >
                No, todavia no
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-[11px] text-[var(--ca-text-secondary)]">
          <span>{message.time}</span>
          <span>Sarah</span>
        </div>
      </div>
    )
  }

  const isAssistant = message.role === 'assistant'

  return (
    <div className={`flex gap-3 ${isAssistant ? '' : 'justify-end'}`}>
      {isAssistant ? (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--ca-teal)]/15 text-[var(--ca-teal)]">
          <Sparkles className="h-5 w-5" />
        </div>
      ) : null}

      <div className={`flex max-w-[min(44rem,85%)] flex-col gap-2 ${isAssistant ? '' : 'items-end'}`}>
        <div
          className={`rounded-[1.75rem] px-4 py-3 text-sm leading-6 shadow-sm md:text-[15px] ${
            isAssistant
              ? 'border border-[var(--ca-bg-secondary)] bg-[var(--ca-bg)] text-[var(--ca-navy)]'
              : 'border border-[var(--ca-teal)]/20 bg-[var(--ca-teal)] text-white'
          }`}
        >
          {message.content}
        </div>
        <div className={`flex items-center gap-2 text-[11px] text-[var(--ca-text-secondary)] ${isAssistant ? '' : 'justify-end'}`}>
          <span>{message.time}</span>
          {isAssistant ? <span>Sarah</span> : <span>Tú</span>}
        </div>
      </div>

      {!isAssistant ? (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[var(--ca-bg-secondary)] bg-[var(--ca-bg-secondary)] text-[var(--ca-navy)]">
          LM
        </div>
      ) : null}
    </div>
  )
}

function ChatComposer({ onSend }: { onSend: (value: string) => void }) {
  const [text, setText] = useState('')
  const [isListening, setIsListening] = useState(false)
  const cameraInputRef = useRef<HTMLInputElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [attachments, setAttachments] = useState<
    Array<{ id: string; file: File; progress: number; status: 'uploading' | 'ready' }>
  >([])
  const uploadIntervalsRef = useRef<Record<string, number>>({})

  useEffect(() => {
    return () => {
      Object.values(uploadIntervalsRef.current).forEach((intervalId) => {
        window.clearInterval(intervalId)
      })
    }
  }, [])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!text.trim()) {
      return
    }

    onSend(text.trim())
    setText('')
  }

  const handleOpenCamera = () => {
    cameraInputRef.current?.click()
  }

  const handleOpenFilePicker = () => {
    fileInputRef.current?.click()
  }

  const startUploadSimulation = (attachmentId: string) => {
    const intervalId = window.setInterval(() => {
      setAttachments((current) =>
        current.map((attachment) => {
          if (attachment.id !== attachmentId || attachment.status !== 'uploading') {
            return attachment
          }

          const nextProgress = Math.min(attachment.progress + Math.floor(Math.random() * 18) + 8, 100)
          if (nextProgress >= 100) {
            window.clearInterval(uploadIntervalsRef.current[attachmentId])
            delete uploadIntervalsRef.current[attachmentId]
            return { ...attachment, progress: 100, status: 'ready' }
          }

          return { ...attachment, progress: nextProgress }
        }),
      )
    }, 320)

    uploadIntervalsRef.current[attachmentId] = intervalId
  }

  const handleAttachmentSelect = (files: FileList | null) => {
    if (!files || files.length === 0) {
      return
    }

    const nextAttachments = Array.from(files).map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      file,
      progress: 0,
      status: 'uploading' as const,
    }))

    setAttachments((current) => [...current, ...nextAttachments])
    nextAttachments.forEach((attachment) => startUploadSimulation(attachment.id))
  }

  const handleRemoveAttachment = (attachmentId: string) => {
    const intervalId = uploadIntervalsRef.current[attachmentId]
    if (intervalId) {
      window.clearInterval(intervalId)
      delete uploadIntervalsRef.current[attachmentId]
    }

    setAttachments((current) => current.filter((attachment) => attachment.id !== attachmentId))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Field.Root className="space-y-2">
        <Field.Label className="sr-only">Mensaje</Field.Label>
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(event) => {
            handleAttachmentSelect(event.target.files)
            event.currentTarget.value = ''
          }}
        />
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          onChange={(event) => {
            handleAttachmentSelect(event.target.files)
            event.currentTarget.value = ''
          }}
        />
        {attachments.length > 0 ? (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {attachments.map((attachment) => {
              const radius = 12
              const circumference = 2 * Math.PI * radius
              const progressOffset = circumference - (attachment.progress / 100) * circumference

              return (
                <div
                  key={attachment.id}
                  className="rounded-2xl border border-[var(--ca-bg-secondary)] bg-[var(--ca-bg)] px-3 py-2 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative h-8 w-8 shrink-0">
                      <svg className="h-8 w-8 -rotate-90" viewBox="0 0 32 32" aria-hidden="true">
                        <circle
                          cx="16"
                          cy="16"
                          r={radius}
                          className="fill-none stroke-[var(--ca-bg-secondary)]"
                          strokeWidth="3"
                        />
                        <circle
                          cx="16"
                          cy="16"
                          r={radius}
                          className="fill-none stroke-[var(--ca-teal)] transition-all"
                          strokeWidth="3"
                          strokeDasharray={circumference}
                          strokeDashoffset={progressOffset}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-[var(--ca-navy)]">
                        {attachment.progress}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-[var(--ca-navy)]" title={attachment.file.name}>
                        {attachment.file.name}
                      </p>
                      <p className="mt-0.5 text-[11px] text-[var(--ca-text-secondary)]">
                        {formatFileSize(attachment.file.size)} ·{' '}
                        {attachment.status === 'ready' ? 'Listo para enviar' : 'Subiendo...'}
                      </p>
                    </div>

                    <Button
                      type="button"
                      onClick={() => handleRemoveAttachment(attachment.id)}
                      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[var(--ca-text-secondary)] transition hover:bg-[var(--ca-bg-secondary)] hover:text-[var(--ca-navy)]"
                      aria-label={`Eliminar ${attachment.file.name}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : null}
        <div className="flex items-end gap-2 rounded-[1.75rem] border border-[var(--ca-bg-secondary)] bg-[var(--ca-bg)] p-2 shadow-[0_18px_60px_rgba(15,23,42,0.08)] focus-within:border-[var(--ca-teal)]">
          <Menu.Root>
            <Menu.Trigger
              type="button"
              className="mb-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--ca-bg-secondary)] text-[var(--ca-text-secondary)] transition hover:bg-[var(--ca-bg)]"
              aria-label="Agregar adjunto"
            >
              <Plus className="h-5 w-5" />
            </Menu.Trigger>
            <Menu.Portal>
              <Menu.Positioner side="top" align="start" sideOffset={8} className="z-[95]">
                <Menu.Popup className="min-w-52 overflow-hidden rounded-2xl border border-[var(--ca-bg-secondary)] bg-[var(--ca-bg)] p-2 text-sm shadow-xl outline-none">
                  <Menu.Item
                    className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-[var(--ca-navy)] outline-none transition data-[highlighted]:bg-[var(--ca-bg-secondary)]"
                    onClick={handleOpenCamera}
                  >
                    <Camera className="h-4 w-4 text-[var(--ca-teal)]" />
                    Activar camara
                  </Menu.Item>
                  <Menu.Item
                    className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-[var(--ca-navy)] outline-none transition data-[highlighted]:bg-[var(--ca-bg-secondary)]"
                    onClick={handleOpenFilePicker}
                  >
                    <Upload className="h-4 w-4 text-[var(--ca-teal)]" />
                    Subir archivos
                  </Menu.Item>
                </Menu.Popup>
              </Menu.Positioner>
            </Menu.Portal>
          </Menu.Root>

          <Input
            value={text}
            onValueChange={setText}
            placeholder="Escribe un mensaje a Sarah..."
            className="min-h-12 min-w-0 flex-1 bg-transparent px-2 py-3 text-sm text-[var(--ca-navy)] outline-none placeholder:text-[var(--ca-text-secondary)]"
            aria-label="Mensaje para Sarah"
          />

          <Tooltip.Root>
            <Tooltip.Trigger
              type="button"
              className={`mb-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition ${
                isListening
                  ? 'bg-rose-100 text-rose-600 hover:bg-rose-200'
                  : 'bg-[var(--ca-bg-secondary)] text-[var(--ca-text-secondary)] hover:bg-[var(--ca-bg)]'
              }`}
              onClick={() => setIsListening(!isListening)}
              aria-label={isListening ? 'Detener grabacion' : 'Iniciar grabacion'}
            >
              <Mic className="h-5 w-5" />
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Positioner side="top" sideOffset={8} className="z-[90]">
                <Tooltip.Popup className="rounded-2xl border border-[var(--ca-bg-secondary)] bg-[var(--ca-bg)] px-3 py-2 text-xs text-[var(--ca-navy)] shadow-xl outline-none">
                  Grabacion de voz
                </Tooltip.Popup>
              </Tooltip.Positioner>
            </Tooltip.Portal>
          </Tooltip.Root>

          <Button
            type="submit"
            disabled={!text.trim()}
            className="mb-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--ca-teal)] text-white transition hover:bg-[var(--ca-teal-dark)] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Enviar mensaje"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </Field.Root>

      <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--ca-text-secondary)]">
        {isListening ? (
          <span className="flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-rose-600">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            Escuchando...
          </span>
        ) : null}
      </div>
    </form>
  )
}

function FloatingProfileMenu({ onLogout, themeMode, onThemeChange, themeVars }: { onLogout: () => void; themeMode: ThemeMode; onThemeChange: (mode: ThemeMode) => void; themeVars: CSSProperties }) {
  return (
    <Menu.Root>
      <Menu.Trigger className="inline-flex items-center gap-2 rounded-full border border-[var(--ca-bg-secondary)] bg-[var(--ca-bg)] px-2 py-1.5 text-[var(--ca-navy)] shadow-[0_18px_50px_rgba(15,23,42,0.22)] transition hover:bg-[var(--ca-bg-secondary)]">
        <Avatar.Root className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-[var(--ca-bg-secondary)] bg-[var(--ca-teal)]/15 text-sm font-semibold text-[var(--ca-navy)]">
          <Avatar.Fallback className="flex h-full w-full items-center justify-center">
            LM
          </Avatar.Fallback>
        </Avatar.Root>
        <span className="hidden text-sm font-medium sm:block">Lorenzo</span>
        <ChevronDown className="h-4 w-4" />
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner side="bottom" align="end" sideOffset={10} className="z-[90]">
          <Menu.Popup style={themeVars} className="min-w-64 overflow-hidden rounded-3xl border border-[var(--ca-bg-secondary)] bg-[var(--ca-bg)] p-2 text-sm shadow-2xl outline-none">
            <div className="px-3 py-3">
              <p className="font-semibold text-[var(--ca-navy)]">Lorenzo Martinez</p>
              <p className="mt-1 text-xs text-[var(--ca-text-secondary)]">
                lorenzo.martinez@email.com
              </p>
            </div>
            <Menu.Separator className="my-1 h-px bg-[var(--ca-bg-secondary)]" />
            <Menu.Item className="flex cursor-pointer items-center gap-2 rounded-2xl px-3 py-2 text-[var(--ca-navy)] outline-none transition data-[highlighted]:bg-[var(--ca-bg-secondary)]">
              <User className="h-4 w-4 text-[var(--ca-teal)]" />
              Mi perfil
            </Menu.Item>
            <Menu.Item className="flex cursor-pointer items-center gap-2 rounded-2xl px-3 py-2 text-[var(--ca-navy)] outline-none transition data-[highlighted]:bg-[var(--ca-bg-secondary)]">
              <Settings className="h-4 w-4 text-[var(--ca-teal)]" />
              Configuracion
            </Menu.Item>
            <Menu.Separator className="my-1 h-px bg-[var(--ca-bg-secondary)]" />
            <div className="px-2 py-2">
              <p className="px-1 text-xs font-semibold uppercase tracking-wider text-[var(--ca-text-secondary)]">Tema</p>
              <Menu.Item
                className="mt-1 flex cursor-pointer items-center gap-2 rounded-2xl px-3 py-2 text-[var(--ca-navy)] outline-none transition data-[highlighted]:bg-[var(--ca-bg-secondary)]"
                onClick={() => onThemeChange('light')}
              >
                <Sun className="h-4 w-4 text-[var(--ca-teal)]" />
                <span className="flex-1">Modo claro</span>
                {themeMode === 'light' && <Check className="h-4 w-4 text-[var(--ca-teal)]" />}
              </Menu.Item>
              <Menu.Item
                className="flex cursor-pointer items-center gap-2 rounded-2xl px-3 py-2 text-[var(--ca-navy)] outline-none transition data-[highlighted]:bg-[var(--ca-bg-secondary)]"
                onClick={() => onThemeChange('dark')}
              >
                <Moon className="h-4 w-4 text-[var(--ca-teal)]" />
                <span className="flex-1">Modo oscuro</span>
                {themeMode === 'dark' && <Check className="h-4 w-4 text-[var(--ca-teal)]" />}
              </Menu.Item>
              <Menu.Item
                className="flex cursor-pointer items-center gap-2 rounded-2xl px-3 py-2 text-[var(--ca-navy)] outline-none transition data-[highlighted]:bg-[var(--ca-bg-secondary)]"
                onClick={() => onThemeChange('system')}
              >
                <Sparkles className="h-4 w-4 text-[var(--ca-teal)]" />
                <span className="flex-1">Tema del sistema</span>
                {themeMode === 'system' && <Check className="h-4 w-4 text-[var(--ca-teal)]" />}
              </Menu.Item>
            </div>
            <Menu.Separator className="my-1 h-px bg-[var(--ca-bg-secondary)]" />
            <Menu.Item
              className="flex cursor-pointer items-center gap-2 rounded-2xl px-3 py-2 text-red-600 outline-none transition data-[highlighted]:bg-red-50"
              onClick={onLogout}
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesion
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [themeMode, setThemeMode] = useState<ThemeMode>(getStoredTheme())
  const messagesViewportRef = useRef<HTMLDivElement | null>(null)
  const hasMountedRef = useRef(false)
  const effectiveTheme = getEffectiveTheme(themeMode)
  const palette = THEME_PALETTES[effectiveTheme]
  const themeVars = createThemeVars(palette)

  useEffect(() => {
    const viewport = messagesViewportRef.current
    if (!viewport) {
      return
    }

    viewport.scrollTo({
      top: viewport.scrollHeight,
      behavior: hasMountedRef.current ? 'smooth' : 'auto',
    })

    hasMountedRef.current = true
  }, [messages.length])

  useEffect(() => {
    setStoredTheme(themeMode)
  }, [themeMode])

  useEffect(() => {
    if (themeMode !== 'system') {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      // Force re-render by triggering a state update
      setThemeMode('system')
    }

    mediaQuery.addEventListener('change', handleChange)
  }, [themeMode])

  const handleLogout = () => {
    localStorage.removeItem('sarah_auth_status')
    localStorage.removeItem('sarah_user_email')
    localStorage.removeItem('sarah_auth_timestamp')
    navigate('/paciente/login', { replace: true })
  }

  const handleSend = (text: string) => {
    const userMessage: TextMessage = {
      id: Date.now(),
      kind: 'text',
      role: 'user',
      content: text,
      time: timeNow(),
    }

    const assistantMessage: TextMessage = {
      id: Date.now() + 1,
      kind: 'text',
      role: 'assistant',
      content:
        'Recibido. Estoy revisando tu consulta y puedo ayudarte con una respuesta simple basada en tu tratamiento.',
      time: timeNow(),
    }

    setMessages((currentMessages) => [...currentMessages, userMessage, assistantMessage])
  }

  const handleReminderChoice = (messageId: number, choice: ReminderChoice) => {
    setMessages((currentMessages) => {
      const alreadyAnswered = currentMessages.some(
        (message) => message.kind === 'reminder' && message.id === messageId && message.selection,
      )

      if (alreadyAnswered) {
        return currentMessages
      }

      const updatedMessages = currentMessages.map((message) =>
        message.kind === 'reminder' && message.id === messageId
          ? { ...message, selection: choice }
          : message,
      )

      const userMessage: TextMessage = {
        id: Date.now(),
        kind: 'text',
        role: 'user',
        content: choice === 'yes' ? 'Si, ya lo tome.' : 'No, todavia no.',
        time: timeNow(),
      }

      const assistantMessage: TextMessage = {
        id: Date.now() + 1,
        kind: 'text',
        role: 'assistant',
        content:
          choice === 'yes'
            ? 'Perfecto, quedo registrado. Seguimos con el control de hoy.'
            : 'De acuerdo, lo dejo pendiente y te lo puedo recordar mas tarde.',
        time: timeNow(),
      }

      return [...updatedMessages, userMessage, assistantMessage]
    })
  }

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode)
  }

  return (
    <div
      className="min-h-screen overflow-hidden text-[var(--ca-navy)]"
      style={{
        ...themeVars,
        background: `linear-gradient(180deg, ${palette.background} 0%, ${palette.backgroundSecondary} 45%, ${palette.background} 100%)`,
        color: palette.textPrimary,
      }}
    >
      <main className="relative flex h-screen min-h-screen w-full flex-col">
        <header className="z-[60] flex w-full items-center justify-between border-b border-[var(--ca-bg-secondary)] bg-[var(--ca-bg)] px-4 py-3 md:px-6">
          <p className="pl-2 text-lg font-semibold tracking-wide text-[var(--ca-teal)] md:pl-3">Sarah</p>
          <FloatingProfileMenu onLogout={handleLogout} themeMode={themeMode} onThemeChange={handleThemeChange} themeVars={themeVars} />
        </header>

        <section className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col px-3 pt-3 sm:px-4 md:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-4xl flex-1 min-h-0 flex-col">
            <div ref={messagesViewportRef} className="flex-1 min-h-0 space-y-5 overflow-y-auto px-0 pb-56 pt-2 md:pb-44">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  onReminderChoice={handleReminderChoice}
                />
              ))}
            </div>
          </div>
        </section>

        <div className="fixed bottom-0 left-0 right-0 z-[50] border-t border-[var(--ca-bg-secondary)] bg-[var(--ca-bg)] pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl">
          <div className="mx-auto w-full max-w-4xl px-3 sm:px-4 md:px-0">
            <ChatComposer onSend={handleSend} />
          </div>
        </div>
      </main>
    </div>
  )
}