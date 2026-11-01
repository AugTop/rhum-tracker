// Métadonnées des bateaux (id Geovoile → nom, skipper, classe, couleur officielle).
// Les bateaux absents de cette liste reçoivent leur classe par déduction (voir data.ts)
// et un nom générique : complète la liste au besoin.

export interface BoatMeta {
    id: string;
    name: string;
    skipper: string;
    className: string;
    color: string;
    nat: string;
}

export const CLASSES = [
    { name: 'Ultim', short: 'ULT', color: '#ff4d5e' },
    { name: 'Ocean Fifty', short: 'O50', color: '#ffb020' },
    { name: 'IMOCA', short: 'IMO', color: '#3ea8ff' },
    { name: 'Class40', short: 'C40', color: '#2ee6a6' },
    { name: 'Vintage Multi', short: 'VMU', color: '#c084fc' },
    { name: 'Vintage Mono', short: 'VMO', color: '#f472b6' },
] as const;

export const MULTIHULLS = new Set(['Ultim', 'Ocean Fifty', 'Vintage Multi']);

const b = (id: string, name: string, className: string, color: string, skipper: string, nat = 'FRA'): BoatMeta => ({
    id,
    name,
    skipper,
    className,
    color,
    nat,
});

export const BOATS: BoatMeta[] = [
    // Ultim
    b('7', 'ACTUAL Ultim 4', 'Ultim', '#DD272F', 'Anthony Marchand'),
    b('1', 'IDEC Sport - CIC', 'Ultim', '#EF4030', 'Alexia Barrier'),
    b('8', 'LIAMM', 'Ultim', '#D24813', 'Guirec Soudée'),
    b('6', 'Maxi Banque Populaire XI', 'Ultim', '#4ACFFA', "Armel Le Cléac'h"),
    b('3', 'Maxi Edmond de Rothschild', 'Ultim', '#FFCE21', 'Charles Caudrelier'),
    b('4', 'SODEBO Ultim 3', 'Ultim', '#78C648', 'Thomas Coville'),
    b('5', 'SVR-Lazartigue', 'Ultim', '#31AFE9', 'Tom Laperche'),
    b('2', 'Ultim Armand Thiery', 'Ultim', '#F256A2', 'Louis Burton'),
    // Ocean Fifty
    b('10', 'Edenred 5', 'Ocean Fifty', '#FF0000', 'Basile Bourgnon'),
    b('17', 'Elvest', 'Ocean Fifty', '#DD4A29', 'Matthieu Perraut'),
    b('11', 'La French Fab', 'Ocean Fifty', '#02ACFC', 'Laurent Bourgues'),
    b('14', 'Lazare x Hellio', 'Ocean Fifty', '#F15C94', 'Erwan Le Draoulec'),
    b('9', 'Le Rire Médecin - Lamotte', 'Ocean Fifty', '#E30038', 'Luke Berry'),
    b('16', 'Sodebo Fifty', 'Ocean Fifty', '#EE7658', 'Léonard Legrand'),
    b('19', 'Solidaires En Peloton by Delanchy', 'Ocean Fifty', '#E74D14', 'Thibaut Vauchel-Camus'),
    b('13', 'Upwind By Merconcept', 'Ocean Fifty', '#F3694E', 'Anne-Claire Le Berre'),
    b('12', 'Viabilis Oceans', 'Ocean Fifty', '#A8D698', 'Baptiste Hulin'),
    b('18', 'Wewise', 'Ocean Fifty', '#F7ED37', 'Pierre Quiroga'),
    // Class40
    b('65', '#EMPOWHER', 'Class40', '#41C1BA', 'Pamela Lee', 'IRL'),
    b('90', 'Afterdara-Elcia', 'Class40', '#FF9700', 'Alexis Thomas'),
    b('61', 'Alderan', 'Class40', '#5F6477', 'Sasha Lanièce'),
    b('42', 'Alice Milliat Foundation', 'Class40', '#CFFF00', 'Aina Bauza Roig', 'ESP'),
    b('60', 'Alternative Sailing - Constructions Du Belon', 'Class40', '#FFD457', "Guillaume L'hostis"),
    b('72', 'Amarris', 'Class40', '#5BB8DD', 'Achille Nebout'),
    b('88', 'BARCO BRESIL', 'Class40', '#F2D21B', 'Gaëtan Thomas', 'BEL'),
    b('55', 'Belgium Ocean Racing - Curium', 'Class40', '#F6543D', 'Jonas Gerckens', 'BEL'),
    b('63', 'Bleu Blanc Planète Location', 'Class40', '#FEFFFF', 'Quentin Le Nabour'),
    b('66', 'Crédit Mutuel', 'Class40', '#DE2521', 'Ian Lipinski'),
    b('51', "Défi Solidaire - avec Ellye et l'Arche", 'Class40', '#6D6E72', 'Sophie Faguet'),
    b('86', 'Djemila Sailing - Belgium Ocean Racing', 'Class40', '#5AAEC2', 'Djemila Tassin', 'BEL'),
    b('73', 'Drépavoile', 'Class40', '#00FF5E', 'Kéni Piperol'),
    b('84', 'Ekinox', 'Class40', '#F3B82C', 'Benoit Sineau'),
    b('81', 'Eora', 'Class40', '#23AEE7', 'Rupert Henry', 'AUS'),
    b('89', 'Exalt', 'Class40', '#00FFF5', 'Axel Trehin'),
    b('62', 'Fondation ARC', 'Class40', '#D1E0F3', 'Mateo Le Calvic'),
    b('52', 'Funae', 'Class40', '#FFFFFF', 'Loïc Fequet'),
    b('67', 'Groupe Réel', 'Class40', '#FFFFFF', 'Alexis Loison'),
    b('77', 'Gustave Roussy', 'Class40', '#C91E2C', 'Christophe Rateau'),
    b('71', 'Hirsch - Centrakor', 'Class40', '#D1E0F3', 'Mikael Mergui'),
    b('56', "Imagin' Act-SOCOMEC", 'Class40', '#FFFFFF', ''),
];

export const BOATS_BY_ID = new Map(BOATS.map(m => [m.id, m]));

export const classColor = (className: string): string =>
    CLASSES.find(c => c.name === className)?.color ?? '#9aa4b2';

// Ligne de départ / arrivée
export const START = { lat: 48.72, lon: -1.84, label: 'Départ · Saint-Malo' };
export const FINISH = { lat: 16.225, lon: -61.53, label: 'Arrivée · Pointe-à-Pitre' };
export const RACE_START = Date.UTC(2026, 10, 1, 12, 2) / 1000; // 1er nov. 2026, 13h02 Paris
