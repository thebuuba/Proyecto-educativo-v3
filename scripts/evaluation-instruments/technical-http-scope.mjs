import assert from 'node:assert/strict'
const scopes={
 MF_053_3:{grade:4,family:'technical-mf053',fileStem:'technical-ifc006-mf053',label:'Técnico MF053',name:'Análisis y Diseño de Sistemas Informáticos',contract:'technical-ifc-mf053-four-contracts.json',source:'MINERD_IFC006_MF053_4_NORM_2017_V1'},
 MF_002_3:{grade:4,family:'technical-mf002',fileStem:'technical-mf002',label:'Técnico MF002',name:'Ofimática',contract:'technical-mf002-four-contracts.json',source:'MINERD_IFC007_MF002_4_NORM_2017_V1'},
 MF_054_3:{grade:5,family:'technical-mf054',fileStem:'technical-ifc006-mf054',label:'Técnico MF054',name:'Desarrollo de Aplicaciones y Sistemas de Información',contract:'technical-mf054-five-contracts.json',source:'MINERD_IFC006_MF054_5_NORM_2017_V1'},
 MF_056_3:{grade:4,family:'technical-mf056',fileStem:'technical-ifc006-mf056',label:'Técnico MF056',name:'Diseño y Desarrollo de Base de Datos',contract:'technical-mf056-four-contracts.json',source:'MINERD_IFC006_MF056_4_NORM_2017_V1'},
 MF_059_3:{grade:4,family:'technical-mf059',fileStem:'technical-ifc006-mf059',label:'Técnico MF059',name:'Diseño de Portales Web y Recursos Multimedia',contract:'technical-mf059-four-contracts.json',source:'MINERD_IFC006_MF059_4_NORM_2017_V1'},
}
/** Pure allowlist; never infer a technical grade from the qualification suffix. */
export function reviewedTechnicalHttpScope(code,grade){
 if(!Object.hasOwn(scopes,code))return null
 const scope=scopes[code]
 return scope.grade===grade?scope:null
}
export function reviewedTechnicalElementIds(record,source){
 const id=source.elementIdMap[record.id]
 if(id)return[id]
 assert(source.metadata.documentaryRecords.some(r=>r.id===record.id&&r.type==='LEARNING_OUTCOME'),'Referente técnico sin elemento ni RA documental revisado')
 return[]
}
