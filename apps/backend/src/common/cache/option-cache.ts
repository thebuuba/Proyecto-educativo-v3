import { TtlMemoryCache } from './ttl-memory-cache'

export const optionCache = new TtlMemoryCache({ ttlMs: 60_000, maxEntries: 500 })

export const optionCacheKeys = {
  courses: {
    courseData: (schoolId: string, appUserId?: string) => `courses:course-data:${schoolId}${appUserId ? `:${appUserId}` : ''}`,
    courseDataPrefix: (schoolId: string) => `courses:course-data:${schoolId}`,
  },
  students: {
    enrollmentCourses: (schoolId: string) => `students:enrollment-courses:${schoolId}`,
  },
  grading: {
    sectionSubjects: (schoolId: string) => `grading:section-subjects:${schoolId}`,
    academicPeriods: (schoolId: string) => `grading:academic-periods:${schoolId}`,
  },
  attendance: {
    currentPeriod: (schoolId: string) => `attendance:current-period:${schoolId}`,
  },
  schedule: {
    sections: (schoolId: string) => `schedule:sections:${schoolId}`,
    teachers: (schoolId: string) => `schedule:teachers:${schoolId}`,
    subjects: (schoolId: string) => `schedule:subjects:${schoolId}`,
    sectionSubjects: (schoolId: string, sectionId = 'all') =>
      `schedule:section-subjects:${schoolId}:${sectionId}`,
    sectionSubjectsPrefix: (schoolId: string) => `schedule:section-subjects:${schoolId}:`,
    timeSlots: (schoolId: string) => `schedule:time-slots:${schoolId}`,
  },
} as const

/** Invalida catálogos propios y consumidores luego de cambiar cursos. */
export function invalidateCourseOptions(schoolId: string) {
  optionCache.invalidatePrefix(optionCacheKeys.courses.courseDataPrefix(schoolId))
  optionCache.invalidate(optionCacheKeys.students.enrollmentCourses(schoolId))
  optionCache.invalidate(optionCacheKeys.grading.sectionSubjects(schoolId))
  optionCache.invalidate(optionCacheKeys.schedule.sections(schoolId))
  optionCache.invalidate(optionCacheKeys.schedule.subjects(schoolId))
  optionCache.invalidatePrefix(optionCacheKeys.schedule.sectionSubjectsPrefix(schoolId))
}

/** Invalida opciones que dependen de períodos académicos. */
export function invalidateAcademicPeriodOptions(schoolId: string) {
  optionCache.invalidate(optionCacheKeys.grading.academicPeriods(schoolId))
  optionCache.invalidate(optionCacheKeys.attendance.currentPeriod(schoolId))
}

/** Invalida opciones cuyo contenido o selección depende del año escolar. */
export function invalidateImplicitSchoolYearOptions(schoolId: string) {
  optionCache.invalidate(optionCacheKeys.students.enrollmentCourses(schoolId))
  optionCache.invalidate(optionCacheKeys.grading.sectionSubjects(schoolId))
  invalidateAcademicPeriodOptions(schoolId)
}

/** Invalida también el curso agregado cuando el cambio vino de administración. */
export function invalidateSchoolYearOptions(schoolId: string) {
  optionCache.invalidatePrefix(optionCacheKeys.courses.courseDataPrefix(schoolId))
  invalidateImplicitSchoolYearOptions(schoolId)
}

/** Invalida conteos y listas derivadas de matrículas. */
export function invalidateEnrollmentOptions(schoolId: string) {
  optionCache.invalidatePrefix(optionCacheKeys.courses.courseDataPrefix(schoolId))
  optionCache.invalidate(optionCacheKeys.students.enrollmentCourses(schoolId))
}
