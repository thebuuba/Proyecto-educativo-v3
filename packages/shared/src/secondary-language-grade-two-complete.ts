import {affirmativeLanguageTask,requestedLanguageFeatures,languageFeatureCriterion,explicitWritingProcess} from './language-feature-criteria'
import {languageReadingProcedures,languageWritingProcedures,languagePlaceClassification} from './language-procedure-criteria'
import {specializePunctuation} from './language-procedure-completion'
import {secondGradeLanguageFeatures} from './secondary-language-grade-two-features'
import {secondGradeNewsCriteria as newsCore} from './secondary-news-grade-two'
import {topicTaskMode} from './secondary-language-topics'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'

const profiles:Record<string,{genre:string;reading:string;plan:string}>={
  noticia:{genre:'noticia',reading:'el hecho y los datos principales de la noticia',plan:'la relación entre titular, entrada y desarrollo de los datos'},
  'guia-turistica':{genre:'guía turística',reading:'los lugares y las indicaciones de la guía',plan:'el orden de la información sobre los lugares y las indicaciones al visitante'},
  'articulo-expositivo':{genre:'artículo expositivo',reading:'el problema y la solución explicada en el artículo',plan:'la relación entre el problema, su explicación y las soluciones'},
  'informe-de-lectura':{genre:'informe de lectura',reading:'la interpretación y los apoyos del informe',plan:'la relación entre resumen, interpretación y ejemplos del texto leído'},
  'cuento-amor-amistad':{genre:'cuento de amor y amistad',reading:'los hechos disponibles y las relaciones entre los personajes del cuento',plan:'la secuencia del conflicto y las acciones motivadas de los personajes'},
  'decima-espinela':{genre:'décima espinela',reading:'el tema y las imágenes expresadas por los versos de la décima',plan:'la organización del tema en los versos y sus relaciones sonoras'},
}

export function completeSecondGradeLanguageCriteria(id:string,activity:string,description:string,base:ContextualTopicCriterion[]):ContextualTopicCriterion[] {
  const profile=profiles[id]
  if(!profile)return base
  const scope=id==='noticia'?'news':`len-2-${id}`,task=affirmativeLanguageTask(description),mode=topicTaskMode(activity)
  const oralCreation=mode==='ORAL'&&(/\b(?:produc|elabor|cre|compon)\w*/.test(task)||id==='informe-de-lectura'&&/expon|exposicion/.test(task))
  const producing=mode==='PRODUCTION'||mode==='REPORT'&&id==='informe-de-lectura'||oralCreation
  const reciting=mode==='ORAL'&&/recit|declam/.test(task)
  const oralProduction=mode==='ORAL'&&/narr|emple|utiliz|us(?:ar|aran|ando)|incorpor/.test(task)
  let features=requestedLanguageFeatures(secondGradeLanguageFeatures[id],description).map(f=>specializePunctuation(f,description))
  if(/subjuntivo/.test(task)&&!/indicativo/.test(task))features=features.filter(f=>f.id!=='indicative')
  if(features.some(f=>f.id==='punctuation'))features=features.filter(f=>f.id!=='signs')
  let rows=[...base]
  const focal=/\b(?:solo|unicamente|exclusivamente)\b/.test(task)
  if(features.length) {
    const core=/funcion|estructura|datos|titular|entrada|cuerpo|problema|solucion|ideas principales|resumen|personajes|ambiente|conflicto|tema del|sentido global|versos octosilabos/.test(task)
    if(focal||!producing&&mode!=='ORAL'&&!core)rows=[]
    else rows=rows.filter(r=>!/-language$|-expression$|-spatial$/.test(r.templateId))
    rows.push(...features.map(f=>languageFeatureCriterion(f,scope,profile.genre,mode==='COMPARISON'?'comparison':reciting?'recitation':oralCreation||oralProduction?'oral-production':producing?'production':'analysis')))
  }
  if(mode==='ANALYSIS'||mode==='REPORT'&&!producing) {
    const reading=languageReadingProcedures(description,scope,profile.genre,profile.reading).map(row=>({...row,templateId:row.templateId.replace(/^guide-/,scope+'-')}))
    if(reading.length) {
      if(!/(?:analiz|identific|explic|interpret|reconoc)\w*.*(?:estructura|personajes|recursos|tema|problema|parrafos)/.test(task))rows=rows.filter(r=>r.templateId.includes('-feature-'))
      rows.push(...reading)
    }
  }
  if(producing) {
    const planning=languageWritingProcedures(description,scope,profile.genre,profile.plan)
    if(/planific/.test(task)&&!/redact|escrib|crearan/.test(task))rows=rows.filter(r=>r.templateId.includes('-feature-'))
    rows.push(...planning)
    if(!(focal&&features.length&&!/borrador|versiones|cambios|public/.test(task)))rows.push(...explicitWritingProcess(description,scope,profile.genre))
  }
  if(id==='guia-turistica'&&/clasific/.test(task)) {
    if(mode==='ANALYSIS'&&!/estructura|recursos/.test(task))rows=rows.filter(r=>r.templateId.includes('-feature-')||r.templateId.includes('-procedure-'))
    rows.push(...languagePlaceClassification(description).map(r=>({...r,templateId:r.templateId.replace(/^guide-/,scope+'-')})))
  }
  if(id==='guia-turistica'&&/mapas/.test(task)&&/fotografias/.test(task)) {
    const resources=/mapas\s+o\s+fotografias|fotografias\s+o\s+mapas/.test(task)?'mapas o fotografías':'mapas y fotografías'
    rows=rows.map(row=>row.templateId.endsWith('-graphics')?{...row,
      observable:`${producing?'Incorpora':'Interpreta'} ${resources} relacionándolos con los lugares y las indicaciones de la guía turística.`,
      progressionLevels:[`Los ${resources} permiten reconocer los lugares y sus relaciones con las indicaciones de la guía.`,
        'Los recursos corresponden a los lugares; una referencia necesita explicarse.',
        'Muestra recursos pertinentes sin establecer su relación con las indicaciones de la guía.',
        'Los recursos sitúan un lugar o una indicación de manera incompatible con la guía.',
        'No aporta evidencia de la relación de los recursos solicitados con los lugares de la guía.'],
    }:row)
  }
  if(id==='articulo-expositivo'&&/cuadro sinoptico|organizador grafico|esquema/.test(task)&&!producing&&mode!=='ORAL')rows.push({
    templateId:`${scope}-procedure-organizer`,title:'Representación de la comprensión',weight:4,
    observable:`Organiza ${/cuadro sinoptico/.test(task)?'un cuadro sinóptico':'la representación solicitada'} que muestra el problema del artículo y la relación entre sus causas, explicaciones y soluciones disponibles.`,
    progressionLevels:['La representación distingue el problema y enlaza explicaciones y soluciones conforme al artículo leído.',
      'Distingue el problema y sus soluciones; una conexión con la explicación necesita aclararse.',
      'Enumera conceptos del artículo sin mostrar cómo se relacionan con el problema.',
      'La representación invierte una relación causal o atribuye al problema una solución de otro caso.',
      'No presenta una representación que permita reconocer las relaciones del artículo.'],
  })
  if(id==='articulo-expositivo'&&producing&&/citas|datos|graficos|audiovisual|fotograf|diagramas/.test(task)) {
    const support=[/citas?\s+o\s+datos?/.test(task)?'citas o datos':/citas/.test(task)?'citas':/datos/.test(task)?'datos':'',/graficos/.test(task)?'gráficos':'',/audiovisual/.test(task)?'apoyos audiovisuales':'',/fotograf/.test(task)?'fotografías':'',/diagramas/.test(task)?'diagramas':''].filter(Boolean).join(' y ')
    rows.push({templateId:`${scope}-procedure-supports`,title:'Apoyos de la explicación',weight:3,
      observable:`Relaciona ${support} con las afirmaciones del artículo para aclarar el problema y sus soluciones, manteniendo el sentido de la información utilizada.`,
      progressionLevels:[`Los apoyos solicitados (${support}) respaldan afirmaciones identificables y permiten comprender las relaciones del problema con sus soluciones.`,
        'Los apoyos corresponden al problema; queda implícita su relación con una afirmación.',
        'Incluye apoyos relacionados con el asunto sin explicar qué afirmaciones respaldan.',
        'Atribuye al apoyo una afirmación que contradice la información representada.',
        'No relaciona los apoyos solicitados con afirmaciones del artículo.'],
    })
  }
  if(activity==='RESEARCH') rows=[{
    templateId:`${scope}-research-information`,title:'Información pertinente para la investigación',weight:5,
    observable:`Selecciona información que permite desarrollar ${profile.plan}, distinguiendo datos documentados de interpretaciones propias.`,
    progressionLevels:[`La información seleccionada permite desarrollar ${profile.plan} y diferencia datos documentados de interpretaciones.`,
      'La información responde al propósito; una afirmación necesita distinguirse como dato o interpretación.',
      'Recopila información relacionada con el asunto, pero no muestra cómo responde al propósito.',
      'Atribuye al asunto datos de otro caso o presenta opiniones como hechos comprobados.',
      'No presenta información pertinente al propósito de la investigación.'],
  },{
    templateId:`${scope}-research-sources`,title:'Origen y contraste de la información',weight:4,
    observable:'Identifica las fuentes de los datos utilizados y comprueba que respaldan la información registrada.',
    progressionLevels:['Cada dato relevante puede relacionarse con una fuente identificable que lo respalda.',
      'Las fuentes respaldan la información; falta precisar el origen de un dato secundario.',
      'Enumera fuentes sin mostrar cuáles respaldan los datos registrados.',
      'Atribuye a una fuente un dato que no contiene o que contradice.',
      'No identifica fuentes que permitan comprobar los datos registrados.'],
  }]
  if(id==='cuento-amor-amistad'&&/fragmento/.test(task)&&!producing)rows=rows.map(row=>{
    if(!/conflict$|oral-story-sequence$/.test(row.templateId))return row
    return {...row,observable:'Explica el conflicto del fragmento de cuento de amor y amistad relacionando los hechos y las motivaciones disponibles.',progressionLevels:[
      'Relaciona el conflicto con hechos y motivaciones presentes en el fragmento, sin inventar un desenlace.',
      'Reconoce el conflicto y lo apoya con información disponible; una motivación necesita aclararse.',
      'Menciona hechos o sentimientos aislados sin relacionarlos con el conflicto del fragmento.',
      'Atribuye al fragmento hechos o motivaciones incompatibles con lo narrado.',
      'No identifica un conflicto sustentado en la información disponible del fragmento.',
    ]}
  })
  if(!/conclu/.test(task))rows=rows.filter(r=>!r.templateId.endsWith('-conclusion'))
  return rows
}

export const completeSecondGradeNewsCriteria=(activity:string,description:string)=>completeSecondGradeLanguageCriteria('noticia',activity,description,newsCore(activity,description))
