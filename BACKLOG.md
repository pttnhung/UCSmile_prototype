# UCSmile VIP Booking & Verification Gateway (Epic Backlog)

This document represents the master epic scope, complete with unified user stories, functional criteria, and acceptance frameworks deployed for the standalone **UCSmile Check-In System**.

---

## 🎯 Epic Overview

The **UCSmile Standalone VIP Booking & Verification System** decouples the core scheduler from the visual layout of the marketing home page. It establishes a dedicated `/booking` route allowing referral partners to distribute clean, direct landing pages to prospective patients. 

This system handles implicit referral attribution, bundles appointment structures into portable encrypted token sequences (QR passes), and interfaces directly with a secure, real-time-simulated coordinator verification gate (`/verify`) to track arrival statuses while keeping user configurations strictly in elegant English.

---

## 👥 Master User Stories

### User Story 1: The Referral Patient
> **As a** prospective dental tourism patient who received a booking link from a UCSmile partner,  
> **I want to** access a dedicated, clean, fast-loading booking form without scrolling through the main marketing page,  
> **So that** I can instantly configure my pre-arranged visit details, have my referral partner code securely linked behind the scenes, and download a verifiable booking pass containing an encrypted check-in check.

### User Story 2: The Clinic Coordinator
> **As a** physical dental clinic receptionist or care coordinator in Da Nang or Ho Chi Minh City,  
> **I want to** scan the patient’s booking pass QR code to open the secure verification panel, view their status, and confirm their arrival,  
> **So that** we can track arrivals and maintain accurate synchronized appointment histories securely and with instant local updates.

---

## 📋 Comprehensive Backlog Breakdown

### Feature Group A: Standalone `/booking` Route & Routing Protocol
* **Title:** Direct Portal Architecture & URL Param Tracking
* **Priority:** `CRITICAL`
* **Detailed Requirements:**
  * Define independent React routing interfaces so the `/booking` endpoint renders a standalone card structure framed in elegant display typography without rendering landing subsegments.
  * Extract URL referral matrices: supporting parameter codes `ref`, `referral`, and `referrer`.
  * Persist captured referral codes immediately inside browser-level `localStorage` (`ucsmile_referral_code`).
  * Ensure the referral tracking process runs implicitly—do *not* expose diagnostic fields, logs, or values to the patient on the ticket or layout. Keep it clean.

### Feature Group B: Dual-Portal Real-time Synchronization
* **Title:** Real-time Interlocked Status Engine
* **Priority:** `HIGH`
* **Detailed Requirements:**
  * Implement active appointment status mapping using keys linked to individual generated booking identifiers: `ucsmile_status_${bookingId}`.
  * Define status state variations: `confirmed` | `cancelled` | `checked_in`.
  * Support instant status reading dynamically within both user-facing passes and scanning devices.

### Feature Group C: The Secure Cancellation Guard
* **Title:** Patient Cancellation Modal & Pass Voiding Flow
* **Priority:** `HIGH`
* **Detailed Requirements:**
  * Expose an intuitive structural cancel trigger labeled "Cancel Appointment" instead of standard Vietnamese terminology.
  * Support animated confirm overlays powered by `motion/react` and layout constraints.
  * Update state keys to `cancelled` upon confirmation. Redundant check-ins must show appropriate warnings.

### Feature Group D: Coordinator Gate & Overrides (`/verify`)
* **Title:** Coordinator Handshake & Checked-In Workflow
* **Priority:** `HIGH`
* **Detailed Requirements:**
  * Create a secure validation routing interface reflecting status indicators.
  * Show red alert flags if client booking passes have been marked `cancelled`.
  * Provide action prompts to allow clinic operators to re-activate & register the patient directly from cancelled limits into active checked-in coordinates.

---

## 🛠️ Acceptance Criteria (English-Only Core)

1. **Parameter Interception:** 
   - Navigating to `/booking?ref=VIP_AGENT` sets `ucsmile_referral_code` to `VIP_AGENT` in storage. No indicator of `VIP_AGENT` is printed visible to the patient on UI screens.
2. **Cancellation Interlock:**
   - On clicking **Cancel Appointment** and confirming, the boarding pass status turns red, displaying a pulsating `Cancelled` tag.
   - Accessing `/verify?p=<TOKEN_HERE>` for that ID immediately displays `Invalid / Cancelled Pass` and blocks checking in unless overridden.
3. **Language Consistency:**
   - Every user-facing component, including warning popups, status tags, headers, tooltips, validation alerts, and input prompts on both platforms must remain 100% English. No hybrid localized banners.
