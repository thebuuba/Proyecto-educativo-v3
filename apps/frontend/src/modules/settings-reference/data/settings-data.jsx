// Recovered from the user-provided Polymet design; layout and sample data preserved.

var activeSessions = [
  {
    id: 's1',
    device: 'MacBook Pro',
    type: 'desktop',
    browser: 'Chrome 126',
    location: 'Valencia, España',
    lastActive: 'Activa ahora',
    current: true,
  },
  {
    id: 's2',
    device: 'iPhone 15',
    type: 'mobile',
    browser: 'App EduNube',
    location: 'Valencia, España',
    lastActive: 'Hace 2 horas',
  },
  {
    id: 's3',
    device: 'iPad Air',
    type: 'tablet',
    browser: 'Safari 17',
    location: 'Madrid, España',
    lastActive: 'Hace 3 días',
  },
  {
    id: 's4',
    device: 'Windows PC',
    type: 'desktop',
    browser: 'Edge 125',
    location: 'Biblioteca UPV',
    lastActive: 'Hace 1 semana',
  },
]
var loginHistory = [
  {
    id: 'l1',
    status: 'success',
    description: 'Inicio de sesión · Chrome',
    location: 'Valencia, España',
    date: 'Hoy, 09:12',
  },
  {
    id: 'l2',
    status: 'blocked',
    description: 'Intento bloqueado · contraseña incorrecta',
    location: 'Lyon, Francia',
    date: 'Ayer, 23:47',
  },
  {
    id: 'l3',
    status: 'success',
    description: 'Inicio de sesión · App EduNube',
    location: 'Valencia, España',
    date: 'Ayer, 18:30',
  },
]
var notificationGroups = [
  {
    id: 'learning',
    label: 'Aprendizaje',
    categories: [
      {
        id: 'classes',
        label: 'Clases en vivo',
        description: 'Recordatorios antes de que empiece una clase',
        channels: { email: true, push: true, sms: false },
      },
      {
        id: 'assignments',
        label: 'Tareas y entregas',
        description: 'Nuevas tareas y fechas límite próximas',
        channels: { email: true, push: true, sms: true },
      },
      {
        id: 'grades',
        label: 'Calificaciones',
        description: 'Cuando un profesor publica tu nota',
        channels: { email: true, push: true, sms: false },
      },
      {
        id: 'new-content',
        label: 'Contenido nuevo',
        description: 'Lecciones nuevas en los cursos que sigues',
        channels: { email: false, push: true, sms: false },
      },
    ],
  },
  {
    id: 'community',
    label: 'Comunidad',
    categories: [
      {
        id: 'messages',
        label: 'Mensajes de profesores',
        description: 'Mensajes directos y anuncios del curso',
        channels: { email: true, push: true, sms: false },
      },
      {
        id: 'forums',
        label: 'Respuestas en foros',
        description: 'Cuando alguien responde a tus preguntas',
        channels: { email: false, push: true, sms: false },
      },
    ],
  },
  {
    id: 'account',
    label: 'Cuenta',
    categories: [
      {
        id: 'security',
        label: 'Alertas de seguridad',
        description: 'Inicios de sesión nuevos y cambios de contraseña',
        channels: { email: true, push: true, sms: true },
        locked: ['email'],
      },
      {
        id: 'billing',
        label: 'Pagos y facturas',
        description: 'Cobros, renovaciones y pagos fallidos',
        channels: { email: true, push: false, sms: false },
        locked: ['email'],
      },
      {
        id: 'promos',
        label: 'Novedades y ofertas',
        description: 'Descuentos, cursos destacados y eventos',
        channels: { email: false, push: false, sms: false },
      },
    ],
  },
]
var privacyOptions = [
  {
    id: 'leaderboard',
    label: 'Aparecer en rankings',
    description: 'Muestra tu posición en las clasificaciones de los cursos',
    enabled: true,
  },
  {
    id: 'progress',
    label: 'Mostrar progreso de cursos',
    description: 'Tus compañeros pueden ver qué cursos estás realizando',
    enabled: true,
  },
  {
    id: 'directory',
    label: 'Aparecer en el directorio de estudiantes',
    description: 'Permite que otros te encuentren por nombre o institución',
    enabled: false,
  },
  {
    id: 'messages',
    label: 'Recibir mensajes de compañeros',
    description: 'Los profesores siempre podrán escribirte',
    enabled: true,
  },
  {
    id: 'online',
    label: 'Mostrar estado en línea',
    description: 'Indica cuándo estás conectado a la plataforma',
    enabled: false,
  },
]
var dataOptions = [
  {
    id: 'personalization',
    label: 'Recomendaciones personalizadas',
    description: 'Usamos tu actividad para sugerirte cursos relevantes',
    enabled: true,
  },
  {
    id: 'analytics',
    label: 'Analítica de uso',
    description: 'Datos anónimos para mejorar la plataforma',
    enabled: true,
  },
  {
    id: 'research',
    label: 'Investigación educativa',
    description: 'Participar en estudios anónimos sobre aprendizaje',
    enabled: false,
  },
]

export {
  activeSessions,
  loginHistory,
  notificationGroups,
  privacyOptions,
  dataOptions,
}
