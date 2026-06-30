/**
 * Servicio de estudiantes.
 *
 * Implementa la lógica de negocio para la gestión de estudiantes,
 * incluyendo operaciones CRUD, matrículas, apoderados,
 * notificaciones e importación masiva de datos desde archivos externos.
 */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { prisma, Prisma } from '@aula/database'
import { CreateStudentDto } from './dto/create-student.dto'
import { UpdateStudentDto } from './dto/update-student.dto'
import { CreateEnrollmentDto } from './dto/create-enrollment.dto'
import {
  CreateCourseStudentDto,
  ImportCourseStudentRowDto,
} from './dto/course-enrollment.dto'

type CourseForEnrollment = {
  id: string
  schoolYearId: string
  gradeId: string
  sectionId: string
  subjectId: string
}

type ImportPreviewRow = {
  rowNumber: number
  studentCode: string
  fullName: string
  duplicate: boolean
  errors: string[]
}

/**
 * Representa una fila de datos de un estudiante durante la importación masiva.
 */
type ImportStudentRow = {
  rowNumber?: number
  studentCode?: string
  firstName?: string
  lastName?: string
  documentId?: string
  birthDate?: string
  gender?: string
  address?: string
}

/**
 * Representa un error encontrado durante la importación de estudiantes.
 */
type ImportStudentError = {
  row: number
  reason: string
}

/** Fecha de nacimiento por defecto usada cuando no se puede parsear la fecha en una importación. */
const IMPORT_FALLBACK_BIRTH_DATE = new Date('2000-01-01T00:00:00')
const FAST_ENROLLMENT_BIRTH_DATE = new Date('2000-01-01T00:00:00')

/**
 * Limpia un valor desconocido retornando su representación como texto
 * sin espacios al inicio o final, o una cadena vacía si no es texto.
 *
 * @param value - Valor a limpiar.
 * @returns Cadena de texto limpia o cadena vacía.
 */
function cleanText(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

/**
 * Verifica si los componentes año, mes y día forman una fecha válida.
 *
 * @param year - Año de la fecha.
 * @param month - Mes de la fecha (1-12).
 * @param day - Día de la fecha.
 * @returns true si la fecha es válida, false en caso contrario.
 */
function isValidDateParts(year: number, month: number, day: number) {
  const date = new Date(year, month - 1, day)
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  )
}

/**
 * Parsea una fecha de nacimiento desde un valor desconocido.
 *
 * Soporta formatos con separadores '/' o '-', tanto en orden
 * año-mes-día como día-mes-año. Si no se puede interpretar,
 * retorna una fecha por defecto.
 *
 * @param value - Valor a parsear como fecha de nacimiento.
 * @returns Objeto Date con la fecha parseada o la fecha por defecto.
 */
function parseBirthDate(value: unknown) {
  const raw = cleanText(value)
  if (!raw) return IMPORT_FALLBACK_BIRTH_DATE

  const parts = raw.split(/[/-]/)
  if (parts.length === 3) {
    const [first, second, third] = parts.map((part) => Number(part))

    if (parts[0].length === 4 && isValidDateParts(first, second, third)) {
      return new Date(first, second - 1, third)
    }

    if (isValidDateParts(third, second, first)) {
      return new Date(third, second - 1, first)
    }
  }

  const date = new Date(`${raw}T00:00:00`)
  if (!Number.isFinite(date.getTime())) return IMPORT_FALLBACK_BIRTH_DATE

  return date
}

function splitFullName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  const firstName = parts.shift() || fullName.trim()
  const lastName = parts.join(' ') || 'Sin apellido'
  return { firstName, lastName }
}

function toRecordStatus(status?: string) {
  if (status === 'retired' || status === 'withdrawn') return 'INACTIVE'
  if (status === 'transferred') return 'INACTIVE'
  return 'ACTIVE'
}

/**
 * Servicio de estudiantes.
 *
 * Implementa la lógica de negocio para la gestión de estudiantes,
 * incluyendo operaciones CRUD, matrículas, apoderados,
 * notificaciones e importación masiva de datos.
 */
@Injectable()
export class StudentsService {
  private async getCourseOrThrow(schoolId: string, courseId: string) {
    const course = await prisma.sectionSubject.findFirst({
      where: { id: courseId, schoolId, status: 'ACTIVE' },
    })

    if (!course) throw new NotFoundException('Course not found')
    return course
  }

  async getEnrollmentCourses(schoolId: string) {
    const courses = await prisma.sectionSubject.findMany({
      where: { schoolId, status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
    })

    if (courses.length === 0) return []

    const [grades, sections, subjects, schoolYears] = await Promise.all([
      prisma.grade.findMany({
        where: {
          schoolId,
          id: { in: courses.map((course) => course.gradeId) },
        },
      }),
      prisma.section.findMany({
        where: {
          schoolId,
          id: { in: courses.map((course) => course.sectionId) },
        },
      }),
      prisma.subject.findMany({
        where: {
          schoolId,
          id: { in: courses.map((course) => course.subjectId) },
        },
      }),
      prisma.schoolYear.findMany({
        where: {
          schoolId,
          id: { in: courses.map((course) => course.schoolYearId) },
        },
      }),
    ])

    const gradeById = new Map(grades.map((item) => [item.id, item]))
    const sectionById = new Map(sections.map((item) => [item.id, item]))
    const subjectById = new Map(subjects.map((item) => [item.id, item]))
    const schoolYearById = new Map(schoolYears.map((item) => [item.id, item]))

    return Promise.all(
      courses.map(async (course) => {
        const courseMeta = course as any
        const gradeName =
          gradeById.get(course.gradeId)?.name ?? courseMeta.grade?.name ?? ''
        const sectionName =
          sectionById.get(course.sectionId)?.name ??
          courseMeta.section?.name ??
          ''
        const subjectName =
          subjectById.get(course.subjectId)?.name ??
          courseMeta.subject?.name ??
          ''
        const schoolYearName =
          schoolYearById.get(course.schoolYearId)?.name ??
          courseMeta.schoolYear?.name ??
          ''
        const studentCount = await prisma.enrollment.count({
          where: {
            schoolId,
            schoolYearId: course.schoolYearId,
            gradeId: course.gradeId,
            sectionId: course.sectionId,
            status: 'ACTIVE',
          },
        })

        return {
          id: course.id,
          gradeId: course.gradeId,
          sectionId: course.sectionId,
          subjectId: course.subjectId,
          schoolYearId: course.schoolYearId,
          gradeName,
          sectionName,
          area:
            typeof courseMeta.area === 'string' ? courseMeta.area : subjectName,
          subjectName,
          shift: typeof courseMeta.shift === 'string' ? courseMeta.shift : '',
          schoolYearName,
          studentCount,
          label:
            `${gradeName} ${sectionName} - ${subjectName} - ${schoolYearName}`.trim(),
        }
      }),
    )
  }

  async getStudentsByCourse(schoolId: string, courseId: string) {
    const course = await this.getCourseOrThrow(schoolId, courseId)
    const enrollments = await prisma.enrollment.findMany({
      where: {
        schoolId,
        schoolYearId: course.schoolYearId,
        gradeId: course.gradeId,
        sectionId: course.sectionId,
        status: 'ACTIVE',
      },
    })
    const studentIds = enrollments.map((item) => item.studentId)
    if (studentIds.length === 0) return []

    const students = await prisma.student.findMany({
      where: { schoolId, id: { in: studentIds } },
      orderBy: { lastName: 'asc' },
    })
    const enrollmentByStudentId = new Map(
      enrollments.map((item) => [item.studentId, item]),
    )

    return students.map((student) => ({
      ...student,
      status: String(student.status).toLowerCase(),
      fullName: `${student.firstName} ${student.lastName}`.trim(),
      enrollmentId: enrollmentByStudentId.get(student.id)?.id ?? null,
    }))
  }

  private async findReusableStudentByCode(
    schoolId: string,
    course: CourseForEnrollment,
    studentCode: string,
  ) {
    const existingStudent = await prisma.student.findFirst({
      where: { schoolId, studentCode },
    })
    if (!existingStudent) return null

    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        schoolId,
        studentId: existingStudent.id,
        schoolYearId: course.schoolYearId,
        gradeId: course.gradeId,
        sectionId: course.sectionId,
        status: 'ACTIVE',
      },
    })

    if (existingEnrollment) {
      throw new BadRequestException(
        'Ya existe un estudiante con esta matrícula en este curso.',
      )
    }
    const existingYearEnrollment = await prisma.enrollment.findFirst({
      where: {
        schoolId,
        studentId: existingStudent.id,
        schoolYearId: course.schoolYearId,
        status: 'ACTIVE',
      },
    })

    if (existingYearEnrollment) {
      throw new BadRequestException(
        'Este estudiante ya tiene matrícula activa en este año escolar.',
      )
    }

    return existingStudent
  }

  async createStudentInCourse(
    schoolId: string,
    courseId: string,
    dto: CreateCourseStudentDto,
  ) {
    const course = await this.getCourseOrThrow(schoolId, courseId)
    const reusableStudent = await this.findReusableStudentByCode(
      schoolId,
      course,
      dto.studentCode,
    )
    const { firstName, lastName } = splitFullName(dto.fullName)

    const student = await prisma.$transaction(async (tx) => {
      const created =
        reusableStudent ??
        (await tx.student.create({
          data: {
            schoolId,
            studentCode: dto.studentCode,
            firstName,
            lastName,
            documentId: dto.documentId || null,
            birthDate: dto.birthDate
              ? new Date(dto.birthDate)
              : FAST_ENROLLMENT_BIRTH_DATE,
            gender: dto.gender || null,
            address: dto.address || null,
            status: toRecordStatus(dto.status) as any,
          },
        }))
      await tx.enrollment.create({
        data: {
          schoolId,
          studentId: created.id,
          schoolYearId: course.schoolYearId,
          gradeId: course.gradeId,
          sectionId: course.sectionId,
          status: 'ACTIVE',
        },
      })
      return created
    })

    return {
      ...student,
      fullName: `${student.firstName} ${student.lastName}`.trim(),
    }
  }

  async previewCourseImport(
    schoolId: string,
    courseId: string,
    rows: ImportCourseStudentRowDto[],
  ) {
    const course = await this.getCourseOrThrow(schoolId, courseId)
    const seenCodes = new Set<string>()
    const preview: ImportPreviewRow[] = []

    for (const [index, row] of rows.entries()) {
      const studentCode = cleanText(row.studentCode)
      const fullName = cleanText(row.fullName)
      const errors: string[] = []
      const duplicate = studentCode ? seenCodes.has(studentCode) : false
      if (!fullName) errors.push('Nombre requerido.')
      if (studentCode) seenCodes.add(studentCode)
      if (studentCode) {
        const existingStudent = await prisma.student.findFirst({
          where: { schoolId, studentCode },
        })
        if (existingStudent) {
          const existingCourseEnrollment = await prisma.enrollment.findFirst({
            where: {
              schoolId,
              studentId: existingStudent.id,
              schoolYearId: course.schoolYearId,
              gradeId: course.gradeId,
              sectionId: course.sectionId,
              status: 'ACTIVE',
            },
          })
          if (existingCourseEnrollment) errors.push('Ya existe en este curso.')

          const existingYearEnrollment = await prisma.enrollment.findFirst({
            where: {
              schoolId,
              studentId: existingStudent.id,
              schoolYearId: course.schoolYearId,
              status: 'ACTIVE',
            },
          })
          if (existingYearEnrollment && !existingCourseEnrollment) {
            errors.push('Ya tiene matrícula activa en este año escolar.')
          }
        }
      }
      preview.push({
        rowNumber: index + 1,
        studentCode,
        fullName,
        duplicate,
        errors,
      })
    }

    return {
      rows: preview,
      detectedStudents: preview.filter((row) => row.fullName).length,
      detectedCodes: preview.filter((row) => row.studentCode).length,
      duplicates: preview.filter(
        (row) =>
          row.duplicate || row.errors.some((error) => error.includes('existe')),
      ).length,
      errors: preview.reduce((count, row) => count + row.errors.length, 0),
    }
  }

  async importStudentsInCourse(
    schoolId: string,
    courseId: string,
    rows: ImportCourseStudentRowDto[],
  ) {
    const preview = await this.previewCourseImport(schoolId, courseId, rows)
    const validRows = preview.rows.filter(
      (row) => row.fullName && !row.duplicate && row.errors.length === 0,
    )
    let imported = 0
    const errors: ImportStudentError[] = []

    for (const row of validRows) {
      try {
        await this.createStudentInCourse(schoolId, courseId, {
          studentCode: row.studentCode || `TEMP-${Date.now()}-${row.rowNumber}`,
          fullName: row.fullName,
        })
        imported += 1
      } catch (error) {
        errors.push({
          row: row.rowNumber,
          reason:
            error instanceof Error ? error.message : 'No se pudo importar.',
        })
      }
    }

    return { imported, errors }
  }

  async withdrawStudentFromCourse(
    schoolId: string,
    courseId: string,
    studentId: string,
  ) {
    const course = await this.getCourseOrThrow(schoolId, courseId)
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        schoolId,
        studentId,
        schoolYearId: course.schoolYearId,
        gradeId: course.gradeId,
        sectionId: course.sectionId,
        status: 'ACTIVE',
      },
    })

    if (!enrollment) throw new NotFoundException('Enrollment not found')

    return prisma.enrollment.update({
      where: { id: enrollment.id },
      data: {
        status: 'WITHDRAWN',
        academicStatus: 'withdrawn',
      },
    })
  }

  async transferStudentToCourse(
    schoolId: string,
    courseId: string,
    studentId: string,
    targetCourseId: string,
  ) {
    if (courseId === targetCourseId) {
      throw new BadRequestException('Selecciona un curso destino diferente.')
    }

    const [sourceCourse, targetCourse] = await Promise.all([
      this.getCourseOrThrow(schoolId, courseId),
      this.getCourseOrThrow(schoolId, targetCourseId),
    ])

    const enrollment = await prisma.enrollment.findFirst({
      where: {
        schoolId,
        studentId,
        schoolYearId: sourceCourse.schoolYearId,
        gradeId: sourceCourse.gradeId,
        sectionId: sourceCourse.sectionId,
        status: 'ACTIVE',
      },
    })

    if (!enrollment) throw new NotFoundException('Enrollment not found')

    const existingTargetEnrollment = await prisma.enrollment.findFirst({
      where: {
        schoolId,
        studentId,
        schoolYearId: targetCourse.schoolYearId,
        gradeId: targetCourse.gradeId,
        sectionId: targetCourse.sectionId,
        status: 'ACTIVE',
      },
    })

    if (existingTargetEnrollment) {
      throw new BadRequestException(
        'El estudiante ya está matriculado en el curso destino.',
      )
    }

    return prisma.enrollment.update({
      where: { id: enrollment.id },
      data: {
        schoolYearId: targetCourse.schoolYearId,
        gradeId: targetCourse.gradeId,
        sectionId: targetCourse.sectionId,
        status: 'ACTIVE',
        academicStatus: 'transferred',
        transferNotes: `Trasladado desde curso ${sourceCourse.id}`,
      },
    })
  }

  /**
   * Obtiene una lista paginada de estudiantes con filtros opcionales.
   *
   * @param schoolId - Identificador del colegio.
   * @param search - Término de búsqueda para filtrar por nombre, apellido o código.
   * @param status - Estado del estudiante para filtrar (ej. ACTIVE, INACTIVE, all).
   * @param page - Número de página (por defecto 1).
   * @param pageSize - Tamaño de página (por defecto 50).
   * @returns Objeto con la lista de estudiantes, total, página y tamaño de página.
   */
  async findAll(
    schoolId: string,
    search?: string,
    status?: string,
    page = 1,
    pageSize = 50,
  ) {
    const where: Prisma.StudentWhereInput = { schoolId }

    if (status && status !== 'all') {
      where.status = status.toUpperCase() as any
    }

    if (search) {
      const term = search.trim()
      where.OR = [
        { firstName: { contains: term, mode: 'insensitive' } },
        { lastName: { contains: term, mode: 'insensitive' } },
        { studentCode: { contains: term, mode: 'insensitive' } },
      ]
    }

    const skip = (page - 1) * pageSize

    const [data, total] = await Promise.all([
      prisma.student.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.student.count({ where }),
    ])

    return { data, total, page, pageSize }
  }

  /**
   * Busca un estudiante por su identificador dentro de un colegio.
   *
   * @param schoolId - Identificador del colegio.
   * @param id - Identificador del estudiante.
   * @returns El estudiante encontrado.
   * @throws NotFoundException si el estudiante no existe.
   */
  async findOne(schoolId: string, id: string) {
    const student = await prisma.student.findFirst({ where: { id, schoolId } })
    if (!student) throw new NotFoundException('Student not found')
    return student
  }

  /**
   * Crea un nuevo estudiante en el sistema.
   *
   * @param schoolId - Identificador del colegio.
   * @param dto - Datos del estudiante a crear.
   * @returns El estudiante creado.
   */
  create(schoolId: string, dto: CreateStudentDto) {
    return prisma.student.create({
      data: {
        schoolId,
        studentCode: dto.studentCode,
        firstName: dto.firstName,
        lastName: dto.lastName,
        documentId: dto.documentId ?? null,
        birthDate: dto.birthDate
          ? new Date(dto.birthDate)
          : FAST_ENROLLMENT_BIRTH_DATE,
        gender: dto.gender ?? null,
        address: dto.address ?? null,
      },
    })
  }

  /**
   * Actualiza los datos de un estudiante existente.
   *
   * Solo actualiza los campos proporcionados en el DTO.
   *
   * @param schoolId - Identificador del colegio.
   * @param id - Identificador del estudiante a actualizar.
   * @param dto - Datos parciales a modificar del estudiante.
   * @returns El estudiante actualizado.
   * @throws NotFoundException si el estudiante no existe.
   */
  async update(schoolId: string, id: string, dto: UpdateStudentDto) {
    const student = await prisma.student.findFirst({ where: { id, schoolId } })
    if (!student) throw new NotFoundException('Student not found')

    return prisma.student.update({
      where: { id },
      data: {
        ...(dto.firstName && { firstName: dto.firstName }),
        ...(dto.lastName && { lastName: dto.lastName }),
        ...(dto.documentId !== undefined && { documentId: dto.documentId }),
        ...(dto.birthDate && { birthDate: new Date(dto.birthDate) }),
        ...(dto.gender !== undefined && { gender: dto.gender }),
        ...(dto.address !== undefined && { address: dto.address }),
        ...(dto.studentCode && { studentCode: dto.studentCode }),
      },
    })
  }

  /**
   * Desactiva un estudiante cambiando su estado a INACTIVE.
   *
   * @param schoolId - Identificador del colegio.
   * @param id - Identificador del estudiante a desactivar.
   * @returns El estudiante con el estado actualizado.
   * @throws NotFoundException si el estudiante no existe.
   */
  async deactivate(schoolId: string, id: string) {
    const student = await prisma.student.findFirst({ where: { id, schoolId } })
    if (!student) throw new NotFoundException('Student not found')

    return prisma.student.update({
      where: { id },
      data: { status: 'INACTIVE' },
    })
  }

  /**
   * Obtiene todas las matrículas de un estudiante.
   *
   * @param schoolId - Identificador del colegio.
   * @param studentId - Identificador del estudiante.
   * @returns Lista de matrículas del estudiante.
   */
  async getEnrollments(schoolId: string, studentId: string) {
    await this.findOne(schoolId, studentId)
    return prisma.enrollment.findMany({
      where: { schoolId, studentId },
    })
  }

  /**
   * Crea una nueva matrícula para un estudiante en un grado, sección y año escolar.
   *
   * Valida que el estudiante, grado, sección y año escolar existan
   * y pertenezcan al colegio especificado.
   *
   * @param schoolId - Identificador del colegio.
   * @param dto - Datos de la matrícula a crear.
   * @returns La matrícula creada.
   * @throws NotFoundException si alguna entidad relacionada no existe.
   */
  async createEnrollment(schoolId: string, dto: CreateEnrollmentDto) {
    const [student, grade, section, schoolYear] = await Promise.all([
      prisma.student.findFirst({ where: { id: dto.studentId, schoolId } }),
      prisma.grade.findFirst({ where: { id: dto.gradeId, schoolId } }),
      prisma.section.findFirst({
        where: { id: dto.sectionId, schoolId, gradeId: dto.gradeId },
      }),
      prisma.schoolYear.findFirst({
        where: { id: dto.schoolYearId, schoolId },
      }),
    ])
    if (!student) throw new NotFoundException('Student not found')
    if (!grade) throw new NotFoundException('Grade not found')
    if (!section) throw new NotFoundException('Section not found')
    if (!schoolYear) throw new NotFoundException('School year not found')

    return prisma.enrollment.create({
      data: {
        studentId: dto.studentId,
        gradeId: dto.gradeId,
        sectionId: dto.sectionId,
        schoolYearId: dto.schoolYearId,
        schoolId,
        enrollmentDate: dto.enrollmentDate
          ? new Date(dto.enrollmentDate)
          : new Date(),
        academicStatus: dto.academicStatus ?? 'active',
        isRepeating: dto.isRepeating ?? false,
      },
    })
  }

  /**
   * Elimina una matrícula junto con sus registros de asistencia y calificaciones.
   *
   * @param schoolId - Identificador del colegio.
   * @param id - Identificador de la matrícula a eliminar.
   * @returns La matrícula eliminada.
   * @throws NotFoundException si la matrícula no existe.
   */
  async deleteEnrollment(schoolId: string, id: string) {
    const enrollment = await prisma.enrollment.findFirst({
      where: { id, schoolId },
    })
    if (!enrollment) throw new NotFoundException('Enrollment not found')

    await prisma.attendanceClass.deleteMany({ where: { enrollmentId: id } })
    await prisma.attendanceDaily.deleteMany({ where: { enrollmentId: id } })
    await prisma.gradesRecord.deleteMany({ where: { enrollmentId: id } })

    return prisma.enrollment.delete({ where: { id } })
  }

  /**
   * Obtiene los grados activos con sus secciones correspondientes.
   *
   * @param schoolId - Identificador del colegio.
   * @returns Lista de grados ordenados por secuencia, cada uno con sus secciones.
   */
  async getGradesWithSections(schoolId: string) {
    const grades = await prisma.grade.findMany({
      where: { schoolId, status: 'ACTIVE' },
      orderBy: { sequence: 'asc' },
    })

    const sections = await prisma.section.findMany({
      where: { schoolId, status: 'ACTIVE' },
      orderBy: { name: 'asc' },
    })

    return grades.map((grade) => ({
      id: grade.id,
      name: grade.name,
      sections: sections
        .filter((s) => s.gradeId === grade.id)
        .map((s) => ({ id: s.id, name: s.name })),
    }))
  }

  /**
   * Obtiene los apoderados asociados a un estudiante.
   *
   * @param schoolId - Identificador del colegio.
   * @param studentId - Identificador del estudiante.
   * @returns Lista de vínculos entre el estudiante y sus apoderados.
   */
  async getGuardians(schoolId: string, studentId: string) {
    await this.findOne(schoolId, studentId)
    const links = await prisma.studentGuardian.findMany({
      where: { schoolId, studentId },
    })
    return links
  }

  /**
   * Importa estudiantes de forma masiva desde un arreglo de datos.
   *
   * Valida cada fila, detecta duplicados por código y documento,
   * y crea los estudiantes en la base de datos. Retorna los
   * resultados exitosos y los errores encontrados.
   *
   * @param schoolId - Identificador del colegio.
   * @param students - Arreglo de datos de estudiantes a importar.
   * @returns Objeto con los estudiantes importados y la lista de errores.
   * @throws BadRequestException si el cuerpo no es un arreglo.
   */
  async importStudents(schoolId: string, students: ImportStudentRow[]) {
    if (!Array.isArray(students)) {
      throw new BadRequestException(
        'El cuerpo debe incluir un arreglo de estudiantes.',
      )
    }

    const results = []
    const errors: ImportStudentError[] = []
    const seenCodes = new Set<string>()
    const seenDocuments = new Set<string>()

    for (const [index, s] of students.entries()) {
      const row = s.rowNumber ?? index + 1
      const firstName = cleanText(s.firstName)
      const lastName = cleanText(s.lastName)
      const documentId = cleanText(s.documentId)
      const birthDate = parseBirthDate(s.birthDate)
      const generatedCode = `IMP-${Date.now()}-${index + 1}`
      const studentCode = cleanText(s.studentCode) || generatedCode

      if (!firstName || !lastName) {
        errors.push({ row, reason: 'Falta nombre o apellido' })
        continue
      }

      if (seenCodes.has(studentCode)) {
        errors.push({
          row,
          reason: `Codigo duplicado en el archivo: ${studentCode}`,
        })
        continue
      }

      if (documentId && seenDocuments.has(documentId)) {
        errors.push({
          row,
          reason: `Documento duplicado en el archivo: ${documentId}`,
        })
        continue
      }

      seenCodes.add(studentCode)
      if (documentId) seenDocuments.add(documentId)

      const data: Prisma.StudentUncheckedCreateInput = {
        schoolId,
        studentCode,
        firstName,
        lastName,
        birthDate,
        documentId: documentId || null,
        gender: cleanText(s.gender) || null,
        address: cleanText(s.address) || null,
      }

      try {
        const created = await prisma.student.create({ data })
        results.push(created)
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          const target = Array.isArray(error.meta?.target)
            ? error.meta.target.join(', ')
            : String(error.meta?.target ?? 'campo unico')

          errors.push({
            row,
            reason: target.includes('document')
              ? 'Ya existe un estudiante con ese documento'
              : 'Ya existe un estudiante con ese codigo',
          })
          continue
        }

        throw error
      }
    }

    return { imported: results.length, students: results, errors }
  }

  /**
   * Envía una notificación simulada a los apoderados de un estudiante.
   *
   * @param schoolId - Identificador del colegio.
   * @param studentId - Identificador del estudiante.
   * @param body - Objeto con el mensaje y asunto de la notificación.
   * @returns Resultado de la operación con el número de apoderados notificados.
   */
  async notifyGuardians(
    schoolId: string,
    studentId: string,
    createdBy: string,
    body: any,
  ) {
    await this.findOne(schoolId, studentId)
    const links = await prisma.studentGuardian.findMany({
      where: { schoolId, studentId },
    })
    const subject = body.subject ?? 'Notificación del colegio'
    const message = body.message ?? ''

    if (links.length) {
      await prisma.guardianNotification.createMany({
        data: links.map((link) => ({
          schoolId,
          studentId,
          guardianId: link.guardianId,
          createdBy,
          subject,
          message,
          status: 'queued',
        })),
      })
    }

    return {
      notified: links.length,
      message,
      subject,
      guardians: links,
    }
  }
}
