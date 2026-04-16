import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell,
  ChevronDown,
  FileText,
  Lightbulb,
  LogOut,
  Mic,
  Moon,
  Send,
  Settings,
  Sparkles,
  Stethoscope,
  Sun,
  User,
} from 'lucide-react'
import {
  Avatar,
  Button,
  Collapsible,
  Field,
  Input,
  Menu,
  Separator,
  Tooltip,
} from '@base-ui/react'

type ChatRole = 'assistant' | 'user'
type FloatingPanel = 'suggestions' | 'context' | null
type ReminderChoice = 'yes' | 'no'
type ThemeMode = 'light' | 'dark'

interface ThemePalette {
  background: string
  backgroundSecondary: string
  textPrimary: string
  textSecondary: string
  accent: string
  hover: string
}

const THEME_PALETTES: Record<ThemeMode, ThemePalette> = {
  light: {
    background: '#f5f8fd',
    backgroundSecondary: '#dfe2e8',
    textPrimary: '#1f293b',
    textSecondary: '#67778c',
    accent: '#0db17f',
    hover: '#17785a',
  },
  dark: {
    background: '#1f273a',
    backgroundSecondary: '#1c2436',
    textPrimary: '#f1f6fa',
    textSecondary: '#90a1b2',
    accent: '#35b498',
    hover: '#12956c',
  },
}

// Edit only this field to set the default app theme.
const DEFAULT_THEME_MODE: ThemeMode = 'light'

function createThemeVars(palette: ThemePalette): CSSProperties {
  return {
    ['--ca-bg' as string]: palette.background,
    ['--ca-bg-secondary' as string]: palette.backgroundSecondary,
    ['--ca-text' as string]: palette.textPrimary,
    ['--ca-text-secondary' as string]: palette.textSecondary,
    ['--ca-accent' as string]: palette.accent,
    ['--ca-accent-hover' as string]: palette.hover,
    ['--ca-navy' as string]: palette.textPrimary,
    ['--ca-teal' as string]: palette.accent,
    ['--ca-teal-dark' as string]: palette.hover,
    ['--ca-teal-light' as string]: palette.backgroundSecondary,
  }
}

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

interface PromptChip {
  label: string
  prompt: string
}

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

const promptChips: PromptChip[] = [
  {
    label: 'Medicamento y horario',
    prompt: 'Revisa mi medicamento actual y dime a que hora debo tomar la siguiente dosis.',
  },
  {
    label: 'Efectos secundarios',
    prompt: 'Tengo mareo despues de tomar la medicacion. Que hago?',
  },
  {
    label: 'Interacciones',
    prompt: 'Puedo mezclar paracetamol con mi tratamiento actual?',
  },
  {
    label: 'Sintomas nuevos',
    prompt: 'Ayudame a registrar un sintoma nuevo para mi equipo medico.',
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!text.trim()) {
      return
    }

    onSend(text.trim())
    setText('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Field.Root className="space-y-2">
        <Field.Label className="sr-only">Mensaje</Field.Label>
        <div className="flex items-end gap-2 rounded-[1.75rem] border border-[var(--ca-bg-secondary)] bg-[var(--ca-bg)] p-2 shadow-[0_18px_60px_rgba(15,23,42,0.08)] focus-within:border-[var(--ca-teal)]">
          <Button
            type="button"
            className="mb-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--ca-bg-secondary)] text-[var(--ca-text-secondary)] transition hover:bg-[var(--ca-bg)]"
            aria-label="Adjuntar archivo"
          >
            <FileText className="h-5 w-5" />
          </Button>

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

function FloatingProfileMenu({ onLogout }: { onLogout: () => void }) {
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
          <Menu.Popup className="min-w-64 overflow-hidden rounded-3xl border border-[var(--ca-bg-secondary)] bg-[var(--ca-bg)] p-2 text-sm shadow-2xl outline-none">
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

function FloatingPanels({
  activePanel,
  onClose,
  onPickPrompt,
  onTriggerReminder,
}: {
  activePanel: FloatingPanel
  onClose: () => void
  onPickPrompt: (prompt: string) => void
  onTriggerReminder: () => void
}) {
  if (!activePanel) {
    return null
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[70] hidden md:block">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="pointer-events-auto absolute right-6 top-24 w-[min(92vw,24rem)] rounded-[2rem] border border-[var(--ca-bg-secondary)] bg-[var(--ca-bg)] p-4 shadow-2xl">
        {activePanel === 'suggestions' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[var(--ca-navy)]">Sugerencias</p>
                <p className="text-xs text-[var(--ca-text-secondary)]">Prompts rapidos</p>
              </div>
              <div className="rounded-2xl bg-[var(--ca-teal)]/10 p-3 text-[var(--ca-teal)]">
                <Lightbulb className="h-5 w-5" />
              </div>
            </div>

            <div className="space-y-2">
              {promptChips.map((chip) => (
                <Button
                  key={chip.label}
                  type="button"
                  onClick={() => onPickPrompt(chip.prompt)}
                  className="w-full rounded-2xl border border-[var(--ca-bg-secondary)] bg-[var(--ca-bg-secondary)] px-4 py-3 text-left text-sm font-medium text-[var(--ca-navy)] transition hover:border-[var(--ca-teal)]/30 hover:bg-[var(--ca-bg)]"
                >
                  {chip.label}
                </Button>
              ))}
            </div>
          </div>
        ) : null}

        {activePanel === 'context' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[var(--ca-navy)]">Contexto</p>
                <p className="text-xs text-[var(--ca-text-secondary)]">Datos utiles del chat</p>
              </div>
              <div className="rounded-2xl bg-[var(--ca-teal)]/10 p-3 text-[var(--ca-teal)]">
                <Stethoscope className="h-5 w-5" />
              </div>
            </div>

            <Separator className="h-px bg-[var(--ca-bg-secondary)]" />

            <div className="space-y-3 text-sm text-[var(--ca-text-secondary)]">
              <p>Sarah responde con tono simple y orientado a salud.</p>
              <p>Usa este panel para ver atajos, recordatorios y guia de uso.</p>
            </div>

            <Collapsible.Root defaultOpen={false} className="rounded-[1.5rem] border border-[var(--ca-bg-secondary)] bg-[var(--ca-bg-secondary)]">
              <Collapsible.Trigger className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left">
                <span className="text-sm font-semibold text-[var(--ca-navy)]">Acciones rapidas</span>
                <span className="text-[var(--ca-teal)]">+</span>
              </Collapsible.Trigger>
              <Collapsible.Panel className="px-4 pb-4 text-sm text-[var(--ca-text-secondary)]">
                Puedes iniciar una nueva conversacion, copiar respuestas y adjuntar contexto sin salir del chat.
              </Collapsible.Panel>
            </Collapsible.Root>
          </div>
        ) : null}

        <div className="mt-4 flex items-center justify-between gap-2">
          <Button
            type="button"
            onClick={onTriggerReminder}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--ca-teal)] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[var(--ca-teal-dark)]"
          >
            <Bell className="h-4 w-4" />
            Recordatorio
          </Button>
          <Button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[var(--ca-bg-secondary)] bg-[var(--ca-bg)] px-4 py-2 text-xs font-semibold text-[var(--ca-navy)] transition hover:bg-[var(--ca-bg-secondary)]"
          >
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [activePanel, setActivePanel] = useState<FloatingPanel>(null)
  const [themeMode, setThemeMode] = useState<ThemeMode>(DEFAULT_THEME_MODE)
  const messagesViewportRef = useRef<HTMLDivElement | null>(null)
  const hasMountedRef = useRef(false)
  const palette = THEME_PALETTES[themeMode]
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

  const handleLogout = () => {
    localStorage.removeItem('sarah_auth_status')
    localStorage.removeItem('sarah_user_email')
    localStorage.removeItem('sarah_auth_timestamp')
    navigate('/login', { replace: true })
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

  const handleTriggerReminder = () => {
    const reminder: ReminderMessage = {
      id: Date.now(),
      kind: 'reminder',
      role: 'assistant',
      content: '¿Ya tomaste tu remedio de hoy?',
      time: timeNow(),
    }

    setMessages((currentMessages) => [...currentMessages, reminder])
    setActivePanel(null)
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

  const toggleTheme = () => {
    setThemeMode((current) => (current === 'light' ? 'dark' : 'light'))
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
      <FloatingPanels
        activePanel={activePanel}
        onClose={() => setActivePanel(null)}
        onPickPrompt={handleSend}
        onTriggerReminder={handleTriggerReminder}
      />

      <main className="relative flex h-screen min-h-screen w-full flex-col px-3 py-3 sm:px-4 md:px-6 lg:px-8">
        <div className="absolute right-3 top-3 z-[60] hidden md:block md:right-6 md:top-6">
          <FloatingProfileMenu onLogout={handleLogout} />
        </div>

        <div className="absolute left-3 top-3 z-[56] md:left-6 md:top-6">
          <Button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--ca-bg-secondary)] bg-[var(--ca-bg)] px-4 py-2 text-xs font-semibold text-[var(--ca-navy)] shadow-sm backdrop-blur transition hover:bg-[var(--ca-bg-secondary)]"
          >
            {themeMode === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            {themeMode === 'light' ? 'Modo oscuro' : 'Modo claro'}
          </Button>
        </div>

        <section className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col">
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
            <div className="mb-2 flex items-center justify-end gap-2">
              <Button
                type="button"
                onClick={() => setActivePanel((current) => (current === 'suggestions' ? null : 'suggestions'))}
                className="rounded-full border border-[var(--ca-bg-secondary)] bg-[var(--ca-bg)] px-4 py-2 text-xs font-semibold text-[var(--ca-navy)] shadow-sm backdrop-blur transition hover:bg-[var(--ca-bg-secondary)]"
              >
                Sugerencias
              </Button>
              <Button
                type="button"
                onClick={() => setActivePanel((current) => (current === 'context' ? null : 'context'))}
                className="rounded-full border border-[var(--ca-bg-secondary)] bg-[var(--ca-bg)] px-4 py-2 text-xs font-semibold text-[var(--ca-navy)] shadow-sm backdrop-blur transition hover:bg-[var(--ca-bg-secondary)]"
              >
                Contexto
              </Button>
            </div>
            <ChatComposer onSend={handleSend} />
          </div>
        </div>
      </main>
    </div>
  )
}