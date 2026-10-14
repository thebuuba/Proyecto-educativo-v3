import {readFileSync} from 'node:fs'
const grammar=JSON.parse(readFileSync(new URL('../../data/evaluation-instruments/english-grade-one-grammar-contracts.json',import.meta.url),'utf8'))
export const capacityDescription=`Leerán un texto en inglés e identificarán ${grammar.map(f=>f.term).join(', ')}.`
