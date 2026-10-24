import { describe, expect, it } from 'vitest'
import { createHash } from 'node:crypto'
import { evaluationCatalogCurrent, evaluationCatalogForVersion } from './catalog-current'
import {catalogFingerprint} from './catalog-fingerprint'

describe('generic product criteria release', () => {
  it('conserva171 instalado al corregir requisitos y composición sin ampliar currículo',()=>{
    const frozen=evaluationCatalogForVersion('evaluation-2026.171')!
    expect(catalogFingerprint(frozen)).toBe('05e2f686d57d38bba9707cdb04134ecb8ce69b456aa1716ed192f7f7335e5b15')
    expect(JSON.parse(JSON.stringify(evaluationCatalogCurrent))).toEqual(JSON.parse(JSON.stringify({...frozen,version:'evaluation-2026.172'})))
  })
  it('conserva170 instalado antes de corregir gustos y preferencias',()=>{
    const frozen=evaluationCatalogForVersion('evaluation-2026.170')!
    expect(catalogFingerprint(frozen)).toBe('4f3cfd4e01c94b1f38f6fc2581584f3d77b71ff9421427de0f91fbbc222107cc')
    expect(JSON.parse(JSON.stringify(evaluationCatalogForVersion('evaluation-2026.171')))).toEqual(JSON.parse(JSON.stringify({...frozen,version:'evaluation-2026.171'})))
  })
  it('conserva el payload150 instalado y limita151 a los tres reconocedores revisados',()=>{
    const frozen=evaluationCatalogForVersion('evaluation-2026.150')!
    const current151=evaluationCatalogForVersion('evaluation-2026.151')!
    expect(catalogFingerprint(frozen)).toBe('5d1cb38fcfc472fbeca75efc8fe0492bd09aa0da2f32b40695c7c970128ef13a')
    const expected=structuredClone(frozen)
    expected.version='evaluation-2026.151'
    const priorScience=expected.scienceCommonModules.find(m=>m.grade===5)!.topics.find(t=>t.id==='periodic-position')!
    const currentScience=current151.scienceCommonModules.find(m=>m.grade===5)!.topics.find(t=>t.id==='periodic-position')!
    expect(priorScience.match).not.toBe(currentScience.match)
    priorScience.match=currentScience.match
    for(const id of ['document','text-format']){
      const previous=expected.technicalModules.find(m=>m.moduleCode==='MF_002_3')!.topics.find(t=>t.id===id)!
      const current=current151.technicalModules.find(m=>m.moduleCode==='MF_002_3')!.topics.find(t=>t.id===id)!
      expect(previous.match).not.toBe(current.match)
      previous.match=current.match
    }
    expect(JSON.parse(JSON.stringify(current151))).toEqual(JSON.parse(JSON.stringify(expected)))
  })
  it('conserva151 instalado y versiona las reglas de presentación sin alterar el contenido curricular',()=>{
    const frozen=evaluationCatalogForVersion('evaluation-2026.151')!
    expect(catalogFingerprint(frozen)).toBe('31871f590cc8f41167bd73679fc93db2bca17b80f199f50caeda8c5d50c9d6eb')
    expect(JSON.parse(JSON.stringify(evaluationCatalogForVersion('evaluation-2026.152')))).toEqual(JSON.parse(JSON.stringify({...frozen,version:'evaluation-2026.152'})))
  })
  it('conserva152 instalado y versiona las reglas científicas sin alterar el contenido curricular',()=>{
    const frozen=evaluationCatalogForVersion('evaluation-2026.152')!
    expect(catalogFingerprint(frozen)).toBe('79cbb7c0b7571617e7d0829cc8b98e193835000c4be8b2c78706c087d9669a71')
    expect(JSON.parse(JSON.stringify(evaluationCatalogForVersion('evaluation-2026.153')))).toEqual(JSON.parse(JSON.stringify({...frozen,version:'evaluation-2026.153'})))
  })
  it('conserva el payload153 registrado y versiona el intercambio explícito de roles sin cambiar currículo',()=>{
    const frozen=evaluationCatalogForVersion('evaluation-2026.153')!
    expect(catalogFingerprint(frozen)).toBe('7dc6d9fa0a433a7941d249d672d1dbd223bc4d0056aa12d4ac4448a0fbbae054')
    expect(JSON.parse(JSON.stringify(evaluationCatalogForVersion('evaluation-2026.154')))).toEqual(JSON.parse(JSON.stringify({...frozen,version:'evaluation-2026.154'})))
  })
  it('conserva154 antes de corregir las acciones y requisitos de noticia de primero',()=>{
    expect(catalogFingerprint(evaluationCatalogForVersion('evaluation-2026.154')!)).toBe('ded489bce0367360783d51cf1282f2b58d1c08b472a8b1ce2175e198b9c688a2')
    expect(evaluationCatalogForVersion('evaluation-2026.155')!.version).toBe('evaluation-2026.155')
  })
  it('conserva155 antes de completar los procedimientos de noticia',()=>{
    expect(catalogFingerprint(evaluationCatalogForVersion('evaluation-2026.155')!)).toBe('08557af68cb3f874694d9dc2e3a8982db13188012554e851559bab953a06b151')
    expect(evaluationCatalogForVersion('evaluation-2026.156')!.version).toBe('evaluation-2026.156')
  })
  it('conserva el candidato156 local antes del ajuste de estructura oral',()=>{
    expect(catalogFingerprint(evaluationCatalogForVersion('evaluation-2026.156')!)).toBe('215b174d865beb44c80df9d40bfe99e58c81b694474c7b7bc5894e7d044354cc')
    expect(evaluationCatalogForVersion('evaluation-2026.157')!.version).toBe('evaluation-2026.157')
  })
  it('conserva157 instalado antes de corregir las consignas y requisitos de guía',()=>{
    expect(catalogFingerprint(evaluationCatalogForVersion('evaluation-2026.157')!)).toBe('2a410278906074e05799027fe33395c740a7007debd746bf594e728ce7d96798')
    expect(evaluationCatalogForVersion('evaluation-2026.158')!.version).toBe('evaluation-2026.158')
  })
  it('conserva158 como candidato local previo a completar actitudes y puntuación de guía',()=>{
    expect(catalogFingerprint(evaluationCatalogForVersion('evaluation-2026.158')!)).toBe('d930f78dcf94c17d98c8963a40ce6d027d67d11d20f4d6a204efd038b501c2f3')
    expect(evaluationCatalogCurrent.version).toBe('evaluation-2026.172')
  })
  it('conserva159 instalado antes de corregir informe de lectura',()=>{
    expect(catalogFingerprint(evaluationCatalogForVersion('evaluation-2026.159')!)).toBe('99f46e348a162a9a2c8a8216774c7e107ffe474e1d61a812eba13ddf31419507')
    expect(JSON.parse(JSON.stringify(evaluationCatalogCurrent))).toEqual(JSON.parse(JSON.stringify({...evaluationCatalogForVersion('evaluation-2026.159'),version:'evaluation-2026.172'})))
  })
  it('conserva162 instalado antes de completar requisitos del caligrama',()=>{
    expect(catalogFingerprint(evaluationCatalogForVersion('evaluation-2026.162')!)).toBe('b819c805b1e11811522d0a349c62fd270a82aa4c42360b8ab9ba970dd97add32')
    expect(JSON.parse(JSON.stringify(evaluationCatalogCurrent))).toEqual(JSON.parse(JSON.stringify({...evaluationCatalogForVersion('evaluation-2026.162'),version:'evaluation-2026.172'})))
  })
  it('conserva168 instalado antes de completar el razonamiento oral',()=>{
    expect(catalogFingerprint(evaluationCatalogForVersion('evaluation-2026.168')!)).toBe('f819506e344a6dd30173c348e25926fbe1e4f48e6bd54a6fcf45f5c3dd08c7bb')
    expect(JSON.parse(JSON.stringify(evaluationCatalogCurrent))).toEqual(JSON.parse(JSON.stringify({...evaluationCatalogForVersion('evaluation-2026.168'),version:'evaluation-2026.172'})))
  })
  it('conserva167 instalado antes de corregir los componentes de fuente',()=>{
    expect(catalogFingerprint(evaluationCatalogForVersion('evaluation-2026.167')!)).toBe('d33ecf696fc8c8bc3308500a683ced13884f53c82a81e6c9756181950cc0b861')
    expect(JSON.parse(JSON.stringify(evaluationCatalogCurrent))).toEqual(JSON.parse(JSON.stringify({...evaluationCatalogForVersion('evaluation-2026.167'),version:'evaluation-2026.172'})))
  })
  it('conserva166 instalado antes de corregir publicaciones e intercambio',()=>{
    expect(catalogFingerprint(evaluationCatalogForVersion('evaluation-2026.166')!)).toBe('22baf31348c0eddf37b54afceb1940505e0ad84f76d42e8fed2e55107f5247d8')
    expect(JSON.parse(JSON.stringify(evaluationCatalogCurrent))).toEqual(JSON.parse(JSON.stringify({...evaluationCatalogForVersion('evaluation-2026.166'),version:'evaluation-2026.172'})))
  })
  it('conserva165 instalado antes de corregir consignas independientes',()=>{
    expect(catalogFingerprint(evaluationCatalogForVersion('evaluation-2026.165')!)).toBe('000a88ef6bcfe7d9ef17f78449b6688b31857437a9dd60968af62a18936fd5d5')
    expect(JSON.parse(JSON.stringify(evaluationCatalogCurrent))).toEqual(JSON.parse(JSON.stringify({...evaluationCatalogForVersion('evaluation-2026.165'),version:'evaluation-2026.172'})))
  })
  it('conserva164 instalado antes de completar componentes transversales',()=>{
    expect(catalogFingerprint(evaluationCatalogForVersion('evaluation-2026.164')!)).toBe('ea77d443cdcc2e0d6761a9dedde555415a2afbeddb1eff9604fdaab03a975fa1')
    expect(JSON.parse(JSON.stringify(evaluationCatalogCurrent))).toEqual(JSON.parse(JSON.stringify({...evaluationCatalogForVersion('evaluation-2026.164'),version:'evaluation-2026.172'})))
  })
  it('conserva163 instalado antes de completar géneros del indicador de salud',()=>{
    expect(catalogFingerprint(evaluationCatalogForVersion('evaluation-2026.163')!)).toBe('cbf092090d3ede4666c7064429351019175c4f8543f7187d16bc816faec5689b')
    expect(JSON.parse(JSON.stringify(evaluationCatalogCurrent))).toEqual(JSON.parse(JSON.stringify({...evaluationCatalogForVersion('evaluation-2026.163'),version:'evaluation-2026.172'})))
  })
  it('conserva161 instalado antes de completar requisitos del cuento',()=>{
    expect(catalogFingerprint(evaluationCatalogForVersion('evaluation-2026.161')!)).toBe('b477d9f4a03e3ead1dd47790fb43721b4c62d8f025061f7109a4cfd97e623739')
    expect(JSON.parse(JSON.stringify(evaluationCatalogCurrent))).toEqual(JSON.parse(JSON.stringify({...evaluationCatalogForVersion('evaluation-2026.161'),version:'evaluation-2026.172'})))
  })
  it('conserva160 instalado antes de completar requisitos del afiche',()=>{
    expect(catalogFingerprint(evaluationCatalogForVersion('evaluation-2026.160')!)).toBe('f8c0fe103ef0683a9504a04fec0fa3fea903dceeb4920f21d75cc26d377ef69b')
    expect(JSON.parse(JSON.stringify(evaluationCatalogCurrent))).toEqual(JSON.parse(JSON.stringify({...evaluationCatalogForVersion('evaluation-2026.160'),version:'evaluation-2026.172'})))
  })
  it.each([
    ['evaluation-2026.46','main','00d4a2d9d0586159392675cb1f59d35ff21411a3b644d384bbced1cb159d8ac0'],
    ['evaluation-2026.47','main','ed791831aee8eb8772dbb6f745eb356b566491651713b8661f864cc50edb2181'],
    ['evaluation-2026.47',undefined,'55b55e591d2a67bc3760296c0a3f510dc7e452b5126997b222052a7f55405a30'],
    ['evaluation-2026.92',undefined,'b586b25b89b54e21dff71f1c234d714b729c4dc3d49ce9890cd843d7ba1b82c7'],
  ] as const)('preserves the complete pre-merge payload of %s (%s)', (version,lineage,expected) => {
    const payload = evaluationCatalogForVersion(version,lineage)
    const canonical = JSON.stringify(payload,(_,value) => value && typeof value === 'object' && !Array.isArray(value)
      ? Object.fromEntries(Object.entries(value).sort(([a],[b])=>a.localeCompare(b))) : value)
    expect(createHash('sha256').update(canonical).digest('hex')).toBe(expected)
  })
  it('resolves the original releases without deriving them from later template revisions', () => {
    const original = evaluationCatalogForVersion('evaluation-2026.1')!
    const second = evaluationCatalogForVersion('evaluation-2026.2')!
    expect(original.version).toBe('evaluation-2026.1')
    expect(second.version).toBe('evaluation-2026.2')
    expect(original.criterionTemplates.some(item => item.id === 'oral-mastery')).toBe(false)
    expect(second.criterionTemplates.some(item => item.id === 'oral-mastery')).toBe(true)
    expect(second.criterionTemplates.length).toBe(original.criterionTemplates.length + 9)
  })

  it('resolves the historical release independently and adds the recovered product criteria only to the new release', () => {
    const previous = evaluationCatalogForVersion('evaluation-2026.46')!
    const current = evaluationCatalogForVersion('evaluation-2026.93')!
    expect(current).not.toBe(evaluationCatalogCurrent)
    expect(current.version).toBe('evaluation-2026.93')
    expect(previous).not.toBe(current)
    for (const id of ['oral-mastery', 'oral-resources', 'oral-responses', 'debate-evidence', 'debate-response',
      'concept-hierarchy', 'concept-relations', 'project-product', 'project-process']) {
      expect(previous.criterionTemplates.some(item => item.id === id)).toBe(false)
      expect(current.criterionTemplates.filter(item => item.id === id)).toHaveLength(1)
    }
    expect(current.activityTypes.find(item => item.id === 'PROJECT')?.triggers).toContain('modelo')
    expect(previous.activityTypes.find(item => item.id === 'PROJECT')?.triggers).not.toContain('modelo')
  })

  it('preserves both historical lineages and releases through the frozen150 baseline', () => {
    const legacy = evaluationCatalogForVersion('evaluation-2026.47', 'main')!
    const curricular = evaluationCatalogForVersion('evaluation-2026.47')!
    const previous = evaluationCatalogForVersion('evaluation-2026.92')!
    expect(legacy.version).toBe(curricular.version)
    expect(legacy.criterionTemplates.some(item => item.id === 'oral-mastery')).toBe(true)
    expect(curricular.criterionTemplates.some(item => item.id === 'oral-mastery')).toBe(false)
    expect(previous.version).toBe('evaluation-2026.92')
    expect(previous.criterionTemplates.some(item => item.id === 'oral-mastery')).toBe(false)
    expect(evaluationCatalogCurrent.version).toBe('evaluation-2026.172')
    const frozen138=evaluationCatalogForVersion('evaluation-2026.138')!
    expect(frozen138.version).toBe('evaluation-2026.138')
    expect(frozen138.optativeScienceModules).toBeUndefined()
    const {version:currentVersion,optativeScienceModules,technicalModules,...currentWithoutScience}=evaluationCatalogForVersion('evaluation-2026.150')!
    expect(technicalModules).toHaveLength(9)
    expect(technicalModules[0]).toMatchObject({moduleCode:'MF_053_3',programCode:'IFC006_3',grade:4,cycle:2,modalityCode:'technical_professional'})
    expect(technicalModules[1]).toMatchObject({moduleCode:'MF_002_3',programCode:'IFC007_3',programCodes:['IFC006_3','IFC007_3'],grade:4,cycle:2,modalityCode:'technical_professional'})
    expect(technicalModules[2]).toMatchObject({moduleCode:'MF_054_3',programCode:'IFC006_3',grade:5,cycle:2,modalityCode:'technical_professional'})
    expect(technicalModules[3]).toMatchObject({moduleCode:'MF_056_3',programCode:'IFC006_3',grade:4,cycle:2,modalityCode:'technical_professional'})
    expect(technicalModules[4]).toMatchObject({moduleCode:'MF_059_3',programCode:'IFC006_3',grade:4,cycle:2,modalityCode:'technical_professional'})
    expect(technicalModules[5]).toMatchObject({moduleCode:'MF_057_3',programCode:'IFC006_3',grade:5,cycle:2,modalityCode:'technical_professional'})
    expect(technicalModules[6]).toMatchObject({moduleCode:'MF_055_3',programCode:'IFC006_3',grade:6,cycle:2,modalityCode:'technical_professional'})
    expect(technicalModules[7]).toMatchObject({moduleCode:'MF_058_3',programCode:'IFC006_3',grade:5,cycle:2,modalityCode:'technical_professional'})
    expect(technicalModules[8]).toMatchObject({moduleCode:'MF_060_3',programCode:'IFC006_3',grade:6,cycle:2,modalityCode:'technical_professional'})
    const frozen146=evaluationCatalogForVersion('evaluation-2026.146')!
    expect(frozen146.technicalModules).toEqual(technicalModules.slice(0,5))
    const frozen145=evaluationCatalogForVersion('evaluation-2026.145')!
    expect(frozen145.technicalModules).toEqual(technicalModules.slice(0,4))
    const frozen144=evaluationCatalogForVersion('evaluation-2026.144')!
    expect(frozen144.version).toBe('evaluation-2026.144')
    expect(frozen144.technicalModules).toEqual(technicalModules.slice(0,3))
    const frozen143=evaluationCatalogForVersion('evaluation-2026.143')!
    expect(frozen143.version).toBe('evaluation-2026.143')
    expect(frozen143.technicalModules).toEqual(technicalModules.slice(0,2))
    const {version:version143,technicalModules:technical143,...rest143}=frozen143
    expect(version143).not.toBe(currentVersion)
    expect(technical143).toHaveLength(2)
    expect(JSON.parse(JSON.stringify({...currentWithoutScience,optativeScienceModules}))).toEqual(JSON.parse(JSON.stringify(rest143)))
    const frozen142=evaluationCatalogForVersion('evaluation-2026.142')!
    expect(frozen142.technicalModules).toEqual(technicalModules.slice(0,1))
    const {version:version142,technicalModules:technical142,...rest142}=frozen142
    expect(version142).toBe('evaluation-2026.142')
    expect(technical142).toHaveLength(1)
    expect(JSON.parse(JSON.stringify({...currentWithoutScience,optativeScienceModules}))).toEqual(JSON.parse(JSON.stringify(rest142)))
    const frozen141=evaluationCatalogForVersion('evaluation-2026.141')!
    expect(frozen141.technicalModules).toBeUndefined()
    const {version:version141,...rest141}=frozen141
    expect(version141).toBe('evaluation-2026.141')
    expect(JSON.parse(JSON.stringify({...currentWithoutScience,optativeScienceModules}))).toEqual(JSON.parse(JSON.stringify(rest141)))
    const {version:previousVersion,...previousWithoutVersion}=frozen138
    expect(currentVersion).not.toBe(previousVersion)
    expect(optativeScienceModules.map(m=>m.subjectCode)).toEqual(['OPT-CT-4','OPT-CT-5','OPT-CT-6'])
    const frozen140=evaluationCatalogForVersion('evaluation-2026.140')!
    expect(frozen140.version).toBe('evaluation-2026.140')
    expect(frozen140.optativeScienceModules!.map(m=>m.subjectCode)).toEqual(['OPT-CT-4','OPT-CT-5'])
    expect(optativeScienceModules.slice(0,2)).toEqual(frozen140.optativeScienceModules)
    const {version:version140,optativeScienceModules:science140,...rest140}=frozen140
    expect(version140).not.toBe(currentVersion)
    expect(science140).toHaveLength(2)
    expect(JSON.parse(JSON.stringify(currentWithoutScience))).toEqual(JSON.parse(JSON.stringify(rest140)))
    const frozen139=evaluationCatalogForVersion('evaluation-2026.139')!
    expect(frozen139.optativeScienceModules!.map(m=>m.subjectCode)).toEqual(['OPT-CT-4'])
    expect(optativeScienceModules[0]).toEqual(frozen139.optativeScienceModules![0])
    const {version:version139,optativeScienceModules:science139,...rest139}=frozen139
    expect(version139).toBe('evaluation-2026.139')
    expect(science139).toHaveLength(1)
    expect(JSON.parse(JSON.stringify(currentWithoutScience))).toEqual(JSON.parse(JSON.stringify(rest139)))
    expect(JSON.parse(JSON.stringify(currentWithoutScience))).toEqual(JSON.parse(JSON.stringify(previousWithoutVersion)))
    expect(evaluationCatalogCurrent.optativeMathModules.map(m=>m.subjectCode)).toEqual(['OPT-MT-4','OPT-MT-5','OPT-MT-6'])
    const frozen137=evaluationCatalogForVersion('evaluation-2026.137')!
    expect(frozen137.optativeMathModules!.map(m=>m.subjectCode)).toEqual(['OPT-MT-4','OPT-MT-5'])
    expect(evaluationCatalogCurrent.optativeMathModules.slice(0,2)).toEqual(frozen137.optativeMathModules)
    const frozen136=evaluationCatalogForVersion('evaluation-2026.136')!
    expect(frozen136.optativeMathModules!.map(m=>m.subjectCode)).toEqual(['OPT-MT-4'])
    expect(evaluationCatalogCurrent.optativeMathModules[0]).toEqual(frozen136.optativeMathModules![0])
    const frozen135=evaluationCatalogForVersion('evaluation-2026.135')!
    expect(frozen135.optativeMathModules).toBeUndefined()
    expect(evaluationCatalogCurrent.optativeSocialModules).toEqual(frozen135.optativeSocialModules)
    const frozen133=evaluationCatalogForVersion('evaluation-2026.133')!
    expect(frozen133.optativeSocialModules!.map(m=>m.subjectCode)).toEqual(['OPT-HCS-SOC-4'])
    expect(evaluationCatalogCurrent.optativeSocialModules[0]).toEqual(frozen133.optativeSocialModules![0])
    expect(evaluationCatalogCurrent.optativeSocialModules.map(m=>m.subjectCode)).toEqual(['OPT-HCS-SOC-4','OPT-HCS-SOC-5','OPT-HCS-SOC-6'])
    const frozen134=evaluationCatalogForVersion('evaluation-2026.134')!
    expect(frozen134.optativeSocialModules!.map(m=>m.subjectCode)).toEqual(['OPT-HCS-SOC-4','OPT-HCS-SOC-5'])
    expect(evaluationCatalogCurrent.optativeSocialModules.slice(0,2)).toEqual(frozen134.optativeSocialModules)
    const frozen126=evaluationCatalogForVersion('evaluation-2026.126')
    expect(frozen126.optativeEnglishModules).toBeUndefined()
    expect(evaluationCatalogCurrent.optativeLanguageModules.slice(0,3)).toEqual(frozen126.optativeLanguageModules)
    const frozen129=evaluationCatalogForVersion('evaluation-2026.129')!
    expect(frozen129.optativeLanguageModules).toHaveLength(3)
    expect(evaluationCatalogCurrent.optativeLanguageModules.map(m=>m.subjectCode)).toEqual(['OPT-HLM-LEN-4','OPT-HLM-LEN-5','OPT-HLM-LEN-6','OPT-HCS-LEN-4','OPT-HCS-LEN-5','OPT-HCS-LEN-6'])
    const frozen131=evaluationCatalogForVersion('evaluation-2026.131')!
    expect(evaluationCatalogCurrent.optativeLanguageModules.slice(0,5)).toEqual(frozen131.optativeLanguageModules)
    const frozen130=evaluationCatalogForVersion('evaluation-2026.130')!
    expect(evaluationCatalogCurrent.optativeLanguageModules.slice(0,4)).toEqual(frozen130.optativeLanguageModules)
    expect(evaluationCatalogCurrent.optativeEnglishModules.map(m=>m.subjectCode)).toEqual(['OPT-HLM-ING-4','OPT-HLM-ING-5','OPT-HLM-ING-6'])
    const frozen128=evaluationCatalogForVersion('evaluation-2026.128')!
    expect(frozen128.optativeEnglishModules!.map(m=>m.subjectCode)).toEqual(['OPT-HLM-ING-4','OPT-HLM-ING-5'])
    expect(evaluationCatalogCurrent.optativeEnglishModules.slice(0,2)).toEqual(frozen128.optativeEnglishModules)
    const frozen127=evaluationCatalogForVersion('evaluation-2026.127')!
    expect(frozen127.optativeEnglishModules!.map(m=>m.subjectCode)).toEqual(['OPT-HLM-ING-4'])
    expect(evaluationCatalogCurrent.optativeEnglishModules[0]).toEqual(frozen127.optativeEnglishModules![0])
    expect(evaluationCatalogCurrent.scienceCommonModules.map(module => module.grade)).toEqual([1,2,3,4,5,6])
    expect(evaluationCatalogCurrent.mathCommonModules.map(module => module.grade)).toEqual([1,2,3,4,5,6])
    expect(evaluationCatalogCurrent.frenchModules.map(module => module.grade)).toEqual([1,2,3,4,5,6])
    expect(new Set(evaluationCatalogCurrent.criterionTemplates.map(item => item.id)).size).toBe(evaluationCatalogCurrent.criterionTemplates.length)
  })
})
