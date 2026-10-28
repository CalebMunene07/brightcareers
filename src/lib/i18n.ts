// Language support for the site chrome (top bar, header and footer).
// Page content is still English only; add translations here as they become available.

export const locales = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "pt", label: "Português" },
  { code: "sw", label: "Kiswahili" },
] as const;

export type Locale = (typeof locales)[number]["code"];

export const defaultLocale: Locale = "en";
export const LOCALE_COOKIE = "locale";

export function isLocale(value: string | undefined): value is Locale {
  return locales.some((l) => l.code === value);
}

export type NavItem = { label: string; href: string };

export type Dictionary = {
  forJobSeekers: string;
  forEmployers: string;
  language: string;
  region: string;
  menuOpen: string;
  menuClose: string;
  seekerNav: NavItem[];
  seekerResources: NavItem[];
  employerNav: NavItem[];
  employerResources: NavItem[];
  resources: string;
  search: string;
  searchPlaceholder: string;
  footer: {
    tagline: string;
    emailLabel: string;
    emailPlaceholder: string;
    subscribe: string;
    rights: string;
    legal: NavItem[];
    columns: { title: string; links: NavItem[] }[];
  };
};

// Link targets are shared by every language; only the labels change.
const routes = {
  seekerNav: ["/jobs", "/working-with-bridge", "/jobs-for-refugees", "/employers/who-we-are", "/cv-maker", "/faq"],
  seekerResources: ["/visa-application", "/air-ticket-booking", "/#insights", "/#locations", "/diversity-and-inclusion", "/contact-us"],
  employerNav: ["/employers", "/employers/how-we-work", "/employers/solutions", "/employers/industries", "/employers/who-we-are"],
  employerResources: ["/employers/resources", "/employers/faq", "/employers/request-staff", "/contact-us"],
  legal: ["/terms-of-use", "/privacy-policy", "/cookie-policy", "/accessibility-statement"],
  footer: [
    [
      "/employers/solutions/flexible-staffing",
      "/employers/solutions/permanent-recruitment",
      "/employers/solutions/outsourcing",
      "/employers/solutions/training",
      "/employers/solutions/diversity-and-inclusion",
    ],
    ["/jobs", "/working-with-bridge", "/jobs-for-refugees", "/cv-maker", "/visa-application", "/air-ticket-booking", "/faq"],
    ["/employers", "/employers/how-we-work", "/employers/industries", "/employers/resources", "/employers/faq"],
    ["/employers/who-we-are", "/diversity-and-inclusion", "/employers/request-staff", "/contact-us"],
  ],
};

function zip(hrefs: string[], labels: string[]): NavItem[] {
  return hrefs.map((href, i) => ({ href, label: labels[i] }));
}

type Labels = {
  chrome: Omit<Dictionary, "seekerNav" | "seekerResources" | "employerNav" | "employerResources" | "footer">;
  seekerNav: string[];
  seekerResources: string[];
  employerNav: string[];
  employerResources: string[];
  footer: Omit<Dictionary["footer"], "legal" | "columns"> & {
    legal: string[];
    columnTitles: string[];
    columns: string[][];
  };
};

const labels: Record<Locale, Labels> = {
  en: {
    chrome: {
      forJobSeekers: "For Job Seekers",
      forEmployers: "For Employers",
      language: "Language",
      region: "Global",
      menuOpen: "Open menu",
      menuClose: "Close menu",
      resources: "Resources",
      search: "Search",
      searchPlaceholder: "Search jobs, e.g. nurse",
    },
    seekerNav: ["Find a Job", "Working With Bridge", "Jobs for Refugees", "Who We Are", "CV Maker", "FAQ"],
    seekerResources: ["Visa application", "Air ticket booking", "Career insights", "Jobs by country", "Diversity & inclusion", "Contact us"],
    employerNav: ["The Bridge Advantage", "How We Work", "Solutions", "Industries", "Who We Are"],
    employerResources: ["Articles & guides", "Employer FAQ", "Request a quote", "Contact us"],
    footer: {
      tagline: "Connecting people with meaningful work and helping organisations build teams that last.",
      emailLabel: "Email address",
      emailPlaceholder: "Your email",
      subscribe: "Subscribe",
      rights: "All rights reserved.",
      legal: ["Terms of use", "Privacy policy", "Cookie policy", "Accessibility"],
      columnTitles: ["Solutions", "For Job Seekers", "For Employers", "Bridge"],
      columns: [
        ["Flexible staffing", "Permanent recruitment", "Outsourcing", "Training", "Diversity & inclusion"],
        ["Find a job", "Working with Bridge", "Jobs for refugees", "CV maker", "Visa application", "Air ticket booking", "Job seeker FAQ"],
        ["The Bridge advantage", "How we work", "Industries", "Resources", "Employer FAQ"],
        ["Who we are", "Diversity & inclusion", "Request a quote", "Contact us"],
      ],
    },
  },
  fr: {
    chrome: {
      forJobSeekers: "Candidats",
      forEmployers: "Employeurs",
      language: "Langue",
      region: "Monde",
      menuOpen: "Ouvrir le menu",
      menuClose: "Fermer le menu",
      resources: "Ressources",
      search: "Rechercher",
      searchPlaceholder: "Rechercher un emploi, ex. infirmier",
    },
    seekerNav: ["Trouver un emploi", "Travailler avec Bridge", "Emplois pour réfugiés", "Qui sommes-nous", "Créateur de CV", "FAQ"],
    seekerResources: ["Demande de visa", "Réservation de billet d'avion", "Conseils carrière", "Emplois par pays", "Diversité et inclusion", "Nous contacter"],
    employerNav: ["L'avantage Bridge", "Notre méthode", "Solutions", "Secteurs", "Qui sommes-nous"],
    employerResources: ["Articles et guides", "FAQ employeurs", "Demander un devis", "Nous contacter"],
    footer: {
      tagline: "Nous mettons les personnes en relation avec un travail qui a du sens et aidons les organisations à bâtir des équipes durables.",
      emailLabel: "Adresse e-mail",
      emailPlaceholder: "Votre e-mail",
      subscribe: "S'abonner",
      rights: "Tous droits réservés.",
      legal: ["Conditions d'utilisation", "Confidentialité", "Cookies", "Accessibilité"],
      columnTitles: ["Solutions", "Candidats", "Employeurs", "Bridge"],
      columns: [
        ["Personnel flexible", "Recrutement permanent", "Externalisation", "Formation", "Diversité et inclusion"],
        ["Trouver un emploi", "Travailler avec Bridge", "Emplois pour réfugiés", "Créateur de CV", "Demande de visa", "Réservation de billet d'avion", "FAQ candidats"],
        ["L'avantage Bridge", "Notre méthode", "Secteurs", "Ressources", "FAQ employeurs"],
        ["Qui sommes-nous", "Diversité et inclusion", "Demander un devis", "Nous contacter"],
      ],
    },
  },
  pt: {
    chrome: {
      forJobSeekers: "Candidatos",
      forEmployers: "Empregadores",
      language: "Idioma",
      region: "Global",
      menuOpen: "Abrir menu",
      menuClose: "Fechar menu",
      resources: "Recursos",
      search: "Pesquisar",
      searchPlaceholder: "Pesquisar vagas, ex. enfermeiro",
    },
    seekerNav: ["Encontrar emprego", "Trabalhar com a Bridge", "Empregos para refugiados", "Quem somos", "Criador de CV", "Perguntas frequentes"],
    seekerResources: ["Pedido de visto", "Reserva de passagem aérea", "Dicas de carreira", "Vagas por país", "Diversidade e inclusão", "Contacte-nos"],
    employerNav: ["A vantagem Bridge", "Como trabalhamos", "Soluções", "Setores", "Quem somos"],
    employerResources: ["Artigos e guias", "Perguntas de empregadores", "Pedir orçamento", "Contacte-nos"],
    footer: {
      tagline: "Ligamos pessoas a trabalho com significado e ajudamos organizações a construir equipas duradouras.",
      emailLabel: "Endereço de e-mail",
      emailPlaceholder: "O seu e-mail",
      subscribe: "Subscrever",
      rights: "Todos os direitos reservados.",
      legal: ["Termos de uso", "Privacidade", "Cookies", "Acessibilidade"],
      columnTitles: ["Soluções", "Candidatos", "Empregadores", "Bridge"],
      columns: [
        ["Pessoal flexível", "Recrutamento permanente", "Outsourcing", "Formação", "Diversidade e inclusão"],
        ["Encontrar emprego", "Trabalhar com a Bridge", "Empregos para refugiados", "Criador de CV", "Pedido de visto", "Reserva de passagem aérea", "Perguntas de candidatos"],
        ["A vantagem Bridge", "Como trabalhamos", "Setores", "Recursos", "Perguntas de empregadores"],
        ["Quem somos", "Diversidade e inclusão", "Pedir orçamento", "Contacte-nos"],
      ],
    },
  },
  sw: {
    chrome: {
      forJobSeekers: "Wanaotafuta Kazi",
      forEmployers: "Waajiri",
      language: "Lugha",
      region: "Kimataifa",
      menuOpen: "Fungua menyu",
      menuClose: "Funga menyu",
      resources: "Rasilimali",
      search: "Tafuta",
      searchPlaceholder: "Tafuta kazi, mf. muuguzi",
    },
    seekerNav: ["Tafuta kazi", "Kufanya kazi na Bridge", "Kazi kwa wakimbizi", "Sisi ni nani", "Kitengeneza CV", "Maswali"],
    seekerResources: ["Maombi ya viza", "Kuhifadhi tiketi ya ndege", "Ushauri wa kazi", "Kazi kwa nchi", "Utofauti na ujumuishi", "Wasiliana nasi"],
    employerNav: ["Faida ya Bridge", "Jinsi tunavyofanya kazi", "Suluhisho", "Sekta", "Sisi ni nani"],
    employerResources: ["Makala na miongozo", "Maswali ya waajiri", "Omba bei", "Wasiliana nasi"],
    footer: {
      tagline: "Tunawaunganisha watu na kazi yenye maana na kusaidia mashirika kujenga timu imara.",
      emailLabel: "Barua pepe",
      emailPlaceholder: "Barua pepe yako",
      subscribe: "Jisajili",
      rights: "Haki zote zimehifadhiwa.",
      legal: ["Masharti ya matumizi", "Faragha", "Vidakuzi", "Ufikivu"],
      columnTitles: ["Suluhisho", "Wanaotafuta Kazi", "Waajiri", "Bridge"],
      columns: [
        ["Wafanyakazi wa muda", "Ajira za kudumu", "Utoaji huduma", "Mafunzo", "Utofauti na ujumuishi"],
        ["Tafuta kazi", "Kufanya kazi na Bridge", "Kazi kwa wakimbizi", "Kitengeneza CV", "Maombi ya viza", "Kuhifadhi tiketi ya ndege", "Maswali ya wanaotafuta kazi"],
        ["Faida ya Bridge", "Jinsi tunavyofanya kazi", "Sekta", "Rasilimali", "Maswali ya waajiri"],
        ["Sisi ni nani", "Utofauti na ujumuishi", "Omba bei", "Wasiliana nasi"],
      ],
    },
  },
};

export function getDictionary(locale: Locale): Dictionary {
  const l = labels[locale];
  const { legal, columnTitles, columns, ...footerText } = l.footer;
  return {
    ...l.chrome,
    seekerNav: zip(routes.seekerNav, l.seekerNav),
    seekerResources: zip(routes.seekerResources, l.seekerResources),
    employerNav: zip(routes.employerNav, l.employerNav),
    employerResources: zip(routes.employerResources, l.employerResources),
    footer: {
      ...footerText,
      legal: zip(routes.legal, legal),
      columns: columnTitles.map((title, i) => ({ title, links: zip(routes.footer[i], columns[i]) })),
    },
  };
}
