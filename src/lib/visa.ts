// Visa application and air ticket booking: destinations, roles and form options.
// Prices, payment methods and payment instructions are edited in Admin → Forms → Pricing & payment (see pricing.ts).

export { usd } from "@/lib/pricing";

/** Destinations an applicant can apply to, with the roles available in each. */
export const destinations: Record<string, string[]> = {
  Canada: ["Caregiving", "Welding", "CNA", "Nursing", "Cleaning", "Farm work", "Receptionist", "Supermarket attendant", "Cruise ship jobs"],
  "United States": ["Caregiving", "Welding", "CNA", "Nursing", "Cleaning", "Farm work", "Receptionist", "Supermarket attendant", "Cruise ship jobs"],
  "United Kingdom": ["Caregiving", "Welding", "CNA", "Nursing", "Cleaning", "Farm work", "Receptionist", "Supermarket attendant", "Cruise ship jobs"],
  Germany: ["Au pair", "Cleaning", "Housekeeping", "Waiter/waitress", "Farm work", "Nursing"],
  Luxembourg: ["Caregiving", "Cleaning", "Welding", "Driving", "Nursing", "Housekeeping", "Waiter/waitress"],
  Netherlands: ["Au pair", "Cleaning", "Housekeeping", "Waiter/waitress", "Farm work", "Nursing"],
  Finland: ["Caregiving", "Cleaning", "Housekeeping", "Nursing", "Farm work", "Welding"],
  Turkey: ["Nanny", "Cleaning", "Housekeeping", "Farm work", "Driving", "Riders", "Factory work", "Welding"],
  Australia: ["Farming", "Teaching", "Caregiving", "Nursing", "Driving", "Construction", "Clinical medicine"],
  "New Zealand": ["Farming", "Teaching", "Caregiving", "Nursing", "Driving", "Construction", "Hospitality"],
};

export const destinationNames = Object.keys(destinations);

export const STUDENT_VISA = "Student visa";
export const visaTypes = ["Work visa", "Skilled worker visa", "Seasonal work visa", "Care visa", STUDENT_VISA];
/** Employment details asked for every visa type except a student visa. */
export const employmentFields = ["employment", "occupation", "employer", "income"];
export const asksEmployment = (visaType: string) => visaType !== STUDENT_VISA;
export const applicantCounts = ["1", "2", "3", "4+"];
export const genders = ["Female", "Male", "Non-binary", "Prefer not to say"];
export const employmentStatuses = ["Employed", "Self-employed", "Student", "Between roles", "Retired"];
export const travelClasses = ["Economy", "Premium economy", "Business"];
/** Supporting documents for a visa application. Images or PDFs, MAX_UPLOAD_BYTES in total (photos are shrunk in the browser first). */
export const visaDocuments = [
  { key: "passport", label: "Passport bio page", required: true },
  { key: "cv", label: "Curriculum vitae / resume", required: true },
  { key: "certificates", label: "Relevant certificates", required: false },
  { key: "photo", label: "Passport-sized photograph", required: true },
] as const;

export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
export const DOC_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
export const DOC_ACCEPT = ".pdf,.jpg,.jpeg,.png,.webp";
