# HOTELYO - Privacy and Data Retention Policy

## 1. Statutory Context
Complies with the **Digital Personal Data Protection Act, 2023 (India)** and applicable Indian hospitality and taxation regulations.

## 2. Retention Schedules by Data Category

| Data Category | Retention Period | Deletion / Anonymization Mechanism | Legal Justification |
|---|---|---|---|
| **Identity Document Images (Aadhaar / Passport)** | 30 days post-stay completion | Automated S3 lifecycle rule purges files; database record marked `PURGED`. | Indian Hospitality Guest Verification & DPDP purpose limitation. |
| **Arrival OTP Challenges** | 24 hours | Automated deletion by background worker. | Ephemeral verification token. |
| **Tax Invoices & Credit Notes** | 8 years from end of financial year | Immutable append-only storage. Personal identifier anonymized upon erasure request. | Indian Income Tax & GST compliance (Section 36 GST Act). |
| **Guest Folios & Payment History** | 8 years | Immutable financial audit ledger. | Section 36 CGST Act & financial audit standards. |
| **Room Access Codes** | Revoked within 60 seconds; audit record retained 1 year | Code erased from active cache; revocation record archived. | Safety and security incident audit. |
| **SOS Alerts & Incident Reports** | 3 years | Retained with restricted staff access. | Workplace safety & guest protection audit. |
| **Session & Auth Logs** | 90 days | Rotated and archived to cold storage. | Security monitoring and breach investigation. |

## 3. Data Erasure & Subject Access Workflow
1. Guest triggers account deletion via Guest Portal account settings.
2. The system checks for active or upcoming reservations. If active/upcoming, deletion is deferred until checkout.
3. ID documents are purged from S3 immediately.
4. Name, email, and phone in `User` and `GuestProfile` are pseudonymized (`ANON-GUEST-{UUID}`).
5. Historical financial invoices retain legal business records without identifying personal marketing data.
