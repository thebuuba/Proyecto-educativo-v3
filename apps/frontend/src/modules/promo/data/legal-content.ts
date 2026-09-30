/**
 * BORRADORES de documentos legales. No son textos definitivos.
 * Deben ser revisados por asesoría legal antes de publicarse.
 * Los fragmentos entre corchetes [ ] son campos por completar y se muestran
 * como marcadores en modo diseño.
 */

export interface LegalSection {
  id: string
  title: string
  paragraphs: string[]
}

export interface LegalDoc {
  title: string
  summary: string
  versionKey: 'terms' | 'privacy'
  sections: LegalSection[]
}

export const termsDoc: LegalDoc = {
  title: 'Términos y condiciones',
  summary:
    'Condiciones de uso de la plataforma Aula Base para docentes, centros educativos y demás usuarios.',
  versionKey: 'terms',
  sections: [
    {
      id: 'partes',
      title: '1. Quiénes somos',
      paragraphs: [
        'Aula Base es un servicio ofrecido por [Razón social], con RNC [RNC] y domicilio en [Dirección fiscal].',
        'Puedes comunicarte con nosotros en [Correo de contacto].',
      ],
    },
    {
      id: 'servicio',
      title: '2. El servicio',
      paragraphs: [
        'Aula Base es una plataforma web de gestión académica que organiza la información de un centro por escuela y año escolar: cursos, asignaturas, estudiantes y matrículas, horario, asistencia, actividades e instrumentos de evaluación, calificaciones, planificación curricular, bitácora, reportes y administración escolar.',
        'Las funciones disponibles pueden variar según el perfil del usuario y [Alcance por plan, por definir].',
      ],
    },
    {
      id: 'cuentas',
      title: '3. Cuentas y perfiles',
      paragraphs: [
        'Para usar Aula Base debes crear una cuenta con datos verdaderos y mantener tu contraseña en reserva. Eres responsable de la actividad realizada con tu cuenta.',
        'Los perfiles contemplados son docente, director, coordinador, administrador, estudiante y tutor. Cada perfil accede a la información que le corresponde según su rol en el centro.',
        'Las cuentas de estudiantes menores de edad [Condiciones de creación y consentimiento de tutores, por definir].',
      ],
    },
    {
      id: 'uso',
      title: '4. Uso aceptable',
      paragraphs: [
        'Te comprometes a usar Aula Base solo para fines educativos y administrativos legítimos, a no introducir información de terceros sin estar autorizado y a no intentar acceder a datos que no te corresponden.',
      ],
    },
    {
      id: 'datos',
      title: '5. Información registrada',
      paragraphs: [
        'La información académica que registras pertenece a [Titular de los datos: docente / centro, por definir]. El tratamiento de datos personales se rige por la Política de privacidad.',
      ],
    },
    {
      id: 'pagos',
      title: '6. Planes, pagos y renovación',
      paragraphs: [
        'La contratación de planes de pago aún no está disponible. Cuando se habilite, esta sección detallará importes, moneda, impuestos, periodicidad, renovación, cancelación y reembolsos.',
        '[Condiciones comerciales por definir].',
      ],
    },
    {
      id: 'responsabilidad',
      title: '7. Disponibilidad y responsabilidad',
      paragraphs: [
        '[Condiciones de disponibilidad del servicio y limitación de responsabilidad, por definir con asesoría legal].',
      ],
    },
    {
      id: 'terminacion',
      title: '8. Terminación',
      paragraphs: [
        '[Causas de suspensión o cierre de cuentas y plazo de conservación de datos tras el cierre, por definir].',
      ],
    },
    {
      id: 'cambios',
      title: '9. Cambios en estos términos',
      paragraphs: [
        'Si modificamos estos términos, publicaremos la nueva versión con su fecha de vigencia y te lo comunicaremos por [Canal de aviso, por definir].',
      ],
    },
    {
      id: 'ley',
      title: '10. Ley aplicable',
      paragraphs: [
        'Estos términos se rigen por las leyes de la República Dominicana. [Jurisdicción competente, por confirmar].',
      ],
    },
  ],
}

export const privacyDoc: LegalDoc = {
  title: 'Política de privacidad',
  summary:
    'Cómo Aula Base recopila, usa y protege los datos personales de docentes, estudiantes, tutores y personal de los centros.',
  versionKey: 'privacy',
  sections: [
    {
      id: 'responsable',
      title: '1. Responsable del tratamiento',
      paragraphs: [
        'El responsable es [Razón social], RNC [RNC], con domicilio en [Dirección fiscal]. Para temas de privacidad escribe a [Correo de privacidad].',
        '[Rol de Aula Base frente a los centros: responsable o encargado del tratamiento, por definir].',
      ],
    },
    {
      id: 'datos',
      title: '2. Datos que tratamos',
      paragraphs: [
        'Datos de cuenta: nombre, apellidos, correo electrónico y contraseña cifrada.',
        'Datos académicos registrados por los usuarios: cursos, matrículas, asistencia, calificaciones, planificaciones, observaciones de bitácora y reportes.',
        'Datos de estudiantes y tutores que el centro o el docente registren, incluidos datos de menores de edad.',
        'Datos técnicos de uso: [Registros técnicos y cookies utilizados, por definir].',
      ],
    },
    {
      id: 'finalidad',
      title: '3. Para qué los usamos',
      paragraphs: [
        'Para prestar el servicio, permitir el acceso según el rol de cada persona, mantener la seguridad de las cuentas y atender tus consultas.',
        'No vendemos datos personales. [Otras finalidades, si las hubiera, por definir].',
      ],
    },
    {
      id: 'base',
      title: '4. Base legal',
      paragraphs: [
        '[Base legal del tratamiento conforme a la Ley n.º 172-13 y demás normativa aplicable, por confirmar con asesoría legal].',
      ],
    },
    {
      id: 'menores',
      title: '5. Datos de menores de edad',
      paragraphs: [
        '[Tratamiento de datos de estudiantes menores y consentimiento de padres o tutores, por definir].',
      ],
    },
    {
      id: 'terceros',
      title: '6. Con quién los compartimos',
      paragraphs: [
        '[Proveedores de alojamiento, correo y pago que intervienen, y su ubicación, por definir].',
      ],
    },
    {
      id: 'conservacion',
      title: '7. Conservación',
      paragraphs: ['[Plazos de conservación de los datos, por definir].'],
    },
    {
      id: 'derechos',
      title: '8. Tus derechos',
      paragraphs: [
        'Puedes solicitar acceso, rectificación, cancelación u oposición al tratamiento de tus datos escribiendo a [Correo de privacidad]. [Plazo de respuesta, por definir].',
      ],
    },
    {
      id: 'seguridad',
      title: '9. Seguridad',
      paragraphs: ['[Medidas de seguridad aplicadas, por describir con el equipo técnico].'],
    },
    {
      id: 'cambios',
      title: '10. Cambios en esta política',
      paragraphs: ['Publicaremos cada nueva versión con su fecha de vigencia.'],
    },
  ],
}
