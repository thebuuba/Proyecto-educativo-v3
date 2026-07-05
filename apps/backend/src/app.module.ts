/**
 * @description Módulo raíz de la aplicación NestJS. Importa todos los módulos funcionales y configura middleware global (interceptors, filters, throttler).
 */

import { Module } from '@nestjs/common'
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core'
import { ConfigModule } from '@nestjs/config'
import { CacheModule } from '@nestjs/cache-manager'
import { ThrottlerModule } from '@nestjs/throttler'
import { ResponseInterceptor } from './common/interceptors/response.interceptor'
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter'
import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { StudentsModule } from './modules/students/students.module'
import { AttendanceModule } from './modules/attendance/attendance.module'
import { GradingModule } from './modules/grading/grading.module'
import { ScheduleModule } from './modules/schedule/schedule.module'
import { PlanningModule } from './modules/planning/planning.module'
import { CoursesModule } from './modules/courses/courses.module'
import { DashboardModule } from './modules/dashboard/dashboard.module'
import { SchoolAdministrationModule } from './modules/school-administration/school-administration.module'
import { ReportsModule } from './modules/reports/reports.module'
import { ProfileModule } from './modules/profile/profile.module'
import { SubjectsModule } from './modules/subjects/subjects.module'
import { backendEnvFilePaths } from './config/env-file-paths'

/**
 * Configuración del módulo raíz.
 *
 * @imports ConfigModule (global), ThrottlerModule con límite de 100 peticiones por minuto,
 * y todos los módulos funcionales de la aplicación (auth, users, students, attendance, etc.).
 * @providers ResponseInterceptor (global) y AllExceptionsFilter (global).
 */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: backendEnvFilePaths }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    CacheModule.register({ isGlobal: true, ttl: 60_000, max: 100 }),
    AuthModule,
    UsersModule,
    StudentsModule,
    AttendanceModule,
    GradingModule,
    ScheduleModule,
    PlanningModule,
    CoursesModule,
    DashboardModule,
    SchoolAdministrationModule,
    ReportsModule,
    ProfileModule,
    SubjectsModule,
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule {}
