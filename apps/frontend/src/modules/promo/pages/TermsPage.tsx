import { Link } from 'react-router-dom'

import { PromoLayout } from '@/modules/promo/components/PromoLayout'

const linkClassName = 'font-semibold text-primary hover:underline'

export function TermsPage() {
  return (
    <PromoLayout>
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-8 lg:px-14">
        <h1 className="mb-2 text-[clamp(2rem,6vw,2.5rem)] font-extrabold leading-tight text-[#0D1117]">
          Términos y condiciones
        </h1>
        <p className="mb-10 text-sm text-[#9CA3AF]">Última actualización: 17 de julio de 2026</p>

        <div className="space-y-8 text-[15px] leading-relaxed text-[#4B5563]">
          <section>
            <h2 className="mb-2 text-lg font-bold text-[#111827]">1. Aceptación y alcance</h2>
            <p>
              Al crear una cuenta o utilizar Aula Base aceptas estos términos y nuestra{' '}
              <Link to="/privacidad" className={linkClassName}>Política de Privacidad</Link>. Si utilizas la
              plataforma en nombre de un centro educativo, declaras que tienes autorización para aceptar estas
              condiciones y gestionar la información de esa institución.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-[#111827]">2. Qué ofrece Aula Base</h2>
            <p>
              Aula Base es un sistema de gestión educativa para administrar centros, usuarios, docentes,
              estudiantes, responsables, cursos, matrículas, asignaturas, horarios, asistencia, evaluaciones,
              calificaciones, planificaciones, reportes, tareas y comunicaciones escolares. Algunas funciones
              dependen del rol asignado y de la configuración del centro.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-[#111827]">3. Cuentas y seguridad</h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>Debes proporcionar información correcta y mantenerla actualizada.</li>
              <li>Eres responsable de proteger tus credenciales y de la actividad realizada desde tu cuenta.</li>
              <li>Debes avisarnos si detectas acceso no autorizado, pérdida de credenciales o uso indebido.</li>
              <li>No puedes compartir una cuenta personal ni intentar acceder a datos o funciones sin permiso.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-[#111827]">4. Datos escolares y contenido</h2>
            <p>
              El centro educativo y sus usuarios autorizados conservan la responsabilidad sobre la información
              que incorporan a Aula Base. Esto incluye datos personales y académicos de estudiantes —que pueden
              ser menores de edad—, familiares, docentes y demás integrantes de la comunidad educativa.
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-6">
              <li>Solo debes registrar datos necesarios para una finalidad educativa legítima.</li>
              <li>Debes contar con la autorización, consentimiento o base legal que corresponda.</li>
              <li>No debes cargar información falsa, ilícita, discriminatoria o que vulnere derechos de terceros.</li>
              <li>Conservas la titularidad de tus contenidos y nos autorizas a procesarlos únicamente para operar, proteger y mejorar el servicio.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-[#111827]">5. Información que utiliza el sistema</h2>
            <p>Para prestar el servicio, Aula Base procesa:</p>
            <ul className="mt-2 list-disc space-y-2 pl-6">
              <li>Datos de cuenta y perfil, como nombre, correo, teléfono, imagen y rol.</li>
              <li>Datos institucionales, académicos, de asistencia, evaluación y comunicación ingresados por usuarios autorizados.</li>
              <li>Archivos e imágenes que decidas adjuntar a actividades o contenidos.</li>
              <li>Datos técnicos básicos, como dirección IP, navegador, solicitudes, errores y eventos de seguridad.</li>
              <li>Cookies y almacenamiento del navegador para mantener la sesión, recordar preferencias y guardar borradores locales.</li>
            </ul>
            <p className="mt-3">
              No vendemos estos datos ni los utilizamos para publicidad dirigida. Los detalles sobre finalidades,
              conservación y derechos están en la{' '}
              <Link to="/privacidad" className={linkClassName}>Política de Privacidad</Link>.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-[#111827]">6. Proveedores tecnológicos</h2>
            <p>
              Aula Base utiliza Supabase para autenticación, base de datos y almacenamiento, y Cloudflare para
              publicar, proteger y ejecutar la aplicación. Estos proveedores pueden procesar datos técnicos y el
              contenido necesario para prestar sus servicios, conforme a sus propias condiciones y compromisos de
              seguridad. No les autorizamos a usar la información escolar para fines publicitarios propios.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-[#111827]">7. Uso permitido</h2>
            <p>No puedes utilizar Aula Base para:</p>
            <ul className="mt-2 list-disc space-y-2 pl-6">
              <li>Infringir leyes, derechos de privacidad, propiedad intelectual o normas escolares aplicables.</li>
              <li>Introducir software malicioso, eludir controles de acceso o afectar la disponibilidad del servicio.</li>
              <li>Extraer datos de forma automatizada, revender el acceso o usar información escolar fuera de su finalidad autorizada.</li>
              <li>Suplantar identidades, alterar registros sin autorización o facilitar fraude académico.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-[#111827]">8. Disponibilidad y exactitud</h2>
            <p>
              Trabajamos para mantener Aula Base disponible y segura, pero pueden existir interrupciones por
              mantenimiento, fallos de internet o servicios de terceros. La plataforma apoya la gestión escolar;
              cada institución debe revisar los registros antes de emitir decisiones, actas o reportes oficiales y
              conservar las copias que exijan sus normas internas o la ley.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-[#111827]">9. Suspensión y terminación</h2>
            <p>
              Podemos limitar o suspender una cuenta cuando sea necesario para proteger usuarios y datos, investigar
              un incidente, cumplir la ley o detener un incumplimiento de estos términos. El usuario o la institución
              puede solicitar el cierre y la gestión de sus datos mediante nuestros canales de contacto, sujeto a las
              obligaciones legales de conservación aplicables.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-[#111827]">10. Propiedad intelectual</h2>
            <p>
              Aula Base, su software, marca y diseño están protegidos por las normas aplicables. Estos términos no
              transfieren derechos sobre la plataforma. La información y los materiales cargados por cada institución
              o usuario continúan perteneciendo a sus respectivos titulares.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-[#111827]">11. Responsabilidad</h2>
            <p>
              En la medida permitida por la ley, Aula Base no responde por decisiones tomadas a partir de datos
              incorrectos ingresados por usuarios, usos no autorizados, pérdida causada por credenciales comprometidas
              ni interrupciones ajenas a nuestro control. Nada de estos términos limita derechos que legalmente no
              puedan excluirse.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-[#111827]">12. Cambios y legislación aplicable</h2>
            <p>
              Podemos actualizar estos términos cuando cambie el servicio o la normativa. Informaremos los cambios
              importantes y mostraremos la nueva fecha de actualización. Estos términos se interpretan conforme a las
              leyes de la República Dominicana, incluida la normativa aplicable sobre protección de datos personales.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-[#111827]">13. Contacto</h2>
            <p>
              Para consultas, solicitudes sobre datos o reportes de seguridad, utiliza nuestra{' '}
              <Link to="/contacto" className={linkClassName}>página de contacto</Link>.
            </p>
          </section>
        </div>
      </article>
    </PromoLayout>
  )
}
