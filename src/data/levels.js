// src/data/levels.js

export const cycles = ["maternelle", "primaire", "college", "lycee"];

export const cycleLabels = {
  maternelle: "Maternelle",
  primaire: "Primaire",
  college: "Collège",
  lycee: "Lycée",
};

export const levelsByCycle = {
  maternelle: [
    { slug: "ps", label: "Petite section", synonyms: ["PS"] },
    { slug: "ms", label: "Moyenne section", synonyms: ["MS"] },
    { slug: "gs", label: "Grande section", synonyms: ["GS"] },
  ],
  primaire: [
    { slug: "cp",  label: "CP",  synonyms: ["CP"] },
    { slug: "ce1", label: "CE1", synonyms: ["CE1"] },
    { slug: "ce2", label: "CE2", synonyms: ["CE2"] },
    { slug: "cm1", label: "CM1", synonyms: ["CM1"] },
    { slug: "cm2", label: "CM2", synonyms: ["CM2"] },
    { slug: "6e",  label: "6ème", synonyms: ["6eme", "CE6"] },
  ],
  college: [
    { slug: "5e", label: "5ème", synonyms: ["5eme", "1ere college"] },
    { slug: "4e", label: "4ème", synonyms: ["4eme", "2eme college"] },
    { slug: "3e", label: "3ème", synonyms: ["3eme", "3eme college"] },
  ],
  lycee: [
    { slug: "2nde", label: "2de / Tronc commun", synonyms: ["2de", "tronc commun"] },
    { slug: "1bac", label: "1ère / 1ère année BAC", synonyms: ["1ere bac"] },
    { slug: "tale", label: "Terminale / 2ème année BAC", synonyms: ["term", "2eme bac", "terminale"] },
  ],
};
