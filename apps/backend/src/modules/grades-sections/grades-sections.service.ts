import { Injectable, NotFoundException } from '@nestjs/common'
import { prisma } from '@aula/database'

@Injectable()
export class GradesSectionsService {
  async getCourseData(schoolId: string) {
    const [grades, sections, subjects, academicLevels, cycles, modalities, teachers] =
      await Promise.all([
        prisma.grade.findMany({
          where: { schoolId, status: 'ACTIVE' },
          orderBy: { sequence: 'asc' },
        }),
        prisma.section.findMany({
          where: { schoolId, status: 'ACTIVE' },
          orderBy: { name: 'asc' },
        }),
        prisma.subject.findMany({ where: { schoolId, status: 'ACTIVE' }, orderBy: { name: 'asc' } }),
        prisma.drAcademicLevel.findMany({ orderBy: { sequence: 'asc' } }),
        prisma.drAcademicCycle.findMany({ orderBy: { name: 'asc' } }),
        prisma.drModality.findMany({ orderBy: { name: 'asc' } }),
        prisma.teacher.findMany({
          where: { schoolId, status: 'ACTIVE' },
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

  getTeachers(schoolId: string) {
    return prisma.teacher.findMany({ where: { schoolId, status: 'ACTIVE' }, orderBy: { firstName: 'asc' } })
  }

  findAllGrades(schoolId: string) {
    return prisma.grade.findMany({ where: { schoolId }, orderBy: { sequence: 'asc' } })
  }

  createGrade(schoolId: string, body: any) {
    return prisma.grade.create({
      data: {
        schoolId,
        name: body.name,
        level: body.level ?? null,
        sequence: body.sequence ?? null,
        academicLevelId: body.academicLevelId ?? null,
        academicCycleId: body.academicCycleId ?? null,
        defaultModalityId: body.defaultModalityId ?? null,
      },
    })
  }

  async updateGrade(schoolId: string, id: string, body: any) {
    const grade = await prisma.grade.findFirst({ where: { id, schoolId } })
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

  async deleteGrade(schoolId: string, id: string) {
    const grade = await prisma.grade.findFirst({ where: { id, schoolId } })
    if (!grade) throw new NotFoundException('Grade not found')

    return prisma.grade.update({
      where: { id },
      data: { status: 'INACTIVE' },
    })
  }

  findSectionsByGrade(schoolId: string, gradeId: string) {
    return prisma.section.findMany({
      where: { schoolId, gradeId, status: 'ACTIVE' },
      orderBy: { name: 'asc' },
    })
  }

  async createSection(schoolId: string, body: any) {
    const grade = await prisma.grade.findFirst({ where: { id: body.gradeId, schoolId } })
    if (!grade) throw new NotFoundException('Grade not found')

    return prisma.section.create({
      data: {
        schoolId,
        gradeId: body.gradeId,
        name: body.name,
        capacity: body.capacity ?? null,
      },
    })
  }

  async updateSection(schoolId: string, id: string, body: any) {
    const section = await prisma.section.findFirst({ where: { id, schoolId } })
    if (!section) throw new NotFoundException('Section not found')
    if (body.gradeId) {
      const grade = await prisma.grade.findFirst({ where: { id: body.gradeId, schoolId } })
      if (!grade) throw new NotFoundException('Grade not found')
    }

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

  async deleteSection(schoolId: string, id: string) {
    const section = await prisma.section.findFirst({ where: { id, schoolId } })
    if (!section) throw new NotFoundException('Section not found')

    return prisma.section.update({
      where: { id },
      data: { status: 'INACTIVE' },
    })
  }

  findAllSubjects(schoolId: string) {
    return prisma.subject.findMany({ where: { schoolId }, orderBy: { name: 'asc' } })
  }

  createSubject(schoolId: string, body: any) {
    return prisma.subject.create({
      data: {
        schoolId,
        name: body.name,
        code: body.code,
        description: body.description ?? null,
        credits: body.credits ?? null,
      },
    })
  }

  async assignSubject(schoolId: string, body: any) {
    const [grade, section, subject, schoolYear, teacher] = await Promise.all([
      prisma.grade.findFirst({ where: { id: body.gradeId, schoolId } }),
      prisma.section.findFirst({ where: { id: body.sectionId, schoolId, gradeId: body.gradeId } }),
      prisma.subject.findFirst({ where: { id: body.subjectId, schoolId } }),
      prisma.schoolYear.findFirst({ where: { id: body.schoolYearId, schoolId } }),
      body.teacherId
        ? prisma.teacher.findFirst({ where: { id: body.teacherId, schoolId } })
        : Promise.resolve(null),
    ])
    if (!grade) throw new NotFoundException('Grade not found')
    if (!section) throw new NotFoundException('Section not found')
    if (!subject) throw new NotFoundException('Subject not found')
    if (!schoolYear) throw new NotFoundException('School year not found')
    if (body.teacherId && !teacher) throw new NotFoundException('Teacher not found')

    return prisma.sectionSubject.create({
      data: {
        sectionId: body.sectionId,
        subjectId: body.subjectId,
        teacherId: body.teacherId ?? null,
        gradeId: body.gradeId,
        schoolYearId: body.schoolYearId,
        schoolId,
      },
    })
  }

  getSectionSubjects(schoolId: string) {
    return prisma.sectionSubject.findMany({
      where: { schoolId, status: 'ACTIVE' },
    })
  }

  async removeSectionSubject(schoolId: string, id: string) {
    const ss = await prisma.sectionSubject.findFirst({ where: { id, schoolId } })
    if (!ss) throw new NotFoundException('Section subject not found')

    return prisma.sectionSubject.update({
      where: { id },
      data: { status: 'INACTIVE' },
    })
  }
}
