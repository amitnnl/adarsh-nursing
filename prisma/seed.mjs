// Seed script for Adarsh College of Nursing MySQL Database
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Adarsh College database seeding...");

  // 1. Seed / Upsert Admin User
  const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || "Adarsh@2026";
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  const admin = await prisma.adminUser.upsert({
    where: { username: "admin" },
    update: {
      passwordHash,
      name: "College Administrator",
      email: "info@adarshnursingcollege.com",
      role: "admin",
    },
    create: {
      username: "admin",
      passwordHash,
      name: "College Administrator",
      email: "info@adarshnursingcollege.com",
      role: "admin",
    },
  });
  console.log(`✅ Admin account configured: ${admin.username} (Password: ${defaultPassword})`);

  // 2. Seed Default Site Settings
  const initialSettings = [
    { key: "site_name", value: "Adarsh College of Nursing", category: "general" },
    { key: "site_short_name", value: "Adarsh College", category: "general" },
    { key: "site_logo", value: "/images/logo-mark.png", category: "general" },
    { key: "site_tagline", value: "Affiliated to Atal Bihari Vajpayee Medical University, Lucknow & Approved by UP State Medical Faculty", category: "general" },
    { key: "site_description", value: "Premier nursing college in Patan, Unnao, Uttar Pradesh offering ANM, GNM, and B.Sc. Nursing degrees with modern labs and hospital attachments.", category: "general" },
    { key: "session_year", value: "2026-27", category: "admissions" },
    { key: "phone_1", value: "+91 94154 85554", category: "contact" },
    { key: "phone_2", value: "+91 94154 85555", category: "contact" },
    { key: "whatsapp_number", value: "+91 94154 85554", category: "contact" },
    { key: "email_address", value: "info@adarshnursingcollege.com", category: "contact" },
    { key: "address_line1", value: "Takia Road, Patan, Tehsil - Bighapur", category: "contact" },
    { key: "address_line2", value: "District Unnao", category: "contact" },
    { key: "address_state", value: "Uttar Pradesh", category: "contact" },
    { key: "address_pin", value: "209867", category: "contact" },
    { key: "address_landmark", value: "Opposite CHC Patan / Near Takia Mela Ground", category: "contact" },
    { key: "coords_lat", value: "26.3312", category: "contact" },
    { key: "coords_lng", value: "80.6015", category: "contact" },
    { key: "announcement_banner", value: "Admissions Open for Session 2026-27: ANM, GNM & B.Sc. Nursing. Direct Admission Helpline: +91 94154 85554", category: "announcements" },
    { key: "announcement_active", value: "true", category: "announcements" },
    { key: "hero_badge", value: "Admissions open for 2026-27", category: "hero" },
    { key: "hero_title_lead", value: "Nurturing compassionate", category: "hero" },
    { key: "hero_title_highlight", value: "healthcare professionals.", category: "hero" },
    { key: "hero_description", value: "A.N.M., G.N.M. and B.Sc. Nursing at a modern campus near Narnaul Bypass, Mahendergarh. Experienced faculty, well-equipped labs, hostel and transport — everything a nursing student needs, close to home.", category: "hero" },
    { key: "hero_image", value: "/images/campus.jpg", category: "hero" },
    { key: "hero_stat_1_val", value: "100%", category: "hero" },
    { key: "hero_stat_1_label", value: "Clinical Exposure", category: "hero" },
    { key: "hero_stat_2_val", value: "3+", category: "hero" },
    { key: "hero_stat_2_label", value: "Recognized Courses", category: "hero" },
    { key: "hero_stat_3_val", value: "10:1", category: "hero" },
    { key: "hero_stat_3_label", value: "Student-Faculty Ratio", category: "hero" },
    { key: "brochure_pdf", value: "", category: "admissions" },
    { key: "social_facebook", value: "https://facebook.com", category: "social" },
    { key: "social_instagram", value: "https://instagram.com", category: "social" },
    { key: "social_youtube", value: "https://youtube.com", category: "social" },
  ];

  for (const s of initialSettings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value, category: s.category },
      create: s,
    });
  }
  console.log(`✅ Configured ${initialSettings.length} site settings`);

  // 3. Seed Courses
  const defaultCourses = [
    {
      slug: "anm",
      code: "ANM",
      name: "Auxiliary Nurse Midwifery",
      fullName: "Auxiliary Nurse Midwife (ANM)",
      duration: "2 Years",
      years: 2,
      type: "Diploma",
      eligibility: JSON.stringify([
        "10+2 passed (Arts / Science / Commerce) from a recognized board",
        "Minimum 40-45% aggregate marks (relaxation as per state norms)",
        "Minimum age 17 years at the time of admission",
        "Medically fit candidate",
      ]),
      summary: "Grassroots healthcare and maternal-child health foundation designed to train community health leaders and village-level medical first responders.",
      learn: JSON.stringify([
        "Community Health Nursing & Primary Healthcare Delivery",
        "Maternal & Child Health Care, Antenatal & Postnatal Care",
        "Immunization Protocols & Cold-Chain Management",
        "Infection Prevention, Sterilization & Aseptic Procedures",
        "Nutrition, Sanitation & Family Planning Education",
        "First Aid, Emergency Response & Referral Pathways",
      ]),
      careers: JSON.stringify([
        "Primary Health Centre (PHC) Nurse",
        "Community Health Worker / Sub-Centre Incharge",
        "Rural Health Mission / NHM Health Assistant",
        "Private Nursing Home & Maternity Clinic Staff",
      ]),
      accent: "rose",
      displayOrder: 1,
    },
    {
      slug: "gnm",
      code: "GNM",
      name: "General Nursing & Midwifery",
      fullName: "General Nursing and Midwifery (GNM)",
      duration: "3 Years",
      years: 3,
      type: "Diploma",
      eligibility: JSON.stringify([
        "10+2 with English, preferably Science (PCB) with 40% marks",
        "Arts/Commerce students eligible as per INC / UP State Medical Faculty norms",
        "Age between 17 and 35 years",
        "Must be certified medically fit",
      ]),
      summary: "Comprehensive clinical and bedside nursing diploma preparing nurses for hospital wards, emergency units, and critical care centers across India.",
      learn: JSON.stringify([
        "Bio-Sciences: Anatomy, Physiology & Microbiology",
        "Behavioral Sciences: Psychology & Sociology in Patient Care",
        "Fundamental Nursing & First Aid Management",
        "Medical-Surgical Nursing I & II (Advanced Clinical Rotations)",
        "Midwifery & Gynecological Nursing with Hands-on Deliveries",
        "Mental Health Nursing & Psychiatric Patient Support",
      ]),
      careers: JSON.stringify([
        "Staff Nurse in Government & Private Multispecialty Hospitals",
        "ICU, OT & Critical Care Unit Specialist",
        "Community Health Officer (CHO) via NHM Bridge Program",
        "Industrial / School Health Nurse",
      ]),
      accent: "navy",
      displayOrder: 2,
    },
    {
      slug: "bsc-nursing",
      code: "B.Sc Nursing",
      name: "Bachelor of Science in Nursing",
      fullName: "Bachelor of Science in Nursing (B.Sc. Nursing)",
      duration: "4 Years",
      years: 4,
      type: "Degree",
      eligibility: JSON.stringify([
        "10+2 with Physics, Chemistry, Biology (PCB) and English",
        "Minimum 45% aggregate marks in PCB (40% for SC/ST)",
        "Minimum age 17 years on or before 31st December of admission year",
        "Admission through UP CNET (Common Nursing Entrance Test) / State counseling",
      ]),
      summary: "Four-year university degree program blending intensive classroom academics, hospital bedside practice, advanced research, and clinical leadership.",
      learn: JSON.stringify([
        "Applied Anatomy, Physiology, Biochemistry & Nutrition",
        "Nursing Foundations & Advanced Clinical Nursing Procedures",
        "Pathology, Genetics & Pharmacology in Nursing Practice",
        "Child Health Nursing & Pediatric Emergency Interventions",
        "Community Health Nursing & Epidemiology Research",
        "Nursing Management, Hospital Leadership & Research Project",
      ]),
      careers: JSON.stringify([
        "Clinical Nursing Specialist / Head Nurse",
        "Government Hospital Nursing Officer (AIIMS, SGPGI, KGMU)",
        "Nursing Educator / Tutor / Lecturer in Nursing Colleges",
        "Global Registered Nurse (OET / NCLEX Pathways abroad)",
      ]),
      accent: "green",
      displayOrder: 3,
    },
  ];

  for (const c of defaultCourses) {
    await prisma.course.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });
  }
  console.log(`✅ Seeded ${defaultCourses.length} academic courses (ANM, GNM, B.Sc)`);

  // 4. Seed Facilities
  const defaultFacilities = [
    {
      title: "Nursing Foundation Lab",
      text: "Equipped with advanced adult and pediatric mannequins, CPR trainers, hospital beds, and clinical instruments to simulate realistic hospital ward scenarios before student rotations.",
      icon: "Stethoscope",
      displayOrder: 1,
    },
    {
      title: "Anatomy & Physiology Lab",
      text: "Features life-size human skeletons, 3D anatomical organ models, histology charts, and digital projection systems for immersive study of the human body.",
      icon: "Microscope",
      displayOrder: 2,
    },
    {
      title: "Community Health Nursing Lab",
      text: "Equipped with field bags, cold-chain immunization models, family folders, and rural health intervention kits to prepare students for preventive community care.",
      icon: "ShieldAlert",
      displayOrder: 3,
    },
    {
      title: "Nutrition & Dietetics Lab",
      text: "Modern demonstration kitchen equipped to practice therapeutic diet calculations, infant formula preparation, diabetic meals, and clinical nutritional therapy.",
      icon: "Apple",
      displayOrder: 4,
    },
    {
      title: "Modern Computer Lab",
      text: "High-speed internet workstations with access to digital health portals, hospital management information systems (HMIS), and medical journals.",
      icon: "GraduationCap",
      displayOrder: 5,
    },
    {
      title: "Library & Digital Reading Room",
      text: "Thousands of nursing textbooks, national & international journals, previous year question papers, and quiet spaces for individual and group study.",
      icon: "BookOpen",
      displayOrder: 6,
    },
    {
      title: "Hostel & Nutritious Mess",
      text: "Secure on-campus residential facilities with 24/7 security, hygienic meals, study desks, and dedicated wardens.",
      icon: "Building2",
      displayOrder: 7,
    },
    {
      title: "College Bus Transport",
      text: "Dedicated college bus network connecting nearby towns and rural routes for seamless daily commute and hospital clinical shifts.",
      icon: "Bus",
      displayOrder: 8,
    },
  ];

  await prisma.facility.deleteMany();
  for (const f of defaultFacilities) {
    await prisma.facility.create({ data: f });
  }
  console.log(`✅ Seeded ${defaultFacilities.length} campus facilities`);

  // 5. Seed Why Us Cards
  const defaultWhyUs = [
    {
      title: "Qualified & Experienced Faculty",
      text: "Learn from nursing professionals who bring years of hospital and teaching experience.",
      displayOrder: 1,
    },
    {
      title: "Practical Training & Clinical Exposure",
      text: "Regular clinical postings so students gain real patient-care experience alongside classroom study.",
      displayOrder: 2,
    },
    {
      title: "Safe & Supportive Environment",
      text: "A disciplined, caring campus where every student is known and guided personally.",
      displayOrder: 3,
    },
    {
      title: "Overall Personality Development",
      text: "Communication skills, confidence and professional ethics are part of everyday learning.",
      displayOrder: 4,
    },
    {
      title: "Excellent Learning Infrastructure",
      text: "Modern labs, library and classrooms in a purpose-built college building.",
      displayOrder: 5,
    },
    {
      title: "Placement Assistance",
      text: "Guidance and support to help graduates find roles in hospitals and healthcare centres.",
      displayOrder: 6,
    },
  ];

  await prisma.whyUsCard.deleteMany();
  for (const w of defaultWhyUs) {
    await prisma.whyUsCard.create({ data: w });
  }
  console.log(`✅ Seeded ${defaultWhyUs.length} 'Why Choose Us' cards`);

  // 6. Seed Admission Steps & Documents
  const defaultSteps = [
    {
      stepNumber: 1,
      title: "Enquire",
      text: "Call, WhatsApp or fill the enquiry form. Our team will explain courses, eligibility and the admission process.",
      displayOrder: 1,
    },
    {
      stepNumber: 2,
      title: "Visit the campus",
      text: "See the classrooms, labs, hostel and meet the faculty. Walk-ins are welcome on working days.",
      displayOrder: 2,
    },
    {
      stepNumber: 3,
      title: "Submit documents",
      text: "Bring your 10th and 12th marksheets, ID proof, passport-size photographs and category certificate if applicable.",
      displayOrder: 3,
    },
    {
      stepNumber: 4,
      title: "Confirm your seat",
      text: "Complete the admission formalities and fee process to reserve your seat for the academic session.",
      displayOrder: 4,
    },
  ];

  await prisma.admissionStep.deleteMany();
  for (const s of defaultSteps) {
    await prisma.admissionStep.create({ data: s });
  }
  console.log(`✅ Seeded ${defaultSteps.length} admission steps`);

  const defaultDocs = [
    { title: "10th class marksheet and certificate", displayOrder: 1 },
    { title: "10+2 marksheet and certificate", displayOrder: 2 },
    { title: "Aadhaar card or other government photo ID", displayOrder: 3 },
    { title: "Passport-size photographs (6 copies)", displayOrder: 4 },
    { title: "Character certificate from last institution", displayOrder: 5 },
    { title: "Caste / category certificate (if applicable)", displayOrder: 6 },
    { title: "Medical fitness certificate", displayOrder: 7 },
  ];

  await prisma.admissionDocument.deleteMany();
  for (const d of defaultDocs) {
    await prisma.admissionDocument.create({ data: d });
  }
  console.log(`✅ Seeded ${defaultDocs.length} admission documents`);

  // 7. Seed Notices
  const defaultNotices = [
    {
      title: "Admissions Open for Session 2026-27",
      content: "Applications are invited for A.N.M., G.N.M. and B.Sc. Nursing programmes. Counseling and campus visits are open on all working days.",
      link: "/admissions",
      date: "Session 2026-27",
      isUrgent: true,
      displayOrder: 1,
    },
    {
      title: "Scholarship & Fee Concession Assistance",
      content: "State government Post-Matric scholarship assistance is available for eligible SC/ST/OBC candidates as per government guidelines.",
      link: "/contact",
      date: "Current Session",
      isUrgent: false,
      displayOrder: 2,
    },
  ];

  await prisma.notice.deleteMany();
  for (const n of defaultNotices) {
    await prisma.notice.create({ data: n });
  }
  console.log(`✅ Seeded ${defaultNotices.length} notices`);

  // 8. Seed Job Openings
  const defaultOpenings = [
    { title: "Nursing Tutor / Clinical Instructor", category: "teaching", status: "Open", displayOrder: 1 },
    { title: "Assistant Professor (Medical Surgical / Community)", category: "teaching", status: "Open", displayOrder: 2 },
    { title: "Associate Professor (OBG / Pediatrics)", category: "teaching", status: "Open", displayOrder: 3 },
    { title: "Librarian / Asst. Librarian", category: "nonTeaching", status: "Open", displayOrder: 4 },
    { title: "Computer Lab Instructor", category: "nonTeaching", status: "Open", displayOrder: 5 },
    { title: "Office Executive / Admission Counselor", category: "nonTeaching", status: "Open", displayOrder: 6 },
  ];

  await prisma.jobOpening.deleteMany();
  for (const j of defaultOpenings) {
    await prisma.jobOpening.create({ data: j });
  }
  console.log(`✅ Seeded ${defaultOpenings.length} job openings`);

  // 9. Seed Sample Gallery Photos
  const defaultPhotos = [
    {
      src: "/images/campus.jpg",
      alt: "College building at dusk",
      caption: "Main building at dusk",
      category: "campus",
      span: "md:col-span-2 md:row-span-2",
      position: "",
      displayOrder: 1,
    },
    {
      src: "/images/campus.jpg",
      alt: "Front entrance",
      caption: "Main entrance",
      category: "campus",
      span: "",
      position: "object-[50%_58%]",
      displayOrder: 2,
    },
    {
      src: "/images/campus.jpg",
      alt: "Front lawn and garden",
      caption: "Lawns and seating",
      category: "campus",
      span: "",
      position: "object-[20%_75%]",
      displayOrder: 3,
    },
    {
      src: "/images/campus.jpg",
      alt: "College signage",
      caption: "Adarsh College of Nursing",
      category: "campus",
      span: "",
      position: "object-[50%_12%]",
      displayOrder: 4,
    },
    {
      src: "/images/poster.jpg",
      alt: "Admission poster",
      caption: "Admissions 2026-27",
      category: "admissions",
      span: "",
      position: "object-top",
      displayOrder: 5,
    },
  ];

  await prisma.galleryPhoto.deleteMany();
  for (const p of defaultPhotos) {
    await prisma.galleryPhoto.create({ data: p });
  }
  console.log(`✅ Seeded ${defaultPhotos.length} gallery photos`);

  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
