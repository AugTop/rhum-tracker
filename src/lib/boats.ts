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
    b('9', 'Le Rire Medecin - Lamotte', 'Ocean Fifty', '#E30038', 'Luke Berry'),
    b('16', 'Sodebo Fifty', 'Ocean Fifty', '#EE7658', 'Léonard Legrand'),
    b('19', 'Solidaires En Peloton by Delanchy', 'Ocean Fifty', '#E74D14', 'Thibaut Vauchel-Camus'),
    b('13', 'Upwind By Merconcept', 'Ocean Fifty', '#F3694E', 'Anne-Claire Le Berre'),
    b('12', 'Viabilis Oceans', 'Ocean Fifty', '#A8D698', 'Baptiste Hulin'),
    b('18', 'Wewise', 'Ocean Fifty', '#F7ED37', 'Pierre Quiroga'),
    // IMOCA
    b('27', '11th Hour Racing', 'IMOCA', '#F68A33', 'Francesca Clapcich', 'ITA'),
    b('23', 'Allagrande Mapei', 'IMOCA', '#00B3E3', 'Ambrogio Beccaria', 'ITA'),
    b('30', 'Anett - Kalhyge', 'IMOCA', '#CCCCCC', 'Jean-Baptiste Daramy'),
    b('25', 'April Marine + Recherche Co-partenaire', 'IMOCA', '#38FF00', 'Arnaud Boissières'),
    b('26', 'Association Petits Princes Queguiner', 'IMOCA', '#D33826', 'Elodie Bonafous'),
    b('22', 'Bureau Vallée', 'IMOCA', '#000000', 'Davy Beaudart'),
    b('29', 'Café Joyeux', 'IMOCA', '#FFE333', "Nicolas D'estais"),
    b('24', 'Charal', 'IMOCA', '#181A27', 'Jérémie Beyou'),
    b('28', 'Coup de Pouce', 'IMOCA', '#EA9440', 'Manuel Cousin'),
    b('37', 'Demain c’est loin', 'IMOCA', '#FF1A1C', 'Nicolas Rouger'),
    b('20', 'FDJ United', 'IMOCA', '#3BA3E7', 'Fabrice Amedeo'),
    b('36', 'Foussier', 'IMOCA', '#C55327', 'Sébastien Marsset'),
    b('38', 'Groupe Dubreuil - Air Caraïbes', 'IMOCA', '#E5DD45', 'Sébastien Simon'),
    b('31', 'Initiatives Coeur', 'IMOCA', '#8C1515', 'Violette Dorange'),
    b('41', "Les P'tits Doudous", 'IMOCA', '#C52264', 'Armel Tripon'),
    b('32', 'Macif Santé Prévoyance', 'IMOCA', '#265BB2', 'Sam Goodchild', 'FRA GBR'),
    b('34', 'MACSF', 'IMOCA', '#BD3A36', 'Corentin Horeau'),
    b('33', 'Malizia 4', 'IMOCA', '#A9A5A4', 'Boris Herrmann', 'GER'),
    b('40', 'Milai - Furuno', 'IMOCA', '#FFFFFF', 'Masa Suzuki', 'JPN'),
    b('21', 'Resilient', 'IMOCA', '#1EABE3', 'Pierre-louis Attwell'),
    b('35', 'Respire', 'IMOCA', '#FF982C', 'Robin Marais'),
    b('39', 'Vaincre la Mucoviscidose', 'IMOCA', '#545454', 'Maxime Sorel'),
    // Class40
    b('90', 'Afterdara-Elcia', 'Class40', '#FF9700', 'Alexis Thomas'),
    b('61', 'Alderan', 'Class40', '#5F6477', 'Sasha Lanièce'),
    b('42', 'Alice Milliat Foundation', 'Class40', '#CFFF00', 'Aina Bauza Roig', 'ESP'),
    b('60', 'Alternative Sailing - Constructions Du Belon', 'Class40', '#FFD457', "Guillaume L'hostis"),
    b('72', 'Amarris', 'Class40', '#5BB8DD', 'Achille Nebout'),
    b('88', 'BARCO BRESIL', 'Class40', '#F2D21B', 'Gaëtan THOMAS', 'BEL'),
    b('55', 'Belgium Ocean Racing - Curium', 'Class40', '#F6543D', 'Jonas Gerckens', 'BEL'),
    b('63', 'Bleu Blanc Planète Location', 'Class40', '#FEFFFF', 'Quentin Le Nabour'),
    b('66', 'Crédit Mutuel', 'Class40', '#DE2521', 'Ian Lipinski'),
    b('86', 'Djemila Sailing - Belgium Ocean Racing', 'Class40', '#5AAEC2', 'Djemila Tassin', 'BEL'),
    b('73', 'Drépavoile', 'Class40', '#00FF5E', 'Kéni Piperol'),
    b('51', "Défi Solidaire - avec Ellye et l'Arche", 'Class40', '#6D6E72', 'Sophie Faguet'),
    b('84', 'Ekinox', 'Class40', '#F3B82C', 'Benoit Sineau'),
    b('65', '#EMPOWHER', 'Class40', '#41C1BA', 'Pamela Lee', 'IRL'),
    b('81', 'Eora', 'Class40', '#23AEE7', 'Rupert Henry', 'AUS'),
    b('89', 'Exalt', 'Class40', '#00FFF5', 'Axel Trehin'),
    b('62', 'Fondation ARC', 'Class40', '#D1E0F3', 'Mateo Le Calvic'),
    b('52', 'Funae', 'Class40', '#FFFFFF', 'Loïc Fequet'),
    b('67', 'Groupe Réel', 'Class40', '#FFFFFF', 'Alexis Loison'),
    b('77', 'Gustave Roussy', 'Class40', '#C91E2C', 'Christophe Rateau'),
    b('71', 'Hirsch - Centrakor', 'Class40', '#D1E0F3', 'Mikael Mergui'),
    b('56', 'Imagin’ Act-SOCOMEC', 'Class40', '#FFFFFF', 'Marco Guerra', 'ITA'),
    b('54', 'Influence 2', 'Class40', '#FFFFFF', 'Andrea Fornaro', 'ITA'),
    b('46', 'Inherent-phare 40', 'Class40', '#FFA000', 'Mathieu Claveau'),
    b('59', 'Inland Roots, Ocean Soul', 'Class40', '#FFFFFF', 'Milan Kolacek', 'CZE'),
    b('64', 'Institut Imagine', 'Class40', '#FF00AA', 'Pierre Leboucher'),
    b('49', 'Legallais', 'Class40', '#F5E208', 'Fabien Delahaye'),
    b('83', 'Lucente', 'Class40', '#092A50', 'Matteo Sericano', 'ITA'),
    b('80', 'Maccaferri Futura', 'Class40', '#D1E0F3', 'Luca Rosetti', 'ITA'),
    b('87', 'Mic Odyssey', 'Class40', '#FFFFFF', 'Jean-baptiste Ternon'),
    b('78', 'Mussulo40', 'Class40', '#FFFFFF', 'Yanick Rebuffat'),
    b('48', 'OceanConnect', 'Class40', '#F68D2A', 'Yves Courbon'),
    b('70', 'Patapain - Les Invincibles', 'Class40', '#D1E0F3', 'William Mathelin Moreaux'),
    b('79', 'Pierreval - Fondation GoodPlanet', 'Class40', '#AABF16', 'Vincent Riou'),
    b('45', 'Plastic Odyssey', 'Class40', '#D1E0F3', 'Jules Bonnier'),
    b('69', 'Qwanza', 'Class40', '#E47200', 'Goulven Marie'),
    b('76', 'Renovatec Sailing Team', 'Class40', '#FFFFFF', 'Ulysse Pozzoli'),
    b('85', 'Réauté Chocolat', 'Class40', '#D1E0F3', 'Lomano Takasi'),
    b('82', 'Rêve De Large 5', 'Class40', '#F4B719', 'Rodolphe Sepho'),
    b('68', 'Sireco', 'Class40', '#D1E0F3', 'Thomas Lurton'),
    b('50', 'SNSM, faites un don !', 'Class40', '#FFFFFF', 'Corentin Douguet'),
    b('74', 'Sogestran - Seafrigo', 'Class40', '#018A70', 'Guillaume Pirouelle'),
    b('53', 'Solano', 'Class40', '#D1E0F3', 'Robin Follin'),
    b('75', 'Team Zeiss', 'Class40', '#DDDB01', 'Thimoté Polet'),
    b('57', 'Viranga', 'Class40', '#E84487', 'Emmanuel Hamez'),
    b('47', 'VSF Sports', 'Class40', '#65D037', 'Pep Costa', 'ESP'),
    b('44', 'Wasabiii', 'Class40', '#FFFFFF', 'Stéphane Bodin'),
    b('58', 'Woman of Course', 'Class40', '#E71100', 'Théa Khelif'),
    b('43', 'Yoda', 'Class40', '#1695B5', 'Yohan Bertrand'),
    // Vintage Multi
    b('92', "Acapella - Proludic - La Chaine de l'Espoir", 'Vintage Multi', '#F2D21B', 'Charlie Capelle'),
    b('104', 'Arkea - Handicap International', 'Vintage Multi', '#FFFFFF', 'Damien Seguin'),
    b('91', 'Des Enfants Et Des Arbres', 'Vintage Multi', '#FFFFFF', 'Christophe Bogrand'),
    b('94', 'Fifty Fifty', 'Vintage Multi', '#0071FF', 'Laurent Etheimer'),
    b('101', 'French Touch Oceans Club', 'Vintage Multi', '#FFFFFF', 'Eric Peron'),
    b('95', 'Graine De Courage', 'Vintage Multi', '#2500FF', 'Florian Gueguen'),
    b('99', 'Groupe GCA', 'Vintage Multi', '#BC00FF', 'Gilles Lamire'),
    b('96', 'MG5-Wellness Training', 'Vintage Multi', '#FF0012', 'Marc Guillemot'),
    b('98', 'Oceans', 'Vintage Multi', '#B26900', 'Francis Joyon'),
    b('103', 'Perros-Guirec', 'Vintage Multi', '#E2D21A', 'Thierry Roger'),
    b('93', 'Trilogik', 'Vintage Multi', '#91B200', 'David Ducosson'),
    b('102', 'Use It Again', 'Vintage Multi', '#27B200', 'Romain Pilliard'),
    b('97', 'We Explore', 'Vintage Multi', '#00B242', 'François Guiffant'),
    // Vintage Mono
    b('113', 'Alegria', 'Vintage Mono', '#CFFF00', 'Jean Le Cam'),
    b('112', 'Armor-Lux - Le Finistère Assurance', 'Vintage Mono', '#FF9700', 'Kieran Le Borgne'),
    b('107', 'Echo-mer', 'Vintage Mono', '#38FF00', 'Wilfried Clerton'),
    b('116', 'Ecolhuma', 'Vintage Mono', '#00FF5E', 'Olivier Nemsguern'),
    b('106', 'Eurvad', 'Vintage Mono', '#00FFF5', 'Tanguy Caradec'),
    b('110', 'Faiaoahe', 'Vintage Mono', '#0071FF', 'Remy Gerin'),
    b('115', 'Feve - Votre Épargne Finance Des Fermes Bio', 'Vintage Mono', '#2500FF', 'Frédéric Mailhos'),
    b('105', 'Grain De Sable', 'Vintage Mono', '#FF00AA', 'Christophe Bachmann'),
    b('111', 'Groupe Cogedis Pour Enfants Du Mékong', 'Vintage Mono', '#FF0012', 'Patrick Isoard'),
    b('114', 'Le Cigare Rouge', 'Vintage Mono', '#C91F2C', 'Sidney Gavignet'),
    b('108', 'Snsm Guilvinec', 'Vintage Mono', '#B26900', 'Gilles Colubi'),
    b('109', 'Tagaroa', 'Vintage Mono', '#91B200', 'Amaury De Jamblinne De Meux', 'BEL'),
    b('117', 'Use It Again For Youth', 'Vintage Mono', '#27B200', 'Titouan Pilliard'),
];

export const BOATS_BY_ID = new Map(BOATS.map(m => [m.id, m]));

export const classColor = (className: string): string =>
    CLASSES.find(c => c.name === className)?.color ?? '#9aa4b2';

// Ligne de départ / arrivée
export const START = { lat: 48.72, lon: -1.84, label: 'Départ · Saint-Malo' };
export const FINISH = { lat: 16.225, lon: -61.53, label: 'Arrivée · Pointe-à-Pitre' };
export const RACE_START = Date.UTC(2026, 10, 1, 12, 2) / 1000; // 1er nov. 2026, 13h02 Paris
