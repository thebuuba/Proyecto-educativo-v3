import { Injectable } from '@nestjs/common'
import { prisma } from '@aula/database'

@Injectable()
export class SubjectsService {
  findAll(schoolId: string) {
    return prisma.subject.findMany({ where: { schoolId }, orderBy: { name: 'asc' } })
  }
}
