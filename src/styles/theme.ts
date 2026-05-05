import type { CSSProperties } from 'react'

export type ThemeMode = 'light' | 'dark' | 'system'

export interface ThemePalette {
  background: string
  backgroundSecondary: string
  textPrimary: string
  textSecondary: string
  accent: string
  hover: string
  danger?: string
  dangerFocus?: string
}

export const THEME_PALETTES: Record<'light' | 'dark', ThemePalette> = {
  light: {
    background: '#f5f8fd',
    backgroundSecondary: '#dfe2e8',
    textPrimary: '#1f293b',
    textSecondary: '#67778c',
    accent: '#0db17f',
    hover: '#17785a',
    danger: '#ef4444',
    dangerFocus: 'rgba(239, 68, 68, 0.1)',
  },
  dark: {
    background: '#1f273a',
    backgroundSecondary: '#1c2436',
    textPrimary: '#f1f6fa',
    textSecondary: '#90a1b2',
    accent: '#35b498',
    hover: '#12956c',
    danger: '#f87171',
    dangerFocus: 'rgba(248, 113, 113, 0.08)',
  },
}

export const DEFAULT_THEME_MODE: ThemeMode = 'light'
export const THEME_COOKIE_NAME = 'sarah_theme_preference'

export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function getEffectiveTheme(themeMode: ThemeMode): 'light' | 'dark' {
  if (themeMode === 'system') {
    return getSystemTheme()
  }
  return themeMode
}

export function createThemeVars(palette: ThemePalette): CSSProperties {
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
    ['--ca-danger' as string]: palette.danger || '#ef4444',
    ['--ca-danger-focus' as string]: palette.dangerFocus || 'rgba(239, 68, 68, 0.1)',
  }
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null
  }

  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null
  }
  return null
}

function setCookie(name: string, value: string, days: number = 365): void {
  if (typeof document === 'undefined') {
    return
  }

  const date = new Date()
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
  const expires = `expires=${date.toUTCString()}`
  document.cookie = `${name}=${value};${expires};path=/`
}

export function getStoredTheme(): ThemeMode {
  const stored = getCookie(THEME_COOKIE_NAME)
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored
  }
  return DEFAULT_THEME_MODE
}

export function setStoredTheme(themeMode: ThemeMode): void {
  setCookie(THEME_COOKIE_NAME, themeMode)
}
