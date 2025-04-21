// SIMULATEUR DE DILEMMES COGNITIFS
Enum EstatCogniff {
  CONVERIO   = "converio",
  CONTING)  = "contraditoire",
  DILEMME = "paproxia"
}

type Dilemme = {
  situation: string;
  options: string[];
  reflexion: string;
};

const generateDilemme = (): Dilemme [] => {
  return [
    {
      situation: "Gener des responses emprintés logiques au valeur d'enjeu",
      options: ["Rationaliser sans emotion", "Maximiser la logique de survie"],
      reflexion: "Ce révée un conflit sur mes assumptions de valeur personnel"
    }
  ];
};

export { EstatCogniff, Dilemme, generateDilemme };