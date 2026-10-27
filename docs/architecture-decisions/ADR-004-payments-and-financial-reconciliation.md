# ADR-004: Payment Processing, Webhook Idempotency, and Financial Reconciliation

## Status
Accepted

## Context
Payment gateways in India (e.g. Razorpay, Cashfree, UPI) communicate via asynchronous webhooks and redirects. Webhooks may arrive out-of-order, be duplicated, or drop altogether if internet connectivity is unstable. Frontend redirects can never be trusted for authoritative confirmation.

## Decision
1. **Gateway Abstraction:** An adapter interface `IPaymentGateway` isolates gateway specifics. Razorpay is the primary implementation with a mock adapter for local testing and CI.
2. **Authoritative Webhook Verification:** A booking is only confirmed upon cryptographic signature verification of the webhook payload (`X-Razorpay-Signature`).
3. **Webhook Idempotency:** Every webhook payload carries a unique `eventId` stored in `PaymentWebhookEvent` with a unique index. Duplicate deliveries are logged, acknowledged with HTTP 200, and discarded without duplicate side-effects.
4. **Separation of Payment and Booking States:**
   - Booking State: `DRAFT`, `PAYMENT_PENDING`, `CONFIRMED`, `CHECKED_IN`, `COMPLETED`, `CANCELLED`, `NO_SHOW`.
   - Payment State: `INITIATED`, `PENDING`, `SUCCEEDED`, `FAILED`, `REFUNDED`, `PARTIALLY_REFUNDED`.
5. **Immutable Financial Invoicing:** Tax invoices (`TaxInvoice`) and folios (`GuestFolio`) use append-only line items. Adjustments are issued through credit notes (`CreditNote`) rather than mutating historical records.

## Consequences
- **Positive:** Compliant with Indian financial auditing standards and GST regulations; immune to duplicate charges or phantom confirmations.
- **Negative:** Slight delay (seconds) for webhook processing if webhook queues experience latency.
