import { numberSetting } from './number-setting'

/** Umbrales de aviso, no reglas de promoción ni calificaciones oficiales. */
export function dashboardAttentionPolicy(env: Record<string, string | undefined> = process.env) {
  return {
    attendanceMinimum: numberSetting(env, 'DASHBOARD_ATTENDANCE_MINIMUM', 80, 0, 100),
    gradeMinimum: numberSetting(env, 'DASHBOARD_GRADE_MINIMUM', 70, 0, 100),
    observationMinimum: numberSetting(env, 'DASHBOARD_OBSERVATION_MINIMUM', 2, 1, 1000, true),
    lookbackDays: numberSetting(env, 'DASHBOARD_ATTENTION_LOOKBACK_DAYS', 30, 1, 3660, true),
    pageSize: numberSetting(env, 'DASHBOARD_ATTENTION_PAGE_SIZE', 500, 1, 2000, true),
    displayLimit: numberSetting(env, 'DASHBOARD_ATTENTION_DISPLAY_LIMIT', 4, 1, 100, true),
  }
}
