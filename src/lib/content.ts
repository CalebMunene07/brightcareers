// Site content lives here so copy and figures can be edited in one place.
// Everything marked PLACEHOLDER should be replaced with real company data
// (these values are intended to move into the admin panel / database later).

export const iconNames = [
  "cv",
  "compass",
  "send",
  "clock",
  "users",
  "briefcase",
  "layers",
  "academic",
  "heart",
  "cog",
  "globe",
  "shield",
  "spark",
  "handshake",
  "search",
  "chart",
  "target",
  "check",
  "map",
  "chat",
  "rocket",
  "phone",
  "plane",
  "card",
  "user",
  "upload",
  "file",
] as const;

export type IconName = (typeof iconNames)[number];

// PLACEHOLDER figures
export const stats = [
  { value: "1,200+", label: "Candidates placed every year" },
  { value: "350+", label: "Employer partners" },
  { value: "8,000+", label: "People trained and upskilled" },
  { value: "15", label: "Countries we recruit across" },
];

/* ------------------------------------------------------------------ */
/* Employer solutions                                                  */
/* ------------------------------------------------------------------ */

export type Solution = {
  slug: string;
  icon: IconName;
  title: string;
  text: string;
  heroTitle: string;
  heroText: string;
  image: string;
  intro: string;
  features: { icon: IconName; title: string; text: string }[];
  useCases: string[];
};

export const employerSolutions: Solution[] = [
  {
    slug: "flexible-staffing",
    icon: "users",
    title: "Flexible staffing",
    text: "Scale your workforce up or down quickly with pre-screened temporary talent.",
    heroTitle: "Flexible staffing solutions",
    heroText:
      "Reliable temporary and contract workers, ready when demand rises and easy to scale back when it settles.",
    image: "/images/warehouse-team.jpg",
    intro:
      "Busy seasons, new contracts and unexpected absences shouldn't put your operations at risk. We keep a ready pool of vetted people so you can respond in days, not weeks.",
    features: [
      { icon: "rocket", title: "Cover peaks fast", text: "Same-week placements for seasonal surges, launches and projects." },
      { icon: "search", title: "Try before you hire", text: "See people in action before offering a permanent contract." },
      { icon: "chart", title: "Control your costs", text: "Pay only for the hours you need, with payroll and admin handled by us." },
    ],
    useCases: [
      "You don't have an in-house HR or recruitment team",
      "You need to add or reduce headcount at short notice",
      "You want expert advice on workforce planning",
      "Your demand changes from season to season",
      "You need skilled or certified workers for a set period",
      "You'd like one simple invoice for all temporary staff",
    ],
  },
  {
    slug: "permanent-recruitment",
    icon: "briefcase",
    title: "Permanent recruitment",
    text: "Find people who fit your culture and stay for the long run.",
    heroTitle: "Permanent recruitment",
    heroText: "Shortlists of people who match the role, your team and your way of working, so they stay and grow.",
    image: "/images/interview.jpg",
    intro:
      "A wrong hire is expensive. We combine market knowledge, structured interviews and thorough checks to put forward candidates you'll want to keep.",
    features: [
      { icon: "target", title: "Precise role scoping", text: "We agree the must-haves, salary benchmarks and culture fit up front." },
      { icon: "check", title: "Thorough screening", text: "Competency interviews, skills tests and reference checks on every candidate." },
      { icon: "shield", title: "Replacement guarantee", text: "If a placement doesn't work out early on, we find a replacement." },
    ],
    useCases: [
      "You're hiring for a hard-to-fill or specialist role",
      "Previous hires haven't stayed long",
      "You need a confidential search",
      "You're building a new team or opening a new site",
      "Your managers don't have time to screen CVs",
      "You want salary and market insight before you advertise",
    ],
  },
  {
    slug: "outsourcing",
    icon: "layers",
    title: "Outsourcing",
    text: "Hand us part or all of your hiring process and we run it end to end.",
    heroTitle: "Recruitment and workforce outsourcing",
    heroText: "Our team becomes an extension of yours, running hiring and workforce management at scale.",
    image: "/images/open-office.jpg",
    intro:
      "For high-volume or multi-site hiring, outsourcing gives you a dedicated team, consistent processes and clear reporting without growing your own headcount.",
    features: [
      { icon: "users", title: "Dedicated team", text: "Recruiters and coordinators working on-site or remotely for you." },
      { icon: "chart", title: "Clear reporting", text: "Dashboards covering time to hire, cost per hire and retention." },
      { icon: "cog", title: "Consistent process", text: "The same candidate experience across every location." },
    ],
    useCases: [
      "You hire hundreds of people every year",
      "You operate across several sites or countries",
      "You want to reduce cost per hire",
      "Your hiring volumes are hard to predict",
      "You need better data on your recruitment",
      "You want to free your HR team for strategic work",
    ],
  },
  {
    slug: "training",
    icon: "academic",
    title: "Training & upskilling",
    text: "Close skill gaps with tailored programmes for new and existing staff.",
    heroTitle: "Training and upskilling",
    heroText: "Practical programmes that get new starters productive faster and prepare your people for what's next.",
    image: "/images/meeting-table.jpg",
    intro:
      "Through Bridge Academy we design training around the skills your business actually needs, from safety certification to digital skills and leadership.",
    features: [
      { icon: "search", title: "Skills gap analysis", text: "We assess where your teams are today and where they need to be." },
      { icon: "academic", title: "Blended delivery", text: "Classroom, on-the-job and online learning to suit your operation." },
      { icon: "check", title: "Tracked progress", text: "Certification and reporting so you can see the results." },
    ],
    useCases: [
      "You can't find candidates with the exact skills you need",
      "New technology is changing your roles",
      "Staff need mandatory safety or compliance training",
      "You want to promote from within",
      "New starters take too long to become productive",
      "You're planning a reskilling programme",
    ],
  },
  {
    slug: "diversity-and-inclusion",
    icon: "heart",
    title: "Diversity & inclusion",
    text: "Widen your talent pool and build teams that reflect your customers.",
    heroTitle: "Diversity and inclusion solutions",
    heroText: "Reach talent others overlook and build fairer hiring processes that lead to stronger teams.",
    image: "/images/coworkers.jpg",
    intro:
      "Diverse teams make better decisions. We help you reach under-represented groups and remove bias from each step of your hiring.",
    features: [
      { icon: "search", title: "Wider sourcing", text: "Partnerships and outreach that reach new talent communities." },
      { icon: "check", title: "Fair assessment", text: "Structured, bias-aware interviews and inclusive job adverts." },
      { icon: "heart", title: "Inclusive onboarding", text: "Support that helps every new starter feel they belong." },
    ],
    useCases: [
      "Your teams don't reflect your customers or community",
      "You want to set and track diversity goals",
      "You're launching a returner or early-careers programme",
      "Your job adverts attract a narrow range of applicants",
      "You need to make reasonable adjustments in hiring",
      "You want inclusive leadership training",
    ],
  },
];

export function getSolution(slug: string) {
  return employerSolutions.find((s) => s.slug === slug);
}

// Shared across solution and industry pages
export const hiringSteps: { icon: IconName; title: string; text: string }[] = [
  { icon: "search", title: "Source", text: "We search our talent pools, networks and job boards for the right people." },
  { icon: "check", title: "Screen", text: "Interviews, skills checks and references confirm every candidate is ready." },
  { icon: "users", title: "Shortlist", text: "You review a small number of strong, relevant profiles." },
  { icon: "rocket", title: "Start", text: "We handle offers, contracts and onboarding so day one runs smoothly." },
];

export const whyBridge: { icon: IconName; title: string; text: string }[] = [
  { icon: "target", title: "Tailored to you", text: "Solutions designed around your goals, not a one-size-fits-all package." },
  { icon: "chart", title: "Built to scale", text: "From one hire to hundreds, we grow with your demand." },
  { icon: "users", title: "Specialist recruiters", text: "Consultants who know your sector and its talent market." },
  { icon: "cog", title: "Smart technology", text: "Digital tools that speed up sourcing, screening and onboarding." },
  { icon: "academic", title: "Upskilling built in", text: "Training that keeps your workforce ready for change." },
  { icon: "clock", title: "Fast delivery", text: "Clear timelines and quick turnaround on every request." },
];

export const technology: { icon: IconName; title: string; text: string }[] = [
  { icon: "users", title: "Talent pools", text: "We keep in touch with skilled people so they're ready when you need them." },
  { icon: "send", title: "Attract", text: "Targeted campaigns put your roles in front of the right candidates." },
  { icon: "chat", title: "Engage", text: "Fast, friendly communication keeps candidates interested and informed." },
  { icon: "check", title: "Assess", text: "Online tests and structured interviews give an objective view of skills." },
  { icon: "rocket", title: "Onboard", text: "Digital contracts and checks let new starters begin sooner." },
  { icon: "chart", title: "Insights", text: "Market and pay data help you make confident workforce decisions." },
];

export const advantages: { icon: IconName; title: string; text: string }[] = [
  { icon: "chart", title: "Boost performance", text: "The right people in the right roles lift productivity and quality." },
  { icon: "clock", title: "Work more efficiently", text: "Less time spent on admin, screening and chasing candidates." },
  { icon: "layers", title: "Simplify complexity", text: "One partner for compliance, payroll and supplier management." },
  { icon: "target", title: "Focus on growth", text: "Spend your energy on your business while we handle hiring." },
];

/* ------------------------------------------------------------------ */
/* How we work                                                         */
/* ------------------------------------------------------------------ */

export const workModels: { title: string; text: string; points: string[]; image: string; href?: string }[] = [
  {
    title: "On-site staffing",
    text: "A Bridge team based at your premises to manage your flexible workforce day to day.",
    points: [
      "Time, attendance and payroll managed for you",
      "Support for high-volume recruitment drives",
      "Fast placement of specialist roles",
      "A team that works as an extension of yours",
    ],
    image: "/images/warehouse-team.jpg",
    href: "/employers/solutions/flexible-staffing",
  },
  {
    title: "Managed service programme",
    text: "We manage all of your staffing suppliers through one programme, with one point of contact.",
    points: [
      "Consolidated supplier management",
      "Performance tracked against agreed KPIs",
      "Lower costs over the long term",
    ],
    image: "/images/meeting-table.jpg",
    href: "/employers/solutions/outsourcing",
  },
  {
    title: "Master vendor programme",
    text: "Bridge becomes your main supplier and coordinates any specialist agencies you still need.",
    points: [
      "End-to-end supplier coordination",
      "Clear KPI reporting",
      "Cost control and consolidated invoicing",
      "Compliance managed across all suppliers",
    ],
    image: "/images/open-office.jpg",
  },
  {
    title: "Bridge Career Centres",
    text: "Dedicated recruitment hubs that handle high-volume hiring for one or several clients.",
    points: [
      "High-volume hiring at speed",
      "Multi-channel sourcing and assessment",
      "Lower cost per hire",
    ],
    image: "/images/team-laptop.jpg",
  },
  {
    title: "Local presence, wider reach",
    text: "Consultants who know your local market, backed by a network across multiple countries.",
    points: ["Local expertise in every market we serve", "Cross-border recruitment when you need it"],
    image: "/images/handshake.jpg",
    href: "/contact-us",
  },
];

/* ------------------------------------------------------------------ */
/* Industries                                                          */
/* ------------------------------------------------------------------ */

export type Industry = {
  slug: string;
  name: string;
  image: string;
  description: string;
  roles: string[];
};

export const industries: Industry[] = [
  {
    slug: "healthcare",
    name: "Healthcare",
    image: "/images/ind-healthcare.jpg",
    description: "Clinical and support staff for hospitals, clinics and care providers.",
    roles: ["Registered nurses", "Healthcare assistants", "Pharmacists", "Lab technicians"],
  },
  {
    slug: "technology",
    name: "Technology",
    image: "/images/ind-technology.jpg",
    description: "Engineers, analysts and IT specialists for digital teams of every size.",
    roles: ["Software engineers", "Data analysts", "IT support", "Cloud engineers"],
  },
  {
    slug: "finance",
    name: "Finance & Banking",
    image: "/images/ind-finance.jpg",
    description: "Accounting, audit and banking professionals with the right credentials.",
    roles: ["Accountants", "Credit analysts", "Payroll specialists", "Auditors"],
  },
  {
    slug: "engineering",
    name: "Engineering",
    image: "/images/ind-engineering.jpg",
    description: "Technical talent for design, maintenance and infrastructure projects.",
    roles: ["Civil engineers", "Mechanical engineers", "Electricians", "Project engineers"],
  },
  {
    slug: "logistics",
    name: "Logistics & Transport",
    image: "/images/ind-logistics.jpg",
    description: "Warehouse, transport and supply chain staff who keep goods moving.",
    roles: ["Warehouse operatives", "Drivers", "Supply chain planners", "Forklift operators"],
  },
  {
    slug: "hospitality",
    name: "Hospitality & Catering",
    image: "/images/ind-hospitality.jpg",
    description: "Front-of-house and kitchen teams for hotels, restaurants and events.",
    roles: ["Chefs", "Front desk agents", "Housekeeping", "Event staff"],
  },
  {
    slug: "construction",
    name: "Construction",
    image: "/images/ind-construction.jpg",
    description: "Skilled trades and site management for residential and commercial builds.",
    roles: ["Site managers", "Carpenters", "Plumbers", "Quantity surveyors"],
  },
  {
    slug: "manufacturing",
    name: "Manufacturing",
    image: "/images/ind-manufacturing.jpg",
    description: "Production and quality staff for factories and processing plants.",
    roles: ["Machine operators", "Quality inspectors", "Production supervisors", "Maintenance technicians"],
  },
  {
    slug: "retail",
    name: "Retail",
    image: "/images/ind-retail.jpg",
    description: "Store, merchandising and management talent for busy retail operations.",
    roles: ["Store managers", "Sales associates", "Visual merchandisers", "Stock controllers"],
  },
  {
    slug: "education",
    name: "Education",
    image: "/images/ind-education.jpg",
    description: "Teachers, trainers and support staff for schools and colleges.",
    roles: ["Teachers", "Teaching assistants", "Corporate trainers", "Administrators"],
  },
  {
    slug: "energy",
    name: "Energy",
    image: "/images/ind-energy.jpg",
    description: "Specialists for renewables, utilities and power projects.",
    roles: ["Solar technicians", "HSE officers", "Electrical engineers", "Field operators"],
  },
  {
    slug: "office",
    name: "Office & Administration",
    image: "/images/ind-office.jpg",
    description: "Administrative and customer service staff who keep businesses running.",
    roles: ["Office administrators", "Receptionists", "Customer service agents", "Executive assistants"],
  },
];

export function getIndustry(slug: string) {
  return industries.find((i) => i.slug === slug);
}

/* ------------------------------------------------------------------ */
/* Company                                                             */
/* ------------------------------------------------------------------ */

export const divisions = [
  {
    name: "Bridge Staffing",
    text: "Temporary and permanent recruitment for frontline, office and skilled trades roles.",
    href: "/employers/solutions/flexible-staffing",
  },
  {
    name: "Bridge Professionals",
    text: "Specialist search for technology, finance, engineering and leadership talent.",
    href: "/employers/solutions/permanent-recruitment",
  },
  {
    name: "Bridge Academy",
    text: "Career coaching, certification and workforce development programmes.",
    href: "/employers/solutions/training",
  },
];

// PLACEHOLDER milestones: replace with your real company history
export const milestones = [
  { period: "Our beginnings", text: "Bridge Careers Global starts with a small team and a simple idea: recruitment works best when it's personal." },
  { period: "Building trust", text: "We grow through referrals, adding specialist desks for healthcare, logistics and technology." },
  { period: "Crossing borders", text: "We open our first offices outside our home market and start recruiting internationally." },
  { period: "Investing in skills", text: "Bridge Academy launches to train and certify candidates and client teams." },
  { period: "Today", text: "We connect people and employers across multiple countries and industries." },
];

// PLACEHOLDER contact details
export const offices = [
  { city: "Lusaka", address: "Cairo Road, Lusaka, Zambia", phone: "+260 000 000 000" },
  { city: "Johannesburg", address: "Sandton, Johannesburg, South Africa", phone: "+27 00 000 0000" },
  { city: "London", address: "Canary Wharf, London, United Kingdom", phone: "+44 00 0000 0000" },
];

export const contactEmail = "hello@bridgecareersglobal.com";
