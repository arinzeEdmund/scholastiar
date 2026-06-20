# Documents And Storage

Status: Unified Platform Service

## Feature Vision

Documents And Storage manages the secure files used across Scholastiar.ai.

It should support CVs, generated documents, credentials, videos, employer assets, and application attachments with strict access control.

Core promise:

> User documents are organized, reusable, and protected.

## Problem Being Solved

Employment workflows require many files:

- CVs
- cover letters
- certificates
- transcripts
- IDs/passports
- work samples
- PersonalityAI CV videos
- Signia project videos, research, decks, and proof-of-work files
- employer logos
- job attachments

Without a secure document system, applications become fragmented and risky.

## Target Users

- candidates
- employers
- admins
- AI systems using approved documents

## Core Workflows

### Candidate Document Vault

Candidates upload, tag, preview, and attach documents.

### Generated Document Storage

AI-generated CVs, cover letters, and answers are versioned and stored.

### PersonalityAI CV Storage

Video uploads and transcripts are stored with visibility controls.

### Signia Proof Storage

Project videos, documents, decks, screenshots, research, certificates, and work samples are stored with candidate-controlled visibility and can be attached to Signia sections, skills, and projects.

### Employer Assets

Employers upload logos and company assets.

### Application Attachments

Documents are attached to specific applications with access scoped to relevant employers.

## AI Opportunities

- document classification
- metadata extraction
- missing document detection
- CV parsing
- duplicate detection
- scan quality warnings

## Data Model Notes

Core entities:

- documents
- document_versions
- document_tags
- document_access_grants
- storage_objects
- application_document_links
- video_assets
- document_audit_logs

## UX Direction

Document management should feel simple and reassuring.

Important UX:

- clear document types
- upload progress
- access visibility
- attached-to indicators
- revoke/delete controls

## Integrations

- Supabase Storage
- RLS
- AI CV generation
- applications
- PersonalityAI CV
- Signia
- employer profiles

## Risks And Constraints

- documents are sensitive
- storage policies must be strict
- employer access must be scoped to submitted applications
- service-role keys must never reach client
- deletion and access revocation need clear behavior

## Later Phase Decisions (Non-Blocking)

- Which document types are MVP?
- Should passport/ID uploads be allowed in V1?
- How long should deleted files be retained?

## Implementation Roadmap

### Phase 1

Build upload, tagging, application attachment, and basic access control.

### Phase 2

Add versioning, metadata extraction, and audit logs.

### Phase 3

Add AI document quality checks and advanced privacy controls.
