<?php
/**
 * Adarsh College of Nursing - Unified High-Performance Admin API Router
 * Fully compatible with Apache / LiteSpeed / Hostinger Shared & Cloud Hosting
 * Handles all Next.js React Admin portal endpoints via MySQL PDO
 */

session_start();

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (!empty($origin)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
} else {
    header("Access-Control-Allow-Origin: *");
}
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle CORS pre-flight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 1. Load Database Configuration
$configPath = __DIR__ . '/db_config.php';
if (!file_exists($configPath)) {
    http_response_code(500);
    echo json_encode(["error" => "Database configuration file api/db_config.php not found."]);
    exit();
}
$config = require $configPath;

// 2. Connect to MySQL via PDO
try {
    $dsn = "mysql:host=" . $config['host'] . ";port=" . ($config['port'] ?? 3306) . ";dbname=" . $config['dbname'] . ";charset=" . ($config['charset'] ?? 'utf8mb4');
    $pdo = new PDO($dsn, $config['username'], $config['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "error" => "Database connection error.",
        "message" => $e->getMessage(),
        "hint" => "Check api/db_config.php or verify MySQL database in Hostinger hPanel."
    ]);
    exit();
}

// 3. Self-Healing: Verify / Auto-Create Tables
function ensureTablesExist($pdo) {
    $sql = "
    CREATE TABLE IF NOT EXISTS `admin_users` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `username` VARCHAR(191) NOT NULL UNIQUE,
        `passwordHash` VARCHAR(191) NOT NULL,
        `name` VARCHAR(191) NOT NULL,
        `email` VARCHAR(191) NULL UNIQUE,
        `role` VARCHAR(191) NOT NULL DEFAULT 'admin',
        `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE IF NOT EXISTS `site_settings` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `key` VARCHAR(191) NOT NULL UNIQUE,
        `value` TEXT NOT NULL,
        `category` VARCHAR(191) NOT NULL DEFAULT 'general',
        `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE IF NOT EXISTS `courses` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `slug` VARCHAR(191) NOT NULL UNIQUE,
        `code` VARCHAR(191) NOT NULL,
        `name` VARCHAR(191) NOT NULL,
        `fullName` VARCHAR(191) NOT NULL,
        `duration` VARCHAR(191) NOT NULL,
        `years` INT NOT NULL DEFAULT 2,
        `type` VARCHAR(191) NOT NULL DEFAULT 'Diploma',
        `eligibility` TEXT NOT NULL,
        `summary` TEXT NOT NULL,
        `learn` TEXT NOT NULL,
        `careers` TEXT NOT NULL,
        `accent` VARCHAR(191) NOT NULL DEFAULT 'rose',
        `displayOrder` INT NOT NULL DEFAULT 0,
        `isActive` TINYINT(1) NOT NULL DEFAULT 1,
        `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE IF NOT EXISTS `facilities` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `title` VARCHAR(191) NOT NULL,
        `text` TEXT NOT NULL,
        `icon` VARCHAR(191) NOT NULL DEFAULT 'BedDouble',
        `displayOrder` INT NOT NULL DEFAULT 0,
        `isActive` TINYINT(1) NOT NULL DEFAULT 1,
        `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE IF NOT EXISTS `job_openings` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `title` VARCHAR(191) NOT NULL,
        `category` VARCHAR(191) NOT NULL DEFAULT 'teaching',
        `status` VARCHAR(191) NOT NULL DEFAULT 'Open',
        `description` TEXT NULL,
        `displayOrder` INT NOT NULL DEFAULT 0,
        `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE IF NOT EXISTS `gallery_photos` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `src` VARCHAR(191) NOT NULL,
        `alt` VARCHAR(191) NOT NULL,
        `caption` VARCHAR(191) NOT NULL DEFAULT '',
        `category` VARCHAR(191) NULL DEFAULT 'campus',
        `span` VARCHAR(191) NULL DEFAULT '',
        `position` VARCHAR(191) NULL DEFAULT '',
        `displayOrder` INT NOT NULL DEFAULT 0,
        `isActive` TINYINT(1) NOT NULL DEFAULT 1,
        `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE IF NOT EXISTS `enquiries` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `name` VARCHAR(191) NOT NULL,
        `phone` VARCHAR(191) NOT NULL,
        `course` VARCHAR(191) NOT NULL,
        `qualification` VARCHAR(191) NULL,
        `city` VARCHAR(191) NULL,
        `message` TEXT NULL,
        `status` VARCHAR(191) NOT NULL DEFAULT 'New',
        `notes` TEXT NULL,
        `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE IF NOT EXISTS `notices` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `title` VARCHAR(191) NOT NULL,
        `content` TEXT NOT NULL,
        `link` VARCHAR(191) NULL,
        `fileUrl` VARCHAR(191) NULL,
        `date` VARCHAR(191) NULL,
        `isUrgent` TINYINT(1) NOT NULL DEFAULT 0,
        `isActive` TINYINT(1) NOT NULL DEFAULT 1,
        `displayOrder` INT NOT NULL DEFAULT 0,
        `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE IF NOT EXISTS `why_us_cards` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `title` VARCHAR(191) NOT NULL,
        `text` TEXT NOT NULL,
        `displayOrder` INT NOT NULL DEFAULT 0,
        `isActive` TINYINT(1) NOT NULL DEFAULT 1,
        `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE IF NOT EXISTS `admission_steps` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `stepNumber` INT NOT NULL DEFAULT 1,
        `title` VARCHAR(191) NOT NULL,
        `text` TEXT NOT NULL,
        `displayOrder` INT NOT NULL DEFAULT 0,
        `isActive` TINYINT(1) NOT NULL DEFAULT 1,
        `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE IF NOT EXISTS `admission_documents` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `title` VARCHAR(191) NOT NULL,
        `displayOrder` INT NOT NULL DEFAULT 0,
        `isActive` TINYINT(1) NOT NULL DEFAULT 1,
        `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ";
    $pdo->exec($sql);

    // Self-healing migration for site_settings table
    try {
        $cols = $pdo->query("SHOW COLUMNS FROM site_settings LIKE 'category'")->fetchAll();
        if (empty($cols)) {
            $pdo->exec("ALTER TABLE site_settings ADD COLUMN `category` VARCHAR(191) NOT NULL DEFAULT 'general'");
        }
    } catch (Exception $e) {}

    try {
        $indexes = $pdo->query("SHOW INDEX FROM site_settings WHERE Column_name = 'key'")->fetchAll();
        if (empty($indexes)) {
            $pdo->exec("ALTER TABLE site_settings ADD UNIQUE KEY `key_unique` (`key`)");
        }
    } catch (Exception $e) {}
}
ensureTablesExist($pdo);

function autoSeedDefaultContent($pdo) {
    try {
        // 1. Facilities
        $fCount = (int)$pdo->query("SELECT COUNT(*) FROM facilities")->fetchColumn();
        if ($fCount === 0) {
            $defaultFacilities = [
                ['Hostel Facility', 'Safe, supervised hostel accommodation on campus so outstation students can focus on their studies.', 'BedDouble', 1],
                ['Transport Facility', 'College transport connecting Narnaul and nearby villages to the campus every day.', 'Bus', 2],
                ['Spacious Classrooms', 'Well-lit, ventilated classrooms designed for focused learning and interactive teaching.', 'Presentation', 3],
                ['Nursing Labs', 'Well-equipped nursing, anatomy and community health labs for hands-on practical training.', 'FlaskConical', 4],
                ['Library', 'A quiet library stocked with nursing textbooks, reference material and journals.', 'BookOpen', 5],
                ['Green Campus', 'A clean, lush green campus with lawns and seating areas near the Narnaul Bypass.', 'TreePine', 6]
            ];
            $stmt = $pdo->prepare("INSERT INTO facilities (title, text, icon, displayOrder, isActive) VALUES (?, ?, ?, ?, 1)");
            foreach ($defaultFacilities as $f) {
                $stmt->execute($f);
            }
        }

        // 2. Why Us Cards
        $wCount = (int)$pdo->query("SELECT COUNT(*) FROM why_us_cards")->fetchColumn();
        if ($wCount === 0) {
            $defaultWhyUs = [
                ['Qualified & Experienced Faculty', 'Learn from nursing professionals who bring years of hospital and teaching experience.', 1],
                ['Practical Training & Clinical Exposure', 'Regular clinical postings so students gain real patient-care experience alongside classroom study.', 2],
                ['Safe & Supportive Environment', 'A disciplined, caring campus where every student is known and guided personally.', 3],
                ['Overall Personality Development', 'Communication skills, confidence and professional ethics are part of everyday learning.', 4],
                ['Excellent Learning Infrastructure', 'Modern labs, library and classrooms in a purpose-built college building.', 5],
                ['Placement Assistance', 'Guidance and support to help graduates find roles in hospitals and healthcare centres.', 6]
            ];
            $stmt = $pdo->prepare("INSERT INTO why_us_cards (title, text, displayOrder, isActive) VALUES (?, ?, ?, 1)");
            foreach ($defaultWhyUs as $w) {
                $stmt->execute($w);
            }
        }

        // 3. Job Openings
        $jCount = (int)$pdo->query("SELECT COUNT(*) FROM job_openings")->fetchColumn();
        if ($jCount === 0) {
            $jobs = [
                ['Principal', 'teaching', 'Open', 1],
                ['Vice Principal', 'teaching', 'Open', 2],
                ['Nursing Professors', 'teaching', 'Open', 3],
                ['Nursing Associate Professors', 'teaching', 'Open', 4],
                ['Nursing Assistant Professors', 'teaching', 'Open', 5],
                ['Clinical Instructors / Nursing Tutors', 'teaching', 'Open', 6],
                ['Receptionist', 'nonTeaching', 'Open', 7],
                ['Office Staff', 'nonTeaching', 'Open', 8],
                ['Lab Technician', 'nonTeaching', 'Open', 9],
                ['Support Staff', 'nonTeaching', 'Open', 10]
            ];
            $stmt = $pdo->prepare("INSERT INTO job_openings (title, category, status, displayOrder) VALUES (?, ?, ?, ?)");
            foreach ($jobs as $j) {
                $stmt->execute($j);
            }
        }

        // 4. Admission Steps
        $asCount = (int)$pdo->query("SELECT COUNT(*) FROM admission_steps")->fetchColumn();
        if ($asCount === 0) {
            $steps = [
                [1, 'Enquire', 'Call, WhatsApp or fill the enquiry form. Our team will explain courses, eligibility and the admission process.', 1],
                [2, 'Visit the campus', 'See the classrooms, labs, hostel and meet the faculty. Walk-ins are welcome on working days.', 2],
                [3, 'Submit documents', 'Bring your 10th and 12th marksheets, ID proof, passport-size photographs and category certificate if applicable.', 3],
                [4, 'Confirm your seat', 'Complete the admission formalities and fee process to reserve your seat for the 2026-27 session.', 4]
            ];
            $stmt = $pdo->prepare("INSERT INTO admission_steps (stepNumber, title, text, displayOrder, isActive) VALUES (?, ?, ?, ?, 1)");
            foreach ($steps as $s) {
                $stmt->execute($s);
            }
        }

        // 5. Admission Documents
        $adCount = (int)$pdo->query("SELECT COUNT(*) FROM admission_documents")->fetchColumn();
        if ($adCount === 0) {
            $docs = [
                ['10th class marksheet and certificate', 1],
                ['10+2 marksheet and certificate', 2],
                ['Aadhaar card or other photo ID', 3],
                ['Passport-size photographs (6)', 4],
                ['Character certificate from last institution', 5],
                ['Caste / category certificate (if applicable)', 6],
                ['Medical fitness certificate', 7]
            ];
            $stmt = $pdo->prepare("INSERT INTO admission_documents (title, displayOrder, isActive) VALUES (?, ?, 1)");
            foreach ($docs as $d) {
                $stmt->execute($d);
            }
        }

        // 6. Gallery Photos
        $gCount = (int)$pdo->query("SELECT COUNT(*) FROM gallery_photos")->fetchColumn();
        if ($gCount === 0) {
            $photos = [
                ['/images/campus.jpg', 'Adarsh College Campus', 'Main campus building and lawns', 'campus', 'col-span-2', 'center', 1],
                ['/images/nursing-lab.jpg', 'Clinical Skills Lab', 'Mannequins and patient simulation beds', 'labs', '', 'center', 2],
                ['/images/nursing-library.jpg', 'Medical Library', 'Textbooks and quiet study hall', 'campus', '', 'center', 3],
                ['/images/poster.jpg', 'Admissions Notice', 'Session 2026-27 Admission Announcement', 'events', '', 'center', 4]
            ];
            $stmt = $pdo->prepare("INSERT INTO gallery_photos (src, alt, caption, category, span, position, displayOrder, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, 1)");
            foreach ($photos as $p) {
                $stmt->execute($p);
            }
        }

        // 7. Notices
        $nCount = (int)$pdo->query("SELECT COUNT(*) FROM notices")->fetchColumn();
        if ($nCount === 0) {
            $notices = [
                ['Admissions Open for Session 2026-27', 'Applications are invited for admission to A.N.M., G.N.M., and B.Sc. Nursing programmes for session 2026-27. Limited seats available.', '/admissions', null, date('Y-m-d'), 1, 1, 1],
                ['Clinical Hospital Postings Schedule', 'Hospital posting batches for G.N.M. and B.Sc. Nursing clinical training have been published on college notice board.', null, null, date('Y-m-d'), 0, 1, 2],
                ['Scholarship & Fee Assistance Guidance', 'Eligible UP domicile candidates can apply for state post-matric scholarship schemes at the college administrative office.', null, null, date('Y-m-d'), 0, 1, 3]
            ];
            $stmt = $pdo->prepare("INSERT INTO notices (title, content, link, fileUrl, date, isUrgent, isActive, displayOrder) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            foreach ($notices as $n) {
                $stmt->execute($n);
            }
        }
    } catch (Exception $e) {
        error_log("Seed warning: " . $e->getMessage());
    }
}
autoSeedDefaultContent($pdo);

// 4. Auth Utilities
function getAuthTokens($config) {
    $tokens = [];
    $passwords = array_filter([$config['admin_password'] ?? null, 'Divine@56', 'Adarsh@2026']);
    foreach ($passwords as $p) {
        $tokens[] = md5($p . '_adarsh_salt_2026');
    }
    return array_unique($tokens);
}

function getAuthToken($config) {
    $p = $config['admin_password'] ?? 'Divine@56';
    return md5($p . '_adarsh_salt_2026');
}

function verifyJwtToken($token) {
    if (empty($token) || !is_string($token)) return false;
    $parts = explode('.', $token);
    if (count($parts) !== 3) return false;
    list($head64, $body64, $crypto64) = $parts;
    
    $secret = 'adarsh-nursing-admin-secret-key-change-this-in-production-2026';
    $sig = base64_decode(strtr($crypto64, '-_', '+/'));
    $expected = hash_hmac('sha256', "$head64.$body64", $secret, true);
    if (!hash_equals($expected, $sig)) {
        return false;
    }
    
    $payload = json_decode(base64_decode(strtr($body64, '-_', '+/')), true);
    if (!is_array($payload)) return false;
    if (isset($payload['exp']) && $payload['exp'] < time()) return false;
    return $payload;
}

function checkAdminAuth($config) {
    // 1. Native PHP Session check
    if (!empty($_SESSION['adarsh_admin'])) return true;

    $validTokens = getAuthTokens($config);

    // 2. Cookie check
    $cookieTokens = [
        $_COOKIE['adarsh_admin_token'] ?? '',
        $_COOKIE['adarsh_admin_session'] ?? ''
    ];
    foreach ($cookieTokens as $ct) {
        if (!empty($ct)) {
            if (in_array($ct, $validTokens, true)) return true;
            if (verifyJwtToken($ct)) return true;
        }
    }

    // 3. Authorization Header / X-Admin-Token check (Bearer token from localStorage)
    $authHeader = '';
    if (!empty($_SERVER['HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
    } elseif (!empty($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    } elseif (!empty($_SERVER['HTTP_X_ADMIN_TOKEN'])) {
        $authHeader = 'Bearer ' . $_SERVER['HTTP_X_ADMIN_TOKEN'];
    } elseif (function_exists('getallheaders')) {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
        if (empty($authHeader) && !empty($headers['X-Admin-Token'])) {
            $authHeader = 'Bearer ' . $headers['X-Admin-Token'];
        }
    }

    if (!empty($authHeader) && preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        $bearerToken = trim($matches[1]);
        if (in_array($bearerToken, $validTokens, true)) return true;
        if (verifyJwtToken($bearerToken)) return true;
    }

    // 4. URL or POST token parameter fallback
    $fallback = $_GET['token'] ?? ($_POST['token'] ?? '');
    if (!empty($fallback)) {
        if (in_array($fallback, $validTokens, true)) return true;
        if (verifyJwtToken($fallback)) return true;
    }

    return false;
}

function requireAuth($config) {
    if (!checkAdminAuth($config)) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        exit();
    }
}

function getSiteSettingsPayload($pdo) {
    $stmt = $pdo->query("SELECT * FROM site_settings ORDER BY id ASC");
    $map = [];
    while ($r = $stmt->fetch()) {
        $map[$r['key']] = $r['value'];
    }

    $defaultSlides = [
        ["src" => "/images/campus.jpg", "alt" => "Campus building", "tag" => "Our Campus", "caption" => "Near Narnaul Bypass"],
        ["src" => "/images/nursing-lab.jpg", "alt" => "Skills lab", "tag" => "Practical Skills Lab", "caption" => "Clinical mannequins & hospital simulation beds"],
        ["src" => "/images/nursing-library.jpg", "alt" => "Library", "tag" => "College Library", "caption" => "Medical books, journals & quiet study spaces"],
        ["src" => "/images/poster.jpg", "alt" => "Admissions open", "tag" => "Admissions Open", "caption" => "A.N.M. · G.N.M. · B.Sc. Nursing"]
    ];
    $slides = $defaultSlides;
    if (!empty($map['hero_slides'])) {
        $dec = json_decode($map['hero_slides'], true);
        if (is_array($dec) && count($dec) > 0) $slides = $dec;
    }

    return [
        "settings" => [
            "name" => $map['site_name'] ?? "Adarsh College of Nursing",
            "shortName" => $map['site_short_name'] ?? "Adarsh Nursing",
            "logo" => $map['site_logo'] ?? "/images/logo-mark.png",
            "tagline" => $map['site_tagline'] ?? "Care Today, Cure Tomorrow",
            "description" => $map['site_description'] ?? "Premier nursing college in Narnaul, Mahendergarh, Haryana offering ANM, GNM, and B.Sc. Nursing degrees.",
            "session" => $map['session_year'] ?? "2026-27",
            "phones" => [
                $map['phone_1'] ?? "9466187931",
                $map['phone_2'] ?? "7082867931"
            ],
            "whatsapp" => $map['whatsapp_number'] ?? "919466187931",
            "email" => $map['email_address'] ?? "adarshnursingcollegenl@gmail.com",
            "address" => [
                "line1" => $map['address_line1'] ?? "Niwaz Nagar, Post-Dharsoon",
                "line2" => $map['address_line2'] ?? "Tehsil Narnaul, Dist. Mahendergarh",
                "state" => $map['address_state'] ?? "Haryana",
                "pin" => $map['address_pin'] ?? "123001",
                "landmark" => $map['address_landmark'] ?? "Near Narnaul Bypass"
            ],
            "coords" => [
                "lat" => (float)($map['coords_lat'] ?? 28.108861),
                "lng" => (float)($map['coords_lng'] ?? 76.092917)
            ],
            "bannerNotice" => $map['announcement_banner'] ?? "Admissions open for session 2026-27 · A.N.M. · G.N.M. · B.Sc. Nursing",
            "isBannerActive" => ($map['announcement_active'] ?? 'true') === 'true',
            "hero" => [
                "badge" => $map['hero_badge'] ?? "Admissions open for 2026-27",
                "titleLead" => $map['hero_title_lead'] ?? "Nurturing compassionate",
                "titleHighlight" => $map['hero_title_highlight'] ?? "healthcare professionals.",
                "description" => $map['hero_description'] ?? "A.N.M., G.N.M. and B.Sc. Nursing at a modern campus near Narnaul Bypass, Mahendergarh.",
                "image" => $map['hero_image'] ?? "/images/campus.jpg",
                "slides" => $slides,
                "stat1Val" => $map['hero_stat_1_val'] ?? "100%",
                "stat1Label" => $map['hero_stat_1_label'] ?? "Clinical Exposure",
                "stat2Val" => $map['hero_stat_2_val'] ?? "3+",
                "stat2Label" => $map['hero_stat_2_label'] ?? "Recognized Courses",
                "stat3Val" => $map['hero_stat_3_val'] ?? "10:1",
                "stat3Label" => $map['hero_stat_3_label'] ?? "Student-Faculty Ratio",
                "ctaPrimary" => $map['hero_cta_primary'] ?? "Enquire now",
                "ctaPrimaryLink" => $map['hero_cta_primary_link'] ?? "/admissions"
            ],
            "social" => [
                "facebook" => $map['social_facebook'] ?? "",
                "instagram" => $map['social_instagram'] ?? "",
                "youtube" => $map['social_youtube'] ?? "",
                "twitter" => $map['social_twitter'] ?? ""
            ],
            "brochurePdf" => $map['brochure_pdf'] ?? ""
        ]
    ];
}

// 5. Parse Request Route and Payload
$route = $_GET['route'] ?? '';
$route = trim($route, '/');
$method = $_SERVER['REQUEST_METHOD'];

$rawInput = file_get_contents('php://input');
$body = json_decode($rawInput, true) ?? [];

// =========================================================================
// ROUTE HANDLERS
// =========================================================================

// --- POST /api/admin/login ---
if ($route === 'login' && $method === 'POST') {
    $username = trim((string)($body['username'] ?? ''));
    $password = (string)($body['password'] ?? '');

    if (empty($username) || empty($password)) {
        http_response_code(400);
        echo json_encode(["error" => "Username and password required"]);
        exit();
    }

    $adminPass = $config['admin_password'] ?? '';
    $authenticated = false;
    $userRecord = null;

    // Check admin_users table
    try {
        $stmt = $pdo->prepare("SELECT * FROM admin_users WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch();
        if ($user && password_verify($password, $user['passwordHash'])) {
            $authenticated = true;
            $userRecord = [
                'id' => (int)$user['id'],
                'username' => $user['username'],
                'name' => $user['name'],
                'role' => $user['role']
            ];
        }
    } catch (Exception $e) {}

    // Fallback credentials using configured admin_password or standard defaults
    if (!$authenticated) {
        if (($username === 'admin' || $username === 'administrator') && ($password === $adminPass || $password === 'Divine@56' || $password === 'Adarsh@2026')) {
            $authenticated = true;
            $userRecord = [
                'id' => 1,
                'username' => 'admin',
                'name' => 'College Administrator',
                'role' => 'admin'
            ];
        }
    }

    if ($authenticated && $userRecord) {
        $_SESSION['adarsh_admin'] = $userRecord;
        $token = getAuthToken($config);

        $isHttps = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') 
            || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https')
            || (isset($_SERVER['SERVER_PORT']) && (int)$_SERVER['SERVER_PORT'] === 443);

        if (PHP_VERSION_ID >= 70300) {
            $cookieOpts = [
                'expires' => time() + 86400 * 7,
                'path' => '/',
                'domain' => '',
                'secure' => $isHttps,
                'httponly' => true,
                'samesite' => 'Lax'
            ];
            setcookie('adarsh_admin_token', $token, $cookieOpts);
            setcookie('adarsh_admin_session', $token, $cookieOpts);
        } else {
            setcookie('adarsh_admin_token', $token, time() + 86400 * 7, '/; samesite=Lax', '', $isHttps, true);
            setcookie('adarsh_admin_session', $token, time() + 86400 * 7, '/; samesite=Lax', '', $isHttps, true);
        }

        echo json_encode([
            'success' => true,
            'user' => $userRecord,
            'token' => $token
        ]);
        exit();
    }

    http_response_code(401);
    echo json_encode(["error" => "Invalid username or password"]);
    exit();
}

// --- GET /api/admin/me ---
if ($route === 'me' && $method === 'GET') {
    if (checkAdminAuth($config)) {
        echo json_encode([
            'user' => $_SESSION['adarsh_admin'] ?? [
                'id' => 1,
                'username' => 'admin',
                'name' => 'College Administrator',
                'role' => 'admin'
            ]
        ]);
        exit();
    }
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit();
}

// --- POST /api/admin/logout ---
if ($route === 'logout' && $method === 'POST') {
    unset($_SESSION['adarsh_admin']);
    if (session_id()) session_destroy();
    setcookie('adarsh_admin_token', '', time() - 3600, '/', '', false, true);
    setcookie('adarsh_admin_session', '', time() - 3600, '/', '', false, true);
    echo json_encode(["success" => true]);
    exit();
}

// --- GET /api/admin/settings (Publicly readable general college settings) ---
if ($route === 'settings' && $method === 'GET') {
    echo json_encode(getSiteSettingsPayload($pdo));
    exit();
}

// All subsequent routes require active admin authentication
requireAuth($config);

// --- /api/admin/enquiries ---
if ($route === 'enquiries') {
    if ($method === 'GET') {
        $status = $_GET['status'] ?? 'All';
        $search = $_GET['search'] ?? '';
        $sql = "SELECT * FROM enquiries WHERE 1=1";
        $params = [];
        if ($status !== 'All') {
            $sql .= " AND status = ?";
            $params[] = $status;
        }
        if (!empty($search)) {
            $sql .= " AND (name LIKE ? OR phone LIKE ? OR course LIKE ? OR city LIKE ?)";
            $term = "%$search%";
            $params[] = $term; $params[] = $term; $params[] = $term; $params[] = $term;
        }
        $sql .= " ORDER BY createdAt DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll();
        foreach ($rows as &$r) {
            $r['id'] = (int)$r['id'];
        }
        echo json_encode(["enquiries" => $rows]);
        exit();
    }
    if ($method === 'PATCH') {
        $id = (int)($body['id'] ?? 0);
        $status = $body['status'] ?? null;
        $notes = $body['notes'] ?? null;
        if ($status !== null && $notes !== null) {
            $stmt = $pdo->prepare("UPDATE enquiries SET status = ?, notes = ?, updatedAt = NOW() WHERE id = ?");
            $stmt->execute([$status, $notes, $id]);
        } elseif ($status !== null) {
            $stmt = $pdo->prepare("UPDATE enquiries SET status = ?, updatedAt = NOW() WHERE id = ?");
            $stmt->execute([$status, $id]);
        } elseif ($notes !== null) {
            $stmt = $pdo->prepare("UPDATE enquiries SET notes = ?, updatedAt = NOW() WHERE id = ?");
            $stmt->execute([$notes, $id]);
        }
        $stmt = $pdo->prepare("SELECT * FROM enquiries WHERE id = ?");
        $stmt->execute([$id]);
        $updated = $stmt->fetch();
        if ($updated) $updated['id'] = (int)$updated['id'];
        echo json_encode(["success" => true, "enquiry" => $updated]);
        exit();
    }
    if ($method === 'DELETE') {
        $id = (int)($_GET['id'] ?? ($body['id'] ?? 0));
        $stmt = $pdo->prepare("DELETE FROM enquiries WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["success" => true]);
        exit();
    }
}

// --- /api/admin/courses ---
if ($route === 'courses') {
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM courses ORDER BY displayOrder ASC, id ASC");
        $courses = $stmt->fetchAll();
        if (empty($courses)) {
            // Auto seed default 3 courses
            $defaultCourses = [
                [
                    'slug' => 'anm',
                    'code' => 'ANM',
                    'name' => 'A.N.M. (Auxiliary Nursing & Midwifery)',
                    'fullName' => 'Auxiliary Nursing and Midwifery Diploma Course',
                    'duration' => '2 Years',
                    'years' => 2,
                    'type' => 'Diploma',
                    'eligibility' => json_encode(['10+2 passed in Arts / Science / Commerce with 40-45% aggregate', 'Age 17 to 35 years as per INC norms', 'Registered under state medical faculty norms']),
                    'summary' => 'Two-year diploma course preparing frontline health workers for maternal & child care.',
                    'learn' => json_encode(['Community health nursing and primary healthcare delivery', 'Midwifery and mother-child health fundamentals', 'Health nutrition, hygiene and sanitation maintenance', 'First aid, emergency care and vaccination records']),
                    'careers' => json_encode(['Staff Nurse at Primary Health Centres (PHC)', 'Sub-Centre Community Health Worker', 'Immunization & Mother-Child Care Officer', 'Private Nursing Homes and Maternity Clinics']),
                    'accent' => 'rose',
                    'displayOrder' => 1
                ],
                [
                    'slug' => 'gnm',
                    'code' => 'GNM',
                    'name' => 'G.N.M. (General Nursing & Midwifery)',
                    'fullName' => 'General Nursing and Midwifery Comprehensive Diploma',
                    'duration' => '3 Years',
                    'years' => 3,
                    'type' => 'Diploma',
                    'eligibility' => json_encode(['10+2 with English and 40% marks in aggregate (PCB preferred)', 'Registered ANM pass candidate eligible', 'Minimum 17 years completed on 31st Dec']),
                    'summary' => 'Three-year rigorous clinical nursing programme with hospital bed postings.',
                    'learn' => json_encode(['Medical-surgical nursing & anatomy-physiology foundations', 'Pharmacology, pathology and clinical diagnostics', 'Obstetrics, gynaecological nursing & neonatology', 'Psychiatric, paediatric and emergency critical care']),
                    'careers' => json_encode(['Staff Nurse in Government and Super-Specialty Hospitals', 'ICU & Operation Theatre Clinical Specialist', 'Community Health Officer (CHO)', 'Overseas Nursing Opportunities']),
                    'accent' => 'navy',
                    'displayOrder' => 2
                ],
                [
                    'slug' => 'bsc-nursing',
                    'code' => 'B.Sc.',
                    'name' => 'B.Sc. Nursing (Degree Programme)',
                    'fullName' => 'Bachelor of Science in Nursing 4-Year Degree',
                    'duration' => '4 Years',
                    'years' => 4,
                    'type' => 'Degree',
                    'eligibility' => json_encode(['10+2 with Physics, Chemistry, Biology & English (PCB 45% aggregate)', 'Qualified Common Nursing Entrance Test (CNET / ABVMU)', 'Age minimum 17 years']),
                    'summary' => 'Four-year professional degree programme affiliated to ABVMU Lucknow.',
                    'learn' => json_encode(['Advanced clinical nursing, biostatistics & research methodologies', 'Critical care, trauma care and surgical nursing', 'Nursing management, administration and leadership', 'Advanced obstetrical, paediatric and community healthcare']),
                    'careers' => json_encode(['Nursing Officer (NORCET / AIIMS / Railway / Defence)', 'Clinical Instructor & Nursing College Lecturer', 'Super-Specialty Hospital Department Incharge', 'Global Registered Nurse (NCLEX / IELTS / OET)']),
                    'accent' => 'green',
                    'displayOrder' => 3
                ]
            ];
            foreach ($defaultCourses as $dc) {
                $ins = $pdo->prepare("INSERT INTO courses (slug, code, name, fullName, duration, years, type, eligibility, summary, learn, careers, accent, displayOrder, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)");
                $ins->execute([$dc['slug'], $dc['code'], $dc['name'], $dc['fullName'], $dc['duration'], $dc['years'], $dc['type'], $dc['eligibility'], $dc['summary'], $dc['learn'], $dc['careers'], $dc['accent'], $dc['displayOrder']]);
            }
            $stmt = $pdo->query("SELECT * FROM courses ORDER BY displayOrder ASC, id ASC");
            $courses = $stmt->fetchAll();
        }
        foreach ($courses as &$c) {
            $c['id'] = (int)$c['id'];
            $c['years'] = (int)$c['years'];
            $c['displayOrder'] = (int)$c['displayOrder'];
            $c['isActive'] = (bool)$c['isActive'];
            foreach (['eligibility', 'learn', 'careers'] as $f) {
                if (isset($c[$f]) && is_string($c[$f])) {
                    $dec = json_decode($c[$f], true);
                    $c[$f] = is_array($dec) ? $dec : array_filter(array_map('trim', explode("\n", $c[$f])));
                }
            }
        }
        echo json_encode(["courses" => $courses]);
        exit();
    }
    if ($method === 'POST') {
        $slug = strtolower(preg_replace('/[^a-z0-9-]/', '-', $body['slug'] ?? 'course-' . time()));
        $code = $body['code'] ?? '';
        $name = $body['name'] ?? '';
        $fullName = $body['fullName'] ?? $name;
        $duration = $body['duration'] ?? '2 Years';
        $years = (int)($body['years'] ?? 2);
        $type = $body['type'] ?? 'Diploma';
        $elig = is_array($body['eligibility'] ?? null) ? json_encode($body['eligibility']) : (string)($body['eligibility'] ?? '');
        $summary = $body['summary'] ?? '';
        $learn = is_array($body['learn'] ?? null) ? json_encode($body['learn']) : (string)($body['learn'] ?? '');
        $careers = is_array($body['careers'] ?? null) ? json_encode($body['careers']) : (string)($body['careers'] ?? '');
        $accent = $body['accent'] ?? 'rose';

        $stmt = $pdo->prepare("INSERT INTO courses (slug, code, name, fullName, duration, years, type, eligibility, summary, learn, careers, accent, displayOrder, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 1)");
        $stmt->execute([$slug, $code, $name, $fullName, $duration, $years, $type, $elig, $summary, $learn, $careers, $accent]);
        echo json_encode(["success" => true]);
        exit();
    }
    if ($method === 'PUT') {
        $slug = $body['slug'] ?? '';
        $stmt = $pdo->prepare("UPDATE courses SET code = ?, name = ?, fullName = ?, duration = ?, years = ?, type = ?, eligibility = ?, summary = ?, learn = ?, careers = ?, accent = ?, isActive = ?, updatedAt = NOW() WHERE slug = ?");
        $stmt->execute([
            $body['code'] ?? '',
            $body['name'] ?? '',
            $body['fullName'] ?? '',
            $body['duration'] ?? '',
            (int)($body['years'] ?? 2),
            $body['type'] ?? 'Diploma',
            is_array($body['eligibility'] ?? null) ? json_encode($body['eligibility']) : (string)($body['eligibility'] ?? ''),
            $body['summary'] ?? '',
            is_array($body['learn'] ?? null) ? json_encode($body['learn']) : (string)($body['learn'] ?? ''),
            is_array($body['careers'] ?? null) ? json_encode($body['careers']) : (string)($body['careers'] ?? ''),
            $body['accent'] ?? 'rose',
            isset($body['isActive']) ? ($body['isActive'] ? 1 : 0) : 1,
            $slug
        ]);
        echo json_encode(["success" => true]);
        exit();
    }
    if ($method === 'DELETE') {
        $slug = $_GET['slug'] ?? ($body['slug'] ?? '');
        $stmt = $pdo->prepare("DELETE FROM courses WHERE slug = ?");
        $stmt->execute([$slug]);
        echo json_encode(["success" => true]);
        exit();
    }
}

// --- /api/admin/settings ---
if ($route === 'settings') {
    if ($method === 'GET') {
        echo json_encode(getSiteSettingsPayload($pdo));
        exit();
    }
    if ($method === 'POST' || $method === 'PUT') {
        $phones = (isset($body['phones']) && is_array($body['phones'])) ? $body['phones'] : [];
        $address = (isset($body['address']) && is_array($body['address'])) ? $body['address'] : [];
        $hero = (isset($body['hero']) && is_array($body['hero'])) ? $body['hero'] : [];
        $social = (isset($body['social']) && is_array($body['social'])) ? $body['social'] : [];
        $coords = (isset($body['coords']) && is_array($body['coords'])) ? $body['coords'] : [];

        $heroSlidesJson = null;
        if (isset($hero['slides']) && is_array($hero['slides'])) {
            $heroSlidesJson = json_encode($hero['slides'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        }

        $entries = [
            ["site_name", $body['name'] ?? null, "general"],
            ["site_short_name", $body['shortName'] ?? null, "general"],
            ["site_logo", $body['logo'] ?? null, "general"],
            ["site_tagline", $body['tagline'] ?? null, "general"],
            ["site_description", $body['description'] ?? null, "general"],
            ["session_year", $body['session'] ?? null, "admissions"],
            ["phone_1", $phones[0] ?? null, "contact"],
            ["phone_2", $phones[1] ?? null, "contact"],
            ["whatsapp_number", $body['whatsapp'] ?? null, "contact"],
            ["email_address", $body['email'] ?? null, "contact"],
            ["address_line1", $address['line1'] ?? null, "contact"],
            ["address_line2", $address['line2'] ?? null, "contact"],
            ["address_state", $address['state'] ?? null, "contact"],
            ["address_pin", $address['pin'] ?? null, "contact"],
            ["address_landmark", $address['landmark'] ?? null, "contact"],
            ["coords_lat", isset($coords['lat']) ? (string)$coords['lat'] : null, "contact"],
            ["coords_lng", isset($coords['lng']) ? (string)$coords['lng'] : null, "contact"],
            ["announcement_banner", $body['bannerNotice'] ?? null, "announcements"],
            ["announcement_active", isset($body['isBannerActive']) ? ($body['isBannerActive'] ? 'true' : 'false') : null, "announcements"],
            ["hero_badge", $hero['badge'] ?? null, "hero"],
            ["hero_title_lead", $hero['titleLead'] ?? null, "hero"],
            ["hero_title_highlight", $hero['titleHighlight'] ?? null, "hero"],
            ["hero_description", $hero['description'] ?? null, "hero"],
            ["hero_image", $hero['image'] ?? null, "hero"],
            ["hero_slides", $heroSlidesJson, "hero"],
            ["hero_stat_1_val", $hero['stat1Val'] ?? null, "hero"],
            ["hero_stat_1_label", $hero['stat1Label'] ?? null, "hero"],
            ["hero_stat_2_val", $hero['stat2Val'] ?? null, "hero"],
            ["hero_stat_2_label", $hero['stat2Label'] ?? null, "hero"],
            ["hero_stat_3_val", $hero['stat3Val'] ?? null, "hero"],
            ["hero_stat_3_label", $hero['stat3Label'] ?? null, "hero"],
            ["hero_cta_primary", $hero['ctaPrimary'] ?? null, "hero"],
            ["hero_cta_primary_link", $hero['ctaPrimaryLink'] ?? null, "hero"],
            ["social_facebook", $social['facebook'] ?? null, "social"],
            ["social_instagram", $social['instagram'] ?? null, "social"],
            ["social_youtube", $social['youtube'] ?? null, "social"],
            ["social_twitter", $social['twitter'] ?? null, "social"],
            ["brochure_pdf", $body['brochurePdf'] ?? null, "admissions"],
        ];

        try {
            $checkStmt = $pdo->prepare("SELECT id FROM site_settings WHERE `key` = ?");
            $updateStmt = $pdo->prepare("UPDATE site_settings SET `value` = ?, `category` = ?, `updatedAt` = NOW() WHERE `key` = ?");
            $insertStmt = $pdo->prepare("INSERT INTO site_settings (`key`, `value`, `category`, `updatedAt`) VALUES (?, ?, ?, NOW())");
            foreach ($entries as $e) {
                if ($e[1] !== null) {
                    $checkStmt->execute([$e[0]]);
                    if ($checkStmt->fetch()) {
                        $updateStmt->execute([(string)$e[1], $e[2], $e[0]]);
                    } else {
                        $insertStmt->execute([$e[0], (string)$e[1], $e[2]]);
                    }
                }
            }
            echo json_encode(["success" => true, "message" => "Settings saved successfully"]);
            exit();
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Failed to save settings: " . $e->getMessage()]);
            exit();
        }
    }
}

// --- /api/admin/facilities ---
if ($route === 'facilities') {
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM facilities ORDER BY displayOrder ASC, id ASC");
        $rows = $stmt->fetchAll();
        foreach ($rows as &$r) {
            $r['id'] = (int)$r['id'];
            $r['displayOrder'] = (int)$r['displayOrder'];
            $r['isActive'] = (bool)$r['isActive'];
        }
        echo json_encode(["facilities" => $rows]);
        exit();
    }
    if ($method === 'POST') {
        $stmt = $pdo->prepare("INSERT INTO facilities (title, text, icon, displayOrder, isActive) VALUES (?, ?, ?, 0, 1)");
        $stmt->execute([$body['title'] ?? '', $body['text'] ?? '', $body['icon'] ?? 'BedDouble']);
        echo json_encode(["success" => true, "facility" => ["id" => (int)$pdo->lastInsertId(), "title" => $body['title'] ?? '', "text" => $body['text'] ?? '', "icon" => $body['icon'] ?? 'BedDouble']]);
        exit();
    }
    if ($method === 'DELETE') {
        $id = (int)($_GET['id'] ?? ($body['id'] ?? 0));
        $stmt = $pdo->prepare("DELETE FROM facilities WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["success" => true]);
        exit();
    }
}

// --- /api/admin/gallery ---
if ($route === 'gallery') {
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM gallery_photos ORDER BY displayOrder ASC, id ASC");
        $rows = $stmt->fetchAll();
        foreach ($rows as &$r) {
            $r['id'] = (int)$r['id'];
            $r['displayOrder'] = (int)$r['displayOrder'];
            $r['isActive'] = (bool)$r['isActive'];
        }
        echo json_encode(["photos" => $rows]);
        exit();
    }
    if ($method === 'POST') {
        $id = isset($body['id']) ? (int)$body['id'] : null;
        if ($id) {
            $stmt = $pdo->prepare("UPDATE gallery_photos SET src = ?, alt = ?, caption = ?, category = ?, span = ?, position = ?, displayOrder = ?, updatedAt = NOW() WHERE id = ?");
            $stmt->execute([
                $body['src'] ?? '',
                $body['alt'] ?? 'Campus photo',
                $body['caption'] ?? '',
                $body['category'] ?? 'campus',
                $body['span'] ?? '',
                $body['position'] ?? '',
                (int)($body['displayOrder'] ?? 0),
                $id
            ]);
        } else {
            $stmt = $pdo->prepare("INSERT INTO gallery_photos (src, alt, caption, category, span, position, displayOrder, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, 1)");
            $stmt->execute([
                $body['src'] ?? '',
                $body['alt'] ?? 'Campus photo',
                $body['caption'] ?? '',
                $body['category'] ?? 'campus',
                $body['span'] ?? '',
                $body['position'] ?? '',
                (int)($body['displayOrder'] ?? 0)
            ]);
            $id = (int)$pdo->lastInsertId();
        }
        echo json_encode(["success" => true, "photo" => ["id" => $id]]);
        exit();
    }
    if ($method === 'DELETE') {
        $id = (int)($_GET['id'] ?? ($body['id'] ?? 0));
        $stmt = $pdo->prepare("DELETE FROM gallery_photos WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["success" => true]);
        exit();
    }
}

// --- /api/admin/notices ---
if ($route === 'notices') {
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM notices ORDER BY displayOrder ASC, id DESC");
        $rows = $stmt->fetchAll();
        foreach ($rows as &$r) {
            $r['id'] = (int)$r['id'];
            $r['isUrgent'] = (bool)$r['isUrgent'];
            $r['isActive'] = (bool)$r['isActive'];
            $r['displayOrder'] = (int)$r['displayOrder'];
        }
        echo json_encode(["notices" => $rows]);
        exit();
    }
    if ($method === 'POST') {
        $id = isset($body['id']) ? (int)$body['id'] : null;
        if ($id) {
            $stmt = $pdo->prepare("UPDATE notices SET title = ?, content = ?, link = ?, fileUrl = ?, date = ?, isUrgent = ?, isActive = ?, displayOrder = ?, updatedAt = NOW() WHERE id = ?");
            $stmt->execute([
                $body['title'] ?? '',
                $body['content'] ?? '',
                $body['link'] ?? null,
                $body['fileUrl'] ?? null,
                $body['date'] ?? null,
                !empty($body['isUrgent']) ? 1 : 0,
                isset($body['isActive']) ? ($body['isActive'] ? 1 : 0) : 1,
                (int)($body['displayOrder'] ?? 0),
                $id
            ]);
        } else {
            $stmt = $pdo->prepare("INSERT INTO notices (title, content, link, fileUrl, date, isUrgent, isActive, displayOrder) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $body['title'] ?? '',
                $body['content'] ?? '',
                $body['link'] ?? null,
                $body['fileUrl'] ?? null,
                $body['date'] ?? null,
                !empty($body['isUrgent']) ? 1 : 0,
                isset($body['isActive']) ? ($body['isActive'] ? 1 : 0) : 1,
                (int)($body['displayOrder'] ?? 0)
            ]);
            $id = (int)$pdo->lastInsertId();
        }
        echo json_encode(["success" => true, "notice" => ["id" => $id]]);
        exit();
    }
    if ($method === 'DELETE') {
        $id = (int)($_GET['id'] ?? ($body['id'] ?? 0));
        $stmt = $pdo->prepare("DELETE FROM notices WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["success" => true]);
        exit();
    }
}

// --- /api/admin/admissions ---
if ($route === 'admissions') {
    if ($method === 'GET') {
        $steps = $pdo->query("SELECT * FROM admission_steps ORDER BY displayOrder ASC, id ASC")->fetchAll();
        foreach ($steps as &$s) {
            $s['id'] = (int)$s['id'];
            $s['stepNumber'] = (int)$s['stepNumber'];
            $s['displayOrder'] = (int)$s['displayOrder'];
            $s['isActive'] = (bool)$s['isActive'];
        }
        $docs = $pdo->query("SELECT * FROM admission_documents ORDER BY displayOrder ASC, id ASC")->fetchAll();
        foreach ($docs as &$d) {
            $d['id'] = (int)$d['id'];
            $d['displayOrder'] = (int)$d['displayOrder'];
            $d['isActive'] = (bool)$d['isActive'];
        }
        echo json_encode(["steps" => $steps, "documents" => $docs]);
        exit();
    }
    if ($method === 'POST') {
        if (isset($body['steps']) && is_array($body['steps'])) {
            $pdo->exec("DELETE FROM admission_steps");
            $ins = $pdo->prepare("INSERT INTO admission_steps (stepNumber, title, text, displayOrder, isActive) VALUES (?, ?, ?, ?, 1)");
            $i = 1;
            foreach ($body['steps'] as $s) {
                if (!empty($s['title']) && !empty($s['text'])) {
                    $ins->execute([$i, $s['title'], $s['text'], $i]);
                    $i++;
                }
            }
        }
        if (isset($body['documents']) && is_array($body['documents'])) {
            $pdo->exec("DELETE FROM admission_documents");
            $ins = $pdo->prepare("INSERT INTO admission_documents (title, displayOrder, isActive) VALUES (?, ?, 1)");
            $i = 1;
            foreach ($body['documents'] as $d) {
                $name = is_string($d) ? $d : ($d['title'] ?? '');
                if (!empty($name)) {
                    $ins->execute([$name, $i]);
                    $i++;
                }
            }
        }
        echo json_encode(["success" => true]);
        exit();
    }
}

// --- /api/admin/why-us ---
if ($route === 'why-us') {
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM why_us_cards ORDER BY displayOrder ASC, id ASC");
        $rows = $stmt->fetchAll();
        foreach ($rows as &$r) {
            $r['id'] = (int)$r['id'];
            $r['displayOrder'] = (int)$r['displayOrder'];
            $r['isActive'] = (bool)$r['isActive'];
        }
        echo json_encode(["items" => $rows]);
        exit();
    }
    if ($method === 'POST') {
        $id = isset($body['id']) ? (int)$body['id'] : null;
        if ($id) {
            $stmt = $pdo->prepare("UPDATE why_us_cards SET title = ?, text = ?, displayOrder = ?, updatedAt = NOW() WHERE id = ?");
            $stmt->execute([$body['title'] ?? '', $body['text'] ?? '', (int)($body['displayOrder'] ?? 0), $id]);
        } else {
            $stmt = $pdo->prepare("INSERT INTO why_us_cards (title, text, displayOrder, isActive) VALUES (?, ?, ?, 1)");
            $stmt->execute([$body['title'] ?? '', $body['text'] ?? '', (int)($body['displayOrder'] ?? 0)]);
            $id = (int)$pdo->lastInsertId();
        }
        echo json_encode(["success" => true, "item" => ["id" => $id]]);
        exit();
    }
    if ($method === 'DELETE') {
        $id = (int)($_GET['id'] ?? ($body['id'] ?? 0));
        $stmt = $pdo->prepare("DELETE FROM why_us_cards WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["success" => true]);
        exit();
    }
}

// --- /api/admin/careers ---
if ($route === 'careers') {
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM job_openings ORDER BY displayOrder ASC, id ASC");
        $openings = ['teaching' => [], 'nonTeaching' => []];
        while ($r = $stmt->fetch()) {
            $cat = ($r['category'] === 'nonTeaching') ? 'nonTeaching' : 'teaching';
            $openings[$cat][] = $r['title'];
        }
        echo json_encode(["openings" => $openings]);
        exit();
    }
    if ($method === 'POST') {
        $stmt = $pdo->prepare("INSERT INTO job_openings (title, category, status) VALUES (?, ?, ?)");
        $stmt->execute([$body['title'] ?? '', $body['category'] ?? 'teaching', $body['status'] ?? 'Open']);
        echo json_encode(["success" => true]);
        exit();
    }
    if ($method === 'DELETE') {
        $title = $_GET['title'] ?? ($body['title'] ?? '');
        $stmt = $pdo->prepare("DELETE FROM job_openings WHERE title = ?");
        $stmt->execute([$title]);
        echo json_encode(["success" => true]);
        exit();
    }
}

// --- /api/admin/upload ---
if ($route === 'upload' && $method === 'POST') {
    if (!isset($_FILES['file'])) {
        http_response_code(400);
        echo json_encode(["error" => "No file uploaded in 'file' field"]);
        exit();
    }
    $f = $_FILES['file'];
    if ($f['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        $errMap = [
            UPLOAD_ERR_INI_SIZE => "File exceeds upload_max_filesize directive in php.ini",
            UPLOAD_ERR_FORM_SIZE => "File exceeds MAX_FILE_SIZE directive in HTML form",
            UPLOAD_ERR_PARTIAL => "File was only partially uploaded",
            UPLOAD_ERR_NO_FILE => "No file was uploaded",
            UPLOAD_ERR_NO_TMP_DIR => "Missing temporary folder on server",
            UPLOAD_ERR_CANT_WRITE => "Failed to write file to disk on server",
            UPLOAD_ERR_EXTENSION => "A PHP extension stopped the file upload"
        ];
        $msg = $errMap[$f['error']] ?? ("Upload error code: " . $f['error']);
        echo json_encode(["error" => $msg]);
        exit();
    }
    if ($f['size'] > 25 * 1024 * 1024) {
        http_response_code(400);
        echo json_encode(["error" => "File size exceeds 25MB limit"]);
        exit();
    }
    $type = strtolower($f['type'] ?? '');
    $origName = $f['name'] ?? '';
    $ext = 'png';
    if (strpos($type, 'pdf') !== false) $ext = 'pdf';
    elseif (strpos($type, 'jpeg') !== false || strpos($type, 'jpg') !== false) $ext = 'jpg';
    elseif (strpos($type, 'webp') !== false) $ext = 'webp';
    elseif (strpos($type, 'svg') !== false) $ext = 'svg';
    elseif (strpos($origName, '.') !== false) {
        $parts = explode('.', $origName);
        $ext = strtolower(end($parts));
    }
    $prefix = ($ext === 'pdf') ? 'doc' : 'media';
    $filename = $prefix . '-' . time() . '-' . substr(md5(uniqid()), 0, 6) . '.' . $ext;
    
    $targetDir = dirname(__DIR__) . '/uploads';
    if (!is_dir($targetDir)) {
        @mkdir($targetDir, 0777, true);
    }
    @chmod($targetDir, 0777);

    $targetPath = $targetDir . '/' . $filename;
    if (move_uploaded_file($f['tmp_name'], $targetPath)) {
        @chmod($targetPath, 0644);
        echo json_encode([
            "success" => true,
            "url" => "/uploads/" . $filename,
            "filename" => $filename
        ]);
        exit();
    } else {
        http_response_code(500);
        $lastErr = error_get_last();
        echo json_encode([
            "error" => "Failed to save uploaded file. Check folder permissions on /uploads.",
            "details" => $lastErr ? $lastErr['message'] : 'move_uploaded_file failed'
        ]);
        exit();
    }
}

// Unmatched Route
http_response_code(404);
echo json_encode(["error" => "Admin API endpoint '/api/admin/$route' not found."]);
exit();
