# User Authentication System Requirements

## Overview
Implementation of a role-based authentication system for the food donation platform with three distinct user types and an approval workflow.

## User Roles

### 1. SUPERADMIN
- **Quantity**: Single admin account for the entire application
- **Creation**: Created at developer end (not through UI)
- **Permissions**: 
  - View and manage all users
  - Approve/reject DONOR and RECEIVER registrations
  - Block/enable existing DONOR and RECEIVER accounts
  - Handle password reset requests from users
  - Approve phone number change requests
  - Full system access and control

### 2. DONOR
- **Registration**: Self-registration available to public
- **Purpose**: Users who want to donate food
- **Status Flow**: Registration → Pending → Admin Approval → Active

### 3. RECEIVER
- **Registration**: Self-registration available to public  
- **Purpose**: Users who need food (NGOs/organizations from existing registration system)
- **Status Flow**: Registration → Pending → Admin Approval → Active
- **Integration**: Same as existing NGO registration system

## Application Access & UI/UX Flow

### Public Access
- **Anyone can access the application** without authentication
- **Current frontend state** remains visible to all visitors
- **Anonymous browsing** of all existing pages (About, Contact, Reviews, etc.)

### Authentication UI Elements
- **Profile Icon**: Located beside 'Contact Us' on the right side of navigation
- **Login Modal**: Profile icon opens a modal with login functionality
  - **Login Fields**: Email ID and Password
  - **Registration Link**: Option to switch from login to registration modal
- **Unified Login**: Single login form for all user types (SUPERADMIN, DONOR, RECEIVER)
  - Backend determines user role after successful authentication
  - No role selection during login process
- **Pending Approval State**: Users with pending registration see "Pending Approval" message upon login attempt
- **Role-Based Navigation**: Navigation menu changes based on authenticated user role
  - **SUPERADMIN**: Dashboard, Donors, Receivers, Donation Sessions
  - **DONOR**: Dashboard, Make Donation, My Donations
  - **RECEIVER**: Dashboard, Food Requests, Received Donations
  - **Public (Unauthenticated)**: Home, About, Donation, Register Your NGO, What People Say, Initiative, Contact Us
- **Logo Click Behavior**: Logo redirects to appropriate dashboard when logged in, otherwise to home page

### Registration Entry Points
- **Donation Page**: Contains "Apply for Donor" button for anonymous users
- **Profile Icon Modal**: Login modal includes registration link for DONOR registration
- **Both Entry Points**: Lead to the same DONOR registration modal/page
- **RECEIVER Registration**: Integrated with existing NGO registration system

## User Management & Profile System

### Account Status Management
- **SUPERADMIN Control**: Can block/enable existing DONOR and RECEIVER accounts
- **Status Types**: Active, Blocked, Pending, Rejected
- **Account Actions**: Block prevents login, Enable restores access

### Profile Management Rules
- **Editable Fields**: Most profile information can be updated after approval
- **Restricted Fields**: 
  - Aadhaar card information (cannot be changed)
  - Email ID (cannot be changed)
- **Phone Number**: Can be changed but requires SUPERADMIN approval (no documentation needed)
- **Dedicated Profile Tabs**: Separate sections for DONOR and RECEIVER users
- **Password Management**: Users can change passwords in their profile section
- **Session Management**: Users remain logged in until manual logout (no automatic timeout)

### Password Reset Workflow
- **Forgot Password**: Available from login page
- **Process**: Sends request to SUPERADMIN (not automated)
- **SUPERADMIN Action**: Manually handles password reset requests
- **Use Case**: When users forget passwords and cannot access accounts

## Notification System

### Email Notifications
- **Email Service**: Nodemailer + Gmail SMTP (free tier - 500 emails/day)
- **Implementation**: To be developed later in the project

#### Email Scenarios
1. **Account Creation Emails**:
   - **Trigger**: After SUPERADMIN approves user registration
   - **Recipients**: DONOR/RECEIVER email addresses
   - **Content**: Welcome message, account activation confirmation, user role, next steps

2. **Donation Session Progress Emails**:
   - **Trigger**: When donation session status changes to "ACTIVE"
   - **Recipients**: Both DONOR and RECEIVER involved in the session
   - **Content**: Session details, unique donation session ID, contact information
   - **Templates**: Different perspectives for DONOR vs RECEIVER

3. **Account Status Change Emails**:
   - **Trigger**: When SUPERADMIN blocks/enables user accounts
   - **Recipients**: Affected user's email address
   - **Content**: Account status notification, reason (optional), contact information

#### Email Templates Required
- **Welcome Email** (Account approved)
- **Session Started Email** (For DONOR)
- **Session Started Email** (For RECEIVER)
- **Account Blocked Email**
- **Account Enabled Email**

#### SMTP Configuration
- **SMTP Host**: smtp.gmail.com
- **SMTP Port**: 587
- **Authentication**: Gmail App Password (requires 2FA)
- **Security**: Environment variables for credentials storage
- **Rate Limiting**: ~100 emails/hour recommended

## Donation Session System

### Map Integration & Location-Based Matching
- **Map Service**: Google Maps API (free tier for low traffic)
- **Distance Display**: Kilometers for distances ≥1km, meters for distances <1km
- **Distance-Based Matching**: RECEIVERs displayed to DONORs based on nearest distance
- **Location Services**: Both DONOR and RECEIVER profiles include location information

### Donation Session Concept
- **Definition**: A donation session is a singular entity representing one complete donation transaction
- **Participants**: Each session connects one DONOR with one RECEIVER
- **Unique Session ID**: System generates unique identifier for each donation session
- **Session Tracking**: Donation session ID enables tracking and reference of specific donations

### Historical Data & Analytics

#### DONOR Dashboard
- **Personal History**: View all donations made since account creation
- **Session Overview**: Access to all donation sessions initiated by the DONOR
- **Session Details**: Complete information about each donation transaction

#### RECEIVER Dashboard  
- **Received Donations**: View all donations received since account creation
- **Session History**: Access to all donation sessions received by the RECEIVER
- **Donation Analytics**: Historical data and trends of received donations

#### SUPERADMIN Dashboard
- **Navigation**: Dedicated pages for Dashboard, Donors, Receivers, and Donation Sessions
- **Dashboard Page** (`/admin`): 
  - Complete overview of all users (DONORs, RECEIVERs)
  - User approval/rejection functionality
  - Account control (block/enable users)
- **Donors Page** (`/admin/donors`):
  - List of all DONOR users with status
  - Filter and search functionality
  - Quick access to donor details
- **Receivers Page** (`/admin/receivers`):
  - List of all RECEIVER users with status
  - Filter and search functionality
  - Quick access to receiver details
- **Donation Sessions Page** (`/admin/donation-sessions`):
  - Complete list of all donation sessions
  - Session status tracking
  - DONOR-RECEIVER relationship view
  - Session search by unique ID
- **Data Retention**: Historical donation session data retained permanently

### Donation Session Data Structure
- **Session ID**: Unique identifier for tracking
- **DONOR Information**: Complete donor details and profile
- **RECEIVER Information**: Complete receiver details and profile  
- **Transaction Details**: Donation specifics, timing, status
- **Location Data**: Geographic information for both parties
- **Session Status**: Current state of the donation process
  - **PENDING**: Session created, awaiting confirmation
  - **ACTIVE**: Session confirmed and in progress
  - **COMPLETED**: Donation successfully completed
  - **CANCELLED**: Session terminated before completion

## Authentication Method

### Simple Authentication
- **Method**: Email ID and Password
- **No OAuth**: Simple email/password authentication only
- **Security**: Standard password hashing and session management

## Registration & Approval Workflow

### DONOR Registration Process (Multiple Entry Points)
1. **Via Donation Page**:
   - Anonymous user visits Donation page
   - User clicks "Apply for Donor" button
   - User redirected to DONOR registration page
2. **Via Profile Icon**:
   - User clicks profile icon → login modal opens
   - User clicks registration link in login modal
   - Same DONOR registration modal/page opens
3. **Registration Completion**:
   - User fills basic details form
   - Account created with role "DONOR" in "PENDING" status
   - User receives confirmation of registration submission

### RECEIVER Registration Process
1. **Integration with Existing NGO System**: Uses current NGO registration flow
2. **Registration Form**: Existing NGO registration form
3. **Account Creation**: Creates user account with role "RECEIVER" in "PENDING" status
4. **Approval Process**: Same workflow as DONOR approval

### General Registration Process
1. User accesses registration page (DONOR or RECEIVER)
2. User fills registration form with basic details
3. Account created in "PENDING" status with selected role
4. User receives confirmation of registration submission

### Admin Approval Process
1. SUPERADMIN views pending registrations in admin dashboard
2. SUPERADMIN reviews user details and application
3. SUPERADMIN approves or rejects registration
4. User status updated to "APPROVED" or "REJECTED"
5. User receives notification of decision

## Technical Implementation Areas

### Database Schema Changes
- **User authentication tables**
- **Role enumeration** (SUPERADMIN, DONOR, RECEIVER)
- **User status tracking** (PENDING, APPROVED, REJECTED, BLOCKED)
- **Session management**
- **Approval audit trail**
- **Location data storage** for map integration
- **Donation session tables** with unique session IDs
- **DONOR-RECEIVER relationship tracking**
- **Historical donation data storage**

### Frontend Components
- **Profile Icon**: Added to navbar beside 'Contact Us'
- **Login Modal**: Modal component triggered by profile icon
  - Login fields (Email ID, Password)
  - Registration link to switch to registration modal
  - "Forgot Password" link (sends request to SUPERADMIN)
- **Registration Modal**: Can be accessed from login modal or donation page
- **Unified Login Form**: Single form handling all user types
- **Role-Based Navigation** (✓ Implemented):
  - Dynamic navbar links based on user authentication and role
  - Logo redirects to appropriate dashboard when logged in
  - Separate navigation menus for SUPERADMIN, DONOR, RECEIVER, and public users
- **Registration Pages**: Separate pages for DONOR and RECEIVER registration
- **"Apply for Donor" Button**: Added to Donation page for anonymous users
- **Map Integration**: Location-based RECEIVER discovery for DONORs
- **Admin Dashboard Pages** (✓ Implemented):
  - **Main Dashboard** (`/admin`): User management, approvals, and account control
  - **Donors Page** (`/admin/donors`): Complete list of all DONOR users
  - **Receivers Page** (`/admin/receivers`): Complete list of all RECEIVER users
  - **Donation Sessions Page** (`/admin/donation-sessions`): Session tracking and management
- **Role-specific Dashboards**: Different interfaces post-login
  - **DONOR Dashboard**: Personal donation history and session tracking
  - **RECEIVER Dashboard**: Received donations history and analytics
- **Profile Management Tabs**: Dedicated sections for DONOR and RECEIVER users
  - Profile editing (with field restrictions)
  - Password change functionality
  - Phone number change requests
- **Donation Session Components**: 
  - Session creation and management
  - Session history views
  - Session tracking by unique ID
- **Pending Approval Status Pages**: User feedback during approval process
- **Notification System**: For approval/rejection communications (email later)

### Backend API Routes
- **Authentication endpoints**: login, register, logout
- **User management endpoints**: CRUD operations for users
- **Account control endpoints**: block/enable user accounts
- **Profile management**: update profile, password change, phone number requests
- **Password reset requests**: forgot password workflow
- **Role-based route protection**: middleware for access control
- **Approval workflow endpoints**: admin approval/rejection actions
- **Email service endpoints**: 
  - Send welcome emails after approval
  - Send session notification emails
  - Send account status change emails
- **Map/Location services**: location-based RECEIVER discovery
- **Donation session endpoints**: 
  - Create, read, update donation sessions
  - Generate unique session IDs
  - Session tracking and search functionality
- **Historical data endpoints**: 
  - DONOR donation history
  - RECEIVER received donations history
  - SUPERADMIN comprehensive analytics

### Security Considerations
- **Route protection** based on user roles
- **Admin-only access** areas
- **Session management** and security
- **Input validation** and sanitization
- **Email security**: 
  - Environment variables for SMTP credentials
  - Gmail App Password authentication (requires 2FA)
  - Rate limiting to prevent email abuse
  - Secure email template rendering

## Open Questions

1. **Distance Radius**: What maximum distance should be considered for showing nearby RECEIVERs? 
   - *Example: Should DONORs see RECEIVERs within 5km, 10km, 25km radius? Should this be user-configurable?*
   - *Example: If a DONOR is in downtown area, should they see RECEIVERs in suburbs 20km away, or only nearby ones within 2-3km?*
2. **Profile Field Validation**: What validation rules should apply to profile updates? *(To be discussed later)*
3. **Additional Admin Tools**: Should we add any other monitoring capabilities beyond user management and session tracking as requirements arise?
4. **Gmail Account Setup**: Should we create a dedicated Gmail account for the application or use an existing one?
5. **Email Template Design**: What should be the visual design and branding for email templates?
6. **Email Delivery Monitoring**: Should we implement email delivery tracking and failure handling?

## Current Codebase Integration

### Existing Components to Modify
- `/src/components/Navbar.tsx` (✓ Updated) - Role-based navigation, profile icon, dynamic logo link
- `/src/app/donation/page.tsx` - Add "Apply for Donor" button for anonymous users
- `/src/app/register-ngo/page.tsx` - May need to integrate with new RECEIVER registration
- API routes structure - Extend for authentication

### New Components Needed
- **LoginModal.tsx** (✓ Implemented) - Modal component for unified login with registration link
- **RegistrationModal.tsx** (✓ Implemented) - Modal for DONOR registration
- **ForgotPasswordModal.tsx** - Password reset request form
- **MapComponent.tsx** - Location-based RECEIVER discovery for DONORs
- **Email Service Module** - Centralized email sending logic with Nodemailer
  - **EmailTemplates** - HTML templates for different email scenarios
  - **EmailService.ts** - SMTP configuration and email sending functions
- **Admin Dashboard Pages** (✓ Implemented):
  - `/admin/page.tsx` - Main dashboard with user management
  - `/admin/donors/page.tsx` - Dedicated DONOR management page
  - `/admin/receivers/page.tsx` - Dedicated RECEIVER management page
  - `/admin/donation-sessions/page.tsx` - Donation session tracking and management
- **UserProfile Components** - Profile management with field restrictions
  - **ProfileEditForm.tsx** - Main profile editing component
  - **PasswordChangeForm.tsx** - Password change functionality
  - **PhoneNumberRequest.tsx** - Phone number change request form
- **Donation Session Components**:
  - **SessionCreation.tsx** - Create new donation sessions
  - **SessionHistory.tsx** - View historical donation sessions
  - **SessionTracking.tsx** - Track sessions by unique ID
  - **DonorDashboard.tsx** - DONOR-specific session history and analytics
  - **ReceiverDashboard.tsx** - RECEIVER-specific donation history and analytics
- **PendingApprovalPage.tsx** - Status page for users awaiting approval

---

*Document created: October 11, 2025*
*Status: Requirements gathering phase*
