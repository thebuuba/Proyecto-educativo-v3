import {requestedLanguageFeatures,type LanguageFeature} from './language-feature-criteria'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'

type LexicalFeature=LanguageFeature&{category:'vocabulary'|'expression'}
const word=(id:string,match:string,name:string,purpose:string,error:string):LexicalFeature=>({id,match:`\\b(?:${match})\\b`,name,function:purpose,error,category:'vocabulary'})
const expression=(id:string,match:string,name:string,purpose:string,error:string):LexicalFeature=>({...word(id,match,name,purpose,error),category:'expression'})
/** PDF134–136: lexical families and expressions; examples are not mandatory word lists. */
export const englishGradeOneLexicon:LexicalFeature[]=[
 word('geography','accidentes geograficos|geographical features','accidentes geográficos','nombrar los rasgos del paisaje solicitados','nombra un accidente geográfico distinto del referente'),
 word('arts','actividades artisticas|artistic activities','actividades artísticas','comunicar la práctica artística indicada','confunde la actividad artística con otra práctica'),
 word('daily','actividades (?:diarias|cotidianas)|daily activities','actividades diarias','nombrar las acciones de la jornada','cambia la acción cotidiana que se desea comunicar'),
 word('leisure','actividades recreativas|recreational activities','actividades recreativas','nombrar la actividad de ocio indicada','confunde la actividad recreativa con otra actividad'),
 word('food','(?<!preparacion de )alimentos|comidas y bebidas|food','alimentos','identificar la comida o bebida mencionada','atribuye al alimento un nombre que corresponde a otro producto'),
 word('address','apelativos|formas de dirigirse|forms of address','apelativos','dirigirse a la persona en la situación indicada','emplea un apelativo que cambia el destinatario o el trato solicitado'),
 word('celebrations','celebraciones|celebrations','celebraciones','nombrar la celebración mencionada','confunde la celebración con otro acontecimiento'),
 word('colors','colores|colours|colors','colores','precisar el color del referente','asigna al referente un color diferente del indicado'),
 word('weather-words','condiciones atmosfericas|weather conditions','condiciones atmosféricas','nombrar el estado del tiempo indicado','confunde el estado del tiempo comunicado'),
 word('territories','continentes|paises|ciudades|continents|countries|cities','lugares geográficos solicitados','identificar el lugar geográfico nombrado','cambia el lugar al que se refiere el mensaje'),
 word('sports','deportes|sports','deportes','nombrar la práctica deportiva indicada','nombra un deporte distinto del solicitado'),
 word('weekdays','dias de la semana|weekdays|days of the week','días de la semana','situar la actividad en el día señalado','desplaza la actividad a otro día'),
 word('seasons','estaciones del ano|seasons','estaciones del año','identificar la estación del año mencionada','confunde la estación a la que se refiere el mensaje'),
 word('phenomena','fenomenos atmosfericos|atmospheric phenomena','fenómenos nombrados en el currículo','identificar el fenómeno nombrado en la situación','utiliza el nombre de un fenómeno distinto del indicado'),
 word('shapes','formas(?! de ser)|figuras geometricas|shapes','formas de los objetos','precisar la forma del objeto','atribuye al objeto una forma diferente'),
 word('personality','formas de ser|personalidad|personality','formas de ser','comunicar la característica de la persona o personaje descrito','atribuye al personaje un rasgo de personalidad diferente'),
 word('music','generos musicales|musical genres','géneros musicales','nombrar el tipo de música mencionado','confunde el género musical con otro género'),
 word('languages','idiomas|languages','idiomas','identificar la lengua mencionada','cambia la lengua a la que se refiere el mensaje'),
 word('building-places','lugares de un edificio|zonas de un edificio|building locations','lugares de un edificio','localizar la zona del edificio indicada','confunde la entrada, salida u otra zona solicitada'),
 word('public-places','lugares de la ciudad|lugares publicos|public places','lugares públicos','identificar el lugar público mencionado','sitúa el referente en un lugar público diferente'),
 word('transport','medios de transporte|means of transport','medios de transporte','nombrar el medio de desplazamiento solicitado','cambia el medio de transporte indicado'),
 word('family','miembros de la familia|parentesco|family members','miembros de la familia','expresar la relación de parentesco indicada','atribuye una relación de parentesco diferente entre los personajes'),
 word('furniture','mobiliario(?: y objetos)?|furniture','mobiliario y objetos solicitados','nombrar el mueble u objeto indicado','confunde el objeto nombrado con otro mueble u objeto'),
 word('nationalities','nacionalidades|nationalities','nacionalidades','expresar la nacionalidad indicada','confunde la nacionalidad con otra procedencia'),
 word('names','nombres propios|proper names','nombres propios','identificar a la persona o lugar nombrado','atribuye el nombre a un referente distinto'),
 word('cardinal','numeros cardinales|cardinal numbers','números cardinales','expresar la cantidad solicitada','comunica una cantidad diferente de la indicada'),
 word('ordinal','numeros ordinales|ordinal numbers','números ordinales','expresar la posición en una serie','cambia la posición del elemento en la serie'),
 word('jobs','ocupaciones|profesiones|occupations|jobs','ocupaciones','nombrar la ocupación mencionada','atribuye a la persona una ocupación distinta'),
 word('body','partes del cuerpo|body parts','partes del cuerpo','identificar la parte corporal indicada','señala una parte corporal distinta de la nombrada'),
 word('belongings','pertenencias|belongings','pertenencias','nombrar la pertenencia mencionada','confunde el objeto personal con otro objeto'),
 word('cooking','preparacion de alimentos|food preparation','preparación de alimentos','comunicar la acción de preparación solicitada','cambia la acción culinaria indicada por otra'),
 word('compass','puntos cardinales|cardinal directions','puntos cardinales','comunicar la orientación espacial indicada','invierte la dirección espacial que se desea comunicar'),
 word('appearance','rasgos fisicos|physical features','rasgos físicos','expresar el rasgo de apariencia descrito','atribuye a la persona o personaje un rasgo físico distinto'),
 word('clothing','ropa(?: y accesorios)?|prendas de vestir|clothing','ropa y accesorios solicitados','nombrar la prenda o accesorio mencionado','nombra una prenda o accesorio diferente del referente'),
 word('sizes','tamanos|sizes','tamaños','precisar el tamaño relativo del referente','cambia el tamaño que se desea indicar'),
 word('chores','tareas del hogar|tareas domesticas|household chores','tareas del hogar','nombrar la tarea doméstica indicada','confunde la tarea doméstica con una acción diferente'),
 word('titles','titulos personales|personal titles','títulos personales','expresar el tratamiento de la persona en la situación acordada','cambia el tratamiento solicitado al dirigirse a la persona'),
 word('equipment','uso de aparatos|uso de equipos|equipment use','uso de aparatos','indicar la acción sobre el aparato','confunde conectar, encender u otra acción solicitada'),
 word('travel','viajes|travel','viajes','nombrar el servicio u objeto del viaje indicado','confunde el servicio, lugar u objeto necesario en la situación de viaje'),
 expression('greeting','saludar|saludos|greetings','saludar','iniciar el contacto según la situación comunicativa','usa una fórmula de cierre cuando se solicita iniciar el contacto'),
 expression('farewell','despedirse|despedidas|farewells','despedirse','cerrar el contacto en la situación comunicativa','usa una fórmula que abre el contacto cuando corresponde despedirse'),
 expression('introduction','presentarse|presentar a (?:alguien|otras personas)|introductions','presentarse o presentar a la persona indicada','dar a conocer a una persona en el intercambio','cambia quién se presenta o quién es presentado'),
 expression('classroom','interactuar en el aula|interaccion en el aula|classroom interaction','interactuar en el aula','comunicar la necesidad de comunicación en clase','la expresión solicita una acción distinta de la necesaria en clase'),
 expression('interruption','interrumpir cortesmente|interrupcion cortes|polite interruption','interrumpir cortésmente','solicitar una interrupción sin cambiar el asunto del intercambio','la expresión no permite reconocer la solicitud de interrupción'),
 expression('turns','(?:tomar|ceder)(?: y ceder)? el turno|turn taking','tomar o ceder el turno según lo solicitado','regular el turno de palabra en el intercambio','pide tomar el turno cuando debe cederlo o lo contrario'),
 expression('translation','solicitar (?:traduccion|repeticion)|pedir (?:traduccion|repeticion)|translation or repetition','solicitar traducción o repetición según lo pedido','pedir ayuda para comprender el mensaje','la solicitud no indica qué parte necesita traducción o repetición'),
 expression('agreement','(?:expresar )?(?:aprobacion|acuerdo)|approval|agreement','expresar aprobación o acuerdo','comunicar acuerdo con lo comunicado','expresa desacuerdo cuando pretende comunicar aprobación'),
 expression('attention','atraer la atencion|llamar la atencion|attract attention','atraer la atención','llamar al interlocutor antes de comunicar el mensaje','la expresión no permite al interlocutor reconocer que se le llama'),
 expression('invitation-response','responder a (?:las )?invitaciones|responding to invitations','responder a una invitación','comunicar aceptación o rechazo según la respuesta elegida','la expresión contradice la aceptación o el rechazo elegido'),
 expression('excuse','excusarse|disculparse|apologizing','excusarse','expresar una disculpa relacionada con la situación','la expresión no permite reconocer la disculpa solicitada'),
 expression('thanks','agradecer|agradecimiento|thanking','agradecer','comunicar agradecimiento por la ayuda o acción indicada','la expresión corresponde a otra intención y no comunica agradecimiento'),
 expression('dates','indicar fechas|expresar fechas|giving dates','indicar fechas','comunicar la fecha indicada','cambia el día, mes o año solicitado'),
 expression('hours','indicar la hora|expresar la hora|telling the time','indicar la hora','comunicar la hora indicada','cambia la hora a la que se refiere el mensaje'),
]

export function requestedEnglishLexicon(text:string){
 const lexical=/\b(?:vocabulario|lexico|palabras|terminos)\b/.test(text)
 return requestedLanguageFeatures(englishGradeOneLexicon.filter(f=>f.category==='expression'||lexical),text)
}

export function englishLexicalCriterion(feature:LanguageFeature,text:string,mode:string):ContextualTopicCriterion{
 const receptive=mode==='reading'||mode==='listening',source=mode==='listening'?'mensaje escuchado':'texto disponible'
 const expression=englishGradeOneLexicon.find(f=>f.id===feature.id)?.category==='expression'
 const target=`${expression?'las expresiones para':'el vocabulario solicitado de'} ${feature.name}`
 const ofTarget=target.startsWith('el ')?`del ${target.slice(3)}`:`de ${target}`
 const explain=/\b(?:explic\w*|justific\w*|significado|funcion)\b/.test(text)
 const levels:ContextualTopicCriterion['progressionLevels']=receptive?[
  `Identifica ${target} en el ${source} en inglés${explain?` y relaciona su significado con la función de ${feature.function}`:''}.`,
  `Localiza ejemplos pertinentes ${ofTarget}${explain?'; una relación con el significado del mensaje requiere precisión':'; una identificación aislada requiere precisión'}.`,
  `Reconoce algunas ${expression?'expresiones':'palabras'} solicitadas, pero omite o confunde otras presentes en el ${source}.`,
  `Confunde el significado en el mensaje: ${feature.error}.`,
  `No identifica ejemplos pertinentes ${ofTarget} en el ${source}.`,
 ]:[
  `Emplea ${target} en inglés para ${feature.function}.`,
  `La selección de ${expression?'expresiones':'palabras'} permite ${feature.function}; un uso aislado necesita revisión.`,
  `Incluye algunas ${expression?'expresiones':'palabras'} pertinentes, pero otros usos no permiten ${feature.function}.`,
  `La elección de ${expression?'expresiones':'palabras'} altera el mensaje: ${feature.error}.`,
  `No aporta usos reconocibles ${ofTarget} para la situación solicitada.`,
 ]
 return {templateId:`ing-1-lexicon-${feature.id}`,title:`${expression?'Expresiones para':'Vocabulario de'} ${feature.name}`,observable:levels[0],weight:3,progressionLevels:levels}
}
