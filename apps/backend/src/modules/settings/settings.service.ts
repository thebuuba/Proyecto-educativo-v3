import { Injectable, NotFoundException } from '@nestjs/common'
import { prisma } from '@aula/database'

@Injectable()
export class SettingsService {
  getSchool(schoolId: string) {
    return prisma.school.findUnique({ where: { id: schoolId } })
  }

  async updateSchool(schoolId: string, body: any) {
    const school = await prisma.school.findUnique({ where: { id: schoolId } })
    if (!school) throw new NotFoundException('School not found')

    return prisma.school.update({
      where: { id: schoolId },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.address !== undefined && { address: body.address }),
        ...(body.phone !== undefined && { phone: body.phone }),
        ...(body.email !== undefined && { email: body.email }),
        ...(body.directorName !== undefined && { directorName: body.directorName }),
        ...(body.logoUrl !== undefined && { logoUrl: body.logoUrl }),
        ...(body.academicLevel !== undefined && { academicLevel: body.academicLevel }),
      },
    })
  }

  getSchoolYears(schoolId: string) {
    return prisma.schoolYear.findMany({
      where: { schoolId },
      orderBy: { startDate: 'desc' },
    })
  }

  createSchoolYear(schoolId: string, body: any) {
    return prisma.schoolYear.create({
      data: {
        schoolId,
        name: body.name,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        isCurrent: body.isCurrent ?? false,
      },
    })
  }

  async updateSchoolYear(schoolId: string, id: string, body: any) {
    const sy = await prisma.schoolYear.findFirst({ where: { id, schoolId } })
    if (!sy) throw new NotFoundException('School year not found')

    return prisma.schoolYear.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.startDate && { startDate: new Date(body.startDate) }),
        ...(body.endDate && { endDate: new Date(body.endDate) }),
        ...(body.isCurrent !== undefined && { isCurrent: body.isCurrent }),
      },
    })
  }

  async setCurrentSchoolYear(schoolId: string, id: string) {
    const sy = await prisma.schoolYear.findFirst({ where: { id, schoolId } })
    if (!sy) throw new NotFoundException('School year not found')

    await prisma.schoolYear.updateMany({
      where: { schoolId, isCurrent: true },
      data: { isCurrent: false },
    })

    return prisma.schoolYear.update({
      where: { id },
      data: { isCurrent: true },
    })
  }

  getAcademicPeriods(schoolId: string) {
    return prisma.academicPeriod.findMany({
      where: { schoolId },
      orderBy: { sequence: 'asc' },
    })
  }
}
