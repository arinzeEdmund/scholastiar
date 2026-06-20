# Migration Agencies Pages

Status: Unified Platform Service

Source service spec: `SERVICES/12-migration-agencies.md`

## Page System Vision

Migration Agencies pages should support a trusted office and agency service layer.

The system should help users:

> Find a trusted office -> view services and prices -> book appointment or submit inquiry -> upload documents -> meet consultant -> receive follow-up and case tracking.

The system should help offices and admins:

> Manage services -> appointments -> consultants -> customer case files -> payments -> reviews -> complaints -> partner verification.

## Public Discovery Pages

### Migration Agencies Home Page

Route: `/migration-agencies`

Purpose: Entry point for trusted office and agency support.

Key sections:

- search by country/city
- Scholastiar office highlights
- service category shortcuts
- partner agency note
- popular services
- appointment CTA
- inquiry CTA

Primary actions:

- find office
- browse services
- book appointment
- submit inquiry

### Office Directory Page

Route: `/migration-agencies/offices`

Purpose: Browse offices and verified agencies.

Filters:

- country
- city
- office type
- service category
- language spoken
- appointment availability
- online/office visit
- Scholastiar-owned vs partner agency
- verified status

Primary actions:

- open office profile
- view services
- book appointment
- submit inquiry

### Office Profile Page

Route: `/migration-agencies/offices/[officeSlug]`

Purpose: Show rich trust-focused office/agency details.

Sections:

- office name
- Scholastiar-owned or partner agency badge
- verified status
- address/map
- opening hours
- phone/email/WhatsApp
- languages spoken
- service categories
- price list
- consultants
- appointment availability
- reviews/ratings
- office photos
- license/registration information
- refund/cancellation policy

Primary actions:

- book service
- submit inquiry
- message office
- view consultants
- report issue

### Service Detail Page

Route: `/migration-agencies/services/[serviceId]`

Purpose: Explain one office service and its price.

Sections:

- service name
- description
- price
- duration
- country covered
- appointment type
- required documents
- online/office visit availability
- refundability
- expected response time
- consultant type
- disclaimers

Primary actions:

- book service
- ask question
- upload documents

## Customer Pages

### Booking Flow Page

Route: `/migration-agencies/book/[serviceId]`

Purpose: Book a service appointment.

Flow:

- confirm office/service
- choose appointment type
- choose date/time
- choose consultant if available
- upload documents if needed
- enter questions/notes
- pay or reserve
- confirm booking

Primary actions:

- book appointment
- save draft
- pay
- upload document

### Inquiry Form Page

Route: `/migration-agencies/inquiries/new`

Purpose: Let users ask for help when they do not know which service they need.

Inputs:

- target country
- purpose of travel
- current situation
- documents available
- preferred office/city
- preferred language
- urgency
- question/details

Primary actions:

- submit inquiry
- attach documents
- request recommended service

### Customer Services Dashboard

Route: `/migration-agencies/dashboard`

Purpose: User dashboard for agency services.

Sections:

- upcoming appointments
- submitted inquiries
- agency responses
- documents requested
- payments
- receipts
- assigned consultant
- case timeline
- follow-up messages
- completed services

Primary actions:

- open booking
- upload document
- message consultant
- view receipt
- submit review

### Booking Detail Page

Route: `/migration-agencies/bookings/[bookingId]`

Purpose: Full view of one appointment/service booking.

Sections:

- service details
- office details
- consultant
- appointment time
- uploaded documents
- requested documents
- payment/receipt
- status
- messages
- follow-up checklist

Primary actions:

- reschedule
- cancel
- upload document
- message consultant
- view receipt
- leave review

### Document Pre-Check Page

Route: `/migration-agencies/bookings/[bookingId]/documents`

Purpose: Upload and review documents before appointment.

Sections:

- uploaded documents
- missing documents
- documents needing translation
- documents needing legalization
- documents to bring physically
- consultant notes

Primary actions:

- upload document
- replace document
- request translation
- mark as bringing physically

### Customer Messages Page

Route: `/migration-agencies/messages`

Purpose: Communicate with offices and consultants inside Scholastiar.ai.

Primary actions:

- send message
- attach document
- respond to consultant
- open booking

### Reviews And Complaints Page

Route: `/migration-agencies/reviews`

Purpose: Let users submit reviews or complaints.

Primary actions:

- leave review
- report issue
- open complaint
- view complaint status

## Consultant And Office Pages

### Office Dashboard

Route: `/office/dashboard`

Purpose: Office operations home for Scholastiar offices and partner agencies.

Key sections:

- today's appointments
- incoming inquiries
- pending document reviews
- assigned consultants
- service bookings
- payments
- reviews
- complaint alerts

Primary actions:

- open appointment
- respond to inquiry
- assign consultant
- review documents
- update service status

### Office Appointment Calendar

Route: `/office/calendar`

Purpose: Manage appointments and availability.

Primary actions:

- view schedule
- reschedule appointment
- block time
- assign consultant
- mark attended/no-show

### Office Inquiry Inbox

Route: `/office/inquiries`

Purpose: Review incoming user inquiries.

Primary actions:

- respond with recommended service
- send price quote
- request documents
- assign consultant
- convert inquiry to booking

### Office Booking Detail Page

Route: `/office/bookings/[bookingId]`

Purpose: Manage one customer appointment/service.

Sections:

- customer details
- service
- documents
- consultant assignment
- messages
- payment status
- follow-up tasks
- appointment notes

Primary actions:

- update status
- add consultant note
- request document
- send follow-up
- mark completed

### Office Document Review Workspace

Route: `/office/bookings/[bookingId]/documents`

Purpose: Review customer documents before appointment.

Primary actions:

- mark document accepted
- mark document missing
- mark needs translation
- mark needs legalization
- add note

### Service Management Page

Route: `/office/services`

Purpose: Manage listed services and prices.

Primary actions:

- add service
- edit price
- set duration
- set required documents
- pause service
- submit service for admin approval

### Consultant Management Page

Route: `/office/consultants`

Purpose: Manage consultant profiles, languages, specialties, and availability.

Primary actions:

- add consultant
- edit profile
- set availability
- assign services
- deactivate consultant

### Consultant Profile Page

Route: `/migration-agencies/consultants/[consultantId]`

Purpose: Public or semi-public consultant profile.

Sections:

- name
- office
- languages
- countries supported
- specialties
- experience level
- availability
- rating
- verified status

Primary actions:

- book consultant
- view services

## Partner Agency Pages

### Partner Agency Onboarding Page

Route: `/migration-agencies/partners/onboarding`

Purpose: Let third-party agencies apply for verification.

Steps:

- business information
- owner/manager identity
- license/registration upload
- office address
- services/pricing
- complaint history declaration
- standards agreement

Primary actions:

- submit application
- upload documents
- save draft

### Partner Agency Dashboard

Route: `/partner-agency/dashboard`

Purpose: Partner agency operations dashboard.

Sections:

- verification status
- bookings
- inquiries
- services
- consultants
- payments
- reviews
- complaints

Primary actions:

- manage bookings
- respond to inquiries
- update services
- view verification notes

## Payments And Support Pages

### Payments And Receipts Page

Route: `/migration-agencies/payments`

Purpose: User payment and receipt dashboard for office services.

Primary actions:

- view receipt
- pay balance
- request refund
- download invoice

### Complaint Detail Page

Route: `/migration-agencies/complaints/[complaintId]`

Purpose: Track complaint handling.

Sections:

- booking/service
- complaint details
- evidence
- office response
- admin status
- resolution

Primary actions:

- add evidence
- respond
- accept resolution

## Admin And Operations Pages

### Admin Migration Agencies Dashboard

Route: `/admin/migration-agencies`

Purpose: Operations overview.

Key sections:

- offices
- partner agencies
- bookings
- inquiries
- payments
- reviews
- complaints
- verification tasks
- service approval queue

Primary actions:

- add office
- verify partner
- review complaint
- inspect booking

### Admin Office Management Page

Route: `/admin/migration-agencies/offices`

Purpose: Manage Scholastiar offices and partner agencies.

Primary actions:

- add office
- edit office
- mark verified
- suspend office
- manage services

### Admin Office Detail Page

Route: `/admin/migration-agencies/offices/[officeId]`

Purpose: Inspect one office or agency.

Sections:

- profile
- verification
- services
- consultants
- bookings
- reviews
- complaints
- payments
- audit logs

Primary actions:

- edit
- verify
- suspend
- approve services
- inspect complaints

### Admin Partner Verification Page

Route: `/admin/migration-agencies/partners/verification`

Purpose: Review third-party partner agency applications.

Primary actions:

- approve partner
- reject partner
- request more documents
- schedule re-verification

### Admin Service Pricing Review Page

Route: `/admin/migration-agencies/services`

Purpose: Review service listings and prices.

Primary actions:

- approve service
- reject service
- flag hidden-fee risk
- request edits

### Admin Complaints Console

Route: `/admin/migration-agencies/complaints`

Purpose: Review complaints and service issues.

Primary actions:

- assign reviewer
- request office response
- issue refund
- warn office
- suspend partner
- close complaint

### Admin Consultant Management Page

Route: `/admin/migration-agencies/consultants`

Purpose: Manage consultant profiles and verification.

Primary actions:

- approve consultant
- edit consultant
- suspend consultant
- assign to office

### Admin Audit Logs Page

Route: `/admin/migration-agencies/audit`

Purpose: Track office, consultant, booking, document, and admin actions.

Primary actions:

- filter by office
- filter by consultant
- filter by booking
- inspect document access

## Suggested MVP Page Set

For the first Migration Agencies MVP, start with Scholastiar-owned offices only:

- `/migration-agencies`
- `/migration-agencies/offices`
- `/migration-agencies/offices/[officeSlug]`
- `/migration-agencies/services/[serviceId]`
- `/migration-agencies/book/[serviceId]`
- `/migration-agencies/inquiries/new`
- `/migration-agencies/dashboard`
- `/migration-agencies/bookings/[bookingId]`
- `/migration-agencies/bookings/[bookingId]/documents`
- `/migration-agencies/messages`
- `/office/dashboard`
- `/office/calendar`
- `/office/inquiries`
- `/office/bookings/[bookingId]`
- `/office/bookings/[bookingId]/documents`
- `/office/services`
- `/office/consultants`
- `/admin/migration-agencies`
- `/admin/migration-agencies/offices`
- `/admin/migration-agencies/offices/[officeId]`

This creates the trusted office booking and service operations loop before adding partner agencies.

## Page Priority

### MVP Priority

- Migration Agencies Home Page
- Office Directory Page
- Office Profile Page
- Service Detail Page
- Booking Flow Page
- Inquiry Form Page
- Customer Services Dashboard
- Booking Detail Page
- Document Pre-Check Page
- Customer Messages Page
- Office Dashboard
- Office Appointment Calendar
- Office Inquiry Inbox
- Office Booking Detail Page
- Office Document Review Workspace
- Service Management Page
- Consultant Management Page
- Admin Migration Agencies Dashboard
- Admin Office Management Page
- Admin Office Detail Page

### Phase 2 Priority

- Consultant Profile Page
- Reviews And Complaints Page
- Payments And Receipts Page
- Complaint Detail Page
- Admin Service Pricing Review Page
- Admin Complaints Console
- Admin Consultant Management Page
- Admin Audit Logs Page

### Phase 3 Priority

- Partner Agency Onboarding Page
- Partner Agency Dashboard
- Admin Partner Verification Page
- partner re-verification workflows
- cross-platform appointment recommendations
