import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common'
import { StudentsService } from './students.service'
import { CreateStudentDto } from './dto/create-student.dto'
import { UpdateStudentDto } from './dto/update-student.dto'
import { CreateEnrollmentDto } from './dto/create-enrollment.dto'
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard'

@Controller('students')
@UseGuards(JwtAuthGuard)
export class StudentsController {
  constructor(private studentsService: StudentsService) {}

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.studentsService.findAll(
      search,
      status,
      page ? Number(page) : 1,
      pageSize ? Number(pageSize) : 50,
    )
  }

  @Get('grades-with-sections')
  getGradesWithSections() {
    return this.studentsService.getGradesWithSections()
  }

  @Post('import')
  importStudents(@Body() body: any) {
    return this.studentsService.importStudents(body.students ?? body)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id)
  }

  @Post()
  create(@Body() dto: CreateStudentDto) {
    return this.studentsService.create(dto)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateStudentDto) {
    return this.studentsService.update(id, dto)
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.studentsService.deactivate(id)
  }

  @Get(':id/enrollments')
  getEnrollments(@Param('id') id: string) {
    return this.studentsService.getEnrollments(id)
  }

  @Post('enrollments')
  createEnrollment(@Body() dto: CreateEnrollmentDto) {
    return this.studentsService.createEnrollment(dto)
  }

  @Delete('enrollments/:id')
  deleteEnrollment(@Param('id') id: string) {
    return this.studentsService.deleteEnrollment(id)
  }

  @Get(':id/guardians')
  getGuardians(@Param('id') id: string) {
    return this.studentsService.getGuardians(id)
  }

  @Post(':id/notify-guardians')
  notifyGuardians(@Param('id') id: string, @Body() body: any) {
    return this.studentsService.notifyGuardians(id, body)
  }
}
