/** AulaBase adaptations. These relations are not official MINERD rubric text. */
export type CommonScienceTopic={id:string;grade:number;label:string;match:string;relation:string;pages:number[];exclude?:string;facets?:{id:string;match:string;label:string;relation:string}[]}
export const scienceTopic=(grade:number,pages:number[],id:string,label:string,match:string,relation:string,exclude?:string):CommonScienceTopic=>({grade,pages,id,label,match,relation,...(exclude?{exclude}:{})})
