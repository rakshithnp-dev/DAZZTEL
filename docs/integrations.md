# HOTELYO - Third-Party Integrations Specification

## 1. Integration Landscape & Provider Adapters
All external service integrations are decoupled behind clean provider interfaces with local mock implementations for deterministic testing and CI.

```mermaid
flowchart LR
    API[HOTELYO Core API] --> IPAY[IPaymentGateway]
    API --> ISMS[ISmsProvider]
    API --> IEMAIL[IEmailProvider]
    API --> IPUSH[IPushProvider]
    API --> ISTORE[IStorageService]
    API --> IACCESS[IAccessCodeProvider]

    IPAY --> RZP[Razorpay / UPI Adapter]
    IPAY --> MOCK_PAY[Mock Gateway Adapter]

    ISMS --> TWILIO[SMS Gateway / MSG91]
    ISMS --> MOCK_SMS[Mock SMS Service]

    IEMAIL --> SES[AWS SES / Resend]
    IEMAIL --> MOCK_EMAIL[Mock Email Service]

    IPUSH --> FCM[Firebase Cloud Messaging]
    IPUSH --> MOCK_PUSH[Mock Push Service]

    ISTORE --> S3[AWS S3 / MinIO]
    ISTORE --> LOCAL_FS[Local Filesystem Storage]

    IACCESS --> KEYPAD[Digital Keypad / Manual Desk Fallback]
```

## 2. Integration Details

### A. Payment Gateway (Razorpay / UPI)
- **Adapter Interface:** `IPaymentGateway`
  - `createOrder(bookingId: string, amountPaise: number, currency: string)`
  - `verifyWebhookSignature(payload: string, signature: string): boolean`
  - `initiateRefund(paymentId: string, amountPaise: number, reason: string)`
- **Webhook Handling:** Verifies HMAC-SHA256 signature using `RAZORPAY_WEBHOOK_SECRET`. Handles `payment.captured`, `payment.failed`, `refund.processed`.

### B. SMS & OTP Dispatch
- **Adapter Interface:** `ISmsProvider`
  - `sendOtp(phone: string, otp: string): Promise<boolean>`
  - `sendBookingConfirmation(phone: string, ref: string, dates: string)`
  - `sendSosAlert(phone: string, alertDetails: object)`
- **Registered DLT Templates (India):** Configured for Indian Telecom DLT (Distributed Ledger Technology) template IDs.

### C. Web Push (Firebase Cloud Messaging - Option B)
- **Adapter Interface:** `IPushProvider`
  - `sendPushNotification(token: string, title: string, body: string, data?: object)`
  - Subscriptions persisted in `PushSubscription` table.

### D. Private Object Storage (S3 / MinIO)
- **Adapter Interface:** `IStorageService`
  - `getUploadSignedUrl(key: string, contentType: string, expiresSeconds: number)`
  - `getDownloadSignedUrl(key: string, expiresSeconds: number)`
