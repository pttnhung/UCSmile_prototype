import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// ==========================================
// CLIENT-SIDE MOCK DATABASE & ROUTER FALLBACK
// (Used exclusively on static hosting platforms like GitHub Pages)
// ==========================================

const initialClinics = [
  { id: 'C-01', name: 'East Meets West Dental (Da Nang)', location: 'Da Nang', status: 'Active' },
  { id: 'C-02', name: 'Rose Dental Clinic (Da Nang)', location: 'Da Nang', status: 'Active' },
  { id: 'C-03', name: 'Serenity International Dental (Da Nang)', location: 'Da Nang', status: 'Active' },
  { id: 'C-04', name: 'Amaris Dental Clinic', location: 'Da Nang', status: 'Active' },
  { id: 'C-05', name: 'Elite Dental Group (Ho Chi Minh)', location: 'Ho Chi Minh', status: 'Active' },
  { id: 'C-06', name: 'Worldwide Dental Specialists (Ho Chi Minh)', location: 'Ho Chi Minh', status: 'Active' },
  {
    id: 'C-ONB-01',
    name: 'SmileCare Da Nang Dental',
    contactPerson: 'Dr. Nguyen Duc',
    contactPhone: '+84905123999',
    contactEmail: 'admin@smilecare.vn',
    website: 'https://smilecare.vn',
    status: 'ONBOARDING_IN_PROGRESS',
    primaryBranchId: 'B-ONB-01',
    flaggedForReview: false,
    createdAt: '2026-06-28T10:00:00Z'
  },
  {
    id: 'C-ONB-02',
    name: 'Elite Oral Clinic Da Nang',
    contactPerson: 'Sophia Le',
    contactPhone: '+84905333555',
    contactEmail: 'sophia.le@eliteoral.com',
    website: 'https://eliteoral.com',
    status: 'PENDING_REVIEW',
    primaryBranchId: 'B-ONB-02',
    flaggedForReview: false,
    createdAt: '2026-06-29T11:30:00Z'
  }
];

const initialBranches = {
  'C-ONB-01': [{
    branchId: 'B-ONB-01',
    clinicId: 'C-ONB-01',
    branchName: 'SmileCare Da Nang Dental',
    city: 'Da Nang',
    address: '120 Bach Dang, Hai Chau, Da Nang',
    isPrimary: true
  }],
  'C-ONB-02': [{
    branchId: 'B-ONB-02',
    clinicId: 'C-ONB-02',
    branchName: 'Elite Oral Clinic Da Nang',
    city: 'Da Nang',
    address: '45 Nguyen Van Linh, Da Nang',
    isPrimary: true
  }]
};

const initialAdmins = {
  'admin@smilecare.vn': {
    id: 'A-ONB-01',
    clinicId: 'C-ONB-01',
    fullName: 'Dr. Nguyen Duc',
    email: 'admin@smilecare.vn',
    phone: '+84905123999',
    password: 'password123',
    createdAt: '2026-06-28T10:00:00Z'
  },
  'sophia.le@eliteoral.com': {
    id: 'A-ONB-02',
    clinicId: 'C-ONB-02',
    fullName: 'Sophia Le',
    email: 'sophia.le@eliteoral.com',
    phone: '+84905333555',
    password: 'password123',
    createdAt: '2026-06-29T11:30:00Z'
  }
};

const initialOnboardings = {
  'C-ONB-01': {
    clinicId: 'C-ONB-01',
    currentStep: 2,
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
  },
  'C-ONB-02': {
    clinicId: 'C-ONB-02',
    currentStep: 5,
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
    }
  }
};

const initialBookings = {
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
  }
};

const initialReferrers = [
  {
    fullName: 'Nhung Phan',
    email: 'nhung.phan230206@vnuk.edu.vn',
    phone: '+84935100111',
    bankName: 'Vietcombank',
    accountNumber: '1012345678',
    referrerCode: 'AMIRAH05',
    status: 'Active',
    membershipLevel: 'Advisor',
    createdAt: '2026-06-12T08:00:00Z',
    upgradeRequested: true,
    notes: 'Requested upgrade to Consultant level'
  }
];

const initialSupportRequests = [
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
  }
];

const initialLogs = [
  {
    id: 'LOG-001',
    action: 'System Seeding Completed',
    updatedBy: 'System',
    updatedAt: new Date().toISOString(),
    previousValue: 'None',
    newValue: 'System Seeding Completed'
  }
];

function getLocalStorageData(key: string, initialValue: any) {
  const saved = localStorage.getItem(key);
  if (!saved) {
    localStorage.setItem(key, JSON.stringify(initialValue));
    return initialValue;
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    return initialValue;
  }
}

function setLocalStorageData(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

const getDB = () => {
  const clinics = getLocalStorageData('ucsmile_clinics', initialClinics);
  const branches = getLocalStorageData('ucsmile_branches', initialBranches);
  const onboardings = getLocalStorageData('ucsmile_onboardings', initialOnboardings);
  const admins = getLocalStorageData('ucsmile_admins', initialAdmins);
  const bookings = getLocalStorageData('ucsmile_bookings', initialBookings);
  const referrers = getLocalStorageData('ucsmile_referrers', initialReferrers);
  const supportRequests = getLocalStorageData('ucsmile_supportRequests', initialSupportRequests);
  const logs = getLocalStorageData('ucsmile_logs', initialLogs);
  return { clinics, branches, onboardings, admins, bookings, referrers, supportRequests, logs };
};

const saveDB = (db: any) => {
  setLocalStorageData('ucsmile_clinics', db.clinics);
  setLocalStorageData('ucsmile_branches', db.branches);
  setLocalStorageData('ucsmile_onboardings', db.onboardings);
  setLocalStorageData('ucsmile_admins', db.admins);
  setLocalStorageData('ucsmile_bookings', db.bookings);
  setLocalStorageData('ucsmile_referrers', db.referrers);
  setLocalStorageData('ucsmile_supportRequests', db.supportRequests);
  setLocalStorageData('ucsmile_logs', db.logs);
};

// Client-Side Simulated API Router
function handleClientSideMockApi(url: string, init?: RequestInit): Response {
  const method = (init?.method || 'GET').toUpperCase();
  const bodyData = init?.body ? JSON.parse(init.body as string) : {};
  
  // Normalize path
  const urlObj = new URL(url, window.location.origin);
  const pathName = urlObj.pathname;

  console.log(`[Mock API] Intercepted ${method} ${pathName}`, bodyData);

  // 1. POST /api/clinic/register
  if (pathName === '/api/clinic/register' && method === 'POST') {
    const db = getDB();
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
    } = bodyData;

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
      return new Response(JSON.stringify({ error: "Missing required fields. Please fill in all required inputs." }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const formattedAdminEmail = adminEmail.trim().toLowerCase();
    if (db.admins[formattedAdminEmail]) {
      return new Response(JSON.stringify({
        error: "This admin email is already registered. Please log in to your account or register with another email."
      }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let flaggedForReview = false;
    let duplicateFlagReason = "";

    const nameExists = db.clinics.some(
      (c: any) => c.name?.toLowerCase().trim() === clinicName.toLowerCase().trim()
    );

    let addressExists = false;
    for (const cid in db.branches) {
      const branches = db.branches[cid];
      if (Array.isArray(branches)) {
        if (branches.some((b: any) => b.address?.toLowerCase().trim() === clinicAddress.toLowerCase().trim() && b.isPrimary)) {
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

    const clinicId = `C-REG-${Date.now()}`;
    const branchId = `B-REG-${Date.now()}`;
    const adminId = `A-REG-${Date.now()}`;

    const clinicRecord = {
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

    const branchRecord = {
      branchId,
      clinicId,
      branchName: primaryBranchName.trim(),
      city: city.trim(),
      address: clinicAddress.trim(),
      isPrimary: true
    };

    const adminRecord = {
      id: adminId,
      clinicId,
      fullName: adminFullName.trim(),
      email: formattedAdminEmail,
      phone: contactPhoneNumber.trim(),
      password: password,
      createdAt: new Date().toISOString()
    };

    const onboardingRecord = {
      clinicId,
      currentStep: 1,
      profileSetupCompleted: false,
      servicesCompleted: false,
      workingHoursCompleted: false,
      additionalInfoCompleted: false,
      agreementCompleted: false
    };

    db.clinics.push(clinicRecord);
    db.branches[clinicId] = [branchRecord];
    db.admins[formattedAdminEmail] = adminRecord;
    db.onboardings[clinicId] = onboardingRecord;

    db.logs.unshift({
      id: `LOG-${Date.now()}`,
      action: `New Clinic Registered (${clinicName})`,
      updatedBy: 'Self Register',
      updatedAt: new Date().toISOString(),
      previousValue: 'None',
      newValue: flaggedForReview ? `Registered & Flagged: ${duplicateFlagReason}` : 'Registered Successfully'
    });

    saveDB(db);

    return new Response(JSON.stringify({
      success: true,
      message: "Your clinic registration has been created successfully.",
      clinic: clinicRecord,
      admin: {
        id: adminRecord.id,
        clinicId: adminRecord.clinicId,
        fullName: adminRecord.fullName,
        email: adminRecord.email,
        phone: adminRecord.phone
      },
      onboarding: onboardingRecord
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 2. POST /api/clinic/login
  if (pathName === '/api/clinic/login' && method === 'POST') {
    const db = getDB();
    const { email, password } = bodyData;
    const formattedEmail = (email || '').trim().toLowerCase();

    const admin = db.admins[formattedEmail];
    if (!admin || admin.password !== password) {
      return new Response(JSON.stringify({ error: "Invalid email or password." }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const clinic = db.clinics.find((c: any) => c.id === admin.clinicId);
    const onboarding = db.onboardings[admin.clinicId] || {
      clinicId: admin.clinicId,
      currentStep: 1,
      profileSetupCompleted: false,
      servicesCompleted: false,
      workingHoursCompleted: false,
      additionalInfoCompleted: false,
      agreementCompleted: false
    };

    let redirect = 'onboarding';
    if (clinic) {
      if (clinic.status === 'PENDING_REVIEW') {
        redirect = 'pending';
      } else if (clinic.status === 'Active') {
        redirect = 'portal';
      }
    }

    return new Response(JSON.stringify({
      success: true,
      redirect,
      admin: {
        id: admin.id,
        clinicId: admin.clinicId,
        fullName: admin.fullName,
        email: admin.email,
        phone: admin.phone
      },
      clinic,
      onboarding
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 3. GET /api/clinic/onboarding/:clinicId
  const onboardingMatch = pathName.match(/^\/api\/clinic\/onboarding\/([^/]+)$/);
  if (onboardingMatch && method === 'GET') {
    const clinicId = onboardingMatch[1];
    const db = getDB();

    const onboarding = db.onboardings[clinicId];
    const clinic = db.clinics.find((c: any) => c.id === clinicId);

    if (!onboarding) {
      return new Response(JSON.stringify({ error: "Onboarding record not found." }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      onboarding,
      clinic
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 4. POST /api/clinic/onboarding/:clinicId/step
  const stepMatch = pathName.match(/^\/api\/clinic\/onboarding\/([^/]+)\/step$/);
  if (stepMatch && method === 'POST') {
    const clinicId = stepMatch[1];
    const { step, data } = bodyData;
    const db = getDB();

    const onboarding = db.onboardings[clinicId];
    if (!onboarding) {
      return new Response(JSON.stringify({ error: "Onboarding record not found." }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (step === 1) {
      const { isDraft, ...profileData } = data;
      onboarding.profileDetails = profileData;
      if (!isDraft) {
        onboarding.profileSetupCompleted = true;
        if (onboarding.currentStep <= 1) {
          onboarding.currentStep = 2;
        }
      }
    } else if (step === 2) {
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
      onboarding.workingHours = data;
      onboarding.workingHoursCompleted = true;
      if (onboarding.currentStep <= 3) {
        onboarding.currentStep = 4;
      }
    } else if (step === 4) {
      const { branches, dentists, documents } = data;
      onboarding.additionalInfo = { branches, dentists, documents };
      onboarding.additionalInfoCompleted = true;
      if (onboarding.currentStep <= 4) {
        onboarding.currentStep = 5;
      }
      
      if (Array.isArray(branches)) {
        const existing = db.branches[clinicId] || [];
        const primary = existing.find((b: any) => b.isPrimary);
        const updatedBranches: any[] = [];
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
        db.branches[clinicId] = updatedBranches;
      }
    } else if (step === 5) {
      const { signedName, termsVersion, agreementStatus, ipAddress, userAgent } = data;
      const agreementRecord = {
        signedName: signedName || "Authorized Representative",
        signedAt: new Date().toISOString(),
        termsVersion: termsVersion || "v1.4-partner-2026",
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
      const clinic = db.clinics.find((c: any) => c.id === clinicId);
      if (clinic) {
        clinic.status = 'PENDING_REVIEW';
      }
      onboarding.submittedForReviewAt = new Date().toISOString();
      onboarding.currentStep = 6;

      db.logs.unshift({
        id: `LOG-${Date.now()}`,
        action: `Clinic Onboarding Submitted for Review (${clinic?.name || clinicId})`,
        updatedBy: 'Clinic Admin',
        updatedAt: new Date().toISOString(),
        previousValue: 'ONBOARDING_IN_PROGRESS',
        newValue: 'PENDING_REVIEW'
      });
    }

    db.onboardings[clinicId] = onboarding;
    saveDB(db);

    const finalClinic = db.clinics.find((c: any) => c.id === clinicId);

    return new Response(JSON.stringify({
      success: true,
      onboarding,
      clinic: finalClinic
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 5. POST /api/clinic/restore
  if (pathName === '/api/clinic/restore' && method === 'POST') {
    const { clinicId, adminEmail } = bodyData;
    const db = getDB();

    const formattedEmail = (adminEmail || '').trim().toLowerCase();
    const admin = db.admins[formattedEmail];
    const clinic = db.clinics.find((c: any) => c.id === clinicId);
    const onboarding = db.onboardings[clinicId];

    return new Response(JSON.stringify({
      success: true,
      clinic,
      admin: admin ? {
        id: admin.id,
        clinicId: admin.clinicId,
        fullName: admin.fullName,
        email: admin.email,
        phone: admin.phone
      } : null,
      onboarding
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 6. POST /api/admin/login
  if (pathName === '/api/admin/login' && method === 'POST') {
    const { email, password } = bodyData;
    if (email === 'admin@ucsmile.com' && password === 'admin123') {
      return new Response(JSON.stringify({
        success: true,
        token: "Bearer ucs-admin-token-123456",
        email: "admin@ucsmile.com"
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ error: "Invalid admin credentials." }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // 7. GET /api/admin/onboardings
  if (pathName === '/api/admin/onboardings' && method === 'GET') {
    const db = getDB();
    const onboardingClinics = db.clinics.filter((c: any) => c.status === 'ONBOARDING_IN_PROGRESS' || c.status === 'PENDING_REVIEW' || c.id.startsWith('C-ONB-'));

    const onboardingsList = onboardingClinics.map((clinic: any) => {
      return {
        clinic,
        onboarding: db.onboardings[clinic.id] || {
          clinicId: clinic.id,
          currentStep: 1,
          profileSetupCompleted: false,
          servicesCompleted: false,
          workingHoursCompleted: false,
          agreementCompleted: false
        },
        branches: db.branches[clinic.id] || []
      };
    });

    return new Response(JSON.stringify(onboardingsList), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 8. GET /api/admin/dashboard
  if (pathName === '/api/admin/dashboard' && method === 'GET') {
    const db = getDB();

    const totalBookings = Object.keys(db.bookings).length;
    const requestedBookings = Object.values(db.bookings).filter((b: any) => b.status === "BOOKING_REQUESTED").length;
    const confirmedBookings = Object.values(db.bookings).filter((b: any) => b.status === "CONFIRMED").length;
    const checkedInBookings = Object.values(db.bookings).filter((b: any) => b.status === "CHECKED-IN").length;
    const cancelledBookings = Object.values(db.bookings).filter((b: any) => b.status === "CANCELLED").length;

    const totalReferrals = Object.values(db.bookings).filter((b: any) => !!b.referralCode).length;
    const activeReferrers = db.referrers.filter((r: any) => r.status === "Active").length;
    const consultantReferrers = db.referrers.filter((r: any) => r.membershipLevel === "Consultant").length;
    const pendingSupportRequests = db.supportRequests.filter((s: any) => s.status === "Pending").length;

    return new Response(JSON.stringify({
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
      bookings: Object.values(db.bookings),
      referrers: db.referrers,
      supportRequests: db.supportRequests,
      clinics: db.clinics,
      logs: db.logs
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 9. POST /api/admin/clinics/:id/review
  const reviewMatch = pathName.match(/^\/api\/admin\/clinics\/([^/]+)\/review$/);
  if (reviewMatch && method === 'POST') {
    const clinicId = reviewMatch[1];
    const { action, adminEmail } = bodyData;
    const db = getDB();

    const clinic = db.clinics.find((c: any) => c.id === clinicId);
    if (!clinic) {
      return new Response(JSON.stringify({ error: "Clinic record not found." }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const oldStatus = clinic.status;
    if (action === 'approve') {
      clinic.status = 'Active';
    } else if (action === 'reject') {
      clinic.status = 'ONBOARDING_IN_PROGRESS';
    }

    db.logs.unshift({
      id: `LOG-${Date.now()}`,
      action: `Onboarding Review: ${action === 'approve' ? 'Approved' : 'Rejected'} (${clinic.name})`,
      updatedBy: adminEmail || 'Admin',
      updatedAt: new Date().toISOString(),
      previousValue: oldStatus,
      newValue: clinic.status
    });

    saveDB(db);

    return new Response(JSON.stringify({ success: true, clinics: db.clinics }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 10. POST /api/admin/clinics/:id/status
  const statusMatch = pathName.match(/^\/api\/admin\/clinics\/([^/]+)\/status$/);
  if (statusMatch && method === 'POST') {
    const clinicId = statusMatch[1];
    const { status, adminEmail } = bodyData;
    const db = getDB();

    const clinic = db.clinics.find((c: any) => c.id === clinicId);
    if (!clinic) {
      return new Response(JSON.stringify({ error: "Clinic record not found." }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const oldStatus = clinic.status;
    clinic.status = status;

    db.logs.unshift({
      id: `LOG-${Date.now()}`,
      action: `Clinic Status Changed (${clinic.name})`,
      updatedBy: adminEmail || 'Admin',
      updatedAt: new Date().toISOString(),
      previousValue: oldStatus,
      newValue: status
    });

    saveDB(db);

    return new Response(JSON.stringify({ success: true, clinics: db.clinics }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 11. POST /api/admin/sync-booking
  if (pathName === '/api/admin/sync-booking' && method === 'POST') {
    const { booking } = bodyData;
    const db = getDB();
    if (booking && booking.bookingId) {
      db.bookings[booking.bookingId] = {
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
        serviceQuantities: booking.serviceQuantities || {},
        status: booking.status || 'BOOKING_REQUESTED',
        created_by: booking.created_by || 'Patient',
        referralCode: booking.referralCode || '',
        referrerName: booking.referrerName || '',
        referralStatus: booking.referralStatus || 'PENDING',
        internalNotes: booking.internalNotes || '',
        created_at: booking.created_at || new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        commissionStatus: booking.commissionStatus || 'Pending'
      };
      saveDB(db);
    }
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 12. POST /api/admin/bookings/:id/status
  const bookingStatusMatch = pathName.match(/^\/api\/admin\/bookings\/([^/]+)\/status$/);
  if (bookingStatusMatch && method === 'POST') {
    const bookingId = bookingStatusMatch[1];
    const { status, adminEmail, confirmedHour, internalNotes } = bodyData;
    const db = getDB();

    const booking = db.bookings[bookingId];
    if (booking) {
      const oldStatus = booking.status;
      booking.status = status;
      if (confirmedHour !== undefined) booking.confirmedHour = confirmedHour;
      if (internalNotes !== undefined) booking.internalNotes = internalNotes;
      booking.lastUpdated = new Date().toISOString();

      db.logs.unshift({
        id: `LOG-${Date.now()}`,
        action: `Booking Status Update (${bookingId})`,
        updatedBy: adminEmail || 'Admin',
        updatedAt: new Date().toISOString(),
        previousValue: oldStatus,
        newValue: status
      });
      saveDB(db);
    }
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 13. POST /api/admin/bookings/:id/commission
  const bookingCommMatch = pathName.match(/^\/api\/admin\/bookings\/([^/]+)\/commission$/);
  if (bookingCommMatch && method === 'POST') {
    const bookingId = bookingCommMatch[1];
    const { status, adminEmail } = bodyData;
    const db = getDB();

    const booking = db.bookings[bookingId];
    if (booking) {
      const oldComm = booking.commissionStatus;
      booking.commissionStatus = status;
      booking.lastUpdated = new Date().toISOString();

      db.logs.unshift({
        id: `LOG-${Date.now()}`,
        action: `Commission Status Update (${bookingId})`,
        updatedBy: adminEmail || 'Admin',
        updatedAt: new Date().toISOString(),
        previousValue: oldComm,
        newValue: status
      });
      saveDB(db);
    }
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 14. POST /api/admin/referrers/:code/status
  const refStatusMatch = pathName.match(/^\/api\/admin\/referrers\/([^/]+)\/status$/);
  if (refStatusMatch && method === 'POST') {
    const referrerCode = refStatusMatch[1];
    const { status, adminEmail } = bodyData;
    const db = getDB();

    const referrer = db.referrers.find((r: any) => r.referrerCode === referrerCode);
    if (referrer) {
      const oldStatus = referrer.status;
      referrer.status = status;

      db.logs.unshift({
        id: `LOG-${Date.now()}`,
        action: `Referrer Status Update (${referrerCode})`,
        updatedBy: adminEmail || 'Admin',
        updatedAt: new Date().toISOString(),
        previousValue: oldStatus,
        newValue: status
      });
      saveDB(db);
    }
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 15. POST /api/admin/referrers/:code/level
  const refLevelMatch = pathName.match(/^\/api\/admin\/referrers\/([^/]+)\/level$/);
  if (refLevelMatch && method === 'POST') {
    const referrerCode = refLevelMatch[1];
    const { level, adminEmail } = bodyData;
    const db = getDB();

    const referrer = db.referrers.find((r: any) => r.referrerCode === referrerCode);
    if (referrer) {
      const oldLevel = referrer.membershipLevel;
      referrer.membershipLevel = level;
      referrer.upgradeRequested = false;

      db.logs.unshift({
        id: `LOG-${Date.now()}`,
        action: `Referrer Membership Upgrade Approved (${referrerCode})`,
        updatedBy: adminEmail || 'Admin',
        updatedAt: new Date().toISOString(),
        previousValue: oldLevel,
        newValue: level
      });
      saveDB(db);
    }
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 15.5 POST /api/admin/referrers/:code/reject-upgrade
  const refRejectUpgradeMatch = pathName.match(/^\/api\/admin\/referrers\/([^/]+)\/reject-upgrade$/);
  if (refRejectUpgradeMatch && method === 'POST') {
    const referrerCode = refRejectUpgradeMatch[1];
    const { adminEmail } = bodyData;
    const db = getDB();

    const referrer = db.referrers.find((r: any) => r.referrerCode === referrerCode);
    if (referrer) {
      referrer.upgradeRequested = false;

      db.logs.unshift({
        id: `LOG-${Date.now()}`,
        action: `Consultant Upgrade Request Rejected (${referrerCode})`,
        updatedBy: adminEmail || 'Admin',
        updatedAt: new Date().toISOString(),
        previousValue: 'Pending Review',
        newValue: 'Standard (Rejected Upgrade)'
      });
      saveDB(db);
    }
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 16. POST /api/admin/support/:id/status
  const supStatusMatch = pathName.match(/^\/api\/admin\/support\/([^/]+)\/status$/);
  if (supStatusMatch && method === 'POST') {
    const requestId = supStatusMatch[1];
    const { status, adminEmail } = bodyData;
    const db = getDB();

    const reqObj = db.supportRequests.find((s: any) => s.id === requestId);
    if (reqObj) {
      const oldStatus = reqObj.status;
      reqObj.status = status;

      db.logs.unshift({
        id: `LOG-${Date.now()}`,
        action: `Support Request Resolved (${requestId})`,
        updatedBy: adminEmail || 'Admin',
        updatedAt: new Date().toISOString(),
        previousValue: oldStatus,
        newValue: status
      });
      saveDB(db);
    }
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 17. POST /api/support/new
  if (pathName === '/api/support/new' && method === 'POST') {
    const { submittedBy, relatedBookingCode, requestType, message } = bodyData;
    const db = getDB();

    const newReq = {
      id: `SR-${1001 + db.supportRequests.length}`,
      submittedBy: submittedBy || 'Guest',
      relatedBookingCode: relatedBookingCode || 'N/A',
      requestType: requestType || 'Inquiry',
      message,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    db.supportRequests.push(newReq);
    db.logs.unshift({
      id: `LOG-${Date.now()}`,
      action: `New Support Request Created (${newReq.id})`,
      updatedBy: submittedBy || 'Guest',
      updatedAt: new Date().toISOString(),
      previousValue: 'None',
      newValue: 'Pending'
    });

    saveDB(db);

    return new Response(JSON.stringify({ success: true, request: newReq }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Default 404 response for other paths
  return new Response(JSON.stringify({ error: `Mock Route Not Found: ${method} ${pathName}` }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' }
  });
}

// Global API Fetch Interceptor - Only active on static hosting platforms like GitHub Pages
const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
const isCloudRun = hostname.endsWith('.run.app');

if (!isLocal && !isCloudRun) {
  const originalFetch = window.fetch;
  const customFetch = async function (input: RequestInfo | URL, init?: RequestInit) {
    let url = '';
    if (typeof input === 'string') {
      url = input;
    } else if (input instanceof URL) {
      url = input.toString();
    } else if (input && typeof input === 'object' && 'url' in input) {
      url = (input as any).url;
    }

    if (url.startsWith('/api/')) {
      return handleClientSideMockApi(url, init);
    }

    if (typeof input === 'string') {
      return originalFetch(url, init);
    } else if (input instanceof URL) {
      return originalFetch(new URL(url), init);
    } else {
      const newRequest = new Request(url, input as RequestInit);
      return originalFetch(newRequest, init);
    }
  };

  try {
    window.fetch = customFetch;
  } catch (e) {
    console.warn("Could not override window.fetch directly, trying Object.defineProperty:", e);
    try {
      Object.defineProperty(window, 'fetch', {
        value: customFetch,
        writable: true,
        configurable: true
      });
    } catch (err) {
      console.error("Failed to mock fetch:", err);
    }
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
