import { Injectable, NotFoundException } from '@nestjs/common'
import { prisma } from '@aula/database'

@Injectable()
export class GradesSectionsService {
  async getCourseData() {
    const school = await prisma.school.findFirst()
    if (!school) return {}

    const [grades, sections, subjects, academicLevels, cycles, modalities, teachers] =
      await Promise.all([
        prisma.grade.findMany({
          where: { schoolId: school.id, status: 'ACTIVE' },
          orderBy: { sequence: 'asc' },
        }),
        prisma.section.findMany({
          where: { schoolId: school.id, status: 'ACTIVE' },
          orderBy: { name: 'asc' },
        }),
        prisma.subject.findMany({ orderBy: { name: 'asc' } }),
        prisma.drAcademicLevel.findMany({ orderBy: { sequence: 'asc' } }),
        prisma.drAcademicCycle.findMany({ orderBy: { name: 'asc' } }),
        prisma.drModality.findMany({ orderBy: { name: 'asc' } }),
        prisma.teacher.findMany({
          where: { schoolId: school.id, status: 'ACTIVE' },
        }),
      ])

    return { grades, sections, subjects, academicLevels, cycles, modalities, teachers }
  }

  getAcademicLevels() {
    return prisma.drAcademicLevel.findMany({ orderBy: { sequence: 'asc' } })
  }

  getCycles() {
    return prisma.drAcademicCycle.findMany({ orderBy: { name: 'asc' } })
  }

  getModalities() {
    return prisma.drModality.findMany({ orderBy: { name: 'asc' } })
  }

  getTeachers() {
    return prisma.teacher.findMany({ orderBy: { firstName: 'asc' } })
  }

  findAllGrades() {
    return prisma.grade.findMany({ orderBy: { sequence: 'asc' } })
  }

  async createGrade(body: any) {
    const school = await prisma.school.findFirst()
    if (!school) throw new Error('No school configured')

    return prisma.grade.create({
      data: {
        schoolId: school.id,
        name: body.name,
        level: body.level ?? null,
        sequence: body.sequence ?? null,
        academicLevelId: body.academicLevelId ?? null,
        academicCycleId: body.academicCycleId ?? null,
        defaultModalityId: body.defaultModalityId ?? null,
      },
    })
  }

  async updateGrade(id: string, body: any) {
    const grade = await prisma.grade.findUnique({ where: { id } })
    if (!grade) throw new NotFoundException('Grade not found')

    return prisma.grade.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.level !== undefined && { level: body.level }),
        ...(body.sequence !== undefined && { sequence: body.sequence }),
        ...(body.academicLevelId !== undefined && { academicLevelId: body.academicLevelId }),
        ...(body.academicCycleId !== undefined && { academicCycleId: body.academicCycleId }),
        ...(body.defaultModalityId !== undefined && { defaultModalityId: body.defaultModalityId }),
        ...(body.status && { status: body.status }),
      },
    })
  }

  async deleteGrade(id: string) {
    const grade = await prisma.grade.findUnique({ where: { id } })
    if (!grade) throw new NotFoundException('Grade not found')

    return prisma.grade.update({
      where: { id },
      data: { status: 'INACTIVE' },
    })
  }

  findSectionsByGrade(gradeId: string) {
    return prisma.section.findMany({
      where: { gradeId, status: 'ACTIVE' },
      orderBy: { name: 'asc' },
    })
  }

  async createSection(body: any) {
    const school = await prisma.school.findFirst()
    if (!school) throw new Error('No school configured')

    return prisma.section.create({
      data: {
        schoolId: school.id,
        gradeId: body.gradeId,
        name: body.name,
        capacity: body.capacity ?? null,
      },
    })
  }

  async updateSection(id: string, body: any) {
    const section = await prisma.section.findUnique({ where: { id } })
    if (!section) throw new NotFoundException('Section not found')

    return prisma.section.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.capacity !== undefined && { capacity: body.capacity }),
        ...(body.gradeId && { gradeId: body.gradeId }),
        ...(body.status && { status: body.status }),
      },
    })
  }

  async deleteSection(id: string) {
    const section = await prisma.section.findUnique({ where: { id } })
    if (!section) throw new NotFoundException('Section not found')

    return prisma.section.update({
      where: { id },
      data: { status: 'INACTIVE' },
    })
  }

  findAllSubjects() {
    return prisma.subject.findMany({ orderBy: { name: 'asc' } })
  }

  async createSubject(body: any) {
    const school = await prisma.school.findFirst()
    if (!school) throw new Error('No school configured')

    return prisma.subject.create({
      data: {
        schoolId: school.id,
        name: body.name,
        code: body.code,
        description: body.description ?? null,
        credits: body.credits ?? null,
      },
    })
  }

  async assignSubject(body: any) {
    const school = await prisma.school.findFirst()
    if (!school) throw new Error('No school configured')

    return prisma.sectionSubject.create({
      data: {
        sectionId: body.sectionId,
        subjectId: body.subjectId,
        teacherId: body.teacherId ?? null,
        gradeId: body.gradeId,
        schoolYearId: body.schoolYearId,
        schoolId: school.id,
      },
    })
  }

  getSectionSubjects() {
    return prisma.sectionSubject.findMany({
      where: { status: 'ACTIVE' },
    })
  }

  async removeSectionSubject(id: string) {
    const ss = await prisma.sectionSubject.findUnique({ where: { id } })
    if (!ss) throw new NotFoundException('Section subject not found')

    return prisma.sectionSubject.update({
      where: { id },
      data: { status: 'INACTIVE' },
    })
  }
}
