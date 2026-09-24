import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { expect, it } from 'vitest'

import { WeeklyAttendanceCard } from './WeeklyAttendanceCard'

it('shows each recorded day percentage outside the chart', () => {
  render(
    <MemoryRouter>
      <WeeklyAttendanceCard attendance={{
        average: 85,
        trendPercent: null,
        activityCount: 1,
        days: [
          { label: 'LUN', value: 85, isToday: true },
          { label: 'MAR', value: null, isToday: false },
        ],
      }} />
    </MemoryRouter>,
  )

  expect(within(screen.getByText('LUN').parentElement!).getByText('85%')).toBeInTheDocument()
  expect(within(screen.getByText('MAR').parentElement!).getByText('—')).toBeInTheDocument()
})
