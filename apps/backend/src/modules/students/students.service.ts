import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { prisma, Prisma } from '@aula/database'
import { CreateStudentDto } from './dto/create-student.dto'
import { UpdateStudentDto } from './dto/update-student.dto'
import { CreateEnrollmentDto } from './dto/create-enrollment.dto'

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

type ImportStudentError = {
  row: number
  reason: string
}

const IMPORT_FALLBACK_BIRTH_DATE = new Date('2000-01-01T00:00:00')

function cleanText(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function isValidDateParts(year: number, month: number, day: number) {
  const date = new Date(year, month - 1, day)
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  )
}

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

@Injectable()
export class StudentsService {
  async findAll(schoolId: string, search?: string, status?: string, page = 1, pageSize = 50) {
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

  async findOne(schoolId: string, id: string) {
    const student = await prisma.student.findFirst({ where: { id, schoolId } })
    if (!student) throw new NotFoundException('Student not found')
    return student
  }

  create(schoolId: string, dto: CreateStudentDto) {
    return prisma.student.create({
      data: {
        schoolId,
        studentCode: dto.studentCode,
        firstName: dto.firstName,
        lastName: dto.lastName,
        documentId: dto.documentId ?? null,
        birthDate: new Date(dto.birthDate),
        gender: dto.gender ?? null,
        address: dto.address ?? null,
      },
    })
  }

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

  async deactivate(schoolId: string, id: string) {
    const student = await prisma.student.findFirst({ where: { id, schoolId } })
    if (!student) throw new NotFoundException('Student not found')

    return prisma.student.update({
      where: { id },
      data: { status: 'INACTIVE' },
    })
  }

  async getEnrollments(schoolId: string, studentId: string) {
    await this.findOne(schoolId, studentId)
    return prisma.enrollment.findMany({
      where: { schoolId, studentId },
    })
  }

  async createEnrollment(schoolId: string, dto: CreateEnrollmentDto) {
    const [student, grade, section, schoolYear] = await Promise.all([
      prisma.student.findFirst({ where: { id: dto.studentId, schoolId } }),
      prisma.grade.findFirst({ where: { id: dto.gradeId, schoolId } }),
      prisma.section.findFirst({ where: { id: dto.sectionId, schoolId, gradeId: dto.gradeId } }),
      prisma.schoolYear.findFirst({ where: { id: dto.schoolYearId, schoolId } }),
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

  async deleteEnrollment(schoolId: string, id: string) {
    const enrollment = await prisma.enrollment.findFirst({ where: { id, schoolId } })
    if (!enrollment) throw new NotFoundException('Enrollment not found')

    await prisma.attendanceClass.deleteMany({ where: { enrollmentId: id } })
    await prisma.attendanceDaily.deleteMany({ where: { enrollmentId: id } })
    await prisma.gradesRecord.deleteMany({ where: { enrollmentId: id } })

    return prisma.enrollment.delete({ where: { id } })
  }

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

  async getGuardians(schoolId: string, studentId: string) {
    await this.findOne(schoolId, studentId)
    const links = await prisma.studentGuardian.findMany({
      where: { schoolId, studentId },
    })
    return links
  }

  async importStudents(schoolId: string, students: ImportStudentRow[]) {
    if (!Array.isArray(students)) {
      throw new BadRequestException('El cuerpo debe incluir un arreglo de estudiantes.')
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
        errors.push({ row, reason: `Codigo duplicado en el archivo: ${studentCode}` })
        continue
      }

      if (documentId && seenDocuments.has(documentId)) {
        errors.push({ row, reason: `Documento duplicado en el archivo: ${documentId}` })
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
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
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

  async notifyGuardians(schoolId: string, studentId: string, body: any) {
    await this.findOne(schoolId, studentId)
    const links = await prisma.studentGuardian.findMany({
      where: { schoolId, studentId },
    })

    return {
      notified: links.length,
      message: body.message ?? '',
      subject: body.subject ?? 'Notificación del colegio',
      guardians: links,
    }
  }
}
