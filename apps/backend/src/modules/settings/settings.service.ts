import { Injectable, NotFoundException } from '@nestjs/common'
import { prisma } from '@aula/database'

@Injectable()
export class SettingsService {
  getSchool() {
    return prisma.school.findFirst()
  }

  async updateSchool(body: any) {
    const school = await prisma.school.findFirst()
    if (!school) throw new NotFoundException('School not found')

    return prisma.school.update({
      where: { id: school.id },
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

  getSchoolYears() {
    return prisma.schoolYear.findMany({ orderBy: { startDate: 'desc' } })
  }

  async createSchoolYear(body: any) {
    const school = await prisma.school.findFirst()
    if (!school) throw new Error('No school configured')

    return prisma.schoolYear.create({
      data: {
        schoolId: school.id,
        name: body.name,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        isCurrent: body.isCurrent ?? false,
      },
    })
  }

  async updateSchoolYear(id: string, body: any) {
    const sy = await prisma.schoolYear.findUnique({ where: { id } })
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

  async setCurrentSchoolYear(id: string) {
    const sy = await prisma.schoolYear.findUnique({ where: { id } })
    if (!sy) throw new NotFoundException('School year not found')

    await prisma.schoolYear.updateMany({
      where: { isCurrent: true },
      data: { isCurrent: false },
    })

    return prisma.schoolYear.update({
      where: { id },
      data: { isCurrent: true },
    })
  }

  getAcademicPeriods() {
    return prisma.academicPeriod.findMany({ orderBy: { sequence: 'asc' } })
  }
}
