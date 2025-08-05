// Multilingual Question Templates for Times Table Animals
// Contains all math problem questions in English, Spanish, and Italian

const QuestionTemplates = {
    'en': {
        // Addition Questions
        addition: [
            'There are {a} carrots in one basket and {b} carrots in another. How many carrots total?',
            'If {a} bunnies hop into the meadow and {b} more join them, how many bunnies are there?',
            'The caretaker gives {a} lettuce leaves to one group and {b} to another. How many leaves total?',
            'The sanctuary has {a} baby bunnies and {b} adult bunnies. How many bunnies in total?',
            'In the morning there were {a} carrots, and the caretaker brought {b} more. How many carrots now?',
            'Albert saw {a} bunnies playing and {b} bunnies sleeping. How many bunnies did he see?'
        ],

        // Subtraction Questions
        subtraction: [
            'There were {a} carrots, but the bunnies ate {b} of them. How many carrots are left?',
            'If {a} bunnies were in the meadow and {b} hopped away, how many bunnies remain?',
            'The caretaker had {a} lettuce leaves and gave away {b}. How many are left?',
            'From {a} bunny treats, {b} were eaten. How many treats remain?',
            'Albert counted {a} flowers, but {b} wilted overnight. How many flowers are still blooming?',
            'There were {a} bunnies in the burrow, then {b} went out to play. How many stayed inside?'
        ],

        // Doubles Questions
        doubles: [
            'Each penguin needs a partner for the ice parade. If there are {n} penguins, how many penguins total?',
            'The penguins slide down the ice slide in pairs. How many penguins in {n} pairs?',
            'Each penguin catches {n} fish. How many fish do 2 penguins catch?',
            'There are {n} penguin pairs playing together. How many penguins are playing?',
            'Each ice block can hold 2 penguins. How many penguins can {n} blocks hold?',
            'In the penguin parade, they march 2 by 2. How many penguins are in {n} rows?'
        ],

        // Doubles Word Problems
        doubles_word_problems: [
            'At the penguin nursery, there are {n} baby penguins. Each baby penguin has exactly 2 flippers. How many flippers are there in total?',
            'The penguin chef is making fish soup. Each bowl needs 2 fish. How many fish are needed for {n} bowls?',
            'For the ice skating show, penguins perform in pairs. If there are {n} pairs, how many penguins are performing?',
            'Each penguin family has 2 parents. How many parent penguins are there in {n} families?',
            'The penguins collect ice cubes for their igloo. Each trip, they bring back 2 ice cubes. How many ice cubes after {n} trips?',
            'Each sled needs 2 penguin pullers. How many penguins are needed to pull {n} sleds?'
        ],

        // Multiplication Questions
        multiplication: [
            'Each penguin family needs {a} fish. How many fish do {b} families need?',
            'There are {a} fish in each ice hole. How many fish in {b} holes?',
            'If {a} penguins each catch {b} fish, how many fish total?',
            'The caretaker gives {a} groups of penguins {b} fish each. How many fish total?'
        ],

        // Simple Division Questions
        simple_division: [
            '{a} fish need to be shared equally among {b} penguins. How many fish per penguin?',
            'If {a} ice cubes are divided into {b} equal groups, how many in each group?',
            'The caretaker has {a} fish to give to {b} penguin families equally. How many per family?'
        ],

        // Division Questions
        division: [
            '{a} water buckets need to be shared equally among {b} elephants. How many buckets per elephant?',
            'If {a} peanuts are divided equally among {b} elephants, how many peanuts each?',
            'The caretaker has {a} hay bales for {b} elephants. How many bales per elephant?'
        ],

        // Fraction Questions
        fractions: [
            'Each monkey gets {n}/{d} of a banana bunch. How many banana bunches for {count} monkeys?',
            'If {n}/{d} of the jungle is for sleeping, what fraction is for playing?',
            'The caretaker gives {n}/{d} of the fruit to the monkeys. What fraction is left?'
        ],

        // Equation Questions
        equations: [
            'If x lions each need {a} pounds of meat, and we have {b} pounds total, how many lions can we feed?',
            'The pride has {a} lions. If we need {b} pounds of meat per lion, how much meat total?',
            'We have {a} lions and need {b} pounds of meat. How much meat per lion?'
        ],

        // Decimal Questions
        decimals: [
            'Each dolphin swims {a} miles. How far do {b} dolphins swim together?',
            'The water temperature is {a} degrees. If it rises by {b} degrees, what is the new temperature?',
            'A dolphin can hold its breath for {a} minutes. How long can {b} dolphins hold their breath in total?'
        ],

        // Exponential Questions
        exponentials: [
            'The dragon has {base} treasure chests. Each chest has {base} compartments. How many compartments total?',
            'If {base} dragons each guard {base} treasures, how many treasures total?',
            'The magic crystal grows by {base} times each day. After 2 days, how many times bigger?'
        ],

        // Mixed Operations
        mixed_operations: [
            'Calculate: ({a} + {b}) × {c}',
            'Solve: {a} × {b} + {c}',
            'Find: {a} + {b} - {c}'
        ],

        // Word Problems
        word_problems: [
            'The animal sanctuary has 15 animals. If 8 are mammals and the rest are birds, how many birds are there?',
            'Each animal needs 3 meals per day. How many meals do 6 animals need per day?',
            'The caretaker works 8 hours a day for 5 days. How many hours total?'
        ],

        // Measurement Questions
        measurement: [
            'The dolphin pool is {a} meters long and {b} meters wide. What is the area?',
            'Each dolphin weighs {a} kilograms. How much do {b} dolphins weigh?',
            'The water depth is {a} meters. If it increases by {b} meters, what is the new depth?',
            'A dolphin can swim {a} meters per minute. How far in {b} minutes?'
        ],

        // Geometry Questions
        geometry: [
            'The giraffe enclosure is a rectangle {a} meters by {b} meters. What is the perimeter?',
            'Each triangle habitat has {a} sides. How many sides do {b} triangles have?',
            'The circular pond has a radius of {a} meters. What is the diameter?',
            'How many corners does a shape with {a} sides have?'
        ],

        // Advanced Multiplication Questions
        advanced_multiplication: [
            'Each owl catches {a} mice per night for {b} nights. How many mice total?',
            'There are {a} rows of {b} owl nests each. How many nests total?',
            'If {a} owls each have {b} feathers, how many feathers in total?',
            'Each observation takes {a} minutes, repeated {b} times. Total minutes?'
        ],

        // Pattern Questions
        patterns: [
            'The sequence is {a}, {b}, {c}. What comes next?',
            'Owls hoot in groups of {a}. How many hoots in {b} groups?',
            'The pattern repeats every {a} steps. What step is position {b}?',
            'Following the pattern {a}, {b}, what is the {c}th number?'
        ],

        // Advanced Equations
        advanced_equations: [
            'Solve for x: {a}x + {b} = {c}',
            'If {a}x - {b} = {c}, what is x?',
            'Find x when {a}(x + {b}) = {c}',
            'What value of x makes {a}x = {b} + {c} true?'
        ],

        // All Concepts (Mixed Advanced)
        all_concepts: [
            'A rainbow has {a} colors, each section is {b} degrees. Total degrees?',
            'Calculate: {a}² + {b} × {c}',
            'If {a}/{b} = {c}/x, what is x?',
            'The rainbow appears for {a} minutes, {b} times per week. Minutes per week?'
        ],

        // Challenge Problems
        challenge_problems: [
            'The ultimate challenge: ({a} + {b}) × {c} - {d} = ?',
            'Master level: {a}² + {b}³ = ?',
            'Expert puzzle: If {a} × x = {b} + {c}, find x',
            'Supreme test: {a} × {b} ÷ {c} + {d} = ?'
        ]
    },

    'es': {
        // Preguntas de Suma
        addition: [
            'Hay {a} zanahorias en una canasta y {b} zanahorias en otra. ¿Cuántas zanahorias en total?',
            'Si {a} conejos saltan al prado y {b} más se unen, ¿cuántos conejos hay?',
            'El cuidador da {a} hojas de lechuga a un grupo y {b} a otro. ¿Cuántas hojas en total?',
            'El santuario tiene {a} conejitos bebés y {b} conejos adultos. ¿Cuántos conejos en total?',
            'Por la mañana había {a} zanahorias, y el cuidador trajo {b} más. ¿Cuántas zanahorias ahora?',
            'Albert vio {a} conejos jugando y {b} conejos durmiendo. ¿Cuántos conejos vio?'
        ],

        // Preguntas de Resta
        subtraction: [
            'Había {a} zanahorias, pero los conejos se comieron {b} de ellas. ¿Cuántas zanahorias quedan?',
            'Si {a} conejos estaban en el prado y {b} se fueron saltando, ¿cuántos conejos quedan?',
            'El cuidador tenía {a} hojas de lechuga y regaló {b}. ¿Cuántas quedan?',
            'De {a} golosinas para conejos, {b} fueron comidas. ¿Cuántas golosinas quedan?',
            'Albert contó {a} flores, pero {b} se marchitaron durante la noche. ¿Cuántas flores siguen floreciendo?',
            'Había {a} conejos en la madriguera, luego {b} salieron a jugar. ¿Cuántos se quedaron adentro?'
        ],

        // Preguntas de Dobles
        doubles: [
            'Cada pingüino necesita una pareja para el desfile de hielo. Si hay {n} pingüinos, ¿cuántos pingüinos en total?',
            'Los pingüinos se deslizan por el tobogán de hielo en parejas. ¿Cuántos pingüinos en {n} parejas?',
            'Cada pingüino atrapa {n} peces. ¿Cuántos peces atrapan 2 pingüinos?',
            'Hay {n} parejas de pingüinos jugando juntas. ¿Cuántos pingüinos están jugando?',
            'Cada bloque de hielo puede sostener 2 pingüinos. ¿Cuántos pingüinos pueden sostener {n} bloques?',
            'En el desfile de pingüinos, marchan de 2 en 2. ¿Cuántos pingüinos hay en {n} filas?'
        ],

        // Problemas de Palabras con Dobles
        doubles_word_problems: [
            'En la guardería de pingüinos, hay {n} pingüinos bebé. Cada pingüino bebé tiene exactamente 2 aletas. ¿Cuántas aletas hay en total?',
            'El chef pingüino está haciendo sopa de pescado. Cada tazón necesita 2 peces. ¿Cuántos peces se necesitan para {n} tazones?',
            'Para el espectáculo de patinaje sobre hielo, los pingüinos actúan en parejas. Si hay {n} parejas, ¿cuántos pingüinos están actuando?',
            'Cada familia de pingüinos tiene 2 padres. ¿Cuántos pingüinos padres hay en {n} familias?',
            'Los pingüinos recolectan cubos de hielo para su iglú. En cada viaje, traen 2 cubos de hielo. ¿Cuántos cubos de hielo después de {n} viajes?',
            'Cada trineo necesita 2 pingüinos que lo tiren. ¿Cuántos pingüinos se necesitan para tirar {n} trineos?'
        ],

        // Preguntas de Multiplicación
        multiplication: [
            'Cada familia de pingüinos necesita {a} peces. ¿Cuántos peces necesitan {b} familias?',
            'Hay {a} peces en cada agujero de hielo. ¿Cuántos peces en {b} agujeros?',
            'Si {a} pingüinos atrapan {b} peces cada uno, ¿cuántos peces en total?',
            'El cuidador da a {a} grupos de pingüinos {b} peces cada uno. ¿Cuántos peces en total?'
        ],

        // Preguntas de División Simple
        simple_division: [
            '{a} peces necesitan ser compartidos igualmente entre {b} pingüinos. ¿Cuántos peces por pingüino?',
            'Si {a} cubos de hielo se dividen en {b} grupos iguales, ¿cuántos en cada grupo?',
            'El cuidador tiene {a} peces para dar a {b} familias de pingüinos igualmente. ¿Cuántos por familia?'
        ],

        // Preguntas de División
        division: [
            '{a} cubos de agua necesitan ser compartidos igualmente entre {b} elefantes. ¿Cuántos cubos por elefante?',
            'Si {a} cacahuetes se dividen igualmente entre {b} elefantes, ¿cuántos cacahuetes cada uno?',
            'El cuidador tiene {a} fardos de heno para {b} elefantes. ¿Cuántos fardos por elefante?'
        ],

        // Preguntas de Fracciones
        fractions: [
            'Cada mono recibe {n}/{d} de un racimo de plátanos. ¿Cuántos racimos de plátanos para {count} monos?',
            'Si {n}/{d} de la selva es para dormir, ¿qué fracción es para jugar?',
            'El cuidador da {n}/{d} de la fruta a los monos. ¿Qué fracción queda?'
        ],

        // Preguntas de Ecuaciones
        equations: [
            'Si x leones necesitan {a} libras de carne cada uno, y tenemos {b} libras en total, ¿cuántos leones podemos alimentar?',
            'La manada tiene {a} leones. Si necesitamos {b} libras de carne por león, ¿cuánta carne en total?',
            'Tenemos {a} leones y necesitamos {b} libras de carne. ¿Cuánta carne por león?'
        ],

        // Preguntas de Decimales
        decimals: [
            'Cada delfín nada {a} millas. ¿Qué tan lejos nadan {b} delfines juntos?',
            'La temperatura del agua es {a} grados. Si sube {b} grados, ¿cuál es la nueva temperatura?',
            'Un delfín puede contener la respiración por {a} minutos. ¿Cuánto tiempo pueden contener la respiración {b} delfines en total?'
        ],

        // Preguntas Exponenciales
        exponentials: [
            'El dragón tiene {base} cofres del tesoro. Cada cofre tiene {base} compartimentos. ¿Cuántos compartimentos en total?',
            'Si {base} dragones guardan {base} tesoros cada uno, ¿cuántos tesoros en total?',
            'El cristal mágico crece {base} veces cada día. Después de 2 días, ¿cuántas veces más grande?'
        ],

        // Operaciones Mixtas
        mixed_operations: [
            'Calcula: ({a} + {b}) × {c}',
            'Resuelve: {a} × {b} + {c}',
            'Encuentra: {a} + {b} - {c}'
        ],

        // Problemas de Palabras
        word_problems: [
            'El santuario de animales tiene 15 animales. Si 8 son mamíferos y el resto son aves, ¿cuántas aves hay?',
            'Cada animal necesita 3 comidas por día. ¿Cuántas comidas necesitan 6 animales por día?',
            'El cuidador trabaja 8 horas al día durante 5 días. ¿Cuántas horas en total?'
        ],

        // Preguntas de Medición
        measurement: [
            'La piscina de delfines mide {a} metros de largo y {b} metros de ancho. ¿Cuál es el área?',
            'Cada delfín pesa {a} kilogramos. ¿Cuánto pesan {b} delfines?',
            'La profundidad del agua es {a} metros. Si aumenta {b} metros, ¿cuál es la nueva profundidad?',
            'Un delfín puede nadar {a} metros por minuto. ¿Qué distancia en {b} minutos?'
        ],

        // Preguntas de Geometría
        geometry: [
            'El recinto de jirafas es un rectángulo de {a} metros por {b} metros. ¿Cuál es el perímetro?',
            'Cada hábitat triangular tiene {a} lados. ¿Cuántos lados tienen {b} triángulos?',
            'El estanque circular tiene un radio de {a} metros. ¿Cuál es el diámetro?',
            '¿Cuántas esquinas tiene una forma con {a} lados?'
        ],

        // Preguntas de Multiplicación Avanzada
        advanced_multiplication: [
            'Cada búho atrapa {a} ratones por noche durante {b} noches. ¿Cuántos ratones en total?',
            'Hay {a} filas de {b} nidos de búho cada una. ¿Cuántos nidos en total?',
            'Si {a} búhos tienen {b} plumas cada uno, ¿cuántas plumas en total?',
            'Cada observación toma {a} minutos, repetida {b} veces. ¿Minutos totales?'
        ],

        // Preguntas de Patrones
        patterns: [
            'La secuencia es {a}, {b}, {c}. ¿Qué sigue?',
            'Los búhos ululan en grupos de {a}. ¿Cuántos ululidos en {b} grupos?',
            'El patrón se repite cada {a} pasos. ¿Qué paso es la posición {b}?',
            'Siguiendo el patrón {a}, {b}, ¿cuál es el {c}º número?'
        ],

        // Ecuaciones Avanzadas
        advanced_equations: [
            'Resuelve para x: {a}x + {b} = {c}',
            'Si {a}x - {b} = {c}, ¿cuál es x?',
            'Encuentra x cuando {a}(x + {b}) = {c}',
            '¿Qué valor de x hace que {a}x = {b} + {c} sea verdadero?'
        ],

        // Todos los Conceptos (Mixto Avanzado)
        all_concepts: [
            'Un arcoíris tiene {a} colores, cada sección es {b} grados. ¿Grados totales?',
            'Calcula: {a}² + {b} × {c}',
            'Si {a}/{b} = {c}/x, ¿cuál es x?',
            'El arcoíris aparece por {a} minutos, {b} veces por semana. ¿Minutos por semana?'
        ],

        // Problemas de Desafío
        challenge_problems: [
            'El desafío definitivo: ({a} + {b}) × {c} - {d} = ?',
            'Nivel maestro: {a}² + {b}³ = ?',
            'Rompecabezas experto: Si {a} × x = {b} + {c}, encuentra x',
            'Prueba suprema: {a} × {b} ÷ {c} + {d} = ?'
        ]
    },

    'it': {
        // Domande di Addizione
        addition: [
            'Ci sono {a} carote in un cesto e {b} carote in un altro. Quante carote in totale?',
            'Se {a} conigli saltano nel prato e {b} altri si uniscono, quanti conigli ci sono?',
            'Il custode dà {a} foglie di lattuga a un gruppo e {b} a un altro. Quante foglie in totale?',
            'Il santuario ha {a} coniglietti e {b} conigli adulti. Quanti conigli in totale?',
            'Al mattino c\'erano {a} carote, e il custode ne ha portate {b} altre. Quante carote ora?',
            'Albert ha visto {a} conigli che giocavano e {b} conigli che dormivano. Quanti conigli ha visto?'
        ],

        // Domande di Sottrazione
        subtraction: [
            'C\'erano {a} carote, ma i conigli ne hanno mangiate {b}. Quante carote rimangono?',
            'Se {a} conigli erano nel prato e {b} sono saltati via, quanti conigli rimangono?',
            'Il custode aveva {a} foglie di lattuga e ne ha regalate {b}. Quante ne rimangono?',
            'Di {a} dolcetti per conigli, {b} sono stati mangiati. Quanti dolcetti rimangono?',
            'Albert ha contato {a} fiori, ma {b} sono appassiti durante la notte. Quanti fiori stanno ancora fiorendo?',
            'C\'erano {a} conigli nella tana, poi {b} sono usciti a giocare. Quanti sono rimasti dentro?'
        ],

        // Domande sui Doppi
        doubles: [
            'Ogni pinguino ha bisogno di un partner per la parata sul ghiaccio. Se ci sono {n} pinguini, quanti pinguini in totale?',
            'I pinguini scivolano giù per lo scivolo di ghiaccio in coppie. Quanti pinguini in {n} coppie?',
            'Ogni pinguino cattura {n} pesci. Quanti pesci catturano 2 pinguini?',
            'Ci sono {n} coppie di pinguini che giocano insieme. Quanti pinguini stanno giocando?',
            'Ogni blocco di ghiaccio può sostenere 2 pinguini. Quanti pinguini possono sostenere {n} blocchi?',
            'Nella parata dei pinguini, marciano 2 per 2. Quanti pinguini ci sono in {n} file?'
        ],

        // Problemi di Parole con Doppi
        doubles_word_problems: [
            'All\'asilo dei pinguini, ci sono {n} pinguini piccoli. Ogni pinguino piccolo ha esattamente 2 pinne. Quante pinne ci sono in totale?',
            'Lo chef pinguino sta preparando zuppa di pesce. Ogni ciotola ha bisogno di 2 pesci. Quanti pesci servono per {n} ciotole?',
            'Per lo spettacolo di pattinaggio sul ghiaccio, i pinguini si esibiscono in coppie. Se ci sono {n} coppie, quanti pinguini si stanno esibendo?',
            'Ogni famiglia di pinguini ha 2 genitori. Quanti pinguini genitori ci sono in {n} famiglie?',
            'I pinguini raccolgono cubetti di ghiaccio per il loro igloo. In ogni viaggio, riportano 2 cubetti di ghiaccio. Quanti cubetti di ghiaccio dopo {n} viaggi?',
            'Ogni slitta ha bisogno di 2 pinguini che la trainino. Quanti pinguini servono per trainare {n} slitte?'
        ],

        // Domande di Moltiplicazione
        multiplication: [
            'Ogni famiglia di pinguini ha bisogno di {a} pesci. Quanti pesci servono a {b} famiglie?',
            'Ci sono {a} pesci in ogni buco nel ghiaccio. Quanti pesci in {b} buchi?',
            'Se {a} pinguini catturano {b} pesci ciascuno, quanti pesci in totale?',
            'Il custode dà a {a} gruppi di pinguini {b} pesci ciascuno. Quanti pesci in totale?'
        ],

        // Domande di Divisione Semplice
        simple_division: [
            '{a} pesci devono essere condivisi equamente tra {b} pinguini. Quanti pesci per pinguino?',
            'Se {a} cubetti di ghiaccio vengono divisi in {b} gruppi uguali, quanti in ogni gruppo?',
            'Il custode ha {a} pesci da dare a {b} famiglie di pinguini equamente. Quanti per famiglia?'
        ],

        // Domande di Divisione
        division: [
            '{a} secchi d\'acqua devono essere condivisi equamente tra {b} elefanti. Quanti secchi per elefante?',
            'Se {a} arachidi vengono divise equamente tra {b} elefanti, quante arachidi ciascuno?',
            'Il custode ha {a} balle di fieno per {b} elefanti. Quante balle per elefante?'
        ],

        // Domande sulle Frazioni
        fractions: [
            'Ogni scimmia riceve {n}/{d} di un grappolo di banane. Quanti grappoli di banane per {count} scimmie?',
            'Se {n}/{d} della giungla è per dormire, che frazione è per giocare?',
            'Il custode dà {n}/{d} della frutta alle scimmie. Che frazione rimane?'
        ],

        // Domande sulle Equazioni
        equations: [
            'Se x leoni hanno bisogno di {a} libbre di carne ciascuno, e abbiamo {b} libbre in totale, quanti leoni possiamo nutrire?',
            'Il branco ha {a} leoni. Se abbiamo bisogno di {b} libbre di carne per leone, quanta carne in totale?',
            'Abbiamo {a} leoni e abbiamo bisogno di {b} libbre di carne. Quanta carne per leone?'
        ],

        // Domande sui Decimali
        decimals: [
            'Ogni delfino nuota {a} miglia. Quanto lontano nuotano {b} delfini insieme?',
            'La temperatura dell\'acqua è {a} gradi. Se sale di {b} gradi, qual è la nuova temperatura?',
            'Un delfino può trattenere il respiro per {a} minuti. Per quanto tempo possono trattenere il respiro {b} delfini in totale?'
        ],

        // Domande Esponenziali
        exponentials: [
            'Il drago ha {base} forzieri del tesoro. Ogni forziere ha {base} scompartimenti. Quanti scompartimenti in totale?',
            'Se {base} draghi custodiscono {base} tesori ciascuno, quanti tesori in totale?',
            'Il cristallo magico cresce di {base} volte ogni giorno. Dopo 2 giorni, quante volte più grande?'
        ],

        // Operazioni Miste
        mixed_operations: [
            'Calcola: ({a} + {b}) × {c}',
            'Risolvi: {a} × {b} + {c}',
            'Trova: {a} + {b} - {c}'
        ],

        // Problemi di Parole
        word_problems: [
            'Il santuario degli animali ha 15 animali. Se 8 sono mammiferi e il resto sono uccelli, quanti uccelli ci sono?',
            'Ogni animale ha bisogno di 3 pasti al giorno. Quanti pasti servono a 6 animali al giorno?',
            'Il custode lavora 8 ore al giorno per 5 giorni. Quante ore in totale?'
        ],

        // Domande di Misurazione
        measurement: [
            'La piscina dei delfini è lunga {a} metri e larga {b} metri. Qual è l\'area?',
            'Ogni delfino pesa {a} chilogrammi. Quanto pesano {b} delfini?',
            'La profondità dell\'acqua è {a} metri. Se aumenta di {b} metri, qual è la nuova profondità?',
            'Un delfino può nuotare {a} metri al minuto. Quanto lontano in {b} minuti?'
        ],

        // Domande di Geometria
        geometry: [
            'Il recinto delle giraffe è un rettangolo di {a} metri per {b} metri. Qual è il perimetro?',
            'Ogni habitat triangolare ha {a} lati. Quanti lati hanno {b} triangoli?',
            'Lo stagno circolare ha un raggio di {a} metri. Qual è il diametro?',
            'Quanti angoli ha una forma con {a} lati?'
        ],

        // Domande di Moltiplicazione Avanzata
        advanced_multiplication: [
            'Ogni gufo cattura {a} topi per notte per {b} notti. Quanti topi in totale?',
            'Ci sono {a} file di {b} nidi di gufo ciascuna. Quanti nidi in totale?',
            'Se {a} gufi hanno {b} piume ciascuno, quante piume in totale?',
            'Ogni osservazione richiede {a} minuti, ripetuta {b} volte. Minuti totali?'
        ],

        // Domande sui Schemi
        patterns: [
            'La sequenza è {a}, {b}, {c}. Cosa viene dopo?',
            'I gufi fanno il verso in gruppi di {a}. Quanti versi in {b} gruppi?',
            'Il schema si ripete ogni {a} passi. Che passo è la posizione {b}?',
            'Seguendo lo schema {a}, {b}, qual è il {c}º numero?'
        ],

        // Equazioni Avanzate
        advanced_equations: [
            'Risolvi per x: {a}x + {b} = {c}',
            'Se {a}x - {b} = {c}, qual è x?',
            'Trova x quando {a}(x + {b}) = {c}',
            'Quale valore di x rende vero {a}x = {b} + {c}?'
        ],

        // Tutti i Concetti (Misto Avanzato)
        all_concepts: [
            'Un arcobaleno ha {a} colori, ogni sezione è {b} gradi. Gradi totali?',
            'Calcola: {a}² + {b} × {c}',
            'Se {a}/{b} = {c}/x, qual è x?',
            'L\'arcobaleno appare per {a} minuti, {b} volte a settimana. Minuti a settimana?'
        ],

        // Problemi di Sfida
        challenge_problems: [
            'La sfida definitiva: ({a} + {b}) × {c} - {d} = ?',
            'Livello maestro: {a}² + {b}³ = ?',
            'Puzzle esperto: Se {a} × x = {b} + {c}, trova x',
            'Test supremo: {a} × {b} ÷ {c} + {d} = ?'
        ]
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuestionTemplates;
}