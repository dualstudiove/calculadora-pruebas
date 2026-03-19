export interface LabExam {
  id: string;
  name: string;
  price: number;
  aliases: string;
  category?: string;
}

export const EXAM_CATEGORIES = [
  { id: 'S', name: 'Serología' },
  { id: 'Q', name: 'Química' },
  { id: 'B', name: 'Bacteriología' },
  { id: 'A', name: 'Pruebas de Alergia' },
  { id: 'H', name: 'Hormonas' },
  { id: 'U', name: 'Uroanálisis' },
  { id: 'C', name: 'Coproanálisis' },
  { id: 'MT', name: 'Marcadores Tumorales' },
  { id: 'O', name: 'Otros' }
];

export interface LabProfile {
  id: string;
  name: string;
  aliases: string;
  examIds: string[];
  specialPrice: number;
}

export const labExams: LabExam[] = [
  { id: '1', name: '% DE SATURACION', price: 15, aliases: '', category: 'Q' },
  { id: '2', name: 'ACIDO URICO', price: 4, aliases: '', category: 'Q' },
  { id: '3', name: 'ACS. PARA TUBERCULOSIS', price: 50, aliases: '', category: 'S' },
  { id: '4', name: 'AG. HELICOBACTER PILORY (HECES)', price: 18, aliases: '', category: 'C' },
  { id: '5', name: 'AGLUTININAS ANTI RH', price: 25, aliases: '', category: 'S' },
  { id: '6', name: 'AGLUTININAS FEBRILES', price: 25, aliases: '', category: 'S' },
  { id: '7', name: 'AMILASA', price: 6, aliases: '', category: 'Q' },
  { id: '8', name: 'ANTI D.N.A', price: 40, aliases: '', category: 'S' },
  { id: '9', name: 'ANTICUERPOS ANTINUCLEARES', price: 40, aliases: '', category: 'S' },
  { id: '10', name: 'ANTICUERPOS TOXOPLASMICOS (HAI)', price: 18, aliases: '', category: 'S' },
  { id: '11', name: 'ANTIESTREPTOLISINA O', price: 10, aliases: '', category: 'S' },
  { id: '12', name: 'B.H.C.G. CUANTITATIVA', price: 30, aliases: '', category: 'H' },
  { id: '13', name: 'BILIRRUBINA', price: 8, aliases: '', category: 'Q' },
  { id: '14', name: 'CALCIO', price: 5, aliases: '', category: 'Q' },
  { id: '15', name: 'CARDIOLIPINA IgG-IgM', price: 60, aliases: '', category: 'S' },
  { id: '16', name: 'CCP. CITRULINADO', price: 55, aliases: '', category: 'S' },
  { id: '17', name: 'CELULAS L.E.', price: 30, aliases: '', category: 'S' },
  { id: '18', name: 'CHAGAS', price: 18, aliases: '', category: 'S' },
  { id: '19', name: 'CITOMEGALOVIRUS IgG-IgM', price: 30, aliases: '', category: 'S' },
  { id: '20', name: 'CLORO', price: 7, aliases: '', category: 'Q' },
  { id: '21', name: 'COLESTEROL', price: 4, aliases: '', category: 'Q' },
  { id: '22', name: 'COOMBS DIRECTO', price: 25, aliases: '', category: 'S' },
  { id: '23', name: 'COOMBS INDIRECTO', price: 25, aliases: '', category: 'S' },
  { id: '24', name: 'CREATININA', price: 4, aliases: '', category: 'Q' },
  { id: '25', name: 'CULTIVOS (UROCULTIVO, HEMOCULTIVO, ETC)', price: 30, aliases: '', category: 'B' },
  { id: '26', name: 'DENGUE (IgG-IgM)', price: 30, aliases: '', category: 'S' },
  { id: '27', name: 'DEP. DE CREATININA EN 24 H.', price: 18, aliases: '', category: 'Q' },
  { id: '28', name: 'DHEA-S', price: 35, aliases: '', category: 'H' },
  { id: '29', name: 'EPSTEIN BARR IgG-IgM', price: 30, aliases: '', category: 'S' },
  { id: '30', name: 'ESTRADIOL', price: 18, aliases: '', category: 'H' },
  { id: '31', name: 'EX. HECES', price: 4, aliases: '', category: 'C' },
  { id: '32', name: 'F.S.H.', price: 18, aliases: '', category: 'H' },
  { id: '33', name: 'FACTOR REUMATOIDEO LATEX', price: 12, aliases: '', category: 'S' },
  { id: '34', name: 'FENOMENO LE', price: 30, aliases: '', category: 'S' },
  { id: '35', name: 'FIBRINOGENO', price: 6, aliases: '', category: 'O' },
  { id: '36', name: 'FOSFATASA ALCALINA', price: 6, aliases: '', category: 'Q' },
  { id: '37', name: 'FOSFOLIPIDOS IgG-IgM', price: 60, aliases: '', category: 'S' },
  { id: '38', name: 'FOSFORO', price: 5, aliases: '', category: 'Q' },
  { id: '39', name: 'FROTIS DE SANGRE PERIFERICA', price: 8, aliases: '', category: 'O' },
  { id: '40', name: 'G.G.T', price: 6, aliases: '', category: 'Q' },
  { id: '41', name: 'GLICEMIA', price: 4, aliases: '', category: 'Q' },
  { id: '42', name: 'GLICEMIA POST PANDRIAL', price: 4, aliases: '', category: 'Q' },
  { id: '43', name: 'GRUPO SANGUINEO', price: 8, aliases: '', category: 'O' },
  { id: '44', name: 'HEMOGLOBINA GLICADA (HbA1c)', price: 18, aliases: '', category: 'Q' },
  { id: '45', name: 'HELICOBACTER PYLORI CUALITATIVO', price: 20, aliases: '', category: 'S' },
  { id: '46', name: 'HELICOBACTER PYLORI IgG-IgM', price: 36, aliases: '', category: 'S' },
  { id: '47', name: 'HEMATOLOGIA COMPLETA', price: 8, aliases: 'Hemograma', category: 'S' },
  { id: '48', name: 'HEMOCULTIVO', price: 25, aliases: '', category: 'B' },
  { id: '49', name: 'CULT LIQ', price: 25, aliases: '', category: 'B' },
  { id: '50', name: 'COPROCULTIVO', price: 25, aliases: '', category: 'B' },
  { id: '51', name: 'HEPATITIS A IgG', price: 18, aliases: '', category: 'S' },
  { id: '52', name: 'HEPATITIS A IgM', price: 18, aliases: '', category: 'S' },
  { id: '53', name: 'HIERRO', price: 10, aliases: '', category: 'Q' },
  { id: '54', name: 'HIV 1+2 ELISA (4TA. GEN.)', price: 15, aliases: '', category: 'S' },
  { id: '55', name: 'INMUNOGLOBULINA A', price: 18, aliases: '', category: 'S' },
  { id: '56', name: 'INMUNOGLOBULINA E (IGE)', price: 18, aliases: '', category: 'A' },
  { id: '57', name: 'INMUNOGLOBULINA G', price: 18, aliases: '', category: 'S' },
  { id: '58', name: 'INMUNOGLOBULINA M', price: 18, aliases: '', category: 'S' },
  { id: '59', name: 'L.H', price: 18, aliases: '', category: 'H' },
  { id: '60', name: 'LDH', price: 6, aliases: '', category: 'Q' },
  { id: '61', name: 'LEUCOCITOS', price: 4, aliases: '', category: 'O' },
  { id: '62', name: 'DIFERENCIAL', price: 4, aliases: '', category: 'O' },
  { id: '63', name: 'LIPASA', price: 20, aliases: '', category: 'Q' },
  { id: '64', name: 'MAGNESIO', price: 5, aliases: '', category: 'Q' },
  { id: '65', name: 'MICROALBUMINURIA', price: 12, aliases: '', category: 'U' },
  { id: '66', name: 'ORINA', price: 4, aliases: '', category: 'U' },
  { id: '67', name: 'PCR CUANTITATIVA', price: 10, aliases: '', category: 'S' },
  { id: '72', name: 'PH y AZUCARES RED.', price: 8, aliases: '', category: 'C' },
  { id: '73', name: 'POTASIO', price: 7, aliases: '', category: 'Q' },
  { id: '74', name: 'PROGESTERONA', price: 18, aliases: '', category: 'H' },
  { id: '75', name: 'PROLACTINA', price: 18, aliases: '', category: 'H' },
  { id: '76', name: 'PROTEINURIA', price: 10, aliases: '', category: 'U' },
  { id: '77', name: 'PROTEOGRAMA', price: 8, aliases: '', category: 'Q' },
  { id: '78', name: 'PRUEBA DE EMBARAZO CUALITATIVA', price: 7, aliases: '', category: 'S' },
  { id: '79', name: 'PRUEBA de IGRA PARA TUBERCULOSIS', price: 60, aliases: '', category: 'S' },
  { id: '80', name: 'REL. ACIDO URICO/CREATININA', price: 8, aliases: '', category: 'Q' },
  { id: '81', name: 'REL. CALCIO/CREATININA', price: 9, aliases: '', category: 'Q' },
  { id: '82', name: 'RETICULOCITO', price: 6, aliases: '', category: 'O' },
  { id: '83', name: 'SANGRE OCULTA (HECES)', price: 7, aliases: '', category: 'C' },
  { id: '84', name: 'SODIO', price: 7, aliases: '', category: 'Q' },
  { id: '85', name: 'SUDAM III (HECES)', price: 5, aliases: '', category: 'C' },
  { id: '86', name: 'TIEMPO DE SANGRIA', price: 5, aliases: '', category: 'O' },
  { id: '87', name: 'TIEMPO DE COAGULACION', price: 5, aliases: '', category: 'O' },
  { id: '88', name: 'T.G.O', price: 6, aliases: '', category: 'Q' },
  { id: '89', name: 'T.G.P', price: 6, aliases: '', category: 'Q' },
  { id: '90', name: 'T.P.T', price: 5, aliases: '', category: 'O' },
  { id: '91', name: 'T.P', price: 5, aliases: '', category: 'O' },
  { id: '92', name: 'T.S.H', price: 18, aliases: '', category: 'H' },
  { id: '93', name: 'T3 LIBRE', price: 18, aliases: '', category: 'H' },
  { id: '94', name: 'T3 TOTAL', price: 18, aliases: '', category: 'H' },
  { id: '95', name: 'T4 LIBRE', price: 18, aliases: '', category: 'H' },
  { id: '96', name: 'T4 TOTAL', price: 18, aliases: '', category: 'H' },
  { id: '97', name: 'TESTOSTERONA LIBRE', price: 20, aliases: '', category: 'H' },
  { id: '98', name: 'TESTOSTERONA TOTAL', price: 18, aliases: '', category: 'H' },
  { id: '99', name: 'TOXO (IgG-IgM)', price: 36, aliases: '', category: 'S' },
  { id: '100', name: 'TRANSFERRINA', price: 12, aliases: '', category: 'Q' },
  { id: '101', name: 'TRIGLICERIDOS', price: 4, aliases: '', category: 'Q' },
  { id: '102', name: 'UREA', price: 4, aliases: '', category: 'Q' },
  { id: '103', name: 'V.S.G', price: 7, aliases: '', category: 'O' },
  { id: '104', name: 'VDRL', price: 8, aliases: '', category: 'S' },
  { id: '105', name: 'CORTISOL', price: 35, aliases: 'Hormona del estrés', category: 'H' }
];

export const labProfiles: LabProfile[] = [
  {
    id: 'p1',
    name: 'PERFIL PRE-OPERATORIO',
    aliases: 'Preoperatorio, Cirugía',
    examIds: ['47', '41', '102', '24', '91', '90', '66', '54', '104'],
    specialPrice: 40
  },
  {
    id: 'p2',
    name: 'PERFIL LIPIDICO',
    aliases: 'Lípidos',
    examIds: ['21', '101'],
    specialPrice: 12
  },
  {
    id: 'p3',
    name: 'PERFIL TIROIDEO',
    aliases: 'Tiroides',
    examIds: ['93', '95', '92'],
    specialPrice: 50
  }
];
