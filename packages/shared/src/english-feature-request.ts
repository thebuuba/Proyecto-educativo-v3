/** A guarded form needs a request, including a named group of forms, not a person's name. */
export function explicitEnglishFeatureRequest(text:string,match:string,forms:string){
 const cue='(?:utiliz\\w*|emple\\w*|us(?:ar(?:an)?|an|en|ando)|identific\\w*|identifiqu\\w*|localiz\\w*|localic\\w*|reconoc\\w*|reconoz\\w*|compar(?:ar(?:an)?|an|en)|con|using|use|(?:funcion|significado|uso) de)'
 const qualifiers='(?:(?:el|la|los|las|un|una|verbos?|modales?|formas?|estructuras?|gramaticales?|de|del|futuro|tiempo|verbal|verbales)\\s+)*'
 return new RegExp(`\\b${cue}\\s+${qualifiers}(?:(?:${forms})(?:,?\\s+(?:(?:y|o|e|and|or)\\s+)?)${qualifiers})*(?:${match})(?=\\b|$)`).test(text)
}
