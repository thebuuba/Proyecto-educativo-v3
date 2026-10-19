/** Format-specific children retain the parent's authored objective in content contracts. */
export const englishObjectiveId=(id:string)=>id.replace(/:(?:experience|capacities|education|name|nationality|occupation|age|address|mood|physical|phone|email|issuer|date|total|recipient|purpose|sense|correctness|underline|annotate|main|secondary)$/,'')
