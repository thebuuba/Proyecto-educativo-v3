export function shouldSearchSchoolQuery(term: string, selectedTerm: string | null) {
  return term.length >= 2 && term !== selectedTerm
}
