// Employer resources (guides and insights). Intended to be managed from the admin panel later.

export const resourceCategories = ["Guides", "Insights", "Articles"] as const;
export type ResourceCategory = (typeof resourceCategories)[number];

export type Resource = {
  slug: string;
  category: ResourceCategory;
  title: string;
  excerpt: string;
  image: string;
  date: string; // ISO
  body: { heading?: string; text: string }[];
};

export const resources: Resource[] = [
  {
    slug: "temporary-or-permanent",
    category: "Guides",
    title: "Temporary or permanent: choosing the right hire for the job",
    excerpt: "A simple framework for deciding which type of hire fits your situation.",
    image: "/images/meeting-table.jpg",
    date: "2026-09-25",
    body: [
      { text: "Both temporary and permanent hiring have their place. The right choice depends on how long you need the skills, how predictable the work is and how quickly you need someone." },
      { heading: "When temporary works best", text: "Seasonal peaks, projects with an end date, cover for leave and testing a new role before committing are all good reasons to hire on a temporary basis." },
      { heading: "When permanent makes sense", text: "If the work is ongoing, central to your business or needs deep knowledge that takes time to build, a permanent hire is usually the better investment." },
      { heading: "The middle ground", text: "Temp-to-perm lets you see someone in the role before offering a permanent contract, reducing the risk for both sides." },
    ],
  },
  {
    slug: "writing-job-adverts",
    category: "Guides",
    title: "How to write a job advert that attracts the right people",
    excerpt: "Clear, honest adverts get more relevant applicants and fewer wasted interviews.",
    image: "/images/laptop-woman.jpg",
    date: "2026-09-18",
    body: [
      { text: "Your job advert is often the first impression a candidate has of your company. A few simple changes can make a big difference to who applies." },
      { heading: "Lead with the role", text: "Open with what the person will actually do and why it matters, not a long description of your company." },
      { heading: "Separate must-haves from nice-to-haves", text: "Long requirement lists put off good candidates, particularly those who only apply when they meet every point." },
      { heading: "Be open about pay", text: "Including a salary range increases applications and saves time for everyone." },
    ],
  },
  {
    slug: "peak-season-planning",
    category: "Insights",
    title: "Planning your workforce for peak season",
    excerpt: "Start early, plan for absence and onboard quickly to get through your busiest months.",
    image: "/images/warehouse-team.jpg",
    date: "2026-09-10",
    body: [
      { text: "Peak periods put pressure on every part of an operation. Businesses that start planning early hire better people and spend less." },
      { heading: "Forecast from last year", text: "Use last season's volumes, absence rates and overtime to estimate how many extra people you'll need and when." },
      { heading: "Book your partner early", text: "Agree volumes and start dates with your recruitment partner well before the rush so they can build a pipeline." },
      { heading: "Make onboarding quick", text: "Short, practical inductions and buddy systems help temporary staff become productive on day one." },
    ],
  },
  {
    slug: "reducing-staff-turnover",
    category: "Insights",
    title: "Reducing staff turnover in high-volume roles",
    excerpt: "Practical steps to keep good people longer in fast-paced environments.",
    image: "/images/coworkers.jpg",
    date: "2026-09-02",
    body: [
      { text: "High turnover is costly: every leaver means more recruitment, training and lost productivity." },
      { heading: "Set honest expectations", text: "Realistic job previews during hiring mean fewer surprises and fewer early leavers." },
      { heading: "Invest in first-line managers", text: "People often leave managers rather than companies. Simple coaching for supervisors can make a measurable difference." },
      { heading: "Show a path forward", text: "Clear progression and training opportunities give people a reason to stay." },
    ],
  },
  {
    slug: "choosing-a-recruitment-partner",
    category: "Articles",
    title: "What to look for in a recruitment partner",
    excerpt: "The questions to ask before you choose an agency to work with.",
    image: "/images/handshake.jpg",
    date: "2026-08-26",
    body: [
      { text: "The right recruitment partner saves you time and improves the quality of your hires. The wrong one adds cost and frustration." },
      { heading: "Sector knowledge", text: "Ask how many similar roles they've filled recently and how they find candidates in your industry." },
      { heading: "Screening and compliance", text: "Check how candidates are vetted and how right-to-work, payroll and safety obligations are handled." },
      { heading: "Communication", text: "Agree how often you'll get updates and who your single point of contact will be." },
    ],
  },
  {
    slug: "fair-interviews",
    category: "Articles",
    title: "Building a fair and consistent interview process",
    excerpt: "Structured interviews lead to better, fairer hiring decisions.",
    image: "/images/interview.jpg",
    date: "2026-08-19",
    body: [
      { text: "Unstructured interviews are poor predictors of performance and open the door to bias. Structure fixes both." },
      { heading: "Same questions for everyone", text: "Ask every candidate the same core questions, linked to the skills the role needs." },
      { heading: "Score as you go", text: "Agree a simple scoring guide in advance and rate answers independently before discussing." },
      { heading: "Mix your panel", text: "Interviewers with different backgrounds and perspectives make more balanced decisions." },
    ],
  },
  {
    slug: "measuring-cost-per-hire",
    category: "Guides",
    title: "How to measure your cost per hire",
    excerpt: "Know what each hire really costs so you can improve it.",
    image: "/images/open-office.jpg",
    date: "2026-08-12",
    body: [
      { text: "Cost per hire is one of the most useful recruitment metrics, but it's often calculated inconsistently." },
      { heading: "Include internal costs", text: "Count recruiter time, hiring manager interview time, advertising, assessments and onboarding, not just agency fees." },
      { heading: "Compare like with like", text: "Track the figure separately for different role types; a warehouse hire and a senior engineer will differ widely." },
      { heading: "Look at quality too", text: "A cheaper hire who leaves after two months costs more in the end. Track retention alongside cost." },
    ],
  },
  {
    slug: "upskilling-your-team",
    category: "Insights",
    title: "Why upskilling your existing team pays off",
    excerpt: "Developing the people you already have is often faster than hiring new skills.",
    image: "/images/workshop.jpg",
    date: "2026-08-05",
    body: [
      { text: "When a new skill is needed, the instinct is often to hire. But your existing staff already know your business, customers and systems." },
      { heading: "Faster results", text: "Training someone who already knows the business can be quicker than recruiting and onboarding a new person." },
      { heading: "Better retention", text: "People who see investment in their development are more likely to stay." },
      { heading: "Start small", text: "Pilot one programme with a small group, measure the results and then scale up." },
    ],
  },
  {
    slug: "onboarding-checklist",
    category: "Guides",
    title: "A simple onboarding checklist for new starters",
    excerpt: "Everything to prepare before, on and after a new starter's first day.",
    image: "/images/team-laptop.jpg",
    date: "2026-07-29",
    body: [
      { text: "Good onboarding helps new starters become productive sooner and makes them more likely to stay." },
      { heading: "Before day one", text: "Send a welcome message with start time, location, dress code and who to ask for. Prepare equipment and system access." },
      { heading: "On day one", text: "Plan a short induction, introduce the team and assign a buddy for questions." },
      { heading: "In the first month", text: "Hold regular check-ins, agree early goals and ask for feedback on the onboarding itself." },
    ],
  },
];

export function getResource(slug: string) {
  return resources.find((r) => r.slug === slug);
}
