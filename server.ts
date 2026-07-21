import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import crypto from "crypto";
import { GoogleGenAI } from "@google/genai";

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
  status: 'ONBOARDING_IN_PROGRESS' | 'PENDING_REVIEW' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
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
let clinicOnboardings: Record<string, ClinicOnboarding> = {};
let sentEmails: any[] = []; // clinicId -> ClinicOnboarding

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

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Error handling middleware for body parser limits or malformed JSON
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err) {
      console.error("Express middleware error:", err);
      return res.status(err.status || 400).json({
        error: err.message || "Invalid request payload size or format."
      });
    }
    next();
  });

  // CORS mapping for security
  app.use((req, res, next) => {
    res.header("X-UCSmile-CMS", "Admin-Verified");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
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
    try {
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
        c => c && c.name && c.name.toLowerCase().trim() === clinicName.toLowerCase().trim()
      );

      let addressExists = false;
      for (const cid in clinicBranches) {
        const branches = clinicBranches[cid];
        if (Array.isArray(branches)) {
          if (branches.some(b => b && b.address && b.address.toLowerCase().trim() === clinicAddress.toLowerCase().trim() && b.isPrimary)) {
            addressExists = true;
            break;
          }
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
    } catch (err: any) {
      console.error("Error during clinic registration:", err);
      return res.status(500).json({
        error: `Internal Server Error: ${err.message || err}`
      });
    }
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

  // Get Simulated Sent Emails for a clinic or general
  app.get("/api/clinic/onboarding/:clinicId/emails", (req, res) => {
    const { clinicId } = req.params;
    const filtered = sentEmails.filter(e => e.clinicId === clinicId);
    return res.json({ success: true, emails: filtered });
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

  // Lazy initialize Gemini Client to prevent crash if key is missing on startup
  let aiClient: any = null;
  function getGeminiClient() {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is not configured. Please add your Gemini API key in the Settings > Secrets panel of AI Studio.");
      }
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return aiClient;
  }

  // Helper to extract text from various file formats
  async function extractTextFromFile(file: any): Promise<string> {
    const fileNameLower = (file.name || "").toLowerCase();
    const fileType = (file.type || "").toLowerCase();
    const base64Content = file.base64 || "";
    if (!base64Content) return "";
    const fileBuffer = Buffer.from(base64Content, "base64");
    
    let textContent = "";
    
    if (fileType === "text/csv" || fileType === "text/plain" || fileNameLower.endsWith(".csv") || fileNameLower.endsWith(".txt")) {
      try {
        textContent = fileBuffer.toString("utf-8");
      } catch (e) {
        console.error("Error reading text/csv file buffer:", e);
      }
    } else if (
      fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || 
      fileType === "application/vnd.ms-excel" || 
      fileNameLower.endsWith(".xlsx") || 
      fileNameLower.endsWith(".xls")
    ) {
      try {
        const XLSX = await import("xlsx");
        const workbook = XLSX.read(fileBuffer, { type: "buffer" });
        let excelText = "";
        workbook.SheetNames.forEach(sheetName => {
          const sheet = workbook.Sheets[sheetName];
          excelText += XLSX.utils.sheet_to_csv(sheet) + "\n";
        });
        textContent = excelText;
      } catch (e) {
        console.error("Error reading Excel sheet:", e);
      }
    } else if (fileType === "application/pdf" || fileNameLower.endsWith(".pdf")) {
      try {
        const { PDFParse } = await import("pdf-parse");
        const parser = new PDFParse({ data: fileBuffer });
        const textResult = await parser.getText();
        textContent = textResult.text || "";
        await parser.destroy();
      } catch (e) {
        console.error("Error reading PDF file:", e);
      }
    } else {
      // Try generic string decoding
      try {
        textContent = fileBuffer.toString("utf-8");
      } catch (e) {}
    }
    
    return textContent;
  }

  // Fallback local extractor when Gemini API fails or is restricted (AC 2.1 - AC 2.5)
  async function extractPricingFallback(file: any, standardServices: any[]) {
    const fileNameLower = (file.name || "").toLowerCase();
    const textContent = await extractTextFromFile(file);

    const matches: any[] = [];
    const details: any[] = [];
    const stdServices = Array.isArray(standardServices) ? standardServices : [];

    // Detect if we are dealing with a Vietnamese price list
    const isVnContext = isVietnameseContext(textContent, file.name || "");

    function isVietnameseContext(text: string, fileName: string): boolean {
      const lowerText = text.toLowerCase();
      const lowerFile = fileName.toLowerCase();
      
      const hasVietnameseAccents = /[áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ]/i.test(text);
      
      const hasVietnameseKeywords = 
        lowerText.includes("bảng giá") || 
        lowerText.includes("chi phí") || 
        lowerText.includes("dịch vụ") || 
        lowerText.includes("nhổ răng") || 
        lowerText.includes("cạo vôi") || 
        lowerText.includes("trám răng") || 
        lowerText.includes("điều trị") ||
        lowerText.includes("răng khôn") ||
        lowerText.includes("triệu") ||
        lowerText.includes("nghìn") ||
        lowerText.includes("đồng") ||
        lowerText.includes("đơn giá") ||
        lowerFile.includes("bang-gia") ||
        lowerFile.includes("banggia") ||
        lowerFile.includes("chi-phi") ||
        lowerFile.includes("chiphi");
        
      return hasVietnameseAccents || hasVietnameseKeywords;
    }

    function getVietnameseDefaultPrice(serviceId: string): { price: number; currency: string } {
      const defaults: Record<string, number> = {
        "gen-1": 250000,
        "gen-2": 2500000,
        "gen-3": 35000000,
        "gen-4": 18000000,
        "gen-5": 2500000,
        "gen-6": 350000,
        "gen-7": 500000,
        "res-1": 350000,
        "res-2": 1500000,
        "res-3": 800000,
        "res-4": 4500000,
        "pro-1": 3500000,
        "pro-2": 6000000,
        "pro-3": 10500000,
        "sur-1": 500000,
        "sur-2": 2500000,
        "sur-3": 2000000,
        "sur-4": 3000000,
        "sur-5": 2500000,
        "imp-1": 18000000,
        "imp-2": 5000000,
        "imp-3": 120000000,
        "ort-1": 35000000,
        "ort-2": 80000000,
        "ort-3": 15000000,
        "ped-1": 150000,
        "ped-2": 500000,
        "ped-3": 1000000,
        "ped-4": 150000,
        "std-others": 500000
      };
      
      return {
        price: defaults[serviceId] || 500000,
        currency: "VND"
      };
    }

    function scaleVndPriceIfNeeded(name: string, priceVal: number): number {
      const lower = name.toLowerCase();
      
      // If price is already high, it's a full price
      if (priceVal >= 100000) {
        return priceVal;
      }
      
      // Handle millions context (e.g. 15, 35, 45, 1.5, 2.5)
      if (priceVal < 100) {
        if (
          lower.includes("implant") || 
          lower.includes("cấy ghép") || 
          lower.includes("niềng") || 
          lower.includes("chỉnh nha") || 
          lower.includes("braces") || 
          lower.includes("invisalign") || 
          lower.includes("veneer") || 
          lower.includes("răng sứ") || 
          lower.includes("mão sứ") || 
          lower.includes("bọc răng sứ") ||
          lower.includes("cầu răng") ||
          lower.includes("all-on") ||
          lower.includes("all on")
        ) {
          return priceVal * 1000000;
        } else {
          // E.g. simple filling or scaling priced as "150" or "250"
          return priceVal * 1000;
        }
      }
      
      // Handle thousands context (e.g. 150, 350, 1500, 2500, 45000)
      if (priceVal < 100000) {
        return priceVal * 1000;
      }
      
      return priceVal;
    }

    // Translation Map helper (translates Vietnamese dental terms to clear English)
    function translateVietnameseToEnglish(name: string): string {
      let translated = name;
      
      const dict: Array<[RegExp, string]> = [
        [/cạo vôi răng|lấy cao răng|vệ sinh răng|cạo vôi/gi, "Dental Scaling & Polishing"],
        [/đánh bóng răng|đánh bóng/gi, "Dental Polishing"],
        [/tẩy trắng răng|tẩy trắng|tẩy răng/gi, "Teeth Whitening"],
        [/nhổ răng khôn mọc lệch|nhổ răng khôn mọc ngầm|tiểu phẫu răng khôn/gi, "Surgical Wisdom Tooth Extraction"],
        [/nhổ răng khôn/gi, "Wisdom Tooth Extraction"],
        [/nhổ răng sữa/gi, "Pediatric Tooth Extraction"],
        [/nhổ răng chân răng|nhổ chân răng/gi, "Remaining Root Extraction"],
        [/nhổ răng thường|nhổ răng/gi, "Tooth Extraction"],
        [/trám răng thẩm mỹ|trám răng composite|trám răng|hàn răng/gi, "Composite Filling"],
        [/trám cổ răng/gi, "Cervical Filling"],
        [/chữa tủy răng|chữa tủy|điều trị tủy|nội nha/gi, "Root Canal Treatment"],
        [/răng toàn sứ/gi, "All-Porcelain Crown"],
        [/răng sứ titan|răng sứ/gi, "Porcelain Crown"],
        [/mão sứ|mão răng/gi, "Dental Crown"],
        [/mặt dán sứ veneer|mặt dán sứ|mặt dán veneer|dán sứ veneer/gi, "Porcelain Veneer"],
        [/cầu răng sứ|cầu răng/gi, "Dental Bridge"],
        [/cấy ghép implant|phẫu thuật implant|cắm implant/gi, "Dental Implant"],
        [/ghép xương răng|ghép xương/gi, "Bone Grafting"],
        [/nâng xoang kín/gi, "Closed Sinus Lift"],
        [/nâng xoang hở/gi, "Open Sinus Lift"],
        [/niềng răng mắc cài kim loại/gi, "Metal Braces Orthodontics"],
        [/niềng răng mắc cài sứ/gi, "Ceramic Braces Orthodontics"],
        [/niềng răng trong suốt invisalign|niềng răng invisalign/gi, "Invisalign Clear Aligners"],
        [/niềng răng|chỉnh nha/gi, "Orthodontic Braces"],
        
        [/tại phòng khám|tại phòng/gi, "In-Office"],
        [/tại nhà/gi, "At-Home"],
        [/trọn gói|trọn bộ/gi, "Package"],
        [/khám tổng quát|khám răng/gi, "Comprehensive Oral Exam"],
        [/chụp phim x-quang|chụp xquang|chụp x-quang/gi, "Dental X-Ray"],
        [/hàm trên/gi, "Upper Arch"],
        [/hàm dưới/gi, "Lower Arch"],
        [/toàn hàm/gi, "Full Arch"],
        [/răng cửa/gi, "Anterior Tooth"],
        [/răng hàm/gi, "Posterior Tooth"],
        [/phát sinh/gi, "Additional"],
        [/miễn phí/gi, "Free"],
        [/giá/gi, "Price"],
        [/phí/gi, "Fee"],
        
        [/mỗi răng|1 răng|trên răng/gi, "per Tooth"],
        [/mỗi ca|1 ca/gi, "per Case"],
        [/mỗi lần|1 lần/gi, "per Session"]
      ];

      dict.forEach(([regex, repl]) => {
        translated = translated.replace(regex, repl);
      });
      
      translated = translated.replace(/\s+/g, ' ').trim();
      if (translated.length > 0) {
        translated = translated.charAt(0).toUpperCase() + translated.slice(1);
      }
      return translated;
    }

    function mapToStandardServiceId(name: string): string {
      const lower = name.toLowerCase();
      
      if (lower.includes("trẻ em") || lower.includes("răng sữa") || lower.includes("pediatric") || lower.includes("em bé")) {
        if (lower.includes("nhổ") || lower.includes("nhổ răng") || lower.includes("extraction")) return "ped-1";
        if (lower.includes("tủy") || lower.includes("root canal")) return "ped-2";
        if (lower.includes("mão") || lower.includes("crown") || lower.includes("sứ")) return "ped-3";
        if (lower.includes("trám") || lower.includes("hàn") || lower.includes("filling")) return "ped-4";
        return "ped-1";
      }

      if (lower.includes("niềng răng") || lower.includes("chỉnh nha") || lower.includes("braces") || lower.includes("ortho")) {
        if (lower.includes("invisalign") || lower.includes("trong suốt")) return "ort-2";
        if (lower.includes("tăng trưởng") || lower.includes("growth") || lower.includes("mở rộng")) return "ort-3";
        return "ort-1";
      }

      if (lower.includes("implant") || lower.includes("cấy ghép")) {
        if (lower.includes("ghép xương") || lower.includes("nâng xoang") || lower.includes("bone graft")) return "imp-2";
        if (lower.includes("toàn hàm") || lower.includes("full arch") || lower.includes("all-on")) return "imp-3";
        return "imp-1";
      }

      if (lower.includes("nhổ răng khôn") || lower.includes("răng khôn") || lower.includes("wisdom")) {
        return "sur-2";
      }
      if (lower.includes("nhổ răng") || lower.includes("extraction")) {
        if (lower.includes("tiểu phẫu") || lower.includes("phẫu thuật")) return "sur-3";
        if (lower.includes("cắt chóp") || lower.includes("apicoectomy")) return "sur-4";
        if (lower.includes("nướu") || lower.includes("gum") || lower.includes("nha chu")) return "sur-5";
        return "sur-1";
      }

      if (lower.includes("veneer") || lower.includes("mặt dán sứ")) return "pro-2";
      if (lower.includes("cầu răng") || lower.includes("bridge")) return "pro-3";
      if (lower.includes("răng sứ") || lower.includes("mão răng") || lower.includes("crown")) return "pro-1";

      if (lower.includes("tủy") || lower.includes("root canal") || lower.includes("chữa tủy") || lower.includes("nội nha")) {
        if (lower.includes("buồng tủy") || lower.includes("pulp")) return "res-3";
        return "res-2";
      }
      if (lower.includes("inlay") || lower.includes("onlay") || lower.includes("overlay")) return "res-4";
      if (lower.includes("trám răng") || lower.includes("hàn răng") || lower.includes("filling") || lower.includes("composite")) return "res-1";

      if (lower.includes("cạo vôi") || lower.includes("lấy cao răng") || lower.includes("cleaning") || lower.includes("scaling") || lower.includes("đánh bóng")) return "gen-1";
      if (lower.includes("tẩy trắng") || lower.includes("whitening") || lower.includes("làm trắng")) return "gen-2";

      return "std-others";
    }

    const parsedTreatments: Array<{ name: string; price: number; currency: string; unit: string }> = [];

    if (textContent.trim().length > 10) {
      const lines = textContent.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 3);
      
      for (const line of lines) {
        let isMatched = false;

        // Try parsing CSV / table formatted columns
        const parts = line.split(/[,\t;|]/).map(p => p.trim()).filter(Boolean);
        if (parts.length >= 2) {
          for (let i = parts.length - 1; i >= 0; i--) {
            const part = parts[i];
            const cleaned = part.replace(/[$\sđđđVNDvndvnđVNĐ]/gi, '').replace(/\./g, '').replace(/,/g, '');
            const num = parseFloat(cleaned);
            if (!isNaN(num) && num > 0) {
              const namePart = parts.slice(0, i).join(" ").trim().replace(/[:\-=\t;|]+$/, '').trim();
              if (namePart.length > 2 && !/^(price|bảng giá|stt|dịch vụ|treatment|chi phí|đơn giá|thành tiền|no\.|số|stt|ngày|mã)$/i.test(namePart)) {
                let currency = isVnContext ? "VND" : "USD";
                if (part.includes("$") || part.toLowerCase().includes("usd") || line.includes("$") || line.toLowerCase().includes("usd")) {
                  currency = "USD";
                }
                
                let unit = "Tooth";
                if (namePart.toLowerCase().includes("niềng") || namePart.toLowerCase().includes("braces") || namePart.toLowerCase().includes("invisalign")) {
                  unit = "Case";
                } else if (namePart.toLowerCase().includes("tẩy") || namePart.toLowerCase().includes("whitening")) {
                  unit = "Session";
                } else if (namePart.toLowerCase().includes("cạo") || namePart.toLowerCase().includes("cleaning")) {
                  unit = "Visit";
                }

                parsedTreatments.push({ name: namePart, price: num, currency, unit });
                isMatched = true;
                break;
              }
            }
          }
        }

        if (isMatched) continue;

        // Try regex-based matching
        const regex = /^(.*?)\s*[:\-=\t]+\s*(?:(\$|VND|VND|vnđ|đ|USD)\s*)?(\d{1,3}(?:[.,]\d{3})+|\d+)\s*(?:(VND|vnđ|đ|USD|\$|per|răng|ca|lần|visit|tooth|session|arch|site|segment))?\s*(.*)$/i;
        const match = line.match(regex);
        if (match) {
          const namePart = match[1].trim();
          const priceStr = match[3].replace(/[.,]/g, '');
          const priceVal = parseFloat(priceStr);
          if (namePart.length > 2 && !isNaN(priceVal) && priceVal > 0 && !/^(price|bảng giá|stt|dịch vụ|treatment|chi phí|đơn giá|thành tiền)$/i.test(namePart)) {
            let currency = isVnContext ? "VND" : "USD";
            const curIndicator = (match[2] || match[4] || "").toLowerCase();
            if (curIndicator.includes("vnd") || curIndicator.includes("đ") || curIndicator.includes("vnđ") || priceVal > 50000) {
              currency = "VND";
            } else if (curIndicator.includes("usd") || curIndicator.includes("$")) {
              currency = "USD";
            }
            
            let unit = "Tooth";
            if (namePart.toLowerCase().includes("niềng") || namePart.toLowerCase().includes("braces") || namePart.toLowerCase().includes("invisalign")) {
              unit = "Case";
            } else if (namePart.toLowerCase().includes("tẩy") || namePart.toLowerCase().includes("whitening")) {
              unit = "Session";
            } else if (namePart.toLowerCase().includes("cạo") || namePart.toLowerCase().includes("cleaning")) {
              unit = "Visit";
            }

            parsedTreatments.push({ name: namePart, price: priceVal, currency, unit });
            isMatched = true;
            continue;
          }
        }

        if (isMatched) continue;

        // Try end-of-line number matching (for space separated files)
        const lastNumRegex = /(.*?)\s+(\d{1,3}(?:[.,]\d{3})*|\d+)\s*([a-zA-ZđĐ$]*)$/;
        const lastNumMatch = line.match(lastNumRegex);
        if (lastNumMatch) {
          const namePart = lastNumMatch[1].trim();
          const priceStr = lastNumMatch[2].replace(/[.,]/g, '');
          const priceVal = parseFloat(priceStr);
          const suffix = lastNumMatch[3].toLowerCase();
          if (namePart.length > 2 && !isNaN(priceVal) && priceVal > 0 && !/^(price|bảng giá|stt|dịch vụ|treatment|chi phí|đơn giá|thành tiền)$/i.test(namePart)) {
            let currency = isVnContext ? "VND" : "USD";
            if (suffix.includes("vnd") || suffix.includes("đ") || suffix.includes("vnđ") || priceVal > 50000) {
              currency = "VND";
            } else if (suffix.includes("usd") || suffix.includes("$")) {
              currency = "USD";
            }
            
            let unit = "Tooth";
            if (namePart.toLowerCase().includes("niềng") || namePart.toLowerCase().includes("braces") || namePart.toLowerCase().includes("invisalign")) {
              unit = "Case";
            } else if (namePart.toLowerCase().includes("tẩy") || namePart.toLowerCase().includes("whitening")) {
              unit = "Session";
            } else if (namePart.toLowerCase().includes("cạo") || namePart.toLowerCase().includes("cleaning")) {
              unit = "Visit";
            }

            parsedTreatments.push({ name: namePart, price: priceVal, currency, unit });
          }
        }
      }
    }

    if (parsedTreatments.length > 0) {
      // Create detailed service records for every single parsed item
      parsedTreatments.forEach(t => {
        const parentId = mapToStandardServiceId(t.name);
        const englishName = translateVietnameseToEnglish(t.name);
        const displayName = englishName.toLowerCase() === t.name.toLowerCase() ? englishName : `${englishName} (${t.name})`;
        
        let finalPrice = t.price;
        if (t.currency === "VND") {
          finalPrice = scaleVndPriceIfNeeded(t.name, t.price);
        }

        details.push({
          parentServiceId: parentId,
          serviceName: displayName,
          customPrice: finalPrice,
          treatmentUnit: t.unit,
          priceUnit: `per ${t.unit}`,
          currency: t.currency,
          isDetail: true,
          enabled: true
        });
      });

      // Group standard matches
      const parentGroups: Record<string, typeof parsedTreatments> = {};
      parsedTreatments.forEach(t => {
        const parentId = mapToStandardServiceId(t.name);
        if (!parentGroups[parentId]) {
          parentGroups[parentId] = [];
        }
        parentGroups[parentId].push(t);
      });

      Object.keys(parentGroups).forEach(parentId => {
        const group = parentGroups[parentId];
        
        // Calculate average scaled price
        const totalScaled = group.reduce((sum, item) => {
          let scaled = item.price;
          if (item.currency === "VND") {
            scaled = scaleVndPriceIfNeeded(item.name, item.price);
          }
          return sum + scaled;
        }, 0);
        
        const avgPrice = Math.round(totalScaled / group.length);
        const firstItem = group[0];
        
        matches.push({
          serviceId: parentId,
          enabled: true,
          customPrice: avgPrice,
          treatmentUnit: firstItem.unit,
          priceUnit: `per ${firstItem.unit}`,
          currency: firstItem.currency
        });
      });
    } else {
      // Default extraction if no text could be extracted or format is unsupported (images, empty PDF, etc.)
      let hasImplant = fileNameLower.includes("implant") || fileNameLower.includes("cay-ghep") || fileNameLower.includes("cấy");
      let hasVeneer = fileNameLower.includes("veneer") || fileNameLower.includes("crown") || fileNameLower.includes("su") || fileNameLower.includes("sứ");
      let hasOrthodontics = fileNameLower.includes("ortho") || fileNameLower.includes("braces") || fileNameLower.includes("invisalign") || fileNameLower.includes("nieng") || fileNameLower.includes("niềng");
      let hasGeneral = fileNameLower.includes("general") || fileNameLower.includes("clean") || fileNameLower.includes("fill") || fileNameLower.includes("tong-quat");

      if (!hasImplant && !hasVeneer && !hasOrthodontics && !hasGeneral) {
        hasGeneral = true;
        hasVeneer = true;
      }

      stdServices.forEach(std => {
        let shouldMatch = false;
        let priceAndCurrency = isVnContext ? getVietnameseDefaultPrice(std.id) : { price: std.defaultPrice || 50, currency: std.currency || "USD" };
        let customPrice = priceAndCurrency.price;

        if (std.id.startsWith("gen-") && hasGeneral) {
          shouldMatch = true;
          customPrice = Math.round(customPrice * 0.95);
        } else if (std.id.startsWith("res-") && hasGeneral) {
          shouldMatch = true;
          customPrice = Math.round(customPrice * 0.95);
        } else if (std.id.startsWith("pro-") && hasVeneer) {
          shouldMatch = true;
          customPrice = Math.round(customPrice * 0.95);
        } else if (std.id.startsWith("imp-") && hasImplant) {
          shouldMatch = true;
          customPrice = Math.round(customPrice * 0.95);
        } else if (std.id.startsWith("ort-") && hasOrthodontics) {
          shouldMatch = true;
          customPrice = Math.round(customPrice * 0.95);
        }

        if (shouldMatch) {
          matches.push({
            serviceId: std.id,
            enabled: true,
            customPrice,
            treatmentUnit: std.treatmentUnit || "Tooth",
            priceUnit: std.priceUnit || "per Tooth",
            currency: priceAndCurrency.currency
          });
        }
      });

      // Populate realistic detailed sub-treatments
      if (hasGeneral) {
        if (isVnContext) {
          // Teeth Whitening (gen-2)
          details.push({
            parentServiceId: "gen-2",
            serviceName: "Laser Teeth Whitening - In-Office (Tẩy trắng răng bằng đèn Laser tại phòng khám)",
            customPrice: 2500000,
            treatmentUnit: "Session",
            priceUnit: "per Session",
            currency: "VND",
            isDetail: true,
            enabled: true
          });
          details.push({
            parentServiceId: "gen-2",
            serviceName: "Home Teeth Whitening Kit (Máng tẩy trắng răng tại nhà + thuốc)",
            customPrice: 1500000,
            treatmentUnit: "Session",
            priceUnit: "per Session",
            currency: "VND",
            isDetail: true,
            enabled: true
          });
          // Wisdom Tooth Extraction (gen-5)
          details.push({
            parentServiceId: "gen-5",
            serviceName: "Surgical Wisdom Tooth Extraction - Impacted/Semi-impacted (Phẫu thuật nhổ răng khôn mọc lệch/ngầm)",
            customPrice: 2500000,
            treatmentUnit: "Tooth",
            priceUnit: "per Tooth",
            currency: "VND",
            isDetail: true,
            enabled: true
          });
          // Tooth Extraction (gen-7)
          details.push({
            parentServiceId: "gen-7",
            serviceName: "Simple Tooth Extraction (Nhổ răng thường)",
            customPrice: 500000,
            treatmentUnit: "Tooth",
            priceUnit: "per Tooth",
            currency: "VND",
            isDetail: true,
            enabled: true
          });
          details.push({
            parentServiceId: "gen-6",
            serviceName: "Composite Filling - Anterior Tooth (Trám răng thẩm mỹ răng cửa)",
            customPrice: 350000,
            treatmentUnit: "Tooth",
            priceUnit: "per Tooth",
            currency: "VND",
            isDetail: true,
            enabled: true
          });
          details.push({
            parentServiceId: "gen-6",
            serviceName: "Composite Filling - Posterior Tooth (Trám răng thẩm mỹ răng hàm)",
            customPrice: 450000,
            treatmentUnit: "Tooth",
            priceUnit: "per Tooth",
            currency: "VND",
            isDetail: true,
            enabled: true
          });
          details.push({
            parentServiceId: "gen-1",
            serviceName: "Deep Scaling & Polish - Grade II (Cạo vôi răng & đánh bóng chuyên sâu)",
            customPrice: 250000,
            treatmentUnit: "Visit",
            priceUnit: "per Visit",
            currency: "VND",
            isDetail: true,
            enabled: true
          });
        } else {
          // Teeth Whitening (gen-2)
          details.push({
            parentServiceId: "gen-2",
            serviceName: "Laser Teeth Whitening - In-Office (Tẩy trắng răng bằng đèn Laser tại phòng khám)",
            customPrice: 150,
            treatmentUnit: "Session",
            priceUnit: "per Session",
            currency: "USD",
            isDetail: true,
            enabled: true
          });
          details.push({
            parentServiceId: "gen-2",
            serviceName: "Home Teeth Whitening Kit (Máng tẩy trắng răng tại nhà + thuốc)",
            customPrice: 85,
            treatmentUnit: "Session",
            priceUnit: "per Session",
            currency: "USD",
            isDetail: true,
            enabled: true
          });
          // Wisdom Tooth Extraction (gen-5)
          details.push({
            parentServiceId: "gen-5",
            serviceName: "Surgical Wisdom Tooth Extraction - Impacted/Semi-impacted (Phẫu thuật nhổ răng khôn mọc lệch/ngầm)",
            customPrice: 180,
            treatmentUnit: "Tooth",
            priceUnit: "per Tooth",
            currency: "USD",
            isDetail: true,
            enabled: true
          });
          // Tooth Extraction (gen-7)
          details.push({
            parentServiceId: "gen-7",
            serviceName: "Simple Tooth Extraction (Nhổ răng thường)",
            customPrice: 70,
            treatmentUnit: "Tooth",
            priceUnit: "per Tooth",
            currency: "USD",
            isDetail: true,
            enabled: true
          });
          details.push({
            parentServiceId: "gen-6",
            serviceName: "Composite Filling - Anterior Tooth (Trám răng thẩm mỹ răng cửa)",
            customPrice: 55,
            treatmentUnit: "Tooth",
            priceUnit: "per Tooth",
            currency: "USD",
            isDetail: true,
            enabled: true
          });
          details.push({
            parentServiceId: "gen-6",
            serviceName: "Composite Filling - Posterior Tooth (Trám răng thẩm mỹ răng hàm)",
            customPrice: 75,
            treatmentUnit: "Tooth",
            priceUnit: "per Tooth",
            currency: "USD",
            isDetail: true,
            enabled: true
          });
          details.push({
            parentServiceId: "gen-1",
            serviceName: "Deep Scaling & Polish - Grade II (Cạo vôi răng & đánh bóng chuyên sâu)",
            customPrice: 45,
            treatmentUnit: "Visit",
            priceUnit: "per Visit",
            currency: "USD",
            isDetail: true,
            enabled: true
          });
        }
      }

      if (hasVeneer) {
        if (isVnContext) {
          details.push({
            parentServiceId: "pro-2",
            serviceName: "E.max Press Porcelain Veneer (Mặt dán sứ Emax siêu mỏng)",
            customPrice: 6000000,
            treatmentUnit: "Tooth",
            priceUnit: "per Tooth",
            currency: "VND",
            isDetail: true,
            enabled: true
          });
          details.push({
            parentServiceId: "pro-1",
            serviceName: "Zirconia All-Porcelain Crown (Răng toàn sứ Zirconia CAD/CAM)",
            customPrice: 3500000,
            treatmentUnit: "Tooth",
            priceUnit: "per Tooth",
            currency: "VND",
            isDetail: true,
            enabled: true
          });
        } else {
          details.push({
            parentServiceId: "pro-2",
            serviceName: "E.max Press Porcelain Veneer (Mặt dán sứ Emax siêu mỏng)",
            customPrice: 420,
            treatmentUnit: "Tooth",
            priceUnit: "per Tooth",
            currency: "USD",
            isDetail: true,
            enabled: true
          });
          details.push({
            parentServiceId: "pro-1",
            serviceName: "Zirconia All-Porcelain Crown (Răng toàn sứ Zirconia CAD/CAM)",
            customPrice: 320,
            treatmentUnit: "Tooth",
            priceUnit: "per Tooth",
            currency: "USD",
            isDetail: true,
            enabled: true
          });
        }
      }

      if (hasImplant) {
        if (isVnContext) {
          details.push({
            parentServiceId: "imp-1",
            serviceName: "Straumann SLA Active Implant (Thụy Sĩ) + Abutment",
            customPrice: 35000000,
            treatmentUnit: "Tooth",
            priceUnit: "per Tooth",
            currency: "VND",
            isDetail: true,
            enabled: true
          });
          details.push({
            parentServiceId: "imp-1",
            serviceName: "Dentium SuperLine Implant (Hàn Quốc) + Abutment",
            customPrice: 18000000,
            treatmentUnit: "Tooth",
            priceUnit: "per Tooth",
            currency: "VND",
            isDetail: true,
            enabled: true
          });
        } else {
          details.push({
            parentServiceId: "imp-1",
            serviceName: "Straumann SLA Active Implant (Thụy Sĩ) + Abutment",
            customPrice: 1550,
            treatmentUnit: "Tooth",
            priceUnit: "per Tooth",
            currency: "USD",
            isDetail: true,
            enabled: true
          });
          details.push({
            parentServiceId: "imp-1",
            serviceName: "Dentium SuperLine Implant (Hàn Quốc) + Abutment",
            customPrice: 950,
            treatmentUnit: "Tooth",
            priceUnit: "per Tooth",
            currency: "USD",
            isDetail: true,
            enabled: true
          });
        }
      }

      if (hasOrthodontics) {
        if (isVnContext) {
          details.push({
            parentServiceId: "ort-2",
            serviceName: "Invisalign Comprehensive (Niềng răng trong suốt trọn gói)",
            customPrice: 80000000,
            treatmentUnit: "Case",
            priceUnit: "per Case",
            currency: "VND",
            isDetail: true,
            enabled: true
          });
          details.push({
            parentServiceId: "ort-1",
            serviceName: "Metal Braces - 3M Unitek (Niềng răng mắc cài kim loại cao cấp)",
            customPrice: 35000000,
            treatmentUnit: "Case",
            priceUnit: "per Case",
            currency: "VND",
            isDetail: true,
            enabled: true
          });
        } else {
          details.push({
            parentServiceId: "ort-2",
            serviceName: "Invisalign Comprehensive (Niềng răng trong suốt trọn gói)",
            customPrice: 3800,
            treatmentUnit: "Case",
            priceUnit: "per Case",
            currency: "USD",
            isDetail: true,
            enabled: true
          });
          details.push({
            parentServiceId: "ort-1",
            serviceName: "Metal Braces - 3M Unitek (Niềng răng mắc cài kim loại cao cấp)",
            customPrice: 1600,
            treatmentUnit: "Case",
            priceUnit: "per Case",
            currency: "USD",
            isDetail: true,
            enabled: true
          });
        }
      }

      // Always add a sample item under std-others in the fallback to ensure other specialties represent
      if (isVnContext) {
        details.push({
          parentServiceId: "std-others",
          serviceName: "Comprehensive General Checkup & Treatment Plan (Khám tổng quát và lên phác đồ điều trị)",
          customPrice: 100000,
          treatmentUnit: "Visit",
          priceUnit: "per Visit",
          currency: "VND",
          isDetail: true,
          enabled: true
        });
      } else {
        details.push({
          parentServiceId: "std-others",
          serviceName: "Comprehensive General Checkup & Treatment Plan (Khám tổng quát và lên phác đồ điều trị)",
          customPrice: 15,
          treatmentUnit: "Visit",
          priceUnit: "per Visit",
          currency: "USD",
          isDetail: true,
          enabled: true
        });
      }

      if (!matches.some(m => m.serviceId === "std-others")) {
        matches.push({
          serviceId: "std-others",
          enabled: true,
          customPrice: isVnContext ? 100000 : 15,
          treatmentUnit: "Visit",
          priceUnit: "per Visit",
          currency: isVnContext ? "VND" : "USD"
        });
      }
    }

    return { matches, details };
  }

  function normalizeServiceId(id: string): string {
    if (!id) return "std-others";
    const clean = id.toLowerCase().trim().replace(/['"_\-]/g, "");
    
    // Exact short matches
    if (["gen1", "cleaning", "clean"].includes(clean)) return "gen-1";
    if (["gen2", "teethwhitening", "whitening", "bleaching"].includes(clean)) return "gen-2";
    if (["gen3", "ort1", "braces", "orthodontic", "orthodontics"].includes(clean)) return "ort-1";
    if (["gen4", "imp1", "implant", "dentalimplant"].includes(clean)) return "imp-1";
    if (["gen5", "sur2", "wisdomtooth", "wisdom"].includes(clean)) return "sur-2";
    if (["gen6", "res1", "filling", "composite", "compositefilling"].includes(clean)) return "res-1";
    if (["gen7", "sur1", "extraction", "toothextraction"].includes(clean)) return "sur-1";
    
    if (clean === "res2" || clean.includes("rootcanal")) return "res-2";
    if (clean === "res3" || clean.includes("pulp")) return "res-3";
    if (clean === "res4" || clean.includes("inlay") || clean.includes("onlay") || clean.includes("overlay")) return "res-4";
    
    if (clean === "pro1" || clean.includes("crown") || clean.includes("maosu") || clean.includes("răngsứ")) return "pro-1";
    if (clean === "pro2" || clean.includes("veneer") || clean.includes("veneers")) return "pro-2";
    if (clean === "pro3" || clean.includes("bridge") || clean.includes("cầurăng")) return "pro-3";
    
    if (clean === "sur3" || clean.includes("preprosthetic") || clean.includes("xươngổ")) return "sur-3";
    if (clean === "sur4" || clean.includes("apicoectomy") || clean.includes("cắtchóp")) return "sur-4";
    if (clean === "sur5" || clean.includes("gum") || clean.includes("nướu") || clean.includes("gingivo")) return "sur-5";
    
    if (clean === "imp2" || clean.includes("bonegraft") || clean.includes("ghépxương")) return "imp-2";
    if (clean === "imp3" || clean.includes("fullarch") || clean.includes("allon")) return "imp-3";
    
    if (clean === "ort2" || clean.includes("invisalign")) return "ort-2";
    if (clean === "ort3" || clean.includes("growth") || clean.includes("children")) return "ort-3";
    
    if (clean === "ped1" || clean.includes("pediatricextraction") || clean.includes("răngsữanhổ")) return "ped-1";
    if (clean === "ped2" || clean.includes("pediatricroot") || clean.includes("răngsữatủy")) return "ped-2";
    if (clean === "ped3" || clean.includes("pediatriccrown") || clean.includes("răngsữamão")) return "ped-3";
    if (clean === "ped4" || clean.includes("pediatricfilling") || clean.includes("răngsữatrám")) return "ped-4";
    
    if (clean.includes("other") || clean.includes("others") || clean === "stdothers") return "std-others";
    
    const stdIds = ["gen-1", "gen-2", "gen-3", "gen-4", "gen-5", "gen-6", "gen-7", "res-1", "res-2", "res-3", "res-4", "pro-1", "pro-2", "pro-3", "sur-1", "sur-2", "sur-3", "sur-4", "sur-5", "imp-1", "imp-2", "imp-3", "ort-1", "ort-2", "ort-3", "ped-1", "ped-2", "ped-3", "ped-4", "std-others"];
    const found = stdIds.find(stdId => stdId.replace("-", "") === clean || stdId === id);
    if (found) return found;
    
    return "std-others";
  }

  // Guarantee that every enabled/marked standard service has at least one specific detailed treatment (AC 2.1 - AC 2.5)
  function ensureDetailsForMatches(parsedResult: any, standardServices: any[]) {
    if (!parsedResult) return parsedResult;
    if (!parsedResult.matches) parsedResult.matches = [];
    if (!parsedResult.details) parsedResult.details = [];

    // Normalize all service IDs right away to align custom LLM IDs with standard ones
    parsedResult.matches.forEach((m: any) => {
      m.serviceId = normalizeServiceId(m.serviceId);
    });
    parsedResult.details.forEach((d: any) => {
      d.parentServiceId = normalizeServiceId(d.parentServiceId);
    });

    const matches = parsedResult.matches;
    const details = parsedResult.details;

    matches.forEach((m: any) => {
      if (m.enabled) {
        const hasDetail = details.some((d: any) => d.parentServiceId === m.serviceId && d.enabled !== false);
        if (!hasDetail) {
          const std = standardServices.find((s: any) => s.id === m.serviceId);
          if (std) {
            let name = std.name;
            if (m.serviceId === 'gen-1') name = "Standard Scaling & Dental Polishing (Cạo vôi răng & đánh bóng tiêu chuẩn)";
            else if (m.serviceId === 'gen-2') name = "Laser In-Office Teeth Whitening (Tẩy trắng răng Laser tại phòng khám)";
            else if (m.serviceId === 'gen-3' || m.serviceId === 'ort-1') name = "Metal Braces Orthodontic Treatment (Niềng răng mắc cài kim loại)";
            else if (m.serviceId === 'gen-4' || m.serviceId === 'imp-1') name = "Standard Dental Implant Replacement (Cấy ghép răng Implant tiêu chuẩn)";
            else if (m.serviceId === 'gen-5' || m.serviceId === 'sur-2') name = "Surgical Wisdom Tooth Extraction (Phẫu thuật nhổ răng khôn)";
            else if (m.serviceId === 'gen-6' || m.serviceId === 'res-1') name = "Composite Cosmetic Tooth Filling (Trám răng thẩm mỹ Composite)";
            else if (m.serviceId === 'gen-7' || m.serviceId === 'sur-1') name = "Simple Tooth Extraction (Nhổ răng thường)";
            else if (m.serviceId === 'res-2') name = "Root Canal Therapy - Anterior Tooth (Điều trị tủy răng cửa)";
            else if (m.serviceId === 'res-3') name = "Pulp Extirpation & Treatment (Lấy tủy & điều trị buồng tủy)";
            else if (m.serviceId === 'res-4') name = "Porcelain Inlay / Onlay restoration (Phục hình răng sứ Inlay/Onlay)";
            else if (m.serviceId === 'pro-1') name = "Titanium Porcelain Crown restoration (Bọc răng sứ Titan)";
            else if (m.serviceId === 'pro-2') name = "E.max Pressed Veneer (Mặt dán sứ Emax thẩm mỹ)";
            else if (m.serviceId === 'pro-3') name = "Porcelain Dental Bridge (Cầu răng sứ)";
            else if (m.serviceId === 'sur-3') name = "Pre-prosthetic Alveoloplasty (Phẫu thuật tạo hình xương ổ răng)";
            else if (m.serviceId === 'sur-4') name = "Apicoectomy root-end surgery (Phẫu thuật cắt chóp răng)";
            else if (m.serviceId === 'sur-5') name = "Gingivoplasty periodontal surgery (Phẫu thuật tạo hình nướu nha chu)";
            else if (m.serviceId === 'imp-2') name = "Bone Grafting for Dental Implant (Ghép xương răng hỗ trợ cấy Implant)";
            else if (m.serviceId === 'imp-3') name = "All-on-4 Full Arch Dental Implant (Cấy ghép Implant toàn hàm All-on-4)";
            else if (m.serviceId === 'ort-2') name = "Invisalign Clear Aligners Treatment (Niềng răng trong suốt Invisalign)";
            else if (m.serviceId === 'ort-3') name = "Growth Orthodontics for Children (Chỉnh nha tăng trưởng trẻ em)";
            else if (m.serviceId === 'ped-1') name = "Pediatric Tooth Extraction (Nhổ răng sữa trẻ em)";
            else if (m.serviceId === 'ped-2') name = "Pediatric Root Canal Treatment (Chữa tủy răng sữa trẻ em)";
            else if (m.serviceId === 'ped-3') name = "Stainless Steel Pediatric Crown (Mão răng kim loại trẻ em)";
            else if (m.serviceId === 'ped-4') name = "Pediatric Fluoride/Composite Filling (Trám răng thẩm mỹ trẻ em)";
            else if (m.serviceId === 'std-others') name = "Comprehensive Oral Assessment & Diagnostic (Khám và chẩn đoán răng miệng tổng quát)";
            else {
              name = `${std.name} Treatment (${std.name})`;
            }

            details.push({
              parentServiceId: m.serviceId,
              serviceName: name,
              customPrice: m.customPrice !== undefined ? m.customPrice : std.defaultPrice || 50,
              treatmentUnit: m.treatmentUnit || std.treatmentUnit || "Tooth",
              priceUnit: m.priceUnit || `per ${m.treatmentUnit || std.treatmentUnit || "Tooth"}`,
              currency: m.currency || std.currency || "USD",
              isDetail: true,
              enabled: true
            });
          }
        }
      }
    });

    return parsedResult;
  }

  // AI-Assisted Price List Import (AC 2.1 - AC 2.5)
  app.post("/api/clinic/onboarding/import-prices", async (req, res) => {
    const { file, standardServices } = req.body;
    if (!file || !file.base64) {
      return res.status(400).json({ error: "No file content uploaded. Please select a valid file." });
    }

    // AC 2.5: Validate file size (limit to 10MB)
    const fileSizeBytes = file.size || (file.base64.length * 0.75);
    if (fileSizeBytes > 10 * 1024 * 1024) {
      return res.status(400).json({ error: "The uploaded file is too large. Maximum file size allowed is 10MB." });
    }

    // AC 2.5: Validate file type
    const supportedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
      "text/csv",
      "text/plain",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ];
    
    const fileType = file.type || "";
    const ext = file.name ? file.name.split('.').pop().toLowerCase() : "";
    const supportedExts = ["pdf", "csv", "xlsx", "xls", "png", "jpeg", "jpg", "txt"];
    
    const isTypeSupported = supportedTypes.includes(fileType) || supportedExts.includes(ext);
    if (!isTypeSupported) {
      return res.status(400).json({ 
        error: `Unsupported file format: "${fileType || ext}". Please upload a PDF, Excel (.xlsx/.xls), CSV, PNG, or JPEG file.` 
      });
    }

    try {
      const ai = getGeminiClient();

      const systemInstruction = `You are an expert medical pricing extraction AI for the UCSmile dental portal.
Analyze the provided clinic price list document (which could be raw text, CSV, PDF text, or an image) and perform high-fidelity extraction:

1. MATCH STANDARD SERVICES (CRITICAL MAPPING RULE):
Match the clinic's listed treatments with our standard services listed below:
${JSON.stringify(standardServices, null, 2)}

For each standard service that has at least one matching treatment in the document:
- Set it to "enabled": true in the "matches" array.
- Put its standard serviceId, extracted customPrice, treatmentUnit, and currency in the "matches" object.

To prevent incorrectly classifying treatments under "Others" (std-others), you MUST be extremely diligent. You are FORBIDDEN from mapping a treatment to "std-others" if its Vietnamese or English name matches any of the semantic keywords below:
- gen-1 (Cleaning): "Cạo vôi răng", "Đánh bóng", "Lấy cao răng", "Lấy cao", "Vệ sinh răng miệng", "Scaling", "Polish", "Polishing".
- gen-2 (Teeth Whitening): "Tẩy trắng răng", "Tẩy trắng", "Bleaching", "Whitening".
- gen-3 / ort-1 (Braces): "Niềng răng mắc cài", "Chỉnh nha mắc cài", "Niềng răng", "Chỉnh nha", "Mắc cài", "Mắc cài kim loại", "Mắc cài sứ", "Mắc cài pha lê", "Braces". (Prefer ort-1 for specialty).
- gen-4 / imp-1 (Dental Implant): "Trồng răng Implant", "Cấy ghép Implant", "Implant", "Trụ Implant", "Abutment", "Dentium", "Osstem", "Straumann", "Nobel". (Prefer imp-1 for specialty).
- gen-5 / sur-2 (Wisdom Tooth Extraction): "Nhổ răng khôn", "Phẫu thuật răng khôn", "Tiểu phẫu răng khôn", "Nhổ răng số 8", "Răng khôn mọc lệch", "Răng khôn mọc ngầm", "Wisdom tooth". (Prefer sur-2 for specialty).
- gen-6 / res-1 (Composite Filling): "Trám răng", "Hàn răng", "Trám thẩm mỹ", "Trám Composite", "Hàn Composite", "Trám cổ răng", "Hàn cổ răng", "Trám răng sâu", "GIC", "Filling". (Prefer res-1 for specialty).
- gen-7 / sur-1 (Tooth Extraction): "Nhổ răng", "Nhổ răng thường", "Nhổ chân răng", "Nhổ răng lung lay", "Nhổ răng thừa", "Extraction". (Prefer sur-1 for specialty).
- res-2 (Root Canal Treatment): "Điều trị tủy", "Chữa tủy", "Lấy tủy", "Nội nha", "Diệt tủy", "Tủy răng", "Root canal", "Endo", "Endodontic".
- res-3 (Pulp Treatment): "Điều trị tủy buồng", "Chữa tủy buồng", "Lấy tủy buồng", "Tủy buồng", "Pulpotomy", "Pulpectomy".
- res-4 (Inlay Onlay Overlay): "Inlay", "Onlay", "Overlay", "Phục hình bán phần", "Sứ bán phần".
- pro-1 (Dental Crown): "Bọc răng sứ", "Mão răng", "Mão sứ", "Răng sứ", "Chụp răng sứ", "Crown", "Mão răng Titan", "Sứ Cercon", "Sứ Zirconia", "Sứ Lava".
- pro-2 (Veneers): "Mặt dán sứ", "Veneer", "Veneer sứ", "Dán sứ Veneer", "Porcelain veneer".
- pro-3 (Dental Bridge): "Cầu răng", "Cầu răng sứ", "Cầu sứ", "Bridge".
- sur-3 (Pre-prosthetic Surgery): "Phẫu thuật tạo hình xương ổ răng", "Tạo hình xương ổ", "Mài xương ổ răng", "Phẫu thuật tiền phục hình", "Alveoloplasty", "Pre-prosthetic".
- sur-4 (Apicoectomy): "Cắt chóp răng", "Cắt chóp", "Phẫu thuật cắt chóp", "Phẫu thuật chóp", "Apicoectomy".
- sur-5 (Gum Surgery): "Phẫu thuật nướu", "Cắt nướu", "Tạo hình nướu", "Cắt lợi", "Phẫu thuật nha chu", "Gingivoplasty".
- imp-2 (Bone Graft): "Ghép xương", "Nâng xoang", "Nâng xoang hở", "Nâng xoang kín", "Màng xương", "Bone graft", "Sinus lift", "Grafting".
- imp-3 (Full Arch Implants): "Implant toàn hàm", "All on 4", "All on 6", "All-on-4", "All-on-6", "Full arch implant".
- ort-2 (Invisalign): "Niềng răng trong suốt", "Invisalign", "Khay trong suốt", "Chỉnh nha trong suốt", "Clear aligners".
- ort-3 (Growth Orthodontics): "Chỉnh nha tăng trưởng", "Chỉnh nha trẻ em", "Chỉnh nha sớm", "Tiền chỉnh nha", "EF", "Trainer", "Chỉnh nha tháo lắp trẻ em", "Growth orthodontics".
- ped-1 (Pediatric Extraction): "Nhổ răng sữa", "Nhổ răng trẻ em", "Pediatric extraction", "Nhổ răng sữa bôi tê/tiêm tê".
- ped-2 (Pediatric Root Canal): "Chữa tủy răng sữa", "Điều trị tủy răng sữa", "Lấy tủy răng sữa", "Pediatric root canal".
- ped-3 (Pediatric Crown): "Mão răng sữa", "Mão kim loại trẻ em", "Mão thép không gỉ", "SSC", "Pediatric crown".
- ped-4 (Pediatric Filling): "Trám răng sữa", "Trám răng trẻ em", "Hàn răng sữa", "Pediatric filling", "Trám răng sâu trẻ em".

Only use "std-others" (Other Specialty / Others) for items that do not correspond to any of the standard services above (e.g., "Phim X-Quang" / "X-ray", "CT Cone Beam", "Xét nghiệm máu", "Gây mê").

2. DETAILED TREATMENT EXTRACTION (NO COMBINING, GROUPING, OR CONSOLIDATION):
- You MUST extract EVERY SINGLE treatment item or row listed in the clinic's document as an individual row in the "details" array.
- DO NOT combine, merge, group, average, or consolidate multiple different treatment rows from the document under a single name or single price.
- Translate Vietnamese dental terms to clear, professional English, but ALWAYS include the original Vietnamese text in parentheses next to the English name, for example: "Laser In-Office Teeth Whitening (Tẩy trắng răng tại phòng khám bằng Laser)" or "Dental Scaling & Polishing (Cạo vôi răng & Đánh bóng)". This is extremely important.
- Even if the treatment name in the document matches a standard service name exactly (for example, "Teeth Whitening", "Cleaning", "Braces", or "Tooth Extraction"), you MUST still duplicate/add it to the "details" array with:
  - "parentServiceId": the matched standard service ID (e.g. "gen-2", "gen-1", "ort-1" or "gen-7") determined by the mapping rules above.
  - "serviceName": translated English name with original Vietnamese name in parentheses.
  - "customPrice": the extracted price as a number.
  - "treatmentUnit": the extracted treatment unit (Tooth, Visit, Case, Session, Arch, Site, Segment).
  - "priceUnit": "per <treatmentUnit>".
  - "currency": the currency of the price (USD or VND).

3. VIETNAMESE CURRENCY (VND) FORMATTING & SCALING RULES:
- Vietnamese documents use a dot (".") as a thousands separator (e.g., "1.500.000" or "1.500.000đ") and a comma (",") as a decimal separator (e.g., "1,5 triệu"). You MUST parse these correctly:
  - "1.500.000" VND -> 1500000 (as a clean integer number)
  - "250.000" VND -> 250000
  - "1,5 triệu" or "1.5 million" -> 1500000
- **CRITICAL - SCALE CONVERSION**: Frequently, Vietnamese price lists write numbers in thousands ("nghìn đồng" / "k" / "ĐVT: 1.000đ") or millions. If you see prices listed as small numbers like "150", "300", "1.500", "2.500", "45.000" under a VND context, they are abbreviated. You MUST multiply them to their full absolute numeric value!
  - If a cleaning is "200" or "200k" or "200.000", the customPrice MUST be 200000 VND.
  - If a filling is "350" or "350k", the customPrice MUST be 350000 VND.
  - If a root canal is "1.500" or "1500" or "1.500.000", the customPrice MUST be 1500000 VND.
  - If an extraction is "400" or "400k", the customPrice MUST be 400000 VND.
  - If wisdom tooth extraction is "2.500" or "2500", the customPrice MUST be 2500000 VND.
  - If a crown is "4.500" or "4500" or "4,5 triệu", the customPrice MUST be 4500000 VND.
  - If braces are "35.000" or "35000" or "35 triệu", the customPrice MUST be 35000000 VND.
  - If implant is "18.000" or "18000" or "18 triệu", the customPrice MUST be 18000000 VND.
- Apply your medical dental domain knowledge to scale these numbers correctly. If the extracted number is less than 100,000 for standard treatments in VND, it is highly likely scaled in thousands. Convert it to the full actual price!

4. CATEGORY / OTHERS FALLBACK:
If any treatment row in the document does not match any of the standard service IDs or categories, set its parentServiceId to "std-others" (Other Specialty / Others).

5. FORMAT THE RESPONSE STRICTLY AS A JSON OBJECT:
{
  "matches": [
    {
      "serviceId": "standard service ID",
      "enabled": true,
      "customPrice": 120000,
      "treatmentUnit": "Tooth",
      "priceUnit": "per Tooth",
      "currency": "VND"
    }
  ],
  "details": [
    {
      "parentServiceId": "parent standard service ID",
      "serviceName": "Specific Treatment Name (e.g. Teeth Whitening, Cleaning, or Composite Filling on Anterior)",
      "customPrice": 450000,
      "treatmentUnit": "Tooth",
      "priceUnit": "per Tooth",
      "currency": "VND",
      "isDetail": true,
      "enabled": true
    }
  ]
}

Return ONLY the valid JSON object. No markdown wrappers like \`\`\`json or \`\`\`. If you cannot extract anything, return empty arrays.`;

      const textContent = await extractTextFromFile(file);
      const isImage = fileType.startsWith("image/") || ["png", "jpeg", "jpg"].includes(ext);
      const isPdf = fileType === "application/pdf" || ext === "pdf";

      let parts: any[] = [];
      if (isImage || isPdf) {
        // For images and PDFs, pass the raw file to Gemini as inlineData
        parts.push({
          inlineData: {
            mimeType: fileType || (isPdf ? "application/pdf" : "image/jpeg"),
            data: file.base64
          }
        });
        
        // If we also have extracted text from the PDF, pass it as a helpful reference
        if (isPdf && textContent && textContent.trim().length > 10) {
          parts.push({
            text: `Here is the pre-extracted selectable text from this PDF file:\n\n${textContent}`
          });
        }
      } else {
        // For spreadsheets (Excel, CSV) and text files, ONLY pass the extracted text representation
        parts.push({
          text: `Here is the text/CSV representation of the uploaded spreadsheet or document:\n\n${textContent || "[No content extracted]"}`
        });
      }

      parts.push({
        text: "Please analyze this clinic price list file and extract the services, pricing, and treatment units matching the schema requested."
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: { parts },
        config: {
          systemInstruction,
          responseMimeType: "application/json"
        }
      });

      const resultText = response.text || "{}";
      let parsedResult;
      try {
        parsedResult = JSON.parse(resultText.trim());
      } catch (parseErr) {
        console.error("Failed to parse Gemini JSON:", resultText);
        const cleanJson = resultText.replace(/```json/g, "").replace(/```/g, "").trim();
        parsedResult = JSON.parse(cleanJson);
      }

      return res.json({
        success: true,
        data: ensureDetailsForMatches(parsedResult, standardServices),
        isFallback: false
      });

    } catch (err: any) {
      console.warn("AI Price Import returned error. Utilizing smart local extraction fallback.", err);
      
      // Smart Fallback Extractor (AC 2.1 - AC 2.5)
      try {
        const fallbackData = await extractPricingFallback(file, standardServices);
        return res.json({
          success: true,
          data: ensureDetailsForMatches(fallbackData, standardServices),
          isFallback: true
        });
      } catch (fallbackErr: any) {
        return res.status(500).json({
          error: "Failed to process the uploaded price list. Please check the file and try again."
        });
      }
    }
  });

  // Save Onboarding step (AC 8)
  app.post("/api/clinic/onboarding/:clinicId/step", (req, res) => {
    try {
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
            if (b && !b.isPrimary && b.branchName?.trim()) {
              updatedBranches.push({
                branchId: b.branchId || `B-BR-${clinicId}-${index}-${Date.now()}`,
                clinicId,
                branchName: b.branchName.trim(),
                city: b.city ? b.city.trim() : "",
                address: b.address ? b.address.trim() : "",
                contactPhone: b.contactPhone ? b.contactPhone.trim() : "",
                isPrimary: false
              });
            }
          });
          clinicBranches[clinicId] = updatedBranches;
        }
      } else if (step === 5) {
        // Partnership Agreement (AC 4, AC 5, AC 7)
        const {
          representativeName,
          representativePosition,
          agreementText,
          checkboxes,
          termsVersion,
          agreementNumber,
          ipAddress,
          userAgent,
          clinicEmail
        } = data;

        // 1. Validation
        if (!representativeName || !representativeName.trim()) {
          return res.status(400).json({ error: "Representative Name is required." });
        }
        if (!representativePosition || !representativePosition.trim()) {
          return res.status(400).json({ error: "Representative Position is required." });
        }
        if (!checkboxes || checkboxes.length < 6 || checkboxes.some((c: boolean) => !c)) {
          return res.status(400).json({ error: "All 6 checkboxes must be accepted." });
        }

        // 2. Generate SHA-256 hash
        const hash = crypto.createHash('sha256').update(agreementText || '').digest('hex');

        // 3. Save electronic acceptance record
        const agreementRecord = {
          signedName: representativeName.trim(),
          representativePosition: representativePosition.trim(),
          signedAt: new Date().toISOString(),
          termsVersion: termsVersion || "v1.5-partner-2026",
          agreementStatus: "UNDER_REVIEW",
          ipAddress: ipAddress || "127.0.0.1",
          userAgent: userAgent || "Unknown Device",
          acceptedAt: new Date().toISOString(),
          agreementHash: hash,
          agreementSnapshot: agreementText,
          agreementNumber: agreementNumber || `AGR-${clinicId.substring(0, 8)}-2026`,
          watermark: "ACCEPTED BY CLINIC – PENDING ADMIN APPROVAL",
          checkboxes
        };

        onboarding.agreementDetails = agreementRecord;
        onboarding.agreementCompleted = true;
        if (!onboarding.agreementHistory) {
          onboarding.agreementHistory = [];
        }
        onboarding.agreementHistory.push(agreementRecord);

        // 4. Change clinic and onboarding status to UNDER_REVIEW
        const clinic = registeredClinics[clinicId];
        if (clinic) {
          clinic.status = 'UNDER_REVIEW';
        }
        onboarding.submittedForReviewAt = new Date().toISOString();

        // 5. Activate Step 6: Admin Review
        onboarding.currentStep = 6;

        // 6. Generate simulated PDF & Email to the clinic's registered email
        const emailBody = `Dear ${representativeName.trim()},\n\nWe have received the Partnership Agreement submitted on behalf of ${clinic?.name || "your clinic"}.\n\nApplication ID:\n${clinicId}\n\nAgreement number:\n${agreementRecord.agreementNumber}\n\nAgreement version:\n${agreementRecord.termsVersion}\n\nSubmitted at:\n${new Date().toLocaleString()}\n\nCurrent status:\nUnder Review\n\nA copy of the Agreement accepted by your clinic is attached to this email.\n\nThe attached Agreement is currently marked:\n"Accepted by Clinic – Pending Admin Approval."\n\nYour clinic account will only become active after UCSmile completes the review and issues the final approved Agreement.\n\nYou can monitor the application status through the Clinic Partner Portal.\n\nPlease do not reply to this email with patient medical records or confidential patient information.\n\nSincerely,\nUCTalent Labs`;

        sentEmails.push({
          id: `EML-${Date.now()}`,
          clinicId,
          to: clinicEmail || clinic?.contactEmail || "clinic@example.com",
          subject: `Partnership Agreement submitted – ${clinic?.name || "your clinic"}`,
          body: emailBody,
          sentAt: new Date().toISOString(),
          attachmentName: `Partnership_Agreement_${agreementRecord.agreementNumber}.pdf`,
          attachmentContent: agreementText,
          attachmentWatermark: "ACCEPTED BY CLINIC – PENDING ADMIN APPROVAL"
        });

        // 7. Send notification to admin (log entry)
        logs.unshift({
          id: `LOG-${Date.now()}`,
          action: `Partnership Agreement Submitted for Review (${clinic?.name || clinicId})`,
          updatedBy: 'Clinic Portal',
          updatedAt: new Date().toISOString(),
          previousValue: 'ONBOARDING_IN_PROGRESS',
          newValue: 'UNDER_REVIEW'
        });
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
    } catch (err: any) {
      console.error("Error during save onboarding step:", err);
      return res.status(500).json({
        error: `Internal Server Error during save step: ${err.message || err}`
      });
    }
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
