import { PromoLayout } from '@/modules/promo/components/PromoLayout'

export function TermsPage() {
  return (
    <PromoLayout>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-8 lg:px-14">
        <h1 className="mb-2 text-[clamp(2rem,6vw,2.5rem)] font-extrabold leading-tight text-[#0D1117]">
          Términos del Servicio
        </h1>
        <p className="mb-10 text-sm text-[#9CA3AF]">Última actualización: Julio 2026</p>

        <div className="space-y-6 text-[15px] leading-relaxed text-[#4B5563]">
          <section>
            <h2 className="mb-2 text-lg font-bold text-[#111827]">1. Aceptación de los términos</h2>
            <p>Al acceder o usar Aula Base, aceptas estar sujeto a estos términos de servicio. Si no estás de acuerdo con alguna parte, no debes usar la plataforma.</p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-[#111827]">2. Descripción del servicio</h2>
            <p>Aula Base es una plataforma de gestión educativa que permite a docentes e instituciones administrar asistencia, calificaciones, horarios, planificaciones y comunicación escolar. El servicio se provee &quot;tal cual&quot; y nos esforzamos por mantener su disponibilidad y funcionamiento.</p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-[#111827]">3. Cuentas de usuario</h2>
            <p>Eres responsable de mantener la confidencialidad de tus credenciales y de todas las actividades que ocurran bajo tu cuenta. Debes notificarnos inmediatamente sobre cualquier uso no autorizado. Las cuentas son personales e intransferibles.</p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-[#111827]">4. Planes y pagos</h2>
            <p>Ofrecemos planes gratuitos y de pago. Las características de cada plan están especificadas en nuestra página de precios. Los pagos se procesan de forma segura a través de nuestros proveedores de pago. Puedes cancelar tu suscripción en cualquier momento.</p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-[#111827]">5. Limitación de responsabilidad</h2>
            <p>Aula Base no será responsable por daños indirectos, incidentales o consecuentes derivados del uso o la imposibilidad de usar el servicio. Nuestra responsabilidad máxima se limita al monto pagado por el servicio en los últimos 12 meses.</p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-[#111827]">6. Modificaciones</h2>
            <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Te notificaremos sobre cambios significativos a través de la plataforma o por correo electrónico. El uso continuado del servicio después de los cambios constituye aceptación de los nuevos términos.</p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-[#111827]">7. Contacto</h2>
            <p>Para consultas sobre estos términos, escríbenos a <a href="mailto:legal@aulabase.com" className="font-semibold text-primary hover:underline">legal@aulabase.com</a>.</p>
          </section>
        </div>
      </div>
    </PromoLayout>
  )
}
