import {
  BellRingingIcon,
  ChartLineUpIcon,
  ClockIcon,
  FlagIcon,
  GearIcon,
  ReceiptIcon,
  ShieldCheckIcon,
} from '@phosphor-icons/react'
import type { IconComponent } from '@/lib/icons'
import type { NotificationKind, NotificationSeverity } from '@/state/atoms'

export const NOTIFICATION_KIND_LABEL: Record<NotificationKind, string> = {
  transaction: 'Transaction',
  security: 'Security',
  system: 'System',
  insight: 'Insight',
  reminder: 'Reminder',
  goal: 'Goal',
}

export const NOTIFICATION_KIND_ICONS: Record<NotificationKind, IconComponent> = {
  transaction: ReceiptIcon,
  security: ShieldCheckIcon,
  system: GearIcon,
  insight: ChartLineUpIcon,
  reminder: ClockIcon,
  goal: FlagIcon,
}

export function notificationIcon(k: NotificationKind): IconComponent {
  return NOTIFICATION_KIND_ICONS[k] ?? BellRingingIcon
}

export const SEVERITY_DOT: Record<NotificationSeverity, string> = {
  info: 'bg-sky-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-rose-500',
}

export const SEVERITY_ICON_BG: Record<NotificationSeverity, string> = {
  info: 'bg-sky-100 text-sky-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-rose-100 text-rose-700',
}

export type NotificationFilter = 'all' | 'unread' | NotificationKind

export const NOTIFICATION_FILTER_ORDER: NotificationFilter[] = [
  'all',
  'unread',
  'transaction',
  'security',
  'reminder',
  'insight',
  'goal',
  'system',
]

export const NOTIFICATION_FILTER_LABEL: Record<NotificationFilter, string> = {
  all: 'All',
  unread: 'Unread',
  transaction: 'Transactions',
  security: 'Security',
  reminder: 'Reminders',
  insight: 'Insights',
  goal: 'Goals',
  system: 'System',
}
