export const site = {
  name: "Adarsh College of Nursing",
  shortName: "Adarsh Nursing",
  tagline: "Care Today, Cure Tomorrow",
  description:
    "Adarsh College of Nursing, Niwaz Nagar (near Narnaul Bypass), Mahendergarh, Haryana. A.N.M., G.N.M. and B.Sc. Nursing programmes with hostel, transport, modern labs and clinical exposure. Admissions open for 2026-27.",
  session: "2026-27",
  phones: ["9466187931", "7082867931"],
  whatsapp: "919466187931",
  email: "adarshnursingcollegenl@gmail.com",
  address: {
    line1: "Niwaz Nagar, Post-Dharsoon",
    line2: "Tehsil Narnaul, Dist. Mahendergarh",
    state: "Haryana",
    pin: "123001",
    landmark: "Near Narnaul Bypass",
  },
  coords: { lat: 28.108861, lng: 76.092917 },
  values: ["Discipline", "Dedication", "Compassion", "Excellence"],
  logo: "/images/logo-mark.png",
};

export const mapsLink = `https://www.google.com/maps/search/?api=1&query=${site.coords.lat},${site.coords.lng}`;
export const mapsEmbed = `https://www.google.com/maps?q=${site.coords.lat},${site.coords.lng}&z=15&output=embed`;

export function telHref(phone: string) {
  const clean = phone.replace(/[^0-9+]/g, "");
  return clean.startsWith("+") ? `tel:${clean}` : `tel:+91${clean}`;
}

export function whatsappHref(message?: string, numberOverride?: string) {
  const target = (numberOverride || site.whatsapp).replace(/[^0-9]/g, "");
  const formatted = target.startsWith("91") ? target : `91${target}`;
  const base = `https://wa.me/${formatted}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/courses", label: "Courses" },
  { href: "/admissions", label: "Admissions" },
  { href: "/facilities", label: "Facilities" },
  { href: "/gallery", label: "Gallery" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
] as const;

export type Course = {
  slug: string;
  code: string;
  name: string;
  fullName: string;
  duration: string;
  years: number;
  type: "Diploma" | "Degree";
  eligibility: string[];
  summary: string;
  learn: string[];
  careers: string[];
  accent: "rose" | "navy" | "green";
};

export const courses: Course[] = [
  {
    slug: "anm",
    code: "A.N.M.",
    name: "A.N.M.",
    fullName: "Auxiliary Nurse Midwifery",
    duration: "2 Years",
    years: 2,
    type: "Diploma",
    eligibility: ["10+2 pass in any stream", "Minimum 45% marks"],
    summary:
      "A two-year diploma that prepares you for community and maternal health care, first aid and basic nursing at primary health centres and hospitals.",
    learn: [
      "Community health nursing",
      "Maternal and child health",
      "First aid, immunisation and health education",
      "Primary care and midwifery practice",
    ],
    careers: [
      "ANM at PHCs and CHCs",
      "Community health worker",
      "Hospital nursing assistant",
      "Pathway to G.N.M.",
    ],
    accent: "rose",
  },
  {
    slug: "gnm",
    code: "G.N.M.",
    name: "G.N.M.",
    fullName: "General Nursing & Midwifery",
    duration: "3 Years",
    years: 3,
    type: "Diploma",
    eligibility: ["10+2 pass in any stream", "Minimum 45% marks"],
    summary:
      "A three-year diploma covering general nursing, midwifery and clinical practice that qualifies you to work as a registered nurse in hospitals and clinics.",
    learn: [
      "Anatomy, physiology and microbiology",
      "Medical-surgical nursing",
      "Paediatric and mental health nursing",
      "Midwifery and gynaecological nursing",
    ],
    careers: [
      "Staff nurse in government and private hospitals",
      "Clinic and nursing home nurse",
      "Community health nurse",
      "Pathway to Post-Basic B.Sc. Nursing",
    ],
    accent: "navy",
  },
  {
    slug: "bsc-nursing",
    code: "B.Sc.",
    name: "B.Sc. Nursing",
    fullName: "Bachelor of Science in Nursing",
    duration: "4 Years",
    years: 4,
    type: "Degree",
    eligibility: ["10+2 with Physics, Chemistry, Biology", "Minimum 45% marks"],
    summary:
      "A four-year degree that builds the scientific foundation and clinical skill for a career as a professional nurse, educator or healthcare leader.",
    learn: [
      "Nursing foundations and pharmacology",
      "Medical-surgical and critical care nursing",
      "Community, paediatric and psychiatric nursing",
      "Nursing research, management and education",
    ],
    careers: [
      "Staff nurse and nursing officer",
      "Nurse educator and clinical instructor",
      "Higher studies: M.Sc. Nursing",
      "Opportunities in India and abroad",
    ],
    accent: "green",
  },
];

export const facilities = [
  {
    title: "Hostel Facility",
    text: "Safe, supervised hostel accommodation on campus so outstation students can focus on their studies.",
    icon: "BedDouble",
  },
  {
    title: "Transport Facility",
    text: "College transport connecting Narnaul and nearby villages to the campus every day.",
    icon: "Bus",
  },
  {
    title: "Spacious Classrooms",
    text: "Well-lit, ventilated classrooms designed for focused learning and interactive teaching.",
    icon: "Presentation",
  },
  {
    title: "Nursing Labs",
    text: "Well-equipped nursing, anatomy and community health labs for hands-on practical training.",
    icon: "FlaskConical",
  },
  {
    title: "Library",
    text: "A quiet library stocked with nursing textbooks, reference material and journals.",
    icon: "BookOpen",
  },
  {
    title: "Green Campus",
    text: "A clean, lush green campus with lawns and seating areas near the Narnaul Bypass.",
    icon: "TreePine",
  },
] as const;

export const whyUs = [
  {
    title: "Qualified & Experienced Faculty",
    text: "Learn from nursing professionals who bring years of hospital and teaching experience.",
  },
  {
    title: "Practical Training & Clinical Exposure",
    text: "Regular clinical postings so students gain real patient-care experience alongside classroom study.",
  },
  {
    title: "Safe & Supportive Environment",
    text: "A disciplined, caring campus where every student is known and guided personally.",
  },
  {
    title: "Overall Personality Development",
    text: "Communication skills, confidence and professional ethics are part of everyday learning.",
  },
  {
    title: "Excellent Learning Infrastructure",
    text: "Modern labs, library and classrooms in a purpose-built college building.",
  },
  {
    title: "Placement Assistance",
    text: "Guidance and support to help graduates find roles in hospitals and healthcare centres.",
  },
] as const;

export const openings = {
  teaching: [
    "Principal",
    "Vice Principal",
    "Nursing Professors",
    "Nursing Associate Professors",
    "Nursing Assistant Professors",
    "Clinical Instructors / Nursing Tutors",
  ],
  nonTeaching: ["Receptionist", "Office Staff", "Lab Technician", "Support Staff"],
};

export const admissionSteps = [
  {
    title: "Enquire",
    text: "Call, WhatsApp or fill the enquiry form. Our team will explain courses, eligibility and the admission process.",
  },
  {
    title: "Visit the campus",
    text: "See the classrooms, labs, hostel and meet the faculty. Walk-ins are welcome on working days.",
  },
  {
    title: "Submit documents",
    text: "Bring your 10th and 12th marksheets, ID proof, passport-size photographs and category certificate if applicable.",
  },
  {
    title: "Confirm your seat",
    text: "Complete the admission formalities and fee process to reserve your seat for the 2026-27 session.",
  },
];

export const documents = [
  "10th class marksheet and certificate",
  "10+2 marksheet and certificate",
  "Aadhaar card or other photo ID",
  "Passport-size photographs (6)",
  "Character certificate from last institution",
  "Caste / category certificate (if applicable)",
  "Medical fitness certificate",
];
