import { PromoLayout } from '@/modules/promo/components/PromoLayout'

export function PrivacyPage() {
  return (
    <PromoLayout>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-8 lg:px-14">
        <h1 className="mb-2 text-[clamp(2rem,6vw,2.5rem)] font-extrabold leading-tight text-[#0D1117]">
          Política de Privacidad
        </h1>
        <p className="mb-10 text-sm text-[#9CA3AF]">Última actualización: Julio 2026</p>

        <div className="space-y-6 text-[15px] leading-relaxed text-[#4B5563]">
          <section>
            <h2 className="mb-2 text-lg font-bold text-[#111827]">1. Información que recopilamos</h2>
            <p>En Aula Base recopilamos la información necesaria para operar nuestra plataforma educativa. Esto incluye:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Datos de registro: nombre completo, correo electrónico y centro educativo.</li>
              <li>Datos académicos: calificaciones, asistencia, planificaciones y otra información educativa ingresada por los docentes.</li>
              <li>Datos de uso: interacciones con la plataforma, preferencias y configuración.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-[#111827]">2. Uso de la información</h2>
            <p>Utilizamos la información recopilada para:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Proveer y mantener la plataforma educativa.</li>
              <li>Generar reportes académicos y analíticos.</li>
              <li>Mejorar nuestros servicios y desarrollar nuevas funcionalidades.</li>
              <li>Comunicarnos contigo sobre actualizaciones, soporte y cambios en el servicio.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-[#111827]">3. Protección de datos</h2>
            <p>Implementamos medidas de seguridad técnicas y organizativas para proteger tu información contra acceso no autorizado, alteración o divulgación. Todos los datos se transmiten mediante conexiones cifradas (SSL/TLS) y se almacenan en servidores seguros.</p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-[#111827]">4. Compartición de datos</h2>
            <p>No compartimos información personal con terceros, excepto cuando sea requerido por ley o con tu consentimiento explícito. Los datos académicos pertenecen a la institución educativa y nunca son utilizados para fines distintos a los contratados.</p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-[#111827]">5. Tus derechos</h2>
            <p>Tienes derecho a acceder, corregir o eliminar tus datos personales en cualquier momento desde la configuración de tu cuenta. Para solicitudes adicionales, contáctanos a través de nuestro formulario de contacto.</p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-[#111827]">6. Contacto</h2>
            <p>Si tienes preguntas sobre esta política de privacidad, puedes contactarnos en <a href="mailto:privacidad@aulabase.com" className="font-semibold text-primary hover:underline">privacidad@aulabase.com</a>.</p>
          </section>
        </div>
      </div>
    </PromoLayout>
  )
}
