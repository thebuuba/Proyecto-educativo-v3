import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { SemanticIcon, type SemanticTone } from '@/components/ui/SemanticUI'

export function SubjectTabHeader({ title, description, context, actions }: { title: string; description: string; context?: ReactNode; actions?: ReactNode }) {
  return <header className="subject-tab-header"><div className="min-w-0"><h2>{title}</h2><p>{description}</p>{context ? <div className="subject-context"><span className="subject-context-dot" />{context}</div> : null}</div><div className="subject-tab-actions">{actions}</div></header>
}

export function SubjectStat({ icon, value, label, tone = 'info', hint }: { icon: LucideIcon; value: ReactNode; label: string; tone?: SemanticTone; hint?: string }) {
  return <div className="subject-stat"><SemanticIcon icon={icon} tone={tone} /><div><strong>{value}</strong><p>{label}</p>{hint ? <small>{hint}</small> : null}</div></div>
}

export function StudentAvatar({ firstName, lastName }: { firstName: string; lastName: string }) {
  return <span aria-hidden="true" className="subject-student-avatar">{firstName.charAt(0)}{lastName.charAt(0)}</span>
}

export function exportStudentCsv(rows: Array<Array<string | number>>) {
  const escape = (value: string | number) => {
    const text = String(value)
    const safe = /^[=+@\-\t\r]/.test(text) ? `'${text}` : text
    return `"${safe.replaceAll('"', '""')}"`
  }
  const url = URL.createObjectURL(new Blob(['\uFEFF', rows.map(row => row.map(escape).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'estudiantes-asignatura.csv'
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
