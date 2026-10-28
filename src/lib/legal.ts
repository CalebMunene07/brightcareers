// DRAFT legal pages. These are starting points only and must be reviewed by a
// qualified lawyer for each country you operate in before the site goes live.

import { contactEmail } from "@/lib/content";

export type LegalPage = {
  slug: string;
  title: string;
  summary: string;
  updated: string;
  sections: { heading: string; text: string[] }[];
};

export const legalPages: LegalPage[] = [
  {
    slug: "privacy-policy",
    title: "Privacy policy",
    summary: "How Bridge Careers Global collects, uses and protects your personal information.",
    updated: "2026-10-03",
    sections: [
      {
        heading: "Who we are",
        text: [
          "Bridge Careers Global (\"we\", \"us\") provides recruitment and workforce services. We are the controller of the personal data described in this policy.",
          `You can contact us about privacy at ${contactEmail}.`,
        ],
      },
      {
        heading: "Information we collect",
        text: [
          "Information you give us: your name, contact details, CV, work history, qualifications, right-to-work documents and anything else you choose to share in forms, applications or the CV maker.",
          "Information about employers: contact names, job titles, company details and hiring requirements.",
          "Technical information: basic device and usage data, and a cookie that remembers your language choice.",
        ],
      },
      {
        heading: "How we use your information",
        text: [
          "To match candidates with suitable jobs and share candidate profiles with prospective employers (with your consent where required).",
          "To respond to enquiries and staff requests, manage assignments, pay temporary workers and meet legal obligations such as right-to-work checks.",
          "To improve our website and services.",
        ],
      },
      {
        heading: "Legal bases",
        text: [
          "We process data to take steps at your request before entering into a contract, to perform contracts, to meet legal obligations, for our legitimate interests in running a recruitment business, and with your consent where the law requires it.",
        ],
      },
      {
        heading: "Sharing your information",
        text: [
          "We share candidate information with employers you are being considered for, and with service providers who host our systems or process payroll on our behalf. We do not sell your personal data.",
          "Where data is transferred between countries, we use appropriate safeguards.",
        ],
      },
      {
        heading: "How long we keep it",
        text: [
          "We keep candidate records for as long as they are useful for finding you work, and for as long as the law requires for workers we have employed. You can ask us to delete your data at any time.",
        ],
      },
      {
        heading: "Your rights",
        text: [
          `Depending on where you live, you may have the right to access, correct, delete or restrict the use of your data, to object to processing, and to data portability. Contact ${contactEmail} to make a request. You may also complain to your local data protection authority.`,
        ],
      },
    ],
  },
  {
    slug: "terms-of-use",
    title: "Website terms of use",
    summary: "The rules for using the Bridge Careers Global website.",
    updated: "2026-10-03",
    sections: [
      {
        heading: "About these terms",
        text: [
          "These terms apply to your use of this website. By using the site you agree to them. If you don't agree, please don't use the site.",
        ],
      },
      {
        heading: "Using the site",
        text: [
          "You may use the site to search for jobs, apply for roles, create a CV, request staff and contact us. You must not misuse the site, attempt to gain unauthorised access, or submit false or misleading information.",
        ],
      },
      {
        heading: "Job listings",
        text: [
          "We try to keep job listings accurate and up to date, but roles may be filled or changed without notice. A listing is not an offer of employment.",
        ],
      },
      {
        heading: "Content and intellectual property",
        text: [
          "The content, design and branding of this site belong to Bridge Careers Global or its licensors. Photographs are used under their respective licences. You may view and print pages for personal use only.",
        ],
      },
      {
        heading: "Liability",
        text: [
          "The site is provided \"as is\". To the extent permitted by law, we are not liable for any loss arising from your use of the site or reliance on its content.",
        ],
      },
      {
        heading: "Changes",
        text: ["We may update these terms from time to time. The date at the top shows when they last changed."],
      },
    ],
  },
  {
    slug: "cookie-policy",
    title: "Cookie policy",
    summary: "The cookies this website uses and why.",
    updated: "2026-10-03",
    sections: [
      {
        heading: "What are cookies?",
        text: ["Cookies are small text files stored on your device when you visit a website. They help the site remember information about your visit."],
      },
      {
        heading: "Cookies we use",
        text: [
          "locale: remembers the language you chose in the language picker. It lasts for one year and is strictly necessary for that feature.",
          "We do not currently use advertising or third-party tracking cookies. If we add analytics in future, we will update this policy and ask for your consent where required.",
        ],
      },
      {
        heading: "Browser storage",
        text: [
          "The CV maker saves your draft CV in your own browser's local storage so you don't lose your work. This data stays on your device unless you choose to send your CV to us.",
        ],
      },
      {
        heading: "Managing cookies",
        text: ["You can delete or block cookies in your browser settings. If you block the language cookie, the site will display in English."],
      },
    ],
  },
  {
    slug: "accessibility-statement",
    title: "Accessibility statement",
    summary: "Our commitment to making this website usable by everyone.",
    updated: "2026-10-03",
    sections: [
      {
        heading: "Our commitment",
        text: [
          "We want everyone to be able to find work and use our services. We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA.",
        ],
      },
      {
        heading: "What we've done",
        text: [
          "The site uses semantic HTML, keyboard-accessible navigation and forms, visible focus states, text alternatives for images and colour contrast that meets recommended levels.",
        ],
      },
      {
        heading: "Known limitations",
        text: [
          "Some older documents and third-party content may not be fully accessible. Page content is currently available in English only, with menus in additional languages.",
        ],
      },
      {
        heading: "Feedback",
        text: [
          `If you have difficulty using any part of this site, please contact us at ${contactEmail} and we will help, including by providing information in another format.`,
        ],
      },
    ],
  },
];

export function getLegalPage(slug: string) {
  return legalPages.find((p) => p.slug === slug);
}
