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
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { AuthenticatedUser } from '../auth/types/authenticated-user'
import { Roles } from '../../common/decorators/roles.decorator'
import { RolesGuard } from '../../common/guards/roles.guard'

@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentsController {
  constructor(private studentsService: StudentsService) {}

  @Get()
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.studentsService.findAll(
      user.schoolId,
      search,
      status,
      page ? Number(page) : 1,
      pageSize ? Number(pageSize) : 50,
    )
  }

  @Get('grades-with-sections')
  getGradesWithSections(@CurrentUser() user: AuthenticatedUser) {
    return this.studentsService.getGradesWithSections(user.schoolId)
  }

  @Post('import')
  @Roles('admin', 'director', 'coordinator')
  importStudents(@CurrentUser() user: AuthenticatedUser, @Body() body: any) {
    return this.studentsService.importStudents(user.schoolId, body.students ?? body)
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.studentsService.findOne(user.schoolId, id)
  }

  @Post()
  @Roles('admin', 'director', 'coordinator')
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateStudentDto) {
    return this.studentsService.create(user.schoolId, dto)
  }

  @Patch(':id')
  @Roles('admin', 'director', 'coordinator')
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateStudentDto,
  ) {
    return this.studentsService.update(user.schoolId, id, dto)
  }

  @Patch(':id/deactivate')
  @Roles('admin', 'director', 'coordinator')
  deactivate(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.studentsService.deactivate(user.schoolId, id)
  }

  @Get(':id/enrollments')
  getEnrollments(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.studentsService.getEnrollments(user.schoolId, id)
  }

  @Post('enrollments')
  @Roles('admin', 'director', 'coordinator')
  createEnrollment(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateEnrollmentDto) {
    return this.studentsService.createEnrollment(user.schoolId, dto)
  }

  @Delete('enrollments/:id')
  @Roles('admin', 'director', 'coordinator')
  deleteEnrollment(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.studentsService.deleteEnrollment(user.schoolId, id)
  }

  @Get(':id/guardians')
  getGuardians(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.studentsService.getGuardians(user.schoolId, id)
  }

  @Post(':id/notify-guardians')
  @Roles('admin', 'director', 'coordinator', 'teacher')
  notifyGuardians(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.studentsService.notifyGuardians(user.schoolId, id, body)
  }
}
