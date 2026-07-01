/**
 * Servicio de configuración
 * @module SettingsService
 * @description Contiene la lógica de negocio para la gestión de la configuración del colegio.
 * Proporciona operaciones CRUD para datos de la institución, años escolares
 * y consulta de períodos académicos.
 */
import { Injectable, NotFoundException } from '@nestjs/common'
import { prisma } from '@aula/database'
import { UpdateSchoolDto } from './dto/update-school.dto'
import { CreateSchoolYearDto } from './dto/create-school-year.dto'
import { UpdateSchoolYearDto } from './dto/update-school-year.dto'

@Injectable()
export class SettingsService {
  /** Obtiene los datos del colegio por su ID */
  getSchool(schoolId: string) {
    return prisma.school.findUnique({ where: { id: schoolId } })
  }

  /** Actualiza los datos del colegio */
  async updateSchool(schoolId: string, dto: UpdateSchoolDto) {
    const school = await prisma.school.findUnique({ where: { id: schoolId } })
    if (!school) throw new NotFoundException('School not found')

    return prisma.school.update({
      where: { id: schoolId },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.slug && { slug: dto.slug }),
        ...(dto.logoUrl !== undefined && { logoUrl: dto.logoUrl }),
        ...(dto.sector !== undefined && { sector: dto.sector }),
        ...(dto.regionalCode !== undefined && { regionalCode: dto.regionalCode }),
        ...(dto.regionalName !== undefined && { regionalName: dto.regionalName }),
        ...(dto.districtCode !== undefined && { districtCode: dto.districtCode }),
        ...(dto.districtName !== undefined && { districtName: dto.districtName }),
        ...(dto.centerCode !== undefined && { centerCode: dto.centerCode }),
        ...(dto.schoolShift !== undefined && { schoolShift: dto.schoolShift }),
        ...(dto.primaryModality !== undefined && { primaryModality: dto.primaryModality }),
        ...(dto.enabledSubsystems !== undefined && { enabledSubsystems: dto.enabledSubsystems as any }),
        ...(dto.officialExportsEnabled !== undefined && { officialExportsEnabled: dto.officialExportsEnabled }),
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
  createSchoolYear(schoolId: string, dto: CreateSchoolYearDto) {
    return prisma.schoolYear.create({
      data: {
        schoolId,
        name: dto.name,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        isCurrent: dto.isCurrent ?? false,
      },
    })
  }

  /** Actualiza un año escolar existente */
  async updateSchoolYear(schoolId: string, id: string, dto: UpdateSchoolYearDto) {
    const sy = await prisma.schoolYear.findFirst({ where: { id, schoolId } })
    if (!sy) throw new NotFoundException('School year not found')

    return prisma.schoolYear.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.startDate && { startDate: new Date(dto.startDate) }),
        ...(dto.endDate && { endDate: new Date(dto.endDate) }),
        ...(dto.isCurrent !== undefined && { isCurrent: dto.isCurrent }),
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
