import { Injectable, NotFoundException } from '@nestjs/common'
import { prisma } from '@aula/database'

function status(value: string) {
  return value.toLowerCase()
}

@Injectable()
export class GradesSectionsService {
  async getCourseData(schoolId: string) {
    const [grades, sections, assignments, subjects, academicLevels, cycles, modalities, teachers, currentSchoolYear] =
      await Promise.all([
        prisma.grade.findMany({
          where: { schoolId, status: 'ACTIVE' },
          orderBy: { sequence: 'asc' },
        }),
        prisma.section.findMany({
          where: { schoolId, status: 'ACTIVE' },
          orderBy: { name: 'asc' },
        }),
        prisma.sectionSubject.findMany({
          where: { schoolId, status: 'ACTIVE' },
        }),
        prisma.subject.findMany({ where: { schoolId, status: 'ACTIVE' }, orderBy: { name: 'asc' } }),
        prisma.drAcademicLevel.findMany({ orderBy: { sequence: 'asc' } }),
        prisma.drAcademicCycle.findMany({ orderBy: { name: 'asc' } }),
        prisma.drModality.findMany({ orderBy: { name: 'asc' } }),
        prisma.teacher.findMany({
          where: { schoolId, status: 'ACTIVE' },
        }),
        prisma.schoolYear.findFirst({
          where: { schoolId, isCurrent: true },
          select: { id: true, name: true },
        }),
      ])

    const levelById = new Map(academicLevels.map((item) => [item.id, item]))
    const cycleById = new Map(cycles.map((item) => [item.id, item]))
    const modalityById = new Map(modalities.map((item) => [item.id, item]))
    const subjectById = new Map(subjects.map((item) => [item.id, item]))
    const teacherById = new Map(teachers.map((item) => [item.id, item]))

    return {
      grades: grades.map((grade) => ({
        ...grade,
        status: status(grade.status),
        academicLevelName: grade.academicLevelId ? levelById.get(grade.academicLevelId)?.name ?? null : null,
        academicCycleName: grade.academicCycleId ? cycleById.get(grade.academicCycleId)?.name ?? null : null,
        defaultModalityName: grade.defaultModalityId ? modalityById.get(grade.defaultModalityId)?.name ?? null : null,
        sections: sections
          .filter((section) => section.gradeId === grade.id)
          .map((section) => ({
            ...section,
            status: status(section.status),
            assignments: assignments
              .filter((assignment) => assignment.sectionId === section.id)
              .map((assignment) => {
                const subject = subjectById.get(assignment.subjectId)
                const teacher = assignment.teacherId ? teacherById.get(assignment.teacherId) : null
                return {
                  id: assignment.id,
                  sectionId: assignment.sectionId,
                  gradeId: assignment.gradeId,
                  subjectId: assignment.subjectId,
                  subjectCode: subject?.code ?? '',
                  subjectName: subject?.name ?? '',
                  teacherId: assignment.teacherId,
                  teacherName: teacher ? `${teacher.firstName} ${teacher.lastName}` : null,
                  status: status(assignment.status),
                }
              }),
          })),
      })),
      catalogs: {
        levels: academicLevels,
        cycles,
        modalities,
        subjects,
        teachers: teachers.map((teacher) => ({
          id: teacher.id,
          name: `${teacher.firstName} ${teacher.lastName}`,
          email: teacher.email,
        })),
      },
      currentSchoolYear,
    }
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
