/**
 * @file Página de Asignaturas
 *
 * Vista del catálogo de materias y áreas académicas.
 */

import { BookOpen } from 'lucide-react'

import { PageShell } from '@/components/ui/PageShell'

/** Página del catálogo de asignaturas */
export function SubjectsPage() {
  return (
    <PageShell
      title="Asignaturas"
      description="Catálogo de materias, áreas académicas y carga curricular."
      icon={BookOpen}
      tone="info"
      eyebrow="Gestión académica"
    />
  )
}
