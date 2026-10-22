import type {TechnicalModule} from './secondary-technical'
/** Pedagogical adaptations; official literals remain in the reviewed matrix. */
export const technicalMf057Five:TechnicalModule={
  "id": "mf057-5",
  "programCode": "IFC006_3",
  "moduleCode": "MF_057_3",
  "grade": 5,
  "cycle": 2,
  "modalityCode": "technical_professional",
  "subjectName": "Administración de Base de Datos",
  "sourceScopeId": "ifc006-mf057-5",
  "pdfPages": [
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37
  ],
  "policy": "REQUESTED_DATABASE_ADMINISTRATION_ACTIONS_FICTITIOUS_PRACTICE_NO_REAL_ACCOUNTS_OR_PRODUCTION_V1",
  "templatePrefix": "technical-mf057",
  "additionalVerbs": "cre(?:a|an|ar|e|en|ando)|prepar(?:a|an|ar|e|en|er|ir|ando|iendo)|defin(?:a|an|ar|e|en|er|ir|ando|iendo)|determin(?:a|an|ar|e|en|er|ir|ando|iendo)|aplic(?:a|an|ar|e|en|er|ir|ando|iendo)|apliqu(?:a|an|ar|e|en|er|ir|ando|iendo)|utiliz(?:a|an|ar|e|en|er|ir|ando|iendo)|utilic(?:a|an|ar|e|en|er|ir|ando|iendo)|compar(?:a|an|ar|e|en|er|ir|ando|iendo)|contrast(?:a|an|ar|e|en|er|ir|ando|iendo)|describ(?:a|an|ar|e|en|er|ir|ando|iendo)|explic(?:a|an|ar|e|en|er|ir|ando|iendo)|identific(?:a|an|ar|e|en|er|ir|ando|iendo)|identifiqu(?:a|an|ar|e|en|er|ir|ando|iendo)|seleccion(?:a|an|ar|e|en|er|ir|ando|iendo)|justific(?:a|an|ar|e|en|er|ir|ando|iendo)|analiz(?:a|an|ar|e|en|er|ir|ando|iendo)|interpret(?:a|an|ar|e|en|er|ir|ando|iendo)|clasific(?:a|an|ar|e|en|er|ir|ando|iendo)|elabor(?:a|an|ar|e|en|er|ir|ando|iendo)|implement(?:a|an|ar|e|en|er|ir|ando|iendo)|ejecut(?:a|an|ar|e|en|er|ir|ando|iendo)|configur(?:a|an|ar|e|en|er|ir|ando|iendo)|document(?:a|an|ar|e|en|er|ir|ando|iendo)|modific(?:a|an|ar|e|en|er|ir|ando|iendo)|modifiqu(?:a|an|ar|e|en|er|ir|ando|iendo)|administr(?:a|an|ar|e|en|er|ir|ando|iendo)|monitore(?:a|an|ar|e|en|er|ir|ando|iendo)|restaur(?:a|an|ar|e|en|er|ir|ando|iendo)|reestructur(?:a|an|ar|e|en|er|ir|ando|iendo)|elimin(?:a|an|ar|e|en|er|ir|ando|iendo)|recuper(?:a|an|ar|e|en|er|ir|ando|iendo)|automatiz(?:a|an|ar|e|en|er|ir|ando|iendo)|establec(?:a|an|ar|e|en|er|ir|ando|iendo)|establez(?:a|an|ar|e|en|er|ir|ando|iendo)|program(?:a|an|ar|e|en|er|ir|ando|iendo)|revis(?:a|an|ar|e|en|er|ir|ando|iendo)|conserv(?:a|an|ar|e|en|er|ir|ando|iendo)|envi(?:a|an|ar|e|en|er|ir|ando|iendo)|instal(?:a|an|ar|e|en|er|ir|ando|iendo)|conect(?:a|an|ar|e|en|er|ir|ando|iendo)|cambi(?:a|an|ar|e|en|er|ir|ando|iendo)|borr(?:a|an|ar|e|en|er|ir|ando|iendo)|prueba|probar|comprueba|comprobar|(?:realiz|planific|planifiqu|actualiz|actualic)(?:a|an|ar|e|en|er|ando|iendo)|corrige|corregir",
  "topics": [
    {
      "id": "dba-definition",
      "grade": 5,
      "label": "Papel del DBA",
      "match": "papel del administrador de bases? de datos|definicion (?:del? )?dba",
      "relation": "la relación entre el papel del DBA y la administración de los datos de la organización ficticia",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.1.1"
      ],
      "pages": [
        29
      ]
    },
    {
      "id": "dba-functions",
      "grade": 5,
      "label": "Funciones del DBA",
      "match": "funciones (?:del? )?dba",
      "relation": "la correspondencia entre las funciones administrativas descritas y las necesidades indicadas de la base de datos del caso",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.1.2",
        "ifc006-mf057-p-dba-functions"
      ],
      "pages": [
        29,
        32
      ]
    },
    {
      "id": "structure-management",
      "grade": 5,
      "label": "Administración de la estructura",
      "match": "administra el dba la estructura",
      "relation": "la relación entre la función del DBA y el mantenimiento de la estructura de la base de datos del caso",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.1.2"
      ],
      "pages": [
        29
      ]
    },
    {
      "id": "data-activities",
      "grade": 5,
      "label": "Actividades de los datos",
      "match": "actividades de los datos",
      "relation": "la correspondencia entre las actividades de los datos, los estándares, la guía de acción y los controles solicitados",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.2.4",
        "ifc006-mf057-p-data-activities"
      ],
      "pages": [
        30,
        33
      ],
      "exclude": "\\bdocument\\w*\\b"
    },
    {
      "id": "manager-administration",
      "grade": 5,
      "label": "Administración del gestor",
      "match": "estadisticas y los problemas potenciales",
      "relation": "la relación entre los datos del sistema gestor, los problemas identificados y la acción administrativa solicitada",
      "sourceRecordIds": [
        "ifc006-mf057-p-manager-administration",
        "ifc006-mf057-CE5.1.2"
      ],
      "pages": [
        29,
        32
      ]
    },
    {
      "id": "data-dictionary",
      "grade": 5,
      "label": "Diccionario de datos",
      "match": "diccionario de datos",
      "relation": "la correspondencia entre los objetos proporcionados y las entradas solicitadas de su diccionario de datos",
      "sourceRecordIds": [
        "ifc006-mf057-p-dictionary-creation",
        "ifc006-mf057-p-dictionary-establishment",
        "ifc006-mf057-CE5.1.2"
      ],
      "pages": [
        29,
        32,
        33
      ],
      "requires": "\\b(?:crea|crear|crean|cree|establece|establecer)\\b"
    },
    {
      "id": "database-reliability",
      "grade": 5,
      "label": "Confiabilidad de la base de datos",
      "match": "confiabilidad de la base de datos",
      "relation": "la correspondencia entre los resultados de las pruebas y las condiciones de confiabilidad indicadas",
      "sourceRecordIds": [
        "ifc006-mf057-p-reliability",
        "ifc006-mf057-CE5.1.2"
      ],
      "pages": [
        29,
        33
      ]
    },
    {
      "id": "database-security",
      "grade": 5,
      "label": "Seguridad de la base de datos",
      "match": "seguridad de la base de datos",
      "relation": "la correspondencia entre los permisos observados y las condiciones de seguridad indicadas para la base de práctica",
      "sourceRecordIds": [
        "ifc006-mf057-p-security-confirmation",
        "ifc006-mf057-CE5.1.2"
      ],
      "pages": [
        29,
        33
      ],
      "requires": "\\b(?:verific\\w*|confirm\\w*)\\b"
    },
    {
      "id": "dba-documentation",
      "grade": 5,
      "label": "Documentación del DBA",
      "match": "documentacion que recibe y entrega el dba",
      "relation": "la función de la documentación recibida y entregada por el DBA sobre la estructura, la creación, el diccionario y los usuarios descritos",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.1.3"
      ],
      "pages": [
        29,
        30
      ]
    },
    {
      "id": "administration-resources",
      "grade": 5,
      "label": "Recursos de administración",
      "match": "medios de almacenamiento|recursos de administracion de bases? de datos",
      "relation": "la correspondencia entre las funciones de los recursos disponibles y las necesidades administrativas indicadas",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.1.4",
        "ifc006-mf057-p-tools-identification",
        "ifc006-mf057-p-resources"
      ],
      "pages": [
        30,
        32
      ]
    },
    {
      "id": "access-methods",
      "grade": 5,
      "label": "Métodos de acceso",
      "match": "metodos de acceso|mecanismos (?:odbc|de acceso)|metodo de acceso a la base",
      "relation": "la correspondencia entre las características del método de acceso, la configuración y el gestor descritos",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.2.1",
        "ifc006-mf057-p-access-identification",
        "ifc006-mf057-p-access-selection"
      ],
      "pages": [
        30,
        34
      ]
    },
    {
      "id": "access-odbc",
      "grade": 5,
      "label": "Acceso ODBC",
      "match": "metodo de acceso odbc",
      "relation": "la correspondencia entre el uso de ODBC en la simulación y la configuración de acceso indicada",
      "sourceRecordIds": [
        "ifc006-mf057-p-access-application"
      ],
      "pages": [
        33
      ]
    },
    {
      "id": "access-ado",
      "grade": 5,
      "label": "Acceso ADO",
      "match": "metodo de acceso ado",
      "relation": "la correspondencia entre el uso de ADO en la simulación y la configuración de acceso indicada",
      "sourceRecordIds": [
        "ifc006-mf057-p-access-application"
      ],
      "pages": [
        33
      ]
    },
    {
      "id": "access-dao",
      "grade": 5,
      "label": "Acceso DAO",
      "match": "metodo de acceso dao",
      "relation": "la correspondencia entre el uso de DAO en la simulación y la configuración de acceso indicada",
      "sourceRecordIds": [
        "ifc006-mf057-p-access-application"
      ],
      "pages": [
        33
      ]
    },
    {
      "id": "access-jdbc",
      "grade": 5,
      "label": "Acceso JDBC",
      "match": "metodo de acceso jdbc",
      "relation": "la correspondencia entre el uso de JDBC en la simulación y la configuración de acceso indicada",
      "sourceRecordIds": [
        "ifc006-mf057-p-access-application"
      ],
      "pages": [
        33
      ]
    },
    {
      "id": "access-isapi",
      "grade": 5,
      "label": "Acceso ISAPI",
      "match": "metodo de acceso isapi",
      "relation": "la correspondencia entre el uso de ISAPI en la simulación y la configuración de acceso indicada",
      "sourceRecordIds": [
        "ifc006-mf057-p-access-application"
      ],
      "pages": [
        33
      ]
    },
    {
      "id": "access-cgi",
      "grade": 5,
      "label": "Acceso CGI",
      "match": "metodo de acceso cgi",
      "relation": "la correspondencia entre el uso de CGI en la simulación y la configuración de acceso indicada",
      "sourceRecordIds": [
        "ifc006-mf057-p-access-application"
      ],
      "pages": [
        33
      ]
    },
    {
      "id": "access-rdo",
      "grade": 5,
      "label": "Acceso RDO",
      "match": "metodo de acceso rdo",
      "relation": "la correspondencia entre el uso de RDO en la simulación y la configuración de acceso indicada",
      "sourceRecordIds": [
        "ifc006-mf057-p-access-application"
      ],
      "pages": [
        33
      ]
    },
    {
      "id": "access-rds",
      "grade": 5,
      "label": "Acceso RDS",
      "match": "metodo de acceso rds",
      "relation": "la correspondencia entre el uso de RDS en la simulación y la configuración de acceso indicada",
      "sourceRecordIds": [
        "ifc006-mf057-p-access-application"
      ],
      "pages": [
        33
      ]
    },
    {
      "id": "database-structure",
      "grade": 5,
      "label": "Estructura de la base de datos",
      "match": "estructura de (?:tablas|la tabla|la base de datos)",
      "relation": "la correspondencia entre los campos, tablas o vistas expresamente solicitados y los requisitos de información dados",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.2.2"
      ],
      "pages": [
        30
      ],
      "requires": "\\b(?:analiz\\w*|modific\\w*)\\b"
    },
    {
      "id": "stored-procedures",
      "grade": 5,
      "label": "Procedimiento almacenado",
      "match": "procedimiento almacenado",
      "relation": "la relación entre la función del procedimiento almacenado proporcionado y el comportamiento descrito en el caso",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.2.2",
        "ifc006-mf057-c-structure"
      ],
      "pages": [
        30,
        33,
        34
      ]
    },
    {
      "id": "database-triggers",
      "grade": 5,
      "label": "Disparador de la base de datos",
      "match": "disparador",
      "relation": "la correspondencia entre el cambio solicitado al disparador, el evento indicado y el comportamiento que debe mantenerse",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.2.2",
        "ifc006-mf057-c-structure"
      ],
      "pages": [
        30,
        33,
        34
      ]
    },
    {
      "id": "conceptual-schema",
      "grade": 5,
      "label": "Esquema conceptual",
      "match": "esquema conceptual",
      "relation": "la correspondencia entre las entidades y relaciones del esquema dado y los requisitos de información solicitados",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.2.2",
        "ifc006-mf057-c-structure"
      ],
      "pages": [
        30,
        33,
        34
      ]
    },
    {
      "id": "database-documentation",
      "grade": 5,
      "label": "Documentación de la base de datos",
      "match": "documentacion de la estructura",
      "relation": "la correspondencia entre la documentación solicitada y la estructura y los cambios proporcionados de la base de práctica",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.2.3"
      ],
      "pages": [
        30
      ]
    },
    {
      "id": "access-documentation",
      "grade": 5,
      "label": "Documentación del acceso",
      "match": "metodo de acceso seleccionado y la estructura",
      "relation": "la correspondencia entre la documentación del método de acceso seleccionado y la estructura de la base de datos indicada",
      "sourceRecordIds": [
        "ifc006-mf057-p-access-documentation"
      ],
      "pages": [
        34
      ]
    },
    {
      "id": "data-activities-documentation",
      "grade": 5,
      "label": "Documentación de actividades",
      "match": "actividades que se realizaran con los datos",
      "relation": "la correspondencia entre las actividades de datos documentadas y el uso indicado en el caso ficticio",
      "sourceRecordIds": [
        "ifc006-mf057-p-data-activities-documentation",
        "ifc006-mf057-p-documents-activities",
        "ifc006-mf057-CE5.2.4"
      ],
      "pages": [
        30,
        34
      ]
    },
    {
      "id": "database-roles",
      "grade": 5,
      "label": "Roles de la base de datos",
      "match": "crea los roles|reestructura los roles|rol senalado",
      "relation": "la correspondencia entre el cambio de roles solicitado, los perfiles ficticios y los permisos que deben mantenerse",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.2.5",
        "ifc006-mf057-p-roles-changes"
      ],
      "pages": [
        30,
        34
      ],
      "relationsByMode": {
        "creation": "la correspondencia entre los roles creados, los permisos asignados a los objetos y los perfiles ficticios indicados"
      }
    },
    {
      "id": "security-policy",
      "grade": 5,
      "label": "Política de seguridad",
      "match": "configuracion de seguridad de los usuarios",
      "relation": "la relación entre las opciones de contraseñas y reintentos descritas y la política de seguridad de la ficha",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.2.6"
      ],
      "pages": [
        30
      ],
      "requires": "\\bdescrib\\w*\\b"
    },
    {
      "id": "database-creation",
      "grade": 5,
      "label": "Creación de la base de datos",
      "match": "crea la base de datos",
      "relation": "la correspondencia entre la base de práctica creada y la estructura y los datos ficticios solicitados",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.2.7",
        "ifc006-mf057-p-database-creation"
      ],
      "pages": [
        30,
        32
      ]
    },
    {
      "id": "database-users",
      "grade": 5,
      "label": "Usuarios de la base de datos",
      "match": "crea los usuarios ficticios",
      "relation": "la correspondencia entre los usuarios de la simulación, los roles asignados y los perfiles ficticios indicados",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.2.7",
        "ifc006-mf057-p-users-roles"
      ],
      "pages": [
        30,
        34
      ]
    },
    {
      "id": "user-types",
      "grade": 5,
      "label": "Tipos de usuarios",
      "match": "tipos de usuarios de bases? de datos",
      "relation": "la correspondencia entre los tipos de usuarios identificados y las funciones descritas en los perfiles ficticios",
      "sourceRecordIds": [
        "ifc006-mf057-p-user-identification",
        "ifc006-mf057-c-administration"
      ],
      "pages": [
        32,
        33
      ]
    },
    {
      "id": "database-privileges",
      "grade": 5,
      "label": "Privilegios de usuarios",
      "match": "privilegios que corresponden a cada usuario",
      "relation": "la correspondencia entre los privilegios identificados y las acciones permitidas a los usuarios ficticios",
      "sourceRecordIds": [
        "ifc006-mf057-p-privilege-identification"
      ],
      "pages": [
        32
      ]
    },
    {
      "id": "security-application",
      "grade": 5,
      "label": "Aplicación de seguridad",
      "match": "aplica los roles y la configuracion de seguridad",
      "relation": "la correspondencia entre los roles y opciones aplicados en la simulación y la configuración de seguridad indicada",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.2.7"
      ],
      "pages": [
        30
      ]
    },
    {
      "id": "data-migration",
      "grade": 5,
      "label": "Migración de datos",
      "match": "migracion de los datos",
      "relation": "la correspondencia entre los datos ficticios del destino, el mapeo solicitado y la conservación del origen",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.2.7"
      ],
      "pages": [
        30
      ]
    },
    {
      "id": "user-select",
      "grade": 5,
      "label": "Privilegio SELECT",
      "match": "privilegio select",
      "relation": "la correspondencia entre el alcance de SELECT y las acciones permitidas al usuario ficticio según la ficha",
      "sourceRecordIds": [
        "ifc006-mf057-p-user-privileges"
      ],
      "pages": [
        32
      ]
    },
    {
      "id": "user-insert",
      "grade": 5,
      "label": "Privilegio INSERT",
      "match": "privilegio insert",
      "relation": "la correspondencia entre el alcance de INSERT y las acciones permitidas al usuario ficticio según la ficha",
      "sourceRecordIds": [
        "ifc006-mf057-p-user-privileges"
      ],
      "pages": [
        32
      ]
    },
    {
      "id": "user-update",
      "grade": 5,
      "label": "Privilegio UPDATE",
      "match": "privilegio update",
      "relation": "la correspondencia entre el alcance de UPDATE y las acciones permitidas al usuario ficticio según la ficha",
      "sourceRecordIds": [
        "ifc006-mf057-p-user-privileges"
      ],
      "pages": [
        32
      ]
    },
    {
      "id": "user-alter",
      "grade": 5,
      "label": "Privilegio ALTER",
      "match": "privilegio alter",
      "relation": "la correspondencia entre el alcance de ALTER y las acciones permitidas al usuario ficticio según la ficha",
      "sourceRecordIds": [
        "ifc006-mf057-p-user-privileges"
      ],
      "pages": [
        32
      ]
    },
    {
      "id": "user-create",
      "grade": 5,
      "label": "Privilegio CREATE",
      "match": "privilegio create",
      "relation": "la correspondencia entre el alcance de CREATE y las acciones permitidas al usuario ficticio según la ficha",
      "sourceRecordIds": [
        "ifc006-mf057-p-user-privileges"
      ],
      "pages": [
        32
      ]
    },
    {
      "id": "user-drop",
      "grade": 5,
      "label": "Privilegio DROP",
      "match": "privilegio drop",
      "relation": "la correspondencia entre el alcance de DROP y las acciones permitidas al usuario ficticio según la ficha",
      "sourceRecordIds": [
        "ifc006-mf057-p-user-privileges"
      ],
      "pages": [
        32
      ]
    },
    {
      "id": "admin-file",
      "grade": 5,
      "label": "Privilegio administrativo FILE",
      "match": "privilegio administrativo file",
      "relation": "la relación entre la función administrativa de FILE y el alcance descrito en la ficha del gestor",
      "sourceRecordIds": [
        "ifc006-mf057-p-administrator-privileges"
      ],
      "pages": [
        33
      ]
    },
    {
      "id": "admin-process",
      "grade": 5,
      "label": "Privilegio administrativo PROCESS",
      "match": "privilegio administrativo process",
      "relation": "la relación entre la función administrativa de PROCESS y el alcance descrito en la ficha del gestor",
      "sourceRecordIds": [
        "ifc006-mf057-p-administrator-privileges"
      ],
      "pages": [
        33
      ]
    },
    {
      "id": "admin-reload",
      "grade": 5,
      "label": "Privilegio administrativo RELOAD",
      "match": "privilegio administrativo reload",
      "relation": "la relación entre la función administrativa de RELOAD y el alcance descrito en la ficha del gestor",
      "sourceRecordIds": [
        "ifc006-mf057-p-administrator-privileges"
      ],
      "pages": [
        33
      ]
    },
    {
      "id": "admin-grant",
      "grade": 5,
      "label": "Privilegio administrativo GRANT",
      "match": "privilegio administrativo grant",
      "relation": "la relación entre la función administrativa de GRANT y el alcance descrito en la ficha del gestor",
      "sourceRecordIds": [
        "ifc006-mf057-p-administrator-privileges"
      ],
      "pages": [
        33
      ]
    },
    {
      "id": "admin-revoke",
      "grade": 5,
      "label": "Privilegio administrativo REVOKE",
      "match": "privilegio administrativo revoke",
      "relation": "la relación entre la función administrativa de REVOKE y el alcance descrito en la ficha del gestor",
      "sourceRecordIds": [
        "ifc006-mf057-p-administrator-privileges"
      ],
      "pages": [
        33
      ]
    },
    {
      "id": "admin-shutdown",
      "grade": 5,
      "label": "Privilegio administrativo SHUTDOWN",
      "match": "privilegio administrativo shutdown",
      "relation": "la relación entre la función administrativa de SHUTDOWN y el alcance descrito en la ficha del gestor",
      "sourceRecordIds": [
        "ifc006-mf057-p-administrator-privileges"
      ],
      "pages": [
        33
      ]
    },
    {
      "id": "special-all",
      "grade": 5,
      "label": "Privilegio especial ALL",
      "match": "privilegio especial all",
      "relation": "la correspondencia entre el alcance del privilegio ALL y las condiciones descritas en la ficha del gestor",
      "sourceRecordIds": [
        "ifc006-mf057-p-special-privileges"
      ],
      "pages": [
        33
      ]
    },
    {
      "id": "special-usage",
      "grade": 5,
      "label": "Privilegio especial USAGE",
      "match": "privilegio especial usage",
      "relation": "la correspondencia entre el alcance del privilegio USAGE y las condiciones descritas en la ficha del gestor",
      "sourceRecordIds": [
        "ifc006-mf057-p-special-privileges"
      ],
      "pages": [
        33
      ]
    },
    {
      "id": "system-create-session",
      "grade": 5,
      "label": "Privilegio de sistema CREATE SESSION",
      "match": "privilegio de sistema create session",
      "relation": "la correspondencia entre el alcance de CREATE SESSION y las acciones permitidas según la ficha del gestor",
      "sourceRecordIds": [
        "ifc006-mf057-p-system-privileges"
      ],
      "pages": [
        33
      ]
    },
    {
      "id": "system-create-table",
      "grade": 5,
      "label": "Privilegio de sistema CREATE TABLE",
      "match": "privilegio de sistema create table",
      "relation": "la correspondencia entre el alcance de CREATE TABLE y las acciones permitidas según la ficha del gestor",
      "sourceRecordIds": [
        "ifc006-mf057-p-system-privileges"
      ],
      "pages": [
        33
      ]
    },
    {
      "id": "system-create-sequence",
      "grade": 5,
      "label": "Privilegio de sistema CREATE SEQUENCE",
      "match": "privilegio de sistema create sequence",
      "relation": "la correspondencia entre el alcance de CREATE SEQUENCE y las acciones permitidas según la ficha del gestor",
      "sourceRecordIds": [
        "ifc006-mf057-p-system-privileges"
      ],
      "pages": [
        33
      ]
    },
    {
      "id": "system-create-view",
      "grade": 5,
      "label": "Privilegio de sistema CREATE VIEW",
      "match": "privilegio de sistema create view",
      "relation": "la correspondencia entre el alcance de CREATE VIEW y las acciones permitidas según la ficha del gestor",
      "sourceRecordIds": [
        "ifc006-mf057-p-system-privileges"
      ],
      "pages": [
        33
      ]
    },
    {
      "id": "system-create-trigger",
      "grade": 5,
      "label": "Privilegio de sistema CREATE TRIGGER",
      "match": "privilegio de sistema create trigger",
      "relation": "la correspondencia entre el alcance de CREATE TRIGGER y las acciones permitidas según la ficha del gestor",
      "sourceRecordIds": [
        "ifc006-mf057-p-system-privileges"
      ],
      "pages": [
        33
      ]
    },
    {
      "id": "system-create-procedure",
      "grade": 5,
      "label": "Privilegio de sistema CREATE PROCEDURE",
      "match": "privilegio de sistema create procedure",
      "relation": "la correspondencia entre el alcance de CREATE PROCEDURE y las acciones permitidas según la ficha del gestor",
      "sourceRecordIds": [
        "ifc006-mf057-p-system-privileges"
      ],
      "pages": [
        33
      ]
    },
    {
      "id": "system-execute-any-procedure",
      "grade": 5,
      "label": "Privilegio de sistema EXECUTE ANY PROCEDURE",
      "match": "privilegio de sistema execute any procedure",
      "relation": "la correspondencia entre el alcance de EXECUTE ANY PROCEDURE y las acciones permitidas según la ficha del gestor",
      "sourceRecordIds": [
        "ifc006-mf057-p-system-privileges"
      ],
      "pages": [
        33
      ]
    },
    {
      "id": "system-create-user",
      "grade": 5,
      "label": "Privilegio de sistema CREATE USER",
      "match": "privilegio de sistema create user",
      "relation": "la correspondencia entre el alcance de CREATE USER y las acciones permitidas según la ficha del gestor",
      "sourceRecordIds": [
        "ifc006-mf057-p-system-privileges"
      ],
      "pages": [
        33
      ]
    },
    {
      "id": "system-create-role",
      "grade": 5,
      "label": "Privilegio de sistema CREATE ROLE",
      "match": "privilegio de sistema create role",
      "relation": "la correspondencia entre el alcance de CREATE ROLE y las acciones permitidas según la ficha del gestor",
      "sourceRecordIds": [
        "ifc006-mf057-p-system-privileges"
      ],
      "pages": [
        33
      ]
    },
    {
      "id": "system-drop-user",
      "grade": 5,
      "label": "Privilegio de sistema DROP USER",
      "match": "privilegio de sistema drop user",
      "relation": "la correspondencia entre el alcance de DROP USER y las acciones permitidas según la ficha del gestor",
      "sourceRecordIds": [
        "ifc006-mf057-p-system-privileges"
      ],
      "pages": [
        33
      ]
    },
    {
      "id": "backup-schema",
      "grade": 5,
      "label": "Esquema y frecuencia de respaldo",
      "match": "esquema y la frecuencia de respaldo",
      "relation": "la correspondencia entre el esquema y la frecuencia de respaldo identificados y los requerimientos y ventanas disponibles",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.3.1",
        "ifc006-mf057-p-backup-schema"
      ],
      "pages": [
        30,
        34
      ]
    },
    {
      "id": "backup-types",
      "grade": 5,
      "label": "Tipos de respaldo",
      "match": "respaldos de bases? de datos completos|tipo de respaldo",
      "relation": "la correspondencia entre las características de los tipos de respaldo considerados y la necesidad indicada",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.3.1",
        "ifc006-mf057-p-backup-identification",
        "ifc006-mf057-p-backup-options",
        "ifc006-mf057-p-backup-selection"
      ],
      "pages": [
        30,
        34
      ]
    },
    {
      "id": "backup-full",
      "grade": 5,
      "label": "Respaldo completo",
      "match": "respaldo completo",
      "relation": "la correspondencia entre el respaldo completo identificado y sus características en la secuencia de copias ficticias dada",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.3.1",
        "ifc006-mf057-p-backup-identification"
      ],
      "pages": [
        30,
        34
      ]
    },
    {
      "id": "backup-log",
      "grade": 5,
      "label": "Respaldo del log",
      "match": "respaldo del log",
      "relation": "la correspondencia entre el respaldo del log identificado y sus características en la secuencia de copias ficticias dada",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.3.1",
        "ifc006-mf057-p-backup-identification"
      ],
      "pages": [
        30,
        34
      ]
    },
    {
      "id": "backup-differential",
      "grade": 5,
      "label": "Respaldo diferencial",
      "match": "respaldo diferencial",
      "relation": "la correspondencia entre el respaldo diferencial identificado y sus características en la secuencia de copias ficticias dada",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.3.1",
        "ifc006-mf057-p-backup-identification"
      ],
      "pages": [
        30,
        34
      ]
    },
    {
      "id": "backup-incremental",
      "grade": 5,
      "label": "Respaldo incremental",
      "match": "respaldo incremental",
      "relation": "la correspondencia entre el respaldo incremental identificado y sus características en la secuencia de copias ficticias dada",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.3.1",
        "ifc006-mf057-p-backup-identification"
      ],
      "pages": [
        30,
        34
      ]
    },
    {
      "id": "backup-limits",
      "grade": 5,
      "label": "Limitaciones del respaldo",
      "match": "limitaciones del respaldo",
      "relation": "la relación entre las limitaciones del respaldo identificadas y el espacio, el tiempo y las condiciones dados",
      "sourceRecordIds": [
        "ifc006-mf057-p-backup-limits"
      ],
      "pages": [
        34
      ]
    },
    {
      "id": "backup-time",
      "grade": 5,
      "label": "Horario del respaldo",
      "match": "horario del respaldo",
      "relation": "la correspondencia entre el horario seleccionado para el respaldo y el uso y las ventanas de disponibilidad indicados",
      "sourceRecordIds": [
        "ifc006-mf057-p-backup-time"
      ],
      "pages": [
        34
      ]
    },
    {
      "id": "backup-alerts",
      "grade": 5,
      "label": "Alertas de respaldo",
      "match": "alertas? de seguimiento de(?:l| los)? respaldos?|alertas y notificaciones de respaldo",
      "relation": "la correspondencia entre las alertas de respaldo solicitadas, el evento de seguimiento y las condiciones de notificación de la ficha",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.3.2",
        "ifc006-mf057-p-backup-alert-identification",
        "ifc006-mf057-p-backup-alert-creation"
      ],
      "pages": [
        30,
        34
      ]
    },
    {
      "id": "backup-creation",
      "grade": 5,
      "label": "Creación del respaldo",
      "match": "implementa el respaldo",
      "relation": "la correspondencia entre el respaldo de práctica realizado y la estrategia y los estándares indicados",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.3.3",
        "ifc006-mf057-p-backup-creation"
      ],
      "pages": [
        31,
        34
      ],
      "application": "El respaldo de práctica conserva los datos ficticios y las opciones solicitados en la estrategia indicada."
    },
    {
      "id": "backup-restoration",
      "grade": 5,
      "label": "Restauración de la copia",
      "match": "restaura (?:la copia|el respaldo)",
      "relation": "la correspondencia entre los datos restaurados en el destino de práctica, la copia indicada y la conservación del origen",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.3.3",
        "ifc006-mf057-p-backup-restoration"
      ],
      "pages": [
        31,
        34
      ],
      "application": "El destino de práctica contiene los datos de la copia indicada y el origen se conserva según lo solicitado."
    },
    {
      "id": "disk-types",
      "grade": 5,
      "label": "Tipos de arreglos de discos",
      "match": "tipos de arreglos de discos|arreglo de discos del servidor",
      "relation": "la correspondencia entre la organización del arreglo de discos y las condiciones indicadas de almacenamiento",
      "sourceRecordIds": [
        "ifc006-mf057-p-disk-types",
        "ifc006-mf057-p-disk-selection"
      ],
      "pages": [
        35
      ]
    },
    {
      "id": "raid-zero",
      "grade": 5,
      "label": "Arreglo RAID0",
      "match": "raid0(?!\\+|[0-9])",
      "relation": "la correspondencia entre la organización del arreglo RAID0 y el diagrama proporcionado",
      "sourceRecordIds": [
        "ifc006-mf057-p-disk-types"
      ],
      "pages": [
        35
      ]
    },
    {
      "id": "raid-one",
      "grade": 5,
      "label": "Arreglo RAID1",
      "match": "raid1(?!\\+|[0-9])",
      "relation": "la correspondencia entre la organización del arreglo RAID1 y el diagrama proporcionado",
      "sourceRecordIds": [
        "ifc006-mf057-p-disk-types"
      ],
      "pages": [
        35
      ]
    },
    {
      "id": "raid-five",
      "grade": 5,
      "label": "Arreglo RAID5",
      "match": "raid5(?!\\+|[0-9])",
      "relation": "la correspondencia entre la organización del arreglo RAID5 y el diagrama proporcionado",
      "sourceRecordIds": [
        "ifc006-mf057-p-disk-types"
      ],
      "pages": [
        35
      ]
    },
    {
      "id": "raid-ten-distinction",
      "grade": 5,
      "label": "RAID10 frente a RAID0+1",
      "match": "raid10|raid0\\+1",
      "relation": "la distinción entre la organización de RAID10 y RAID0+1 según los diagramas dados, sin tratarlos como equivalentes",
      "sourceRecordIds": [
        "ifc006-mf057-p-disk-types"
      ],
      "pages": [
        35
      ]
    },
    {
      "id": "disk-tools",
      "grade": 5,
      "label": "Herramientas de arreglos de discos",
      "match": "programas para definir arreglos",
      "relation": "la correspondencia entre los programas identificados y las funciones de definición de arreglos descritas",
      "sourceRecordIds": [
        "ifc006-mf057-p-disk-tools"
      ],
      "pages": [
        35
      ]
    },
    {
      "id": "disk-creation",
      "grade": 5,
      "label": "Creación del arreglo de discos",
      "match": "crea el arreglo de discos",
      "relation": "la correspondencia entre el arreglo creado en la simulación y el diseño de almacenamiento proporcionado",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.4.1",
        "ifc006-mf057-p-disk-configuration"
      ],
      "pages": [
        31,
        35
      ]
    },
    {
      "id": "disk-server-application",
      "grade": 5,
      "label": "Aplicación del arreglo al servidor",
      "match": "aplica el arreglo de discos creado",
      "relation": "la correspondencia entre el arreglo aplicado al servidor simulado y la configuración indicada",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.4.2"
      ],
      "pages": [
        31
      ]
    },
    {
      "id": "database-disk-layout",
      "grade": 5,
      "label": "Ubicación de archivos",
      "match": "ubicacion de los archivos de datos",
      "relation": "la correspondencia entre la ubicación de los archivos expresamente solicitados y los discos indicados",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.4.3",
        "ifc006-mf057-p-database-disk-configuration",
        "ifc006-mf057-p-database-array-configuration"
      ],
      "pages": [
        31,
        35
      ],
      "facets": [
        {
          "id": "data",
          "label": "Disco de archivos de datos",
          "match": "archivos de datos",
          "relation": "la correspondencia entre la ubicación de los archivos de datos y el disco indicado en el diseño"
        },
        {
          "id": "log",
          "label": "Disco de archivos log",
          "match": "\\blog\\b",
          "relation": "la correspondencia entre la ubicación de los archivos log y el disco indicado en el diseño"
        },
        {
          "id": "temporary",
          "label": "Disco de archivos temporales",
          "match": "temporales",
          "relation": "la correspondencia entre la ubicación de los archivos temporales y el disco indicado en el diseño"
        }
      ]
    },
    {
      "id": "backup-disk-configuration",
      "grade": 5,
      "label": "Destino de los respaldos",
      "match": "destino de los respaldos en el disco",
      "relation": "la correspondencia entre el disco de destino configurado en la simulación y la ubicación de respaldos solicitada",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.4.4",
        "ifc006-mf057-p-database-disk-configuration"
      ],
      "pages": [
        31,
        35
      ]
    },
    {
      "id": "monitor-alerts",
      "grade": 5,
      "label": "Alertas del comportamiento",
      "match": "alertas del comportamiento|crea las alertas de la base de datos",
      "relation": "la correspondencia entre las alertas del comportamiento, los eventos y las condiciones de notificación indicados",
      "sourceRecordIds": [
        "ifc006-mf057-p-monitor-alert-identification",
        "ifc006-mf057-CE5.5.1",
        "ifc006-mf057-p-monitor-alert-creation"
      ],
      "pages": [
        31,
        35
      ]
    },
    {
      "id": "monitor-alert-documentation",
      "grade": 5,
      "label": "Documentación de alertas",
      "match": "documenta las alertas y notificaciones",
      "relation": "la correspondencia entre las alertas documentadas y los eventos y condiciones que requieren seguimiento",
      "sourceRecordIds": [
        "ifc006-mf057-p-monitor-alert-documentation"
      ],
      "pages": [
        35
      ]
    },
    {
      "id": "monitor-data-space",
      "grade": 5,
      "label": "Espacio libre de archivos",
      "match": "porcentaje de espacio libre",
      "relation": "la correspondencia entre la alerta configurada en la simulación y el umbral de espacio libre de los archivos de datos",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.5.1"
      ],
      "pages": [
        31
      ],
      "requires": "\\b(?:establece|crea|configura)\\b"
    },
    {
      "id": "monitor-log-events",
      "grade": 5,
      "label": "Eventos del log",
      "match": "eventos del log",
      "relation": "la correspondencia entre la alerta configurada en la simulación y los eventos del log indicados",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.5.1"
      ],
      "pages": [
        31
      ],
      "requires": "\\b(?:establece|crea|configura)\\b"
    },
    {
      "id": "monitor-transaction-locks",
      "grade": 5,
      "label": "Bloqueos de transacciones",
      "match": "bloqueos de las transacciones",
      "relation": "la correspondencia entre la alerta configurada en la simulación y los bloqueos de transacciones indicados",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.5.1"
      ],
      "pages": [
        31
      ],
      "requires": "\\b(?:establece|crea|configura)\\b"
    },
    {
      "id": "monitor-disk-space",
      "grade": 5,
      "label": "Espacio en disco",
      "match": "falta de espacio en disco",
      "relation": "la correspondencia entre la alerta configurada en la simulación y la condición de espacio en disco indicada",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.5.1"
      ],
      "pages": [
        31
      ],
      "requires": "\\b(?:establece|crea|configura)\\b"
    },
    {
      "id": "monitor-system-resources",
      "grade": 5,
      "label": "Uso de CPU y memoria",
      "match": "alto uso de cpu y memoria",
      "relation": "la correspondencia entre la alerta configurada en la simulación y los umbrales de CPU y memoria indicados",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.5.1"
      ],
      "pages": [
        31
      ],
      "requires": "\\b(?:establece|crea|configura)\\b"
    },
    {
      "id": "monitor-engine-unavailable",
      "grade": 5,
      "label": "Disponibilidad del motor",
      "match": "indisponibilidad del motor",
      "relation": "la correspondencia entre la alerta configurada en la simulación y la condición de disponibilidad del motor indicada",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.5.1"
      ],
      "pages": [
        31
      ],
      "requires": "\\b(?:establece|crea|configura)\\b"
    },
    {
      "id": "database-monitoring",
      "grade": 5,
      "label": "Monitoreo de la base de datos",
      "match": "monitorea la base de datos",
      "relation": "la correspondencia entre los datos observados con la herramienta y los límites dados de consultas, bloqueos y uso de recursos",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.5.2",
        "ifc006-mf057-p-monitor-tools"
      ],
      "pages": [
        31,
        35
      ]
    },
    {
      "id": "alert-response-automation",
      "grade": 5,
      "label": "Respuesta automática a alertas",
      "match": "respuesta a la alerta de crecimiento",
      "relation": "la correspondencia entre la respuesta automática de la simulación y la regla dada para el crecimiento de archivos",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.5.3"
      ],
      "pages": [
        31
      ]
    },
    {
      "id": "old-backup-cleanup",
      "grade": 5,
      "label": "Política de respaldos antiguos",
      "match": "limpieza de respaldos antiguos",
      "relation": "la correspondencia entre las copias que deben conservarse y la política dada de limpieza de respaldos antiguos",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.5.3"
      ],
      "pages": [
        31
      ],
      "relationsByMode": {
        "analysis": "la relación entre la política de retención de respaldos y las condiciones descritas en el caso ficticio",
        "selection": "la correspondencia entre las copias que deben conservarse y la política dada de limpieza de respaldos antiguos"
      }
    },
    {
      "id": "notification-automation",
      "grade": 5,
      "label": "Notificación automática",
      "match": "simulacion de envio de alertas",
      "relation": "la correspondencia entre la notificación simulada, los eventos y los destinatarios ficticios indicados",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.5.3"
      ],
      "pages": [
        31
      ]
    },
    {
      "id": "updates-review",
      "grade": 5,
      "label": "Revisión de actualizaciones",
      "match": "ficha de actualizaciones disponibles",
      "relation": "la correspondencia entre las actualizaciones revisadas del motor y del sistema operativo y el período indicado",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.6.1"
      ],
      "pages": [
        31
      ]
    },
    {
      "id": "review-periods",
      "grade": 5,
      "label": "Períodos de revisión",
      "match": "periodos de revision",
      "relation": "la correspondencia entre los períodos de revisión establecidos y las condiciones de uso del hardware y software descritos",
      "sourceRecordIds": [
        "ifc006-mf057-p-review-periods"
      ],
      "pages": [
        35
      ]
    },
    {
      "id": "maintenance-components",
      "grade": 5,
      "label": "Componentes que requieren mantenimiento",
      "match": "hardware y el software del servidor",
      "relation": "la correspondencia entre los componentes identificados y las necesidades de mantenimiento o actualización del diagnóstico",
      "sourceRecordIds": [
        "ifc006-mf057-p-hardware-identification"
      ],
      "pages": [
        36
      ]
    },
    {
      "id": "maintenance-tools",
      "grade": 5,
      "label": "Herramientas de mantenimiento",
      "match": "herramientas de mantenimiento",
      "relation": "la correspondencia entre las funciones de las herramientas elegidas y la tarea de mantenimiento indicada",
      "sourceRecordIds": [
        "ifc006-mf057-p-maintenance-tools"
      ],
      "pages": [
        36
      ]
    },
    {
      "id": "updates-need",
      "grade": 5,
      "label": "Necesidad de actualización",
      "match": "necesario aplicar la actualizacion",
      "relation": "la correspondencia entre la decisión de actualizar y las incidencias y compatibilidades proporcionadas",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.6.2",
        "ifc006-mf057-p-maintenance-need"
      ],
      "pages": [
        31,
        36
      ]
    },
    {
      "id": "updates-environment",
      "grade": 5,
      "label": "Ambiente de actualización",
      "match": "en que ambiente conviene realizar la actualizacion",
      "relation": "la correspondencia entre el ambiente propuesto y los riesgos y requisitos dados de la actualización",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.6.3",
        "ifc006-mf057-p-maintenance-environment"
      ],
      "pages": [
        31,
        36
      ]
    },
    {
      "id": "updates-testing",
      "grade": 5,
      "label": "Prueba de la actualización",
      "match": "prueba la actualizacion del motor",
      "relation": "la correspondencia entre las pruebas de actualización en la simulación y el funcionamiento requerido de la base y las aplicaciones ficticias",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.6.4",
        "ifc006-mf057-p-maintenance-application"
      ],
      "pages": [
        31,
        32,
        36
      ]
    },
    {
      "id": "production-update-analysis",
      "grade": 5,
      "label": "Plan de actualización del caso",
      "match": "plan de aplicacion de actualizaciones",
      "relation": "la correspondencia entre el plan del ambiente ficticio, las pruebas previas y los requisitos de funcionamiento dados",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.6.4"
      ],
      "pages": [
        31,
        32
      ]
    },
    {
      "id": "maintenance-plan",
      "grade": 5,
      "label": "Plan de mantenimiento",
      "match": "plan de mantenimiento",
      "relation": "la correspondencia entre el plan solicitado, el diagnóstico y las acciones de mantenimiento expresamente indicadas",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.7.1"
      ],
      "pages": [
        32
      ],
      "facets": [
        {
          "id": "indices",
          "label": "Plan de índices",
          "match": "reindexacion|recreacion de (?:los )?indices|\\bindices\\b",
          "relation": "la adecuación de la acción de índices prevista en el plan al diagnóstico proporcionado"
        },
        {
          "id": "statistics",
          "label": "Plan de estadísticas",
          "match": "estadisticas",
          "relation": "la correspondencia entre la actualización de estadísticas prevista en el plan y la necesidad indicada en el diagnóstico"
        },
        {
          "id": "consistency",
          "label": "Plan de consistencia",
          "match": "consistencia",
          "relation": "la correspondencia entre las comprobaciones de consistencia previstas en el plan y las condiciones indicadas en el diagnóstico"
        }
      ]
    },
    {
      "id": "maintenance-plan-documentation",
      "grade": 5,
      "label": "Documentación del plan",
      "match": "documenta el plan de mantenimiento",
      "relation": "la correspondencia entre el plan documentado y las actividades y períodos indicados para futuras consultas",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.7.2"
      ],
      "pages": [
        32
      ],
      "suppresses": [
        "maintenance-plan"
      ]
    },
    {
      "id": "server-communication",
      "grade": 5,
      "label": "Comunicación entre servidores",
      "match": "comunicacion entre el servidor|pruebas de comunicacion",
      "relation": "la correspondencia entre los resultados de comunicación de los servidores simulados y las condiciones de red dadas",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.7.3",
        "ifc006-mf057-p-maintenance-application"
      ],
      "pages": [
        32,
        36
      ]
    },
    {
      "id": "server-response",
      "grade": 5,
      "label": "Tiempo de respuesta entre servidores",
      "match": "tiempos? de respuesta entre los servidores|pruebas de comunicacion y tiempo de respuesta",
      "relation": "la correspondencia entre los tiempos de respuesta de los servidores simulados y los límites proporcionados",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.7.4",
        "ifc006-mf057-p-server-tests"
      ],
      "pages": [
        32,
        36,
        37
      ]
    },
    {
      "id": "table-recovery",
      "grade": 5,
      "label": "Recuperación de tablas",
      "match": "recuperacion de la tabla",
      "relation": "la correspondencia entre la tabla recuperada en la simulación y los datos ficticios y el procedimiento indicados",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.7.5",
        "ifc006-mf057-p-maintenance-application"
      ],
      "pages": [
        32,
        36
      ]
    },
    {
      "id": "lock-removal",
      "grade": 5,
      "label": "Eliminación del bloqueo",
      "match": "elimina el bloqueo de la transaccion",
      "relation": "la correspondencia entre la eliminación del bloqueo indicado en la simulación y la conservación de las operaciones válidas",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.7.5",
        "ifc006-mf057-p-maintenance-application"
      ],
      "pages": [
        32,
        36
      ]
    },
    {
      "id": "database-statistics",
      "grade": 5,
      "label": "Estadísticas de la base de datos",
      "match": "estadisticas de la base de datos|datos estadisticos de la base de datos",
      "relation": "la correspondencia entre los datos estadísticos solicitados y las condiciones indicadas para decidir acciones futuras",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.7.5",
        "ifc006-mf057-p-statistics-update",
        "ifc006-mf057-p-statistics-identification"
      ],
      "pages": [
        32,
        36,
        37
      ]
    },
    {
      "id": "point-in-time-recovery",
      "grade": 5,
      "label": "Recuperación a un punto en el tiempo",
      "match": "punto en el tiempo",
      "relation": "la correspondencia entre el estado recuperado en la simulación, el momento solicitado y las copias ficticias dadas",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.7.5"
      ],
      "pages": [
        32
      ]
    },
    {
      "id": "table-consistency",
      "grade": 5,
      "label": "Consistencia de tablas",
      "match": "consistencia de las tablas",
      "relation": "la correspondencia entre los resultados de las tablas y las reglas de integridad proporcionadas",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.7.5"
      ],
      "pages": [
        32
      ]
    },
    {
      "id": "disk-consistency",
      "grade": 5,
      "label": "Consistencia de discos",
      "match": "consistencia de los discos",
      "relation": "la correspondencia entre el diagnóstico de los discos simulados y las condiciones de consistencia indicadas",
      "sourceRecordIds": [
        "ifc006-mf057-CE5.7.5"
      ],
      "pages": [
        32
      ]
    },
    {
      "id": "system-documentation",
      "grade": 5,
      "label": "Documentación de actividades del sistema",
      "match": "actividades del sistema de bases? de datos",
      "relation": "la correspondencia entre las actividades del sistema documentadas y los registros ficticios proporcionados",
      "sourceRecordIds": [
        "ifc006-mf057-p-system-documentation",
        "ifc006-mf057-p-maintenance-application"
      ],
      "pages": [
        36
      ]
    },
    {
      "id": "database-indexes",
      "grade": 5,
      "label": "Verificación de índices",
      "match": "indices de la base de datos",
      "relation": "la correspondencia entre las condiciones de los índices y la necesidad indicada de reindexación o recreación",
      "sourceRecordIds": [
        "ifc006-mf057-p-index-verification"
      ],
      "pages": [
        36
      ]
    },
    {
      "id": "query-planning",
      "grade": 5,
      "label": "Planificación de consultas",
      "match": "nuevas consultas de la base de datos",
      "relation": "la correspondencia entre las consultas planificadas, las necesidades futuras y las condiciones de funcionamiento dadas",
      "sourceRecordIds": [
        "ifc006-mf057-p-query-planning",
        "ifc006-mf057-p-maintenance-application"
      ],
      "pages": [
        36
      ]
    },
    {
      "id": "server-corrections",
      "grade": 5,
      "label": "Correcciones del servidor",
      "match": "correcciones del servidor",
      "relation": "la correspondencia entre las correcciones realizadas en la simulación, las pruebas dadas y el funcionamiento que debe conservarse",
      "sourceRecordIds": [
        "ifc006-mf057-p-server-corrections"
      ],
      "pages": [
        37
      ]
    },
    {
      "id": "statistics-scheduling",
      "grade": 5,
      "label": "Programación del análisis estadístico",
      "match": "analisis periodico de los datos estadisticos",
      "relation": "la correspondencia entre la programación del análisis estadístico en la simulación y los períodos y condiciones indicados",
      "sourceRecordIds": [
        "ifc006-mf057-p-statistics-scheduling"
      ],
      "pages": [
        37
      ],
      "suppresses": [
        "database-statistics"
      ]
    },
    {
      "id": "correction-documentation",
      "grade": 5,
      "label": "Documentación de correcciones",
      "match": "documenta las correcciones",
      "relation": "la correspondencia entre las correcciones documentadas, las pruebas y los cambios proporcionados para futuras consultas",
      "sourceRecordIds": [
        "ifc006-mf057-p-correction-documentation"
      ],
      "pages": [
        37
      ],
      "suppresses": [
        "server-corrections"
      ]
    }
  ]
}
