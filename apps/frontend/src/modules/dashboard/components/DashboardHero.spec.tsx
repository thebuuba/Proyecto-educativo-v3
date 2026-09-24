import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { DashboardHero } from './DashboardHero'
import type { DashboardClass } from '../types/dashboard'

const activeClass: DashboardClass = {
  id: 'class-1',
  subjectName: 'Matemática',
  gradeName: '1.º',
  sectionName: 'A',
  startTime: '00:00',
  endTime: '23:59',
  durationMinutes: 1439,
  room: null,
  studentCount: 20,
  dayOfWeek: 1,
  sectionId: 'section-1',
  sectionSubjectId: 'subject-1',
  academicPeriodId: null,
  startsInMinutes: null,
  status: 'current',
}

describe('DashboardHero countdown', () => {
  it('reserves enough room and keeps the compact label on one line', () => {
    render(
      <DashboardHero
        nextClass={activeClass}
        onStartClass={vi.fn()}
        onViewPlanning={vi.fn()}
      />,
    )

    const timer = screen.getByRole('timer')
    const label = screen.getByText('Termina', { selector: '[data-countdown-label]' })
    const progress = timer.querySelector('[data-countdown-progress]')

    expect(timer).toHaveClass('size-16')
    expect(label).toHaveClass('whitespace-nowrap', 'tracking-[0.06em]')
    expect(progress).not.toHaveClass('transition-[stroke-dasharray]')
  })
})
