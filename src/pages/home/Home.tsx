import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User,
  Settings,
  LogOut,
  Pill,
  Clock,
  CheckCircle2,
  MessageCircleQuestion,
  Mic,
  Send,
  Sparkles,
  Activity,
  Target,
  Stethoscope,
  ChevronRight,
  ChevronDown,
} from 'lucide-react'

// 1. INTERFAZ: Definimos los tipos para los props del Header
interface DashboardHeaderProps {
  onLogout: () => void;
}

function DashboardHeader({ onLogout }: DashboardHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <header className="w-full bg-[#1f293b] text-white py-4 px-4 md:px-6 sticky top-0 z-50 shadow-md">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-lg md:text-xl font-semibold tracking-wide">
            Sarah
          </span>
          <span className="text-xs md:text-sm text-[#0db17f] font-light tracking-widest uppercase">
            Tu Asistente de Salud
          </span>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 hover:bg-white/10 text-white px-3 py-2 rounded-md transition-colors"
          >
            <span className="text-sm md:text-base font-medium hidden sm:inline">
              Hola, Lorenzo
            </span>
           
            <div className="h-9 w-9 rounded-full border-2 border-white/30 bg-[#0db17f] flex items-center justify-center text-white text-sm font-semibold">
              LM
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen ? (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">Lorenzo Martinez</p>
                  <p className="text-xs text-gray-500">lorenzo.martinez@email.com</p>
                </div>
                <div className="py-1">
                  <a
                    href="#perfil"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <User className="h-4 w-4" />
                    <span>Mi Perfil</span>
                  </a>
                  <a
                    href="#configuracion"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Configuracion</span>
                  </a>
                </div>
                <div className="border-t border-gray-100 py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(false)
                      onLogout()
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Cerrar Sesion</span>
                  </button>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </header>
  )
}

function MedicationWidget() {
  const [isTaken, setIsTaken] = useState(false)

  return (
    <div className="bg-white rounded-xl border-l-4 border-l-[#0db17f] shadow-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="flex items-center gap-2 text-[#1f293b] text-lg md:text-xl font-bold">
          <Pill className="h-5 w-5 md:h-6 md:w-6 text-[#0db17f]" />
          Proximo Medicamento
        </h2>
      </div>
      <div className="p-5 space-y-4">
        {isTaken ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-3">
            <div className="rounded-full bg-green-100 p-4">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <p className="text-lg font-semibold text-green-700">
              ¡Medicamento registrado!
            </p>
            <p className="text-sm text-gray-500 text-center">
              Tu proximo medicamento sera a las 08:00 hrs.
            </p>
            <button
              onClick={() => setIsTaken(false)}
              className="mt-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Deshacer
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-4 p-4 bg-[#f5f8fd] rounded-lg">
              <div className="rounded-full bg-[#0db17f]/10 p-3 shrink-0">
                <Clock className="h-6 w-6 text-[#0db17f]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg md:text-xl font-bold text-[#1f293b]">
                  Amoxicilina 500mg
                </h3>
                <p className="text-2xl md:text-3xl font-bold text-[#0db17f] mt-1">
                  21:00 hrs
                </p>
                <p className="text-sm md:text-base text-gray-500 mt-2">
                  Antibiotico para la infeccion
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsTaken(true)}
              className="w-full flex items-center justify-center gap-2 bg-[#0db17f] hover:bg-[#17785a] text-white text-base md:text-lg font-semibold py-4 rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <CheckCircle2 className="h-5 w-5" />
              Marcar como Tomado
            </button>

            <button className="flex items-center justify-center gap-2 w-full text-[#0db17f] hover:text-[#17785a] text-sm md:text-base font-medium py-2 transition-colors hover:underline underline-offset-4">
              <MessageCircleQuestion className="h-4 w-4" />
              Tengo dudas / Ver efectos secundarios
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function AIAssistantInput() {
  const [query, setQuery] = useState('')
  const [isListening, setIsListening] = useState(false)

  // 2. TIPO DE EVENTO: Le decimos a TS que 'e' es un evento de formulario
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (query.trim()) {
      console.log('Query submitted:', query)
      setQuery('')
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-[#0db17f]/20 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="flex items-center gap-2 text-[#1f293b] text-base md:text-lg font-bold">
          <Sparkles className="h-5 w-5 text-[#0db17f]" />
          Consultar a Sarah (IA)
        </h2>
      </div>
      <div className="p-5">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center gap-2 p-2 bg-[#f5f8fd] rounded-xl border-2 border-[#0db17f]/30 focus-within:border-[#0db17f] transition-colors">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="¿Sarah, puedo tomar Paracetamol con mi tratamiento actual?"
              className="flex-1 bg-transparent border-none outline-none px-3 py-3 text-sm md:text-base text-[#1f293b] placeholder:text-gray-400"
              aria-label="Pregunta a Sarah"
            />
            <button
              type="button"
              onClick={() => setIsListening(!isListening)}
              className={`shrink-0 h-10 w-10 rounded-full flex items-center justify-center transition-colors ${
                isListening
                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                  : 'hover:bg-[#0db17f]/10 text-[#0db17f]'
              }`}
              aria-label={isListening ? 'Detener grabacion' : 'Iniciar grabacion de voz'}
            >
              <Mic className="h-5 w-5" />
            </button>
            <button
              type="submit"
              disabled={!query.trim()}
              className="shrink-0 h-10 w-10 rounded-full bg-[#0db17f] hover:bg-[#17785a] text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Enviar pregunta"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          {isListening ? (
            <p className="text-xs text-red-600 mt-2 flex items-center gap-1 animate-pulse">
              <span className="w-2 h-2 bg-red-500 rounded-full" />
              Escuchando...
            </p>
          ) : null}
        </form>
        <p className="text-xs text-gray-500 mt-3 text-center">
          Sarah te ayuda con dudas sobre tu tratamiento, medicamentos y bienestar.
        </p>
      </div>
    </div>
  )
}

// 3. INTERFAZ: Tipamos los props de las tarjetas de acceso rápido
interface QuickAccessCardProps {
  title: string;
  icon: React.ReactNode;
  href: string;
  description?: string; // El signo '?' significa que es opcional
}

function QuickAccessCard({ title, icon, href, description }: QuickAccessCardProps) {
  return (
    <a href={href} className="block group">
      <div className="h-full bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 hover:border-[#0db17f]/50 hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
        <div className="p-4 md:p-5 flex flex-col items-center text-center space-y-3">
          <div className="rounded-full bg-[#1f293b]/5 p-4 group-hover:bg-[#0db17f]/10 transition-colors">
            {icon}
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-[#1f293b] text-sm md:text-base leading-tight">
              {title}
            </h3>
            {description ? (
              <p className="text-xs text-[#67778c] hidden md:block">{description}</p>
            ) : null}
          </div>
          <ChevronRight className="h-4 w-4 text-[#0db17f] opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </a>
  )
}

function QuickAccessGrid() {
  const quickAccessItems = [
    {
      title: 'Mi Tratamiento Actual',
      description: 'Ver medicamentos y horarios',
      icon: <Pill className="h-7 w-7 md:h-8 md:w-8 text-[#0db17f]" />,
      href: '#tratamiento',
    },
    {
      title: 'Reportar Actividad/Nutricion',
      description: 'Registra ejercicio y comidas',
      icon: <Activity className="h-7 w-7 md:h-8 md:w-8 text-[#0db17f]" />,
      href: '#actividad',
    },
    {
      title: 'Mis Avances y Adherencia',
      description: 'Seguimiento de tu progreso',
      icon: <Target className="h-7 w-7 md:h-8 md:w-8 text-[#0db17f]" />,
      href: '#avances',
    },
    {
      title: 'Contactar a mi Equipo Medico',
      description: 'Comunicacion directa',
      icon: <Stethoscope className="h-7 w-7 md:h-8 md:w-8 text-[#0db17f]" />,
      href: '#equipo-medico',
    },
  ]

  return (
    <section aria-labelledby="quick-access-title">
      <h2 id="quick-access-title" className="text-lg md:text-xl font-bold text-[#1f293b] mb-4">
        Acceso Rapido
      </h2>
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {quickAccessItems.map((item) => (
          <QuickAccessCard
            key={item.title}
            title={item.title}
            description={item.description}
            icon={item.icon}
            href={item.href}
          />
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('sarah_auth_status')
    localStorage.removeItem('sarah_user_email')
    localStorage.removeItem('sarah_auth_timestamp')
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[#f5f8fd]">
      <DashboardHeader onLogout={handleLogout} />

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <section aria-labelledby="medication-section">
          <h1 id="medication-section" className="sr-only">
            Panel de Paciente - Sarah
          </h1>
          <MedicationWidget />
        </section>

        <AIAssistantInput />

        <QuickAccessGrid />

        <footer className="text-center py-6">
          <p className="text-xs text-[#67778c]">
            Sarah - Tu Asistente de Salud Inteligente
          </p>
        </footer>
      </main>
    </div>
  )
}