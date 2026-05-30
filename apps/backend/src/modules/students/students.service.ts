import { Injectable, NotFoundException } from '@nestjs/common'
import { prisma, Prisma } from '@aula/database'
import { CreateStudentDto } from './dto/create-student.dto'
import { UpdateStudentDto } from './dto/update-student.dto'
import { CreateEnrollmentDto } from './dto/create-enrollment.dto'

@Injectable()
export class StudentsService {
  async findAll(search?: string, status?: string, page = 1, pageSize = 50) {
    const where: Prisma.StudentWhereInput = {}
    const school = await prisma.school.findFirst()
    if (school) where.schoolId = school.id

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

  async findOne(id: string) {
    const student = await prisma.student.findUnique({ where: { id } })
    if (!student) throw new NotFoundException('Student not found')
    return student
  }

  async create(dto: CreateStudentDto) {
    const school = await prisma.school.findFirst()
    if (!school) throw new Error('No school configured')

    return prisma.student.create({
      data: {
        schoolId: school.id,
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

  async update(id: string, dto: UpdateStudentDto) {
    const student = await prisma.student.findUnique({ where: { id } })
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

  async deactivate(id: string) {
    const student = await prisma.student.findUnique({ where: { id } })
    if (!student) throw new NotFoundException('Student not found')

    return prisma.student.update({
      where: { id },
      data: { status: 'INACTIVE' },
    })
  }

  async getEnrollments(studentId: string) {
    return prisma.enrollment.findMany({
      where: { studentId },
    })
  }

  async createEnrollment(dto: CreateEnrollmentDto) {
    const school = await prisma.school.findFirst()
    if (!school) throw new Error('No school configured')

    return prisma.enrollment.create({
      data: {
        studentId: dto.studentId,
        gradeId: dto.gradeId,
        sectionId: dto.sectionId,
        schoolYearId: dto.schoolYearId,
        schoolId: school.id,
        enrollmentDate: dto.enrollmentDate
          ? new Date(dto.enrollmentDate)
          : new Date(),
        academicStatus: dto.academicStatus ?? 'active',
        isRepeating: dto.isRepeating ?? false,
      },
    })
  }

  async deleteEnrollment(id: string) {
    const enrollment = await prisma.enrollment.findUnique({ where: { id } })
    if (!enrollment) throw new NotFoundException('Enrollment not found')

    await prisma.attendanceClass.deleteMany({ where: { enrollmentId: id } })
    await prisma.attendanceDaily.deleteMany({ where: { enrollmentId: id } })
    await prisma.gradesRecord.deleteMany({ where: { enrollmentId: id } })

    return prisma.enrollment.delete({ where: { id } })
  }

  async getGradesWithSections() {
    const school = await prisma.school.findFirst()
    if (!school) return []

    const grades = await prisma.grade.findMany({
      where: { schoolId: school.id, status: 'ACTIVE' },
      orderBy: { sequence: 'asc' },
    })

    const sections = await prisma.section.findMany({
      where: { schoolId: school.id, status: 'ACTIVE' },
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

  async getGuardians(studentId: string) {
    const links = await prisma.studentGuardian.findMany({
      where: { studentId },
    })
    return links
  }

  async importStudents(students: any[]) {
    const school = await prisma.school.findFirst()
    if (!school) throw new Error('No school configured')

    const results = []
    for (const s of students) {
      const data: any = {
        schoolId: school.id,
        studentCode: s.studentCode,
        firstName: s.firstName,
        lastName: s.lastName,
        documentId: s.documentId ?? null,
        gender: s.gender ?? null,
        address: s.address ?? null,
      }
      if (s.birthDate) data.birthDate = new Date(s.birthDate)

      const created = await prisma.student.create({ data })
      results.push(created)
    }

    return { imported: results.length, students: results }
  }

  async notifyGuardians(studentId: string, body: any) {
    const links = await prisma.studentGuardian.findMany({
      where: { studentId },
    })

    return {
      notified: links.length,
      message: body.message ?? '',
      subject: body.subject ?? 'Notificación del colegio',
      guardians: links,
    }
  }
}
