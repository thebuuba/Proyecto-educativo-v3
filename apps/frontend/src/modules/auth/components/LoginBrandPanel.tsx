import { AlertTriangle, CalendarCheck, GraduationCap, ShieldCheck, Sparkles } from 'lucide-react'

export function LoginBrandPanel() {
  return (
    <section className="login-brand" aria-label="Aula Base">
      <div className="login-brand-mark"><span className="login-brand-logo"><GraduationCap size={21} /></span><span><strong>Aula Base</strong><small>Sistema docente</small></span></div>
      <div className="login-brand-art" aria-hidden="true">
        <div className="login-class-card"><span>CLASE EN CURSO</span><strong>Ciencias Físicas · 3.º A</strong><div className="login-class-bottom"><b>5:10</b><i>MP</i><i>LG</i><i>AR</i><i>JM</i></div></div>
        <div className="login-attendance-card"><span><CalendarCheck size={17} /></span><div><strong>Asistencia registrada</strong><small>24/25 presentes</small><em /></div></div>
        <div className="login-alert-card"><span className="login-alert-icon"><AlertTriangle size={17} /></span><span><strong>2 estudiantes</strong> podrían ir a completiva</span></div>
      </div>
      <div className="login-brand-copy"><h2>Tu salón organizado, para que enseñes más y registres menos.</h2><ul><li><CalendarCheck />Pasa lista en segundos desde cualquier dispositivo</li><li><Sparkles />Alertas de estudiantes en riesgo y completivas</li><li><ShieldCheck />Alineado al currículo por competencias del MINERD</li></ul></div>
      <p className="login-brand-footer">© {new Date().getFullYear()} Aula Base · Hecho para docentes de República Dominicana</p>
    </section>
  )
}
