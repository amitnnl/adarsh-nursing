-- ===============================================================
-- Adarsh College of Nursing - Hostinger MySQL Database Init Script
-- Import this file in Hostinger hPanel -> Databases -> phpMyAdmin
-- ===============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. admin_users
CREATE TABLE IF NOT EXISTS `admin_users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'admin',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    UNIQUE INDEX `admin_users_username_key`(`username`),
    UNIQUE INDEX `admin_users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `admin_users` (`username`, `passwordHash`, `name`, `email`, `role`)
VALUES ('admin', '$2b$10$DzcxEl8lAqPXkM0GjjKnbu28fNFtNRYSSjzGJyX6gu3lYFZv4Nf6e', 'College Administrator', 'info@adarshnursingcollege.com', 'admin')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 2. site_settings
CREATE TABLE IF NOT EXISTS `site_settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(191) NOT NULL,
    `value` TEXT NOT NULL,
    `category` VARCHAR(191) NOT NULL DEFAULT 'general',
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    UNIQUE INDEX `site_settings_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `site_settings` (`key`, `value`, `category`) VALUES
('site_name', 'Adarsh College of Nursing', 'general'),
('site_short_name', 'Adarsh College', 'general'),
('site_logo', '/images/logo-mark.png', 'general'),
('site_tagline', 'Affiliated to Atal Bihari Vajpayee Medical University, Lucknow & Approved by UP State Medical Faculty', 'general'),
('site_description', 'Premier nursing college in Patan, Unnao, Uttar Pradesh offering ANM, GNM, and B.Sc. Nursing degrees with modern labs and hospital attachments.', 'general'),
('session_year', '2026-27', 'admissions'),
('phone_1', '+91 94154 85554', 'contact'),
('phone_2', '+91 94154 85555', 'contact'),
('whatsapp_number', '+91 94154 85554', 'contact'),
('email_address', 'info@adarshnursingcollege.com', 'contact'),
('address_line1', 'Takia Road, Patan, Tehsil - Bighapur', 'contact'),
('address_line2', 'District Unnao', 'contact'),
('address_state', 'Uttar Pradesh', 'contact'),
('address_pin', '209867', 'contact'),
('address_landmark', 'Opposite CHC Patan / Near Takia Mela Ground', 'contact'),
('coords_lat', '26.3312', 'contact'),
('coords_lng', '80.6015', 'contact'),
('announcement_banner', 'Admissions Open for Session 2026-27: ANM, GNM & B.Sc. Nursing. Direct Admission Helpline: +91 94154 85554', 'announcements'),
('announcement_active', 'true', 'announcements'),
('hero_badge', 'Admissions open for 2026-27', 'hero'),
('hero_title_lead', 'Nurturing compassionate', 'hero'),
('hero_title_highlight', 'healthcare professionals.', 'hero'),
('hero_description', 'A.N.M., G.N.M. and B.Sc. Nursing at a modern campus near Narnaul Bypass, Mahendergarh. Experienced faculty, well-equipped labs, hostel and transport — everything a nursing student needs, close to home.', 'hero'),
('hero_image', '/images/campus.jpg', 'hero'),
('hero_stat_1_val', '100%', 'hero'),
('hero_stat_1_label', 'Clinical Exposure', 'hero'),
('hero_stat_2_val', '3+', 'hero'),
('hero_stat_2_label', 'Recognized Courses', 'hero'),
('hero_stat_3_val', '10:1', 'hero'),
('hero_stat_3_label', 'Student-Faculty Ratio', 'hero')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);

-- 3. courses
CREATE TABLE IF NOT EXISTS `courses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `duration` VARCHAR(191) NOT NULL,
    `years` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `eligibility` TEXT NOT NULL,
    `summary` TEXT NOT NULL,
    `learn` TEXT NOT NULL,
    `careers` TEXT NOT NULL,
    `accent` VARCHAR(191) NOT NULL DEFAULT 'rose',
    `displayOrder` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    UNIQUE INDEX `courses_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `courses` (`slug`, `code`, `name`, `fullName`, `duration`, `years`, `type`, `eligibility`, `summary`, `learn`, `careers`, `accent`, `displayOrder`) VALUES
('anm', 'ANM', 'Auxiliary Nurse Midwifery', 'Auxiliary Nurse Midwife (ANM)', '2 Years', 2, 'Diploma', 
'["10+2 passed (Arts / Science / Commerce) from a recognized board","Minimum 40-45% aggregate marks (relaxation as per state norms)","Minimum age 17 years at the time of admission","Medically fit candidate"]',
'Grassroots healthcare and maternal-child health foundation designed to train community health leaders and village-level medical first responders.',
'["Community Health Nursing & Primary Healthcare Delivery","Maternal & Child Health Care, Antenatal & Postnatal Care","Immunization Protocols & Cold-Chain Management","Infection Prevention, Sterilization & Aseptic Procedures","Nutrition, Sanitation & Family Planning Education","First Aid, Emergency Response & Referral Pathways"]',
'["Primary Health Centre (PHC) Nurse","Community Health Worker / Sub-Centre Incharge","Rural Health Mission / NHM Health Assistant","Private Nursing Home & Maternity Clinic Staff"]',
'rose', 1),

('gnm', 'GNM', 'General Nursing & Midwifery', 'General Nursing and Midwifery (GNM)', '3 Years', 3, 'Diploma',
'["10+2 with English, preferably Science (PCB) with 40% marks","Arts/Commerce students eligible as per INC / UP State Medical Faculty norms","Age between 17 and 35 years","Must be certified medically fit"]',
'Comprehensive clinical and bedside nursing diploma preparing nurses for hospital wards, emergency units, and critical care centers across India.',
'["Bio-Sciences: Anatomy, Physiology & Microbiology","Behavioral Sciences: Psychology & Sociology in Patient Care","Fundamental Nursing & First Aid Management","Medical-Surgical Nursing I & II (Advanced Clinical Rotations)","Midwifery & Gynecological Nursing with Hands-on Deliveries","Mental Health Nursing & Psychiatric Patient Support"]',
'["Staff Nurse in Government & Private Multispecialty Hospitals","ICU, OT & Critical Care Unit Specialist","Community Health Officer (CHO) via NHM Bridge Program","Industrial / School Health Nurse"]',
'navy', 2),

('bsc-nursing', 'B.Sc Nursing', 'Bachelor of Science in Nursing', 'Bachelor of Science in Nursing (B.Sc. Nursing)', '4 Years', 4, 'Degree',
'["10+2 with Physics, Chemistry, Biology (PCB) and English","Minimum 45% aggregate marks in PCB (40% for SC/ST)","Minimum age 17 years on or before 31st December of admission year","Admission through UP CNET / State counseling"]',
'Four-year university degree program blending intensive classroom academics, hospital bedside practice, advanced research, and clinical leadership.',
'["Applied Anatomy, Physiology, Biochemistry & Nutrition","Nursing Foundations & Advanced Clinical Nursing Procedures","Pathology, Genetics & Pharmacology in Nursing Practice","Child Health Nursing & Pediatric Emergency Interventions","Community Health Nursing & Epidemiology Research","Nursing Management, Hospital Leadership & Research Project"]',
'["Clinical Nursing Specialist / Head Nurse","Government Hospital Nursing Officer (AIIMS, SGPGI, KGMU)","Nursing Educator / Tutor / Lecturer in Nursing Colleges","Global Registered Nurse (OET / NCLEX Pathways abroad)"]',
'green', 3)
ON DUPLICATE KEY UPDATE `fullName` = VALUES(`fullName`);

-- 4. facilities
CREATE TABLE IF NOT EXISTS `facilities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `text` TEXT NOT NULL,
    `icon` VARCHAR(191) NOT NULL,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `facilities` (`title`, `text`, `icon`, `displayOrder`) VALUES
('Nursing Foundation Lab', 'Equipped with advanced adult and pediatric mannequins, CPR trainers, hospital beds, and clinical instruments to simulate realistic hospital ward scenarios before student rotations.', 'Stethoscope', 1),
('Anatomy & Physiology Lab', 'Features life-size human skeletons, 3D anatomical organ models, histology charts, and digital projection systems for immersive study of the human body.', 'Microscope', 2),
('Community Health Nursing Lab', 'Equipped with field bags, cold-chain immunization models, family folders, and rural health intervention kits to prepare students for preventive community care.', 'ShieldAlert', 3),
('Nutrition & Dietetics Lab', 'Modern demonstration kitchen equipped to practice therapeutic diet calculations, infant formula preparation, diabetic meals, and clinical nutritional therapy.', 'Apple', 4),
('Modern Computer Lab', 'High-speed internet workstations with access to digital health portals, hospital management information systems (HMIS), and medical journals.', 'GraduationCap', 5),
('Library & Digital Reading Room', 'Thousands of nursing textbooks, national & international journals, previous year question papers, and quiet spaces for individual and group study.', 'BookOpen', 6),
('Hostel & Nutritious Mess', 'Secure on-campus residential facilities with 24/7 security, hygienic meals, study desks, and dedicated wardens.', 'Building2', 7),
('College Bus Transport', 'Dedicated college bus network connecting nearby towns and rural routes for seamless daily commute and hospital clinical shifts.', 'Bus', 8)
ON DUPLICATE KEY UPDATE `text` = VALUES(`text`);

-- 5. job_openings
CREATE TABLE IF NOT EXISTS `job_openings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Open',
    `description` TEXT NULL,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `job_openings` (`title`, `category`, `status`, `displayOrder`) VALUES
('Nursing Tutor / Clinical Instructor', 'teaching', 'Open', 1),
('Assistant Professor (Medical Surgical / Community)', 'teaching', 'Open', 2),
('Associate Professor (OBG / Pediatrics)', 'teaching', 'Open', 3),
('Librarian / Asst. Librarian', 'nonTeaching', 'Open', 4),
('Computer Lab Instructor', 'nonTeaching', 'Open', 5),
('Office Executive / Admission Counselor', 'nonTeaching', 'Open', 6)
ON DUPLICATE KEY UPDATE `status` = VALUES(`status`);

-- 6. gallery_photos
CREATE TABLE IF NOT EXISTS `gallery_photos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `src` VARCHAR(191) NOT NULL,
    `alt` VARCHAR(191) NOT NULL,
    `caption` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NULL DEFAULT 'campus',
    `span` VARCHAR(191) NULL DEFAULT '',
    `position` VARCHAR(191) NULL DEFAULT '',
    `displayOrder` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `gallery_photos` (`src`, `alt`, `caption`, `category`, `span`, `position`, `displayOrder`) VALUES
('/images/campus.jpg', 'College building at dusk', 'Main building at dusk', 'campus', 'md:col-span-2 md:row-span-2', '', 1),
('/images/nursing-lab.jpg', 'Nursing Skills Lab', 'Nursing practical skill demonstration lab', 'campus', '', 'object-[50%_58%]', 2),
('/images/nursing-library.jpg', 'Library and digital study hall', 'Digital research & medical textbook study room', 'campus', '', 'object-[20%_75%]', 3),
('/images/campus.jpg', 'College signage', 'Adarsh College of Nursing', 'campus', '', 'object-[50%_12%]', 4),
('/images/poster.jpg', 'Admission poster', 'Admissions 2026-27', 'admissions', '', 'object-top', 5)
ON DUPLICATE KEY UPDATE `caption` = VALUES(`caption`);

-- 7. enquiries
CREATE TABLE IF NOT EXISTS `enquiries` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `course` VARCHAR(191) NOT NULL,
    `qualification` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `message` TEXT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'New',
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 8. notices
CREATE TABLE IF NOT EXISTS `notices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `link` VARCHAR(191) NULL,
    `fileUrl` VARCHAR(191) NULL,
    `date` VARCHAR(191) NULL,
    `isUrgent` BOOLEAN NOT NULL DEFAULT false,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `notices` (`title`, `content`, `link`, `date`, `isUrgent`, `displayOrder`) VALUES
('Admissions Open for Session 2026-27', 'Applications are invited for A.N.M., G.N.M. and B.Sc. Nursing programmes. Counseling and campus visits are open on all working days.', '/admissions', 'Session 2026-27', 1, 1),
('Scholarship & Fee Concession Assistance', 'State government Post-Matric scholarship assistance is available for eligible SC/ST/OBC candidates as per government guidelines.', '/contact', 'Current Session', 0, 2)
ON DUPLICATE KEY UPDATE `content` = VALUES(`content`);

-- 9. why_us_cards
CREATE TABLE IF NOT EXISTS `why_us_cards` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `text` TEXT NOT NULL,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `why_us_cards` (`title`, `text`, `displayOrder`) VALUES
('Qualified & Experienced Faculty', 'Learn from nursing professionals who bring years of hospital and teaching experience.', 1),
('Practical Training & Clinical Exposure', 'Regular clinical postings so students gain real patient-care experience alongside classroom study.', 2),
('Safe & Supportive Environment', 'A disciplined, caring campus where every student is known and guided personally.', 3),
('Overall Personality Development', 'Communication skills, confidence and professional ethics are part of everyday learning.', 4),
('Excellent Learning Infrastructure', 'Modern labs, library and classrooms in a purpose-built college building.', 5),
('Placement Assistance', 'Guidance and support to help graduates find roles in hospitals and healthcare centres.', 6)
ON DUPLICATE KEY UPDATE `text` = VALUES(`text`);

-- 10. admission_steps
CREATE TABLE IF NOT EXISTS `admission_steps` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `stepNumber` INTEGER NOT NULL DEFAULT 1,
    `title` VARCHAR(191) NOT NULL,
    `text` TEXT NOT NULL,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `admission_steps` (`stepNumber`, `title`, `text`, `displayOrder`) VALUES
(1, 'Enquire', 'Call, WhatsApp or fill the enquiry form. Our team will explain courses, eligibility and the admission process.', 1),
(2, 'Visit the campus', 'See the classrooms, labs, hostel and meet the faculty. Walk-ins are welcome on working days.', 2),
(3, 'Submit documents', 'Bring your 10th and 12th marksheets, ID proof, passport-size photographs and category certificate if applicable.', 3),
(4, 'Confirm your seat', 'Complete the admission formalities and fee process to reserve your seat for the academic session.', 4)
ON DUPLICATE KEY UPDATE `text` = VALUES(`text`);

-- 11. admission_documents
CREATE TABLE IF NOT EXISTS `admission_documents` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `admission_documents` (`title`, `displayOrder`) VALUES
('10th class marksheet and certificate', 1),
('10+2 marksheet and certificate', 2),
('Aadhaar card or other government photo ID', 3),
('Passport-size photographs (6 copies)', 4),
('Character certificate from last institution', 5),
('Caste / category certificate (if applicable)', 6),
('Medical fitness certificate', 7)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

SET FOREIGN_KEY_CHECKS = 1;
