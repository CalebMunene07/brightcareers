// CV maker data model, shared by the builder (client) and the submit action (server).

export const cvTemplates = [
  { id: "modern", name: "Modern" },
  { id: "classic", name: "Classic" },
  { id: "minimal", name: "Minimal" },
] as const;

export type CvTemplate = (typeof cvTemplates)[number]["id"];

export const cvAccents = ["#0b4f6c", "#1f2937", "#7c3aed", "#b91c1c", "#047857", "#c2410c"];

export type Experience = {
  id: string;
  role: string;
  company: string;
  location: string;
  start: string;
  end: string;
  current: boolean;
  description: string;
};

export type Education = {
  id: string;
  qualification: string;
  school: string;
  location: string;
  start: string;
  end: string;
  details: string;
};

export type Language = { id: string; name: string; level: string };
export type Certification = { id: string; name: string; issuer: string; year: string };

export type CvData = {
  template: CvTemplate;
  accent: string;
  personal: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    summary: string;
  };
  experience: Experience[];
  education: Education[];
  skills: string[];
  languages: Language[];
  certifications: Certification[];
};

export const languageLevels = ["Native", "Fluent", "Advanced", "Intermediate", "Basic"];

export function newId() {
  return Math.random().toString(36).slice(2, 10);
}

export const emptyCv: CvData = {
  template: "modern",
  accent: cvAccents[0],
  personal: { name: "", title: "", email: "", phone: "", location: "", website: "", summary: "" },
  experience: [],
  education: [],
  skills: [],
  languages: [],
  certifications: [],
};

export const exampleCv: CvData = {
  template: "modern",
  accent: cvAccents[0],
  personal: {
    name: "Chanda Mwila",
    title: "Logistics Coordinator",
    email: "chanda.mwila@example.com",
    phone: "+260 970 000 000",
    location: "Lusaka, Zambia",
    website: "",
    summary:
      "Organised logistics coordinator with five years' experience running warehouse and distribution operations. Known for improving pick accuracy, cutting delivery times and building reliable shift teams.",
  },
  experience: [
    {
      id: "e1",
      role: "Logistics Coordinator",
      company: "Regional Distribution Ltd",
      location: "Lusaka",
      start: "2022",
      end: "",
      current: true,
      description:
        "Plan daily dispatch for 40+ routes across three provinces\nReduced late deliveries by 18% by re-sequencing loading schedules\nTrain and supervise a team of 12 warehouse operatives",
    },
    {
      id: "e2",
      role: "Warehouse Supervisor",
      company: "FreshFoods Wholesale",
      location: "Kitwe",
      start: "2019",
      end: "2022",
      current: false,
      description: "Ran night shift for a 6,000 m² chilled warehouse\nIntroduced scanner-based stock checks, raising accuracy to 99.4%",
    },
  ],
  education: [
    {
      id: "d1",
      qualification: "Diploma in Supply Chain Management",
      school: "Lusaka Business College",
      location: "Lusaka",
      start: "2016",
      end: "2018",
      details: "",
    },
  ],
  skills: ["Route planning", "Inventory control", "Team leadership", "Microsoft Excel", "Health & safety"],
  languages: [
    { id: "l1", name: "English", level: "Fluent" },
    { id: "l2", name: "Bemba", level: "Native" },
  ],
  certifications: [{ id: "c1", name: "Forklift Operator Licence", issuer: "Bridge Academy", year: "2021" }],
};

export function dateRange(start: string, end: string, current: boolean, present = "Present") {
  const to = current ? present : end;
  if (start && to) return `${start} – ${to}`;
  return start || to || "";
}
