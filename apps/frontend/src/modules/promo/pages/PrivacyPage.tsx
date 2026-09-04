import { ShieldCheck } from 'lucide-react'

import { PromoLayout } from '@/modules/promo/components/PromoLayout'

export function PrivacyPage() {
  return (
    <PromoLayout>
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-8 lg:px-14">
        <div className="mb-10 flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-success/18 text-foreground"><ShieldCheck className="size-5" /></div>
          <div>
            <h1 className="text-[clamp(2rem,6vw,2.5rem)] font-extrabold leading-tight text-foreground">Política de Privacidad</h1>
            <p className="mt-1 text-sm text-muted-foreground">Última actualización: Julio 2026</p>
          </div>
        </div>

        <div className="space-y-6 text-[15px] leading-relaxed text-muted-foreground">
          <PolicySection title="1. Información que recopilamos">
            <p>En Aula Base recopilamos la información necesaria para operar nuestra plataforma educativa. Esto incluye:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6"><li>Datos de registro: nombre completo, correo electrónico y centro educativo.</li><li>Datos académicos: calificaciones, asistencia, planificaciones y otra información educativa ingresada por los docentes.</li><li>Datos de uso: interacciones con la plataforma, preferencias y configuración.</li></ul>
          </PolicySection>
          <PolicySection title="2. Uso de la información">
            <p>Utilizamos la información recopilada para:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6"><li>Proveer y mantener la plataforma educativa.</li><li>Generar reportes académicos y analíticos.</li><li>Mejorar nuestros servicios y desarrollar nuevas funcionalidades.</li><li>Comunicarnos contigo sobre actualizaciones, soporte y cambios en el servicio.</li></ul>
          </PolicySection>
          <PolicySection title="3. Protección de datos"><p>Implementamos medidas de seguridad técnicas y organizativas para proteger tu información contra acceso no autorizado, alteración o divulgación. Todos los datos se transmiten mediante conexiones cifradas (SSL/TLS) y se almacenan en servidores seguros.</p></PolicySection>
          <PolicySection title="4. Compartición de datos"><p>No compartimos información personal con terceros, excepto cuando sea requerido por ley o con tu consentimiento explícito. Los datos académicos pertenecen a la institución educativa y nunca son utilizados para fines distintos a los contratados.</p></PolicySection>
          <PolicySection title="5. Tus derechos"><p>Tienes derecho a acceder, corregir o eliminar tus datos personales en cualquier momento desde la configuración de tu cuenta. Para solicitudes adicionales, contáctanos a través de nuestro formulario de contacto.</p></PolicySection>
          <PolicySection title="6. Contacto"><p>Si tienes preguntas sobre esta política de privacidad, puedes contactarnos en <a href="mailto:privacidad@aulabase.com" className="font-semibold text-primary-variant hover:underline">privacidad@aulabase.com</a>.</p></PolicySection>
        </div>
      </article>
    </PromoLayout>
  )
}

function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-2xl bg-card p-5 shadow-sm"><h2 className="mb-2 text-lg font-bold text-foreground">{title}</h2>{children}</section>
}
