import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { prisma } from '@aula/database'
import { SaveJournalEntryDto } from './dto/save-journal-entry.dto'

const entryInclude = {
  schoolYear: { select: { id: true, name: true } },
  academicPeriod: { select: { id: true, name: true } },
  section: { select: { id: true, name: true, grade: { select: { name: true } } } },
  sectionSubject: { select: { id: true, subject: { select: { id: true, name: true } } } },
  students: { include: { student: { select: { id: true, firstName: true, lastName: true, studentCode: true } } } },
} as const

@Injectable()
export class JournalService {
  list(schoolId: string, userId: string) {
    return prisma.teacherJournalEntry.findMany({
      where: { schoolId, createdById: userId },
      include: entryInclude,
      orderBy: [{ occurredAt: 'desc' }, { createdAt: 'desc' }],
    })
  }

  async create(schoolId: string, userId: string, dto: SaveJournalEntryDto) {
    await this.validateContext(schoolId, dto)
    return prisma.teacherJournalEntry.create({
      data: {
        schoolId,
        createdById: userId,
        ...this.entryData(dto),
        students: { create: (dto.studentIds ?? []).map((studentId) => ({ schoolId, studentId })) },
      },
      include: entryInclude,
    })
  }

  async update(schoolId: string, userId: string, id: string, dto: SaveJournalEntryDto) {
    await this.owned(schoolId, userId, id)
    await this.validateContext(schoolId, dto)
    return prisma.$transaction(async (tx) => {
      await tx.teacherJournalStudent.deleteMany({ where: { entryId: id } })
      return tx.teacherJournalEntry.update({
        where: { id },
        data: {
          ...this.entryData(dto),
          students: { create: (dto.studentIds ?? []).map((studentId) => ({ schoolId, studentId })) },
        },
        include: entryInclude,
      })
    })
  }

  async setArchive(schoolId: string, userId: string, id: string, archived: boolean) {
    await this.owned(schoolId, userId, id)
    return prisma.teacherJournalEntry.update({ where: { id }, data: { status: archived ? 'ARCHIVED' : 'ACTIVE' }, include: entryInclude })
  }

  async completeFollowUp(schoolId: string, userId: string, id: string) {
    await this.owned(schoolId, userId, id)
    return prisma.teacherJournalEntry.update({ where: { id }, data: { followUpStatus: 'completed' }, include: entryInclude })
  }

  async remove(schoolId: string, userId: string, id: string) {
    const entry = await this.owned(schoolId, userId, id)
    if (entry.status !== 'ARCHIVED') throw new BadRequestException('Archiva la anotación antes de eliminarla')
    await prisma.teacherJournalEntry.delete({ where: { id } })
    return { id }
  }

  private entryData(dto: SaveJournalEntryDto) {
    const tags = [...new Set((dto.tags ?? []).map((tag) => tag.trim()).filter(Boolean))]
    const requiresFollowUp = dto.requiresFollowUp ?? false
    return {
      entryType: dto.entryType,
      title: dto.title?.trim() || null,
      content: dto.content.trim(),
      occurredAt: new Date(dto.occurredAt),
      schoolYearId: dto.schoolYearId || null,
      sectionId: dto.sectionId || null,
      sectionSubjectId: dto.sectionSubjectId || null,
      academicPeriodId: dto.academicPeriodId || null,
      tags,
      requiresFollowUp,
      followUpDate: requiresFollowUp && dto.followUpDate ? new Date(dto.followUpDate) : null,
      followUpStatus: requiresFollowUp ? (dto.followUpStatus === 'completed' ? 'completed' : 'pending') : 'none',
    }
  }

  private async owned(schoolId: string, userId: string, id: string) {
    const entry = await prisma.teacherJournalEntry.findFirst({ where: { id, schoolId, createdById: userId } })
    if (!entry) throw new NotFoundException('Anotación no encontrada')
    return entry
  }

  private async validateContext(schoolId: string, dto: SaveJournalEntryDto) {
    if (!dto.content.trim()) throw new BadRequestException('El contenido es obligatorio')
    const [section, schoolYear, academicPeriod] = await Promise.all([
      dto.sectionId ? prisma.section.findFirst({ where: { id: dto.sectionId, schoolId }, select: { id: true } }) : null,
      dto.schoolYearId ? prisma.schoolYear.findFirst({ where: { id: dto.schoolYearId, schoolId }, select: { id: true } }) : null,
      dto.academicPeriodId ? prisma.academicPeriod.findFirst({ where: { id: dto.academicPeriodId, schoolId }, select: { id: true } }) : null,
    ])
    if (dto.sectionId && !section) throw new BadRequestException('El curso no pertenece al centro')
    if (dto.schoolYearId && !schoolYear) throw new BadRequestException('El año escolar no pertenece al centro')
    if (dto.academicPeriodId && !academicPeriod) throw new BadRequestException('El período no pertenece al centro')
    if (dto.sectionSubjectId) {
      const subject = await prisma.sectionSubject.findFirst({ where: { id: dto.sectionSubjectId, schoolId } })
      if (!subject) throw new BadRequestException('La asignatura no pertenece al centro')
      if (dto.sectionId && subject.sectionId !== dto.sectionId) throw new BadRequestException('La asignatura no pertenece al curso seleccionado')
    }
    if (dto.studentIds?.length) {
      const count = await prisma.student.count({ where: { id: { in: dto.studentIds }, schoolId } })
      if (count !== new Set(dto.studentIds).size) throw new BadRequestException('Hay estudiantes que no pertenecen al centro')
    }
  }
}
