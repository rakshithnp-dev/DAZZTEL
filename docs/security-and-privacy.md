# HOTELYO - Security and Privacy Specification

## 1. Security Compliance & Standards
HOTELYO is architected to satisfy **OWASP ASVS Level 2** and mitigate all **OWASP Top 10 (2021)** security risks.

### A. Authentication & Credential Storage
- **Passwords:** Hashed with Argon2id using recommended OWASP parameters (minimum memory cost: 64 MB, time cost: 3 iterations).
- **Session Tokens:**
  - Access Token: 15-minute validity, RS256 or HS256 JWT, signed with rotating key.
  - Refresh Token: 7-day validity, persisted as cryptographic hash in `Session` table, with immediate revocation on family reuse.
- **Cookies:** When transmitted in browser cookies: `HttpOnly`, `Secure`, `SameSite=Strict`.

### B. Arrival OTP Cryptography
- 6-digit numeric OTP generated via cryptographically secure pseudo-random number generator (`crypto.randomInt(100000, 1000000)`).
- **Storage:** Plaintext OTP is **never** stored in the database or written to server logs. Only an HMAC-SHA256 keyed hash (`crypto.createHmac('sha256', OTP_SECRET).update(otp).digest('hex')`) is persisted.
- **Controls:**
  - Expiry: 15 minutes.
  - Attempt limit: Maximum 5 invalid attempts before challenge is permanently locked.
  - Resend cooldown: 30 seconds minimum between SMS/Email dispatch requests.
  - Daily cap: Maximum 5 OTP generations per stay per day.

### C. Identity Document Privacy & Encryption
- Uploaded government identity documents (Aadhaar / Passport / DL / Voter ID) are saved in private object storage (S3).
- Direct public access is blocked. Authorized staff access files exclusively via short-lived pre-signed URLs (validity: 5 minutes).
- Sensitive metadata (e.g. ID numbers) is encrypted at rest using AES-256-GCM (`AES_256_DOCUMENT_ENCRYPTION_KEY`).

### D. Compliance with India's Digital Personal Data Protection Act (DPDP)
1. **Explicit Consent:** Guests consent to ID verification and communication preferences at pre-check-in.
2. **Right to Erasure & Export:** Guests can request personal data export or deletion.
3. **Data Retention Exemption:** Financial records (Tax Invoices, Folios) and access audit trails are retained for the legally mandated statutory period (8 years under Indian tax laws) in an anonymized state if personal data deletion is requested.
