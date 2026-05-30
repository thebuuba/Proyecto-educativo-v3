import { Injectable } from '@nestjs/common'
import { prisma } from '@aula/database'

@Injectable()
export class SubjectsService {
  findAll() {
    return prisma.subject.findMany({ orderBy: { name: 'asc' } })
  }
}
