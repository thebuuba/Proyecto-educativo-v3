import type { ImportCourseStudentRow } from '@/modules/students/types'

export function parsePastedStudents(text: string): ImportCourseStudentRow[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      if (line.includes(' - ')) {
        const [studentCode, ...nameParts] = line.split(' - ')
        return {
          studentCode: studentCode.trim(),
          fullName: nameParts.join(' - ').trim(),
        }
      }

      if (line.includes(',')) {
        const [studentCode, ...nameParts] = line.split(',')
        return {
          studentCode: studentCode.trim(),
          fullName: nameParts.join(',').trim(),
        }
      }

      return { fullName: line }
    })
}
