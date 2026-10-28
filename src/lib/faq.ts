// FAQ content. Intended to be managed from the admin panel later.

export type Faq = { q: string; a: string };

export const jobSeekerFaq: Faq[] = [
  {
    q: "What does a recruitment agency do?",
    a: "We match people looking for work with employers who need staff. We find the roles, help you prepare, put you forward to employers and support you once you start. Our service is free for job seekers.",
  },
  {
    q: "Do I have to pay to use Bridge Careers Global?",
    a: "No. Employers pay for our services. We will never ask a candidate for money to apply for a job, register with us or start an assignment.",
  },
  {
    q: "How do I apply for a job?",
    a: "Search our open roles, choose a job and complete the short application form with your CV. If nothing fits right now, send us your CV through the contact page and a consultant will be in touch when a suitable role comes up.",
  },
  {
    q: "Do you offer training?",
    a: "Yes. Through Bridge Academy we offer courses and certifications for many of the roles we recruit for, from health and safety to digital skills. Ask your consultant what's available in your area.",
  },
  {
    q: "How and when will I be paid on a temporary assignment?",
    a: "When you work through Bridge on a temporary assignment, we pay you directly into your bank account on a regular schedule agreed at the start. Your consultant will explain timesheets and pay dates before your first day.",
  },
  {
    q: "Can a temporary job become permanent?",
    a: "Often, yes. Many employers use temporary assignments to find permanent hires. If you'd like a permanent role, tell your consultant so they can look for opportunities with that potential.",
  },
  {
    q: "What happens when my assignment ends?",
    a: "Your consultant will check in before your assignment finishes and look for your next role, so you can move straight on to new work wherever possible.",
  },
  {
    q: "How is my personal data used?",
    a: "We only use your information to help you find work and to meet our legal obligations. You can read the details, and how to ask us to delete your data, in our privacy policy.",
  },
];

export const employerFaq: Faq[] = [
  {
    q: "How quickly can you supply staff?",
    a: "For many temporary roles we can place pre-screened people within a few days. Permanent and specialist roles typically take one to three weeks to shortlist, depending on the role.",
  },
  {
    q: "How are your fees structured?",
    a: "Temporary staff are charged at an hourly or daily rate that covers pay, statutory costs and our margin. Permanent placements are usually a one-off fee based on the starting salary. We'll give you a clear quote before any work starts.",
  },
  {
    q: "Who employs the temporary workers?",
    a: "For temporary assignments, workers are employed by Bridge. We handle contracts, payroll, statutory deductions and compliance, so you receive a single invoice.",
  },
  {
    q: "How do you screen candidates?",
    a: "Every candidate is interviewed and has their identity, right to work and references checked. Depending on the role we also run skills tests, certification checks and background checks.",
  },
  {
    q: "What if a placement doesn't work out?",
    a: "Tell your consultant straight away. For temporary roles we'll arrange a replacement as quickly as possible. Permanent placements include a replacement guarantee period.",
  },
  {
    q: "Can I hire a temporary worker permanently?",
    a: "Yes. Temp-to-perm is a great way to reduce hiring risk. The terms for transferring a worker to your payroll are set out in our agreement.",
  },
  {
    q: "Do you recruit outside our country?",
    a: "Yes. We recruit across several countries and can support cross-border hiring, including the documentation needed for international candidates.",
  },
  {
    q: "How do I get started?",
    a: "Send us a staff request with a few details about the role and timing. A consultant will call you within one working day to discuss your needs.",
  },
];

export const applyTips: { title: string; points: string[] }[] = [
  {
    title: "Writing your CV",
    points: [
      "Keep it to two pages and put your most relevant experience first.",
      "Use the same keywords as the job advert so your skills are easy to spot.",
      "Show results with numbers where you can: targets met, people managed, money saved.",
      "Check spelling and contact details carefully before you send it.",
    ],
  },
  {
    title: "Online assessments",
    points: [
      "Find a quiet place with a reliable internet connection.",
      "Read each instruction carefully and keep an eye on the timer.",
      "Practise with free example tests beforehand so the format feels familiar.",
      "Answer personality questions honestly rather than guessing what's wanted.",
    ],
  },
  {
    title: "Interview preparation",
    points: [
      "Research the employer: what they do, their customers and recent news.",
      "Prepare examples using the situation, task, action, result approach.",
      "Plan your journey or test your video call set-up in advance.",
      "Have two or three questions ready to ask at the end.",
    ],
  },
];
