/**
 * Servicio de configuración
 * @module SettingsService
 * @description Contiene la lógica de negocio para la gestión de la configuración del colegio.
 * Proporciona operaciones CRUD para datos de la institución, años escolares
 * y consulta de períodos académicos.
 */
import { Injectable, NotFoundException } from '@nestjs/common'
import { prisma } from '@aula/database'

@Injectable()
export class SettingsService {
  /** Obtiene los datos del colegio por su ID */
  getSchool(schoolId: string) {
    return prisma.school.findUnique({ where: { id: schoolId } })
  }

  /** Actualiza los datos del colegio */
  async updateSchool(schoolId: string, body: any) {
    const school = await prisma.school.findUnique({ where: { id: schoolId } })
    if (!school) throw new NotFoundException('School not found')

    return prisma.school.update({
      where: { id: schoolId },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.slug && { slug: body.slug }),
        ...(body.logoUrl !== undefined && { logoUrl: body.logoUrl }),
        ...(body.sector !== undefined && { sector: body.sector }),
        ...(body.regionalCode !== undefined && { regionalCode: body.regionalCode }),
        ...(body.regionalName !== undefined && { regionalName: body.regionalName }),
        ...(body.districtCode !== undefined && { districtCode: body.districtCode }),
        ...(body.districtName !== undefined && { districtName: body.districtName }),
        ...(body.centerCode !== undefined && { centerCode: body.centerCode }),
        ...(body.schoolShift !== undefined && { schoolShift: body.schoolShift }),
        ...(body.primaryModality !== undefined && { primaryModality: body.primaryModality }),
        ...(body.enabledSubsystems !== undefined && { enabledSubsystems: body.enabledSubsystems }),
        ...(body.officialExportsEnabled !== undefined && { officialExportsEnabled: body.officialExportsEnabled }),
      },
    })
  }

  /** Obtiene los años escolares del colegio ordenados por fecha de inicio */
  getSchoolYears(schoolId: string) {
    return prisma.schoolYear.findMany({
      where: { schoolId },
      orderBy: { startDate: 'desc' },
    })
  }

  /** Crea un nuevo año escolar */
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

  /** Actualiza un año escolar existente */
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

  /** Establece un año escolar como el actual, desmarcando los demás en una transacción */
  async setCurrentSchoolYear(schoolId: string, id: string) {
    const sy = await prisma.schoolYear.findFirst({ where: { id, schoolId } })
    if (!sy) throw new NotFoundException('School year not found')

    const [, current] = await prisma.$transaction([
      prisma.schoolYear.updateMany({
        where: { schoolId, isCurrent: true },
        data: { isCurrent: false },
      }),
      prisma.schoolYear.update({
        where: { id },
        data: { isCurrent: true },
      }),
    ])

    return current
  }

  /** Obtiene los períodos académicos del colegio */
  getAcademicPeriods(schoolId: string) {
    return prisma.academicPeriod.findMany({
      where: { schoolId },
      orderBy: { sequence: 'asc' },
    })
  }
}
