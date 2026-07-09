import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

// Define Types
interface Booking {
  bookingId: string;
  fullName: string;
  whatsappPhone: string;
  email: string;
  nationality: string;
  preferredDate: string;
  destination: string;
  clinic: string;
  preferredSession: string;
  confirmedHour: string;
  treatment: string;
  selectedServices: string[];
  serviceQuantities?: Record<string, number>;
  additionalDetails?: string;
  status: 'BOOKING_REQUESTED' | 'CONFIRMED' | 'CHECKED-IN' | 'CANCELLED';
  created_by: 'Patient' | 'Staff' | 'Consultant';
  referralCode?: string;
  referrerName?: string;
  referralStatus?: string;
  internalNotes?: string;
  created_at: string;
  lastUpdated: string;
  commissionStatus: 'Pending' | 'Approved' | 'Paid' | 'Rejected';
}

interface Referrer {
  fullName: string;
  email: string;
  phone: string;
  code: string;
  membershipLevel: 'Standard' | 'Consultant';
  status: 'Active' | 'Inactive';
  pendingUpgradeReview: boolean;
  createdAt: string;
}

interface SupportRequest {
  id: string;
  submittedBy: string;
  relatedBookingCode?: string;
  requestType: 'Cancellation' | 'Reschedule' | 'Referral Issue' | 'Other';
  message: string;
  status: 'Pending' | 'In Review' | 'Resolved' | 'Rejected';
  createdAt: string;
  internalNotes?: string;
}

interface AdminLog {
  id: string;
  action: string;
  updatedBy: string;
  updatedAt: string;
  previousValue: string;
  newValue: string;
}

// Clinic and Onboarding Types
export interface ClinicBranch {
  branchId: string;
  clinicId: string;
  branchName: string;
  city: string;
  address: string;
  isPrimary: boolean;
  contactPhone?: string;
}

export interface DentalClinic {
  id: string;
  name: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  website?: string;
  status: 'ONBOARDING_IN_PROGRESS' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  primaryBranchId: string;
  flaggedForReview: boolean;
  duplicateFlagReason?: string;
  createdAt: string;
}

export interface ClinicAdmin {
  id: string;
  clinicId: string;
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  createdAt: string;
}

export interface ClinicOnboarding {
  clinicId: string;
  currentStep: number; // 0 to 5
  profileSetupCompleted: boolean;
  profileDetails?: {
    logoUrl?: string;
    description?: string;
    languages: string[];
    specialties: string[];
    facilities: string[];
    clinicDisplayName?: string;
    whatsAppNumber?: string;
    clinicImages?: string[];
  };
  servicesCompleted: boolean;
  services?: Array<{
    serviceId: string;
    serviceName: string;
    priceRange: string;
    customPrice?: number;
    enabled: boolean;
  }>;
  workingHoursCompleted: boolean;
  workingHours?: Record<string, {
    open: string;
    close: string;
    isClosed: boolean;
  }>;
  agreementCompleted: boolean;
  agreementDetails?: {
    signedName: string;
    signedAt: string;
    termsVersion: string;
    agreementStatus?: string;
    ipAddress?: string;
    userAgent?: string;
    acceptedAt?: string;
  };
  agreementHistory?: Array<{
    signedName: string;
    signedAt: string;
    termsVersion: string;
    agreementStatus?: string;
    ipAddress?: string;
    userAgent?: string;
    acceptedAt?: string;
  }>;
  additionalInfoCompleted?: boolean;
  additionalInfo?: {
    branches?: Array<{
      branchName: string;
      city: string;
      address: string;
      contactPhone?: string;
    }>;
    dentists?: Array<{
      name: string;
      position: string;
      specialization: string;
      experience?: string;
      languages: string;
      photo?: string;
      bio?: string;
    }>;
    documents?: Array<{
      name: string;
      type: string;
      url: string;
      uploadedAt: string;
      fileSize: string;
    }>;
  };
  submittedForReviewAt?: string;
}

// In-Memory Databases for the Backend State
let bookings: Record<string, Booking> = {};
let referrers: Referrer[] = [];
let supportRequests: SupportRequest[] = [];
let logs: AdminLog[] = [];
let clinicAdmins: Record<string, ClinicAdmin> = {}; // email -> ClinicAdmin
let registeredClinics: Record<string, DentalClinic> = {}; // clinicId -> DentalClinic
let clinicBranches: Record<string, ClinicBranch[]> = {}; // clinicId -> ClinicBranch[]
let clinicOnboardings: Record<string, ClinicOnboarding> = {}; // clinicId -> ClinicOnboarding

let clinics = [
  { id: 'C-01', name: 'East Meets West Dental (Da Nang)', location: 'Da Nang', status: 'Active' },
  { id: 'C-02', name: 'Rose Dental Clinic (Da Nang)', location: 'Da Nang', status: 'Active' },
  { id: 'C-03', name: 'Serenity International Dental (Da Nang)', location: 'Da Nang', status: 'Active' },
  { id: 'C-04', name: 'Amaris Dental Clinic', location: 'Da Nang', status: 'Active' },
  { id: 'C-05', name: 'Elite Dental Group (Ho Chi Minh)', location: 'Ho Chi Minh', status: 'Active' },
  { id: 'C-06', name: 'Worldwide Dental Specialists (Ho Chi Minh)', location: 'Ho Chi Minh', status: 'Active' }
];

// Seed Helper
function seedDatabase() {
  const now = new Date().toISOString();

  // 1. Seed Referrers
  referrers = [
    {
      fullName: 'Nhung Phan',
      email: 'nhung.phan230206@vnuk.edu.vn', // User email
      phone: '+84905123456',
      code: 'AMIRAH05',
      membershipLevel: 'Standard',
      status: 'Active',
      pendingUpgradeReview: true, // Eligible for evaluation
      createdAt: '2025-06-14T09:00:00Z'
    },
    {
      fullName: 'Alex Tran',
      email: 'alex.tran@ucsmile.com',
      phone: '+84905111111',
      code: 'ALEX2025',
      membershipLevel: 'Consultant',
      status: 'Active',
      pendingUpgradeReview: false,
      createdAt: '2025-10-12T10:00:00Z'
    },
    {
      fullName: 'Sarah Nguyen',
      email: 'sarah.n@ucsmile.com',
      phone: '+84905222222',
      code: 'SARAH001',
      membershipLevel: 'Standard',
      status: 'Active',
      pendingUpgradeReview: false,
      createdAt: '2025-12-05T15:30:00Z'
    },
    {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      code: 'JOHN002',
      membershipLevel: 'Standard',
      status: 'Active',
      pendingUpgradeReview: false,
      createdAt: '2026-01-20T08:15:00Z'
    },
    {
      fullName: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1987654321',
      code: 'JANE003',
      membershipLevel: 'Standard',
      status: 'Inactive',
      pendingUpgradeReview: false,
      createdAt: '2026-02-14T11:45:00Z'
    }
  ];

  // 2. Seed Bookings match the AC requirement statuses & CreatedBy
  bookings = {
    'UCS-1111-VN': {
      bookingId: 'UCS-1111-VN',
      fullName: 'Nguyen Minh An',
      whatsappPhone: '+84905111222',
      email: 'an.nguyen@example.com',
      nationality: 'Vietnam',
      preferredDate: '2026-06-15',
      destination: 'danang',
      clinic: 'East Meets West Dental (Da Nang)',
      preferredSession: 'morning',
      confirmedHour: '09:00 AM',
      treatment: 'Teeth Whitening (x1)',
      selectedServices: ['Teeth Whitening'],
      serviceQuantities: { 'Teeth Whitening': 1 },
      status: 'CONFIRMED',
      created_by: 'Staff',
      referralCode: 'ALEX2025',
      referrerName: 'Alex Tran',
      referralStatus: 'VALID',
      internalNotes: 'Pre-vetted patient from VIP partner program.',
      created_at: '2026-06-10T14:30:00Z',
      lastUpdated: '2026-06-12T10:00:00Z',
      commissionStatus: 'Pending'
    },
    'UCS-2222-AU': {
      bookingId: 'UCS-2222-AU',
      fullName: 'Sarah Jenkins',
      whatsappPhone: '+61298765432',
      email: 'sarah.j@example.au',
      nationality: 'Australia',
      preferredDate: '2026-06-20',
      destination: 'hcm',
      clinic: 'Elite Dental Group (Ho Chi Minh)',
      preferredSession: 'afternoon',
      confirmedHour: '02:30 PM',
      treatment: 'Dental Implants (x1)',
      selectedServices: ['Dental Implants'],
      serviceQuantities: { 'Dental Implants': 1 },
      status: 'BOOKING_REQUESTED',
      created_by: 'Patient',
      referralCode: 'SARAH001',
      referrerName: 'Sarah Nguyen',
      referralStatus: 'VALID',
      internalNotes: 'Awaiting digital X-Ray confirmation records.',
      created_at: '2026-06-11T09:12:00Z',
      lastUpdated: '2026-06-11T09:12:00Z',
      commissionStatus: 'Pending'
    },
    'UCS-9001-VN': {
      bookingId: 'UCS-9001-VN',
      fullName: 'Nhung Phan Thị Thùy',
      whatsappPhone: '+84935100111',
      email: 'nhung.thuy@example.com',
      nationality: 'Vietnam',
      preferredDate: '2026-06-15',
      destination: 'danang',
      clinic: 'East Meets West Dental (Da Nang)',
      preferredSession: 'morning',
      confirmedHour: '10:00 AM',
      treatment: 'Tooth Extraction',
      selectedServices: ['Tooth Extraction'],
      status: 'CONFIRMED',
      created_by: 'Patient',
      referralCode: 'AMIRAH05',
      referrerName: 'Nhung Phan',
      referralStatus: 'VALID',
      created_at: '2026-06-12T08:00:00Z',
      lastUpdated: '2026-06-12T08:20:00Z',
      commissionStatus: 'Pending'
    },
    'UCS-9002-VN': {
      bookingId: 'UCS-9002-VN',
      fullName: 'Nhung Patient',
      whatsappPhone: '+84905000222',
      email: 'nhung.patient@example.com',
      nationality: 'Vietnam',
      preferredDate: '2026-06-18',
      destination: 'danang',
      clinic: 'Rose Dental Clinic (Da Nang)',
      preferredSession: 'afternoon',
      confirmedHour: '03:00 PM',
      treatment: 'Tooth Extraction',
      selectedServices: ['Tooth Extraction'],
      status: 'CONFIRMED',
      created_by: 'Patient',
      referralCode: 'AMIRAH05',
      referrerName: 'Nhung Phan',
      referralStatus: 'VALID',
      created_at: '2026-06-12T11:40:00Z',
      lastUpdated: '2026-06-12T11:40:00Z',
      commissionStatus: 'Pending'
    },
    'UCS-9003-VN': {
      bookingId: 'UCS-9003-VN',
      fullName: 'Nguyên Văn Anh',
      whatsappPhone: '+84905111222',
      email: 'vananh@example.com',
      nationality: 'Vietnam',
      preferredDate: '2026-06-20',
      destination: 'danang',
      clinic: 'East Meets West Dental (Da Nang)',
      preferredSession: 'afternoon',
      confirmedHour: '01:30 PM',
      treatment: 'Dental Implants',
      selectedServices: ['Dental Implants'],
      status: 'CHECKED-IN',
      created_by: 'Consultant',
      referralCode: 'AMIRAH05',
      referrerName: 'Nhung Phan',
      referralStatus: 'VALID',
      created_at: '2026-06-13T16:00:00Z',
      lastUpdated: '2026-06-14T09:30:00Z',
      commissionStatus: 'Approved'
    },
    'UCS-9004-VN': {
      bookingId: 'UCS-9004-VN',
      fullName: 'Trần Thị Mai',
      whatsappPhone: '+84905222333',
      email: 'thimai@example.com',
      nationality: 'Vietnam',
      preferredDate: '2026-06-22',
      destination: 'danang',
      clinic: 'Rose Dental Clinic (Da Nang)',
      preferredSession: 'morning',
      confirmedHour: '08:30 AM',
      treatment: 'Teeth Whitening',
      selectedServices: ['Teeth Whitening'],
      status: 'CANCELLED',
      created_by: 'Patient',
      referralCode: 'AMIRAH05',
      referrerName: 'Nhung Phan',
      referralStatus: 'VALID',
      created_at: '2026-06-13T09:15:00Z',
      lastUpdated: '2026-06-14T10:10:00Z',
      commissionStatus: 'Rejected'
    },
    'UCS-9005-VN': {
      bookingId: 'UCS-9005-VN',
      fullName: 'Lê Hoàng Nam',
      whatsappPhone: '+84905333444',
      email: 'hoangnam@example.com',
      nationality: 'Vietnam',
      preferredDate: '2026-06-25',
      destination: 'danang',
      clinic: 'East Meets West Dental (Da Nang)',
      preferredSession: 'afternoon',
      confirmedHour: '04:00 PM',
      treatment: 'Porcelain Crowns',
      selectedServices: ['Porcelain Crowns'],
      status: 'CONFIRMED',
      created_by: 'Consultant',
      referralCode: 'AMIRAH05',
      referrerName: 'Nhung Phan',
      referralStatus: 'VALID',
      created_at: '2026-06-13T11:00:00Z',
      lastUpdated: '2026-06-14T15:20:00Z',
      commissionStatus: 'Pending'
    },
    'UCS-9006-VN': {
      bookingId: 'UCS-9006-VN',
      fullName: 'Phạm Minh Tuấn',
      whatsappPhone: '+84905444555',
      email: 'minhtuan@example.com',
      nationality: 'Vietnam',
      preferredDate: '2026-06-28',
      destination: 'danang',
      clinic: 'Rose Dental Clinic (Da Nang)',
      preferredSession: 'afternoon',
      confirmedHour: '02:00 PM',
      treatment: 'Invisalign',
      selectedServices: ['Invisalign'],
      status: 'BOOKING_REQUESTED',
      created_by: 'Patient',
      referralCode: 'AMIRAH05',
      referrerName: 'Nhung Phan',
      referralStatus: 'VALID',
      created_at: '2026-06-13T14:40:00Z',
      lastUpdated: '2026-06-13T14:40:00Z',
      commissionStatus: 'Pending'
    },
    'UCS-9007-VN': {
      bookingId: 'UCS-9007-VN',
      fullName: 'Võ Quốc Bảo',
      whatsappPhone: '+84905555666',
      email: 'quocbao@example.com',
      nationality: 'Vietnam',
      preferredDate: '2026-07-02',
      destination: 'danang',
      clinic: 'East Meets West Dental (Da Nang)',
      preferredSession: 'afternoon',
      confirmedHour: '03:15 PM',
      treatment: 'Root Canal Treatment',
      selectedServices: ['Root Canal Treatment'],
      status: 'CANCELLED',
      created_by: 'Patient',
      referralCode: 'AMIRAH05',
      referrerName: 'Nhung Phan',
      referralStatus: 'VALID',
      created_at: '2026-06-14T09:00:00Z',
      lastUpdated: '2026-06-14T19:00:00Z',
      commissionStatus: 'Rejected'
    }
  };

  // 3. Seed Support Requests
  supportRequests = [
    {
      id: 'SR-1001',
      submittedBy: 'Patient (Trần Thị Mai)',
      relatedBookingCode: 'UCS-9004-VN',
      requestType: 'Cancellation',
      message: 'Please cancel my appointment due to unexpected changes in my flight schedule to Da Nang.',
      status: 'Pending',
      createdAt: '2026-06-13T10:00:00Z'
    },
    {
      id: 'SR-1002',
      submittedBy: 'Referrer (Nhung Phan)',
      relatedBookingCode: 'UCS-9001-VN',
      requestType: 'Referral Issue',
      message: 'The commission for UCS-9001-VN is still listed as pending. The patient was confirmed, but I wanted to verify the checked-in timing.',
      status: 'Pending',
      createdAt: '2026-06-14T08:30:00Z'
    },
    {
      id: 'SR-1003',
      submittedBy: 'Consultant (Alex Tran)',
      relatedBookingCode: 'UCS-1111-VN',
      requestType: 'Reschedule',
      message: 'Patient requested to change their timing slot on June 15 from 09:00 AM to 11:30 AM.',
      status: 'In Review',
      createdAt: '2026-06-14T14:20:00Z'
    },
    {
      id: 'SR-1004',
      submittedBy: 'Staff',
      relatedBookingCode: 'UCS-2222-AU',
      requestType: 'Other',
      status: 'Resolved',
      createdAt: '2026-06-12T11:00:00Z',
      message: 'Airport pickup shuttle assignment verification requested.',
      internalNotes: 'Resolved. Assigned local driver: Mr. Hung. Shared with patient.'
    }
  ];

  // 4. Seed Admin Logs
  logs = [
    {
      id: 'LOG-001',
      action: 'Clinic Activation',
      updatedBy: 'System',
      updatedAt: '2026-06-10T08:00:00Z',
      previousValue: 'Inactive',
      newValue: 'Active'
    },
    {
      id: 'LOG-002',
      action: 'Seeded system environment metrics',
      updatedBy: 'System',
      updatedAt: '2026-06-14T19:20:18Z',
      previousValue: 'None',
      newValue: 'System Seeding Completed'
    }
  ];

  // 5. Seed Onboarding Clinics
  const c1Id = 'C-ONB-01';
  registeredClinics[c1Id] = {
    id: c1Id,
    name: 'SmileCare Da Nang Dental',
    contactPerson: 'Dr. Nguyen Duc',
    contactPhone: '+84905123999',
    contactEmail: 'admin@smilecare.vn',
    website: 'https://smilecare.vn',
    status: 'ONBOARDING_IN_PROGRESS',
    primaryBranchId: 'B-ONB-01',
    flaggedForReview: false,
    createdAt: '2026-06-28T10:00:00Z'
  };

  clinicBranches[c1Id] = [{
    branchId: 'B-ONB-01',
    clinicId: c1Id,
    branchName: 'SmileCare Da Nang Dental',
    city: 'Da Nang',
    address: '120 Bach Dang, Hai Chau, Da Nang',
    isPrimary: true
  }];

  clinicAdmins['admin@smilecare.vn'] = {
    id: 'A-ONB-01',
    clinicId: c1Id,
    fullName: 'Dr. Nguyen Duc',
    email: 'admin@smilecare.vn',
    phone: '+84905123999',
    password: 'password123',
    createdAt: '2026-06-28T10:00:00Z'
  };

  clinicOnboardings[c1Id] = {
    clinicId: c1Id,
    currentStep: 2, // At services and pricing step
    profileSetupCompleted: true,
    profileDetails: {
      description: 'Award-winning family dental practice in Hai Chau, offering modern diagnostics and high patient comfort.',
      languages: ['English', 'Vietnamese'],
      specialties: ['Teeth Whitening', 'Cosmetic Dentistry', 'General Checkup'],
      facilities: ['Private Rooms', 'Free WiFi', 'Waiting Lounge']
    },
    servicesCompleted: false,
    workingHoursCompleted: false,
    agreementCompleted: false
  };

  const c2Id = 'C-ONB-02';
  registeredClinics[c2Id] = {
    id: c2Id,
    name: 'Elite Oral Clinic Da Nang',
    contactPerson: 'Sophia Le',
    contactPhone: '+84905333555',
    contactEmail: 'sophia.le@eliteoral.com',
    website: 'https://eliteoral.com',
    status: 'PENDING_REVIEW', // Ready for Admin review!
    primaryBranchId: 'B-ONB-02',
    flaggedForReview: false,
    createdAt: '2026-06-29T11:30:00Z'
  };

  clinicBranches[c2Id] = [{
    branchId: 'B-ONB-02',
    clinicId: c2Id,
    branchName: 'Elite Oral Clinic Da Nang',
    city: 'Da Nang',
    address: '45 Nguyen Van Linh, Da Nang',
    isPrimary: true
  }];

  clinicAdmins['sophia.le@eliteoral.com'] = {
    id: 'A-ONB-02',
    clinicId: c2Id,
    fullName: 'Sophia Le',
    email: 'sophia.le@eliteoral.com',
    phone: '+84905333555',
    password: 'password123',
    createdAt: '2026-06-29T11:30:00Z'
  };

  clinicOnboardings[c2Id] = {
    clinicId: c2Id,
    currentStep: 5, // Fully completed and submitted!
    profileSetupCompleted: true,
    profileDetails: {
      description: 'Expert implantology and premium prosthodontics in the heart of Da Nang. JCI guidelines compliant.',
      languages: ['English', 'Korean', 'Vietnamese'],
      specialties: ['Dental Implants', 'Porcelain Crowns', 'Teeth Whitening'],
      facilities: ['3D CT Scanner', 'English Speaking Staff', 'Sedation Dentistry']
    },
    servicesCompleted: true,
    services: [
      { serviceId: 'S1', serviceName: 'Dental Implants', priceRange: '$800 - $1500', customPrice: 950, enabled: true },
      { serviceId: 'S2', serviceName: 'Porcelain Crowns', priceRange: '$200 - $450', customPrice: 280, enabled: true },
      { serviceId: 'S3', serviceName: 'Teeth Whitening', priceRange: '$120 - $250', customPrice: 150, enabled: true }
    ],
    workingHoursCompleted: true,
    workingHours: {
      'Monday': { open: '08:00', close: '18:00', isClosed: false },
      'Tuesday': { open: '08:00', close: '18:00', isClosed: false },
      'Wednesday': { open: '08:00', close: '18:00', isClosed: false },
      'Thursday': { open: '08:00', close: '18:00', isClosed: false },
      'Friday': { open: '08:00', close: '18:00', isClosed: false },
      'Saturday': { open: '08:00', close: '12:00', isClosed: false },
      'Sunday': { open: '00:00', close: '00:00', isClosed: true }
    },
    agreementCompleted: true,
    agreementDetails: {
      signedName: 'Sophia Le',
      signedAt: '2026-06-29T14:45:00Z',
      termsVersion: 'v1.2-partner'
    },
    submittedForReviewAt: '2026-06-29T14:50:00Z'
  };
}

// Perform Seeding
seedDatabase();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // CORS mapping for security
  app.use((req, res, next) => {
    res.header("X-UCSmile-CMS", "Admin-Verified");
    next();
  });

  // HELPER: Admin Token Middleware Check
  const verifyAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ucs-admin-token-")) {
      return res.status(403).json({
        error: "You do not have permission to perform this action."
      });
    }
    next();
  };

  // --- API ROUTES ---

  // Backend Healthcheck
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // --- CLINIC PORTAL ENDPOINTS ---

  // Clinic Registration (AC 1, AC 2, AC 4, AC 5, AC 6)
  app.post("/api/clinic/register", (req, res) => {
    const {
      clinicName,
      contactPersonName,
      contactPhoneNumber,
      contactEmail,
      primaryBranchName,
      city,
      clinicAddress,
      website,
      adminFullName,
      adminEmail,
      password
    } = req.body;

    // AC 4 Required Field Validation
    if (
      !clinicName || !clinicName.trim() ||
      !contactPersonName || !contactPersonName.trim() ||
      !contactPhoneNumber || !contactPhoneNumber.trim() ||
      !contactEmail || !contactEmail.trim() ||
      !primaryBranchName || !primaryBranchName.trim() ||
      !city || !city.trim() ||
      !clinicAddress || !clinicAddress.trim() ||
      !adminFullName || !adminFullName.trim() ||
      !adminEmail || !adminEmail.trim() ||
      !password || !password.trim()
    ) {
      return res.status(400).json({ error: "Missing required fields. Please fill in all required inputs." });
    }

    const formattedAdminEmail = adminEmail.trim().toLowerCase();

    // AC 5 Duplicate Registration Check (Clinic Admin Email)
    if (clinicAdmins[formattedAdminEmail]) {
      return res.status(409).json({
        error: "This admin email is already registered. Please log in to your account or register with another email."
      });
    }

    // AC 5 Duplicate clinic name or primary branch address check (triggers Admin flag, does not block)
    let flaggedForReview = false;
    let duplicateFlagReason = "";

    const nameExists = Object.values(registeredClinics).some(
      c => c.name.toLowerCase().trim() === clinicName.toLowerCase().trim()
    );

    let addressExists = false;
    for (const cid in clinicBranches) {
      if (clinicBranches[cid].some(b => b.address.toLowerCase().trim() === clinicAddress.toLowerCase().trim() && b.isPrimary)) {
        addressExists = true;
        break;
      }
    }

    if (nameExists || addressExists) {
      flaggedForReview = true;
      const reasons = [];
      if (nameExists) reasons.push("Clinic name matches an existing registration");
      if (addressExists) reasons.push("Primary branch address matches an existing registration");
      duplicateFlagReason = reasons.join(", ");
    }

    // AC 6 Successful Registration creations
    const clinicId = `C-REG-${Date.now()}`;
    const branchId = `B-REG-${Date.now()}`;
    const adminId = `A-REG-${Date.now()}`;

    const clinicRecord: DentalClinic = {
      id: clinicId,
      name: clinicName.trim(),
      contactPerson: contactPersonName.trim(),
      contactPhone: contactPhoneNumber.trim(),
      contactEmail: contactEmail.trim(),
      website: website ? website.trim() : "",
      status: 'ONBOARDING_IN_PROGRESS',
      primaryBranchId: branchId,
      flaggedForReview,
      duplicateFlagReason,
      createdAt: new Date().toISOString()
    };

    const branchRecord: ClinicBranch = {
      branchId,
      clinicId,
      branchName: primaryBranchName.trim(),
      city: city.trim(),
      address: clinicAddress.trim(),
      isPrimary: true
    };

    const adminRecord: ClinicAdmin = {
      id: adminId,
      clinicId,
      fullName: adminFullName.trim(),
      email: formattedAdminEmail,
      phone: contactPhoneNumber.trim(),
      password: password,
      createdAt: new Date().toISOString()
    };

    const onboardingRecord: ClinicOnboarding = {
      clinicId,
      currentStep: 1, // On successful registration, prompt to step 1
      profileSetupCompleted: false,
      servicesCompleted: false,
      workingHoursCompleted: false,
      additionalInfoCompleted: false,
      agreementCompleted: false
    };

    // Save records
    registeredClinics[clinicId] = clinicRecord;
    clinicBranches[clinicId] = [branchRecord];
    clinicAdmins[formattedAdminEmail] = adminRecord;
    clinicOnboardings[clinicId] = onboardingRecord;

    // Log the action
    const logId = `LOG-${Date.now()}`;
    logs.unshift({
      id: logId,
      action: `New Clinic Registered (${clinicName})`,
      updatedBy: 'Self Register',
      updatedAt: new Date().toISOString(),
      previousValue: 'None',
      newValue: flaggedForReview ? `Registered & Flagged: ${duplicateFlagReason}` : 'Registered Successfully'
    });

    return res.status(201).json({
      success: true,
      message: "Your clinic registration has been created successfully. Please continue completing your clinic onboarding information for UCSmile review.",
      clinic: clinicRecord,
      admin: {
        id: adminRecord.id,
        clinicId: adminRecord.clinicId,
        fullName: adminRecord.fullName,
        email: adminRecord.email,
        phone: adminRecord.phone
      },
      onboarding: onboardingRecord
    });
  });

  // Clinic Admin Login (AC 5 login suggestion support)
  app.post("/api/clinic/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please provide both login email and password." });
    }

    const formattedEmail = email.trim().toLowerCase();
    const admin = clinicAdmins[formattedEmail];

    if (!admin || admin.password !== password) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const clinic = registeredClinics[admin.clinicId];
    const onboarding = clinicOnboardings[admin.clinicId];

    return res.json({
      success: true,
      admin: {
        id: admin.id,
        clinicId: admin.clinicId,
        fullName: admin.fullName,
        email: admin.email,
        phone: admin.phone
      },
      clinic,
      onboarding
    });
  });

  // Get Onboarding state
  app.get("/api/clinic/onboarding/:clinicId", (req, res) => {
    const { clinicId } = req.params;
    const clinic = registeredClinics[clinicId];
    const onboarding = clinicOnboardings[clinicId];
    const branches = clinicBranches[clinicId] || [];

    if (!clinic) {
      return res.status(404).json({ error: "Clinic not found." });
    }

    return res.json({
      success: true,
      clinic,
      branches,
      onboarding
    });
  });

  // Restore in-memory clinic registration session (for server-restart survivability)
  app.post("/api/clinic/restore", (req, res) => {
    const { clinic, admin, onboarding, branches } = req.body;
    if (!clinic || !admin || !onboarding) {
      return res.status(400).json({ error: "Missing restoration data." });
    }
    
    const clinicId = clinic.id;
    const formattedAdminEmail = admin.email.trim().toLowerCase();
    
    registeredClinics[clinicId] = clinic;
    clinicAdmins[formattedAdminEmail] = admin;
    clinicOnboardings[clinicId] = onboarding;
    if (branches) {
      clinicBranches[clinicId] = branches;
    }
    
    return res.json({ success: true, message: "Session successfully restored on server." });
  });

  // Save Onboarding step (AC 8)
  app.post("/api/clinic/onboarding/:clinicId/step", (req, res) => {
    const { clinicId } = req.params;
    const { step, data } = req.body;

    const onboarding = clinicOnboardings[clinicId];
    if (!onboarding) {
      return res.status(404).json({ error: "Onboarding record not found." });
    }

    if (step === 1) {
      // Profile details
      const { isDraft, ...profileData } = data;
      onboarding.profileDetails = profileData;
      if (!isDraft) {
        onboarding.profileSetupCompleted = true;
        if (onboarding.currentStep <= 1) {
          onboarding.currentStep = 2;
        }
      }
    } else if (step === 2) {
      // Services and pricing
      if (Array.isArray(data)) {
        onboarding.services = data;
        onboarding.servicesCompleted = true;
        if (onboarding.currentStep <= 2) {
          onboarding.currentStep = 3;
        }
      } else {
        const { isDraft, services } = data;
        onboarding.services = services;
        if (!isDraft) {
          onboarding.servicesCompleted = true;
          if (onboarding.currentStep <= 2) {
            onboarding.currentStep = 3;
          }
        }
      }
    } else if (step === 3) {
      // Working hours
      onboarding.workingHours = data;
      onboarding.workingHoursCompleted = true;
      if (onboarding.currentStep <= 3) {
        onboarding.currentStep = 4;
      }
    } else if (step === 4) {
      // Additional clinic information (AC 5)
      const { branches, dentists, documents } = data;
      onboarding.additionalInfo = { branches, dentists, documents };
      onboarding.additionalInfoCompleted = true;
      if (onboarding.currentStep <= 4) {
        onboarding.currentStep = 5;
      }
      // Save branches list as well if provided (AC 2)
      if (Array.isArray(branches)) {
        const existing = clinicBranches[clinicId] || [];
        const primary = existing.find(b => b.isPrimary);
        const updatedBranches: ClinicBranch[] = [];
        if (primary) {
          updatedBranches.push(primary);
        }
        branches.forEach((b: any, index: number) => {
          if (!b.isPrimary && b.branchName?.trim()) {
            updatedBranches.push({
              branchId: b.branchId || `B-BR-${clinicId}-${index}-${Date.now()}`,
              clinicId,
              branchName: b.branchName.trim(),
              city: b.city.trim(),
              address: b.address.trim(),
              contactPhone: b.contactPhone ? b.contactPhone.trim() : "",
              isPrimary: false
            });
          }
        });
        clinicBranches[clinicId] = updatedBranches;
      }
    } else if (step === 5) {
      // Partnership Agreement (AC 4, AC 5, AC 7)
      const { signedName, termsVersion, agreementStatus, ipAddress, userAgent } = data;
      const agreementRecord = {
        signedName: signedName || "Authorized Representative",
        signedAt: new Date().toISOString(),
        termsVersion: termsVersion || "v1.0.0-2026",
        agreementStatus: agreementStatus || "AGREEMENT_ACCEPTED",
        ipAddress: ipAddress || "127.0.0.1",
        userAgent: userAgent || "Unknown Device",
        acceptedAt: new Date().toISOString()
      };

      onboarding.agreementDetails = agreementRecord;
      onboarding.agreementCompleted = true;
      if (!onboarding.agreementHistory) {
        onboarding.agreementHistory = [];
      }
      onboarding.agreementHistory.push(agreementRecord);

      if (onboarding.currentStep <= 5) {
        onboarding.currentStep = 6;
      }
    } else if (step === 6) {
      // Final submission for review
      const clinic = registeredClinics[clinicId];
      if (clinic) {
        clinic.status = 'PENDING_REVIEW';
      }
      onboarding.submittedForReviewAt = new Date().toISOString();
      onboarding.currentStep = 6;

      // Log action
      logs.unshift({
        id: `LOG-${Date.now()}`,
        action: `Clinic Onboarding Submitted for Review (${clinic?.name})`,
        updatedBy: 'Clinic Admin',
        updatedAt: new Date().toISOString(),
        previousValue: 'ONBOARDING_IN_PROGRESS',
        newValue: 'PENDING_REVIEW'
      });
    } else {
      return res.status(400).json({ error: "Invalid onboarding step number." });
    }

    return res.json({
      success: true,
      onboarding,
      clinic: registeredClinics[clinicId]
    });
  });

  // Admin: Get all onboarding clinics
  app.get("/api/admin/onboardings", verifyAdmin, (req, res) => {
    const results = Object.values(registeredClinics).map(clinic => {
      return {
        clinic,
        onboarding: clinicOnboardings[clinic.id],
        branches: clinicBranches[clinic.id] || [],
        admin: Object.values(clinicAdmins).find(a => a.clinicId === clinic.id)
      };
    });
    return res.json({ success: true, onboardings: results });
  });

  // Admin: Approve / Reject registered clinic
  app.post("/api/admin/clinics/:clinicId/review", verifyAdmin, (req, res) => {
    const { clinicId } = req.params;
    const { status, adminEmail, rejectReason } = req.body; // status: 'APPROVED' or 'REJECTED'

    const clinic = registeredClinics[clinicId];
    if (!clinic) {
      return res.status(404).json({ error: "Clinic not found." });
    }

    if (status !== 'APPROVED' && status !== 'REJECTED') {
      return res.status(400).json({ error: "Invalid status value. Must be APPROVED or REJECTED." });
    }

    const previousStatus = clinic.status;
    clinic.status = status;

    if (status === 'APPROVED') {
      // Add to vetted listings as "Active" so patient can select it during booking!
      const branches = clinicBranches[clinicId] || [];
      const primaryBranch = branches.find(b => b.isPrimary) || branches[0];
      
      // Ensure we don't double add
      if (!clinics.some(cl => cl.id === clinicId)) {
        clinics.push({
          id: clinicId,
          name: clinic.name,
          location: primaryBranch ? primaryBranch.city : "Da Nang",
          status: 'Active'
        });
      }
    }

    // Log the approval/rejection
    logs.unshift({
      id: `LOG-${Date.now()}`,
      action: `Clinic Onboarding Review: ${status} (${clinic.name})`,
      updatedBy: adminEmail || 'Admin',
      updatedAt: new Date().toISOString(),
      previousValue: previousStatus,
      newValue: status + (rejectReason ? ` (Reason: ${rejectReason})` : "")
    });

    return res.json({
      success: true,
      clinic,
      clinicsList: clinics
    });
  });


  // POST Admin Login
  app.post("/api/admin/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please provide both email and password." });
    }

    // Accept developer email or admin@ucsmile.com
    const formattedEmail = email.trim().toLowerCase();
    const isAdminEmail = formattedEmail === "nhung.phan230206@vnuk.edu.vn" || formattedEmail === "admin@ucsmile.com";
    const isCorrectPassword = password === "password123" || password === "admin123" || password === "admin"; // Flexible for testing

    if (isAdminEmail && isCorrectPassword) {
      // Return a simulated secure token
      const mockedToken = `ucs-admin-token-${Buffer.from(formattedEmail).toString("base64")}`;
      return res.json({
        success: true,
        token: mockedToken,
        user: {
          email: formattedEmail,
          fullName: formattedEmail === "nhung.phan230206@vnuk.edu.vn" ? "Nhung Phan (Admin)" : "Administrator",
          role: "Admin"
        }
      });
    }

    return res.status(401).json({ error: "Invalid email or password." });
  });

  // GET Admin Dashboard Pack
  app.get("/api/admin/dashboard", verifyAdmin, (req, res) => {
    // 1. Calculate stats required by AC 2
    const totalBookings = Object.keys(bookings).length;
    const requestedBookings = Object.values(bookings).filter(b => b.status === "BOOKING_REQUESTED").length;
    const confirmedBookings = Object.values(bookings).filter(b => b.status === "CONFIRMED").length;
    const checkedInBookings = Object.values(bookings).filter(b => b.status === "CHECKED-IN").length;
    const cancelledBookings = Object.values(bookings).filter(b => b.status === "CANCELLED").length;

    const totalReferrals = Object.values(bookings).filter(b => !!b.referralCode).length;
    const activeReferrers = referrers.filter(r => r.status === "Active").length;
    const consultantReferrers = referrers.filter(r => r.membershipLevel === "Consultant").length;
    const pendingSupportRequests = supportRequests.filter(s => s.status === "Pending").length;

    res.json({
      stats: {
        totalBookings,
        requestedBookings,
        confirmedBookings,
        checkedInBookings,
        cancelledBookings,
        totalReferrals,
        activeReferrers,
        consultantReferrers,
        pendingSupportRequests
      },
      bookings: Object.values(bookings),
      referrers,
      supportRequests,
      clinics,
      logs
    });
  });

  // POST Sync Booking (Triggered on frontend components when patients create bookings)
  app.post("/api/admin/sync-booking", (req, res) => {
    const { booking } = req.body;
    if (booking && booking.bookingId) {
      const existing = bookings[booking.bookingId];
      bookings[booking.bookingId] = {
        bookingId: booking.bookingId,
        fullName: booking.fullName || booking.name || 'Valued Guest',
        whatsappPhone: booking.whatsappPhone || booking.phone || '',
        email: booking.email || '',
        nationality: booking.nationality || 'Vietnam',
        preferredDate: booking.preferredDate || booking.date || '',
        destination: booking.destination || 'danang',
        clinic: booking.clinic || 'Any Vetted Partner Clinic',
        preferredSession: booking.preferredSession || booking.session || 'morning',
        confirmedHour: booking.confirmedHour || '',
        treatment: booking.treatment || booking.service || '',
        selectedServices: booking.selectedServices || [booking.service || ''],
        status: (booking.status?.toUpperCase() === 'PENDING' ? 'BOOKING_REQUESTED' : booking.status?.toUpperCase()) || 'BOOKING_REQUESTED',
        created_by: booking.created_by || 'Patient',
        referralCode: booking.referralCode || booking.referral || '',
        referrerName: booking.referrerName || '',
        referralStatus: booking.referralStatus || 'VALID',
        created_at: booking.created_at || new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        commissionStatus: existing?.commissionStatus || 'Pending',
        internalNotes: booking.internalNotes || '',
      };
      return res.json({ success: true });
    }
    res.status(400).json({ error: "Invalid booking sync request" });
  });

  // POST Update Booking Status & Internal Notes (AC 4, AC 10)
  app.post("/api/admin/bookings/:id/status", verifyAdmin, (req, res) => {
    const { id } = req.params;
    const { status, adminEmail, internalNotes } = req.body;

    const b = bookings[id];
    if (!b) {
      return res.status(404).json({ error: "Booking record was not found." });
    }

    const previousStatus = b.status;
    const previousNotes = b.internalNotes || "";

    if (status) {
      // Validate sensitive state transitions (AC 4)
      // BOOKING_REQUESTED -> CONFIRMED, BOOKING_REQUESTED -> CANCELLED
      // CONFIRMED -> CHECKED-IN, CONFIRMED -> CANCELLED
      // CHECKED-IN -> no change
      // CANCELLED -> no change
      
      const isAllowed = 
        (previousStatus === "BOOKING_REQUESTED" && (status === "CONFIRMED" || status === "CANCELLED")) ||
        (previousStatus === "CONFIRMED" && (status === "CHECKED-IN" || status === "CANCELLED")) ||
        (previousStatus === status); // Allowed to overwrite with same status

      if (!isAllowed) {
        return res.status(400).json({ 
          error: `Status change from ${previousStatus} to ${status} is forbidden under core platform rules.` 
        });
      }

      b.status = status;
      
      // Auto upgrade commission status eligibility based on rules (AC 5)
      // CHECKED-IN = eligible (keep as Pending for selection or auto-approve)
      // CANCELLED = not eligible / Rejected
      if (status === "CANCELLED") {
        b.commissionStatus = "Rejected";
      } else if (status === "CHECKED-IN" && b.commissionStatus === "Pending") {
        // Now eligible for review (keep status as Pending or auto-eligible)
      }
    }

    if (internalNotes !== undefined) {
      b.internalNotes = internalNotes;
    }

    b.lastUpdated = new Date().toISOString();

    // Log the update (AC 10)
    const logId = `LOG-${Date.now()}`;
    const newLog: AdminLog = {
      id: logId,
      action: status ? `Booking Status Update (${id})` : `Booking Notes Edited (${id})`,
      updatedBy: adminEmail || 'Admin',
      updatedAt: new Date().toISOString(),
      previousValue: status ? previousStatus : previousNotes,
      newValue: status ? status : (internalNotes || "")
    };
    logs.unshift(newLog);

    return res.json({ success: true, booking: b });
  });

  // POST Manage Commission Status (AC 5)
  app.post("/api/admin/bookings/:id/commission", verifyAdmin, (req, res) => {
    const { id } = req.params;
    const { commissionStatus, adminEmail } = req.body;

    const b = bookings[id];
    if (!b) {
      return res.status(404).json({ error: "Booking record was not found." });
    }

    const oldVal = b.commissionStatus;
    b.commissionStatus = commissionStatus;

    // Log commission state edit
    const logId = `LOG-${Date.now()}`;
    const newLog: AdminLog = {
      id: logId,
      action: `Commission Review Updated (${id})`,
      updatedBy: adminEmail || 'Admin',
      updatedAt: new Date().toISOString(),
      previousValue: oldVal,
      newValue: commissionStatus
    };
    logs.unshift(newLog);

    return res.json({ success: true, booking: b });
  });

  // POST Toggle Referrer Account Status (AC 6)
  app.post("/api/admin/referrers/:code/status", verifyAdmin, (req, res) => {
    const { code } = req.params;
    const { status, adminEmail } = req.body; // 'Active' | 'Inactive'

    const idx = referrers.findIndex(r => r.code.toUpperCase() === code.toUpperCase());
    if (idx === -1) {
      return res.status(404).json({ error: "Referrer record was not found." });
    }

    const ref = referrers[idx];
    const oldVal = ref.status;
    ref.status = status;

    // Log referrer activation toggle
    const logId = `LOG-${Date.now()}`;
    const newLog: AdminLog = {
      id: logId,
      action: `Referrer Status Changed (${code})`,
      updatedBy: adminEmail || 'Admin',
      updatedAt: new Date().toISOString(),
      previousValue: oldVal,
      newValue: status
    };
    logs.unshift(newLog);

    return res.json({ success: true, referrer: ref });
  });

  // POST Upgrade/Downgrade Referrer Membership (AC 6, AC 7)
  app.post("/api/admin/referrers/:code/level", verifyAdmin, (req, res) => {
    const { code } = req.params;
    const { level, actionType, adminEmail } = req.body; // Level: 'Standard' | 'Consultant', actionType: 'approve_review' | 'manual'

    const idx = referrers.findIndex(r => r.code.toUpperCase() === code.toUpperCase());
    if (idx === -1) {
      return res.status(404).json({ error: "Referrer record was not found." });
    }

    const ref = referrers[idx];
    const oldLevel = ref.membershipLevel;
    
    ref.membershipLevel = level;
    if (actionType === 'approve_review' || level === 'Consultant') {
      ref.pendingUpgradeReview = false; // Mark upgrade review as handled
    } else if (level === 'Standard') {
      ref.pendingUpgradeReview = false;
    }

    // Log the upgrade/downgrade level
    const logId = `LOG-${Date.now()}`;
    const newLog: AdminLog = {
      id: logId,
      action: actionType === 'approve_review' ? `Consultant Upgrade Request Handled (${code})` : `Referrer Level Override (${code})`,
      updatedBy: adminEmail || 'Admin',
      updatedAt: new Date().toISOString(),
      previousValue: oldLevel,
      newValue: level
    };
    logs.unshift(newLog);

    return res.json({ success: true, referrer: ref });
  });

  // POST Reject Consultant Upgrade Request (AC 7)
  app.post("/api/admin/referrers/:code/reject-upgrade", verifyAdmin, (req, res) => {
    const { code } = req.params;
    const { adminEmail } = req.body;

    const idx = referrers.findIndex(r => r.code.toUpperCase() === code.toUpperCase());
    if (idx === -1) {
      return res.status(404).json({ error: "Referrer record was not found." });
    }

    const ref = referrers[idx];
    ref.pendingUpgradeReview = false; // Clear review flag, keep standard

    // Log
    const logId = `LOG-${Date.now()}`;
    const newLog: AdminLog = {
      id: logId,
      action: `Consultant Upgrade Request Rejected (${code})`,
      updatedBy: adminEmail || 'Admin',
      updatedAt: new Date().toISOString(),
      previousValue: 'Pending Review',
      newValue: 'Standard (Rejected Upgrade)'
    };
    logs.unshift(newLog);

    return res.json({ success: true, referrer: ref });
  });

  // POST Resolve Support Request (AC 8)
  app.post("/api/admin/support/:id/status", verifyAdmin, (req, res) => {
    const { id } = req.params;
    const { status, internalNotes, adminEmail } = req.body; // Status: 'Pending' | 'In Review' | 'Resolved' | 'Rejected'

    const reqRecord = supportRequests.find(s => s.id === id);
    if (!reqRecord) {
      return res.status(404).json({ error: "Support request was not found." });
    }

    const oldStatus = reqRecord.status;
    reqRecord.status = status;
    if (internalNotes !== undefined) {
      reqRecord.internalNotes = internalNotes;
    }

    // Log support request action
    const logId = `LOG-${Date.now()}`;
    const newLog: AdminLog = {
      id: logId,
      action: `Support Request Handled (${id})`,
      updatedBy: adminEmail || 'Admin',
      updatedAt: new Date().toISOString(),
      previousValue: oldStatus,
      newValue: status
    };
    logs.unshift(newLog);

    return res.json({ success: true, request: reqRecord });
  });

  // POST Add support request from users (Patients, Staff, Referrers, etc)
  app.post("/api/support/new", (req, res) => {
    const { submittedBy, relatedBookingCode, requestType, message } = req.body;
    
    if (!submittedBy || !requestType || !message) {
      return res.status(400).json({ error: "Fields submittedBy, requestType, message are required." });
    }

    const nextId = `SR-${1000 + supportRequests.length + 1}`;
    const newReq: SupportRequest = {
      id: nextId,
      submittedBy,
      relatedBookingCode,
      requestType,
      message,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    supportRequests.push(newReq);
    
    return res.json({ success: true, request: newReq });
  });

  // POST Toggle Clinic Status (AC 10)
  app.post("/api/admin/clinics/:id/status", verifyAdmin, (req, res) => {
    const { id } = req.params;
    const { status, adminEmail } = req.body; // 'Active' | 'Inactive'

    const cIdx = clinics.findIndex(cl => cl.id === id);
    if (cIdx === -1) {
      return res.status(404).json({ error: "Clinic record was not found." });
    }

    const oldStatus = clinics[cIdx].status;
    clinics[cIdx].status = status;

    // Log clinic state change
    const logId = `LOG-${Date.now()}`;
    const newLog: AdminLog = {
      id: logId,
      action: `Clinic Status Changed (${clinics[cIdx].name})`,
      updatedBy: adminEmail || 'Admin',
      updatedAt: new Date().toISOString(),
      previousValue: oldStatus,
      newValue: status
    };
    logs.unshift(newLog);

    return res.json({ success: true, clinics });
  });


  // --- VITE MIDDLEWARE SETUP ---

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: any, res: any) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
