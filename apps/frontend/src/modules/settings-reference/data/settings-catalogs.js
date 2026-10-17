// Etiquetas del diseño; los valores personales se reciben exclusivamente de servicios.
export const notificationGroups = [
  {id:'learning',label:'Aprendizaje',categories:[
    {id:'classes',label:'Clases en vivo',description:'Recordatorios de clases'},
    {id:'assignments',label:'Tareas y entregas',description:'Actividades y fechas de entrega'},
    {id:'grades',label:'Calificaciones',description:'Publicación de calificaciones'},
    {id:'new-content',label:'Contenido nuevo',description:'Nuevos recursos de los cursos'},
  ]},
  {id:'community',label:'Comunidad',categories:[
    {id:'messages',label:'Mensajes de profesores',description:'Mensajes y anuncios del curso'},
    {id:'forums',label:'Respuestas en foros',description:'Respuestas a conversaciones'},
  ]},
  {id:'account',label:'Cuenta',categories:[
    {id:'security',label:'Alertas de seguridad',description:'Avisos de acceso y seguridad'},
    {id:'billing',label:'Pagos y facturas',description:'Avisos comerciales de tu cuenta'},
    {id:'promos',label:'Novedades y ofertas',description:'Comunicaciones opcionales'},
  ]},
].map(group => ({...group,categories:group.categories.map(category => ({...category,channels:{email:null,push:null,sms:null}}))}))

export const privacyOptions = [
  {id:'leaderboard',label:'Aparecer en rankings',description:'Visibilidad en clasificaciones de cursos'},
  {id:'progress',label:'Mostrar progreso de cursos',description:'Compartir el avance con compañeros'},
  {id:'directory',label:'Aparecer en el directorio de estudiantes',description:'Visibilidad en el directorio de la comunidad'},
  {id:'messages',label:'Recibir mensajes',description:'Permitir mensajes de la comunidad'},
  {id:'online',label:'Mostrar estado en línea',description:'Visibilidad del estado de conexión'},
]
export const dataOptions = [
  {id:'personalization',label:'Personalización',description:'Preferencias de contenido personalizado'},
  {id:'analytics',label:'Analítica de uso',description:'Preferencias de analítica opcional'},
  {id:'research',label:'Investigación educativa',description:'Preferencias de participación en estudios'},
]
