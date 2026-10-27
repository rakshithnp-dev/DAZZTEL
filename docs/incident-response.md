# HOTELYO - Security & Safety Incident Response Plan

## 1. Incident Severity Definitions
- **P1 (Critical):** SOS delivery failure, double-booking collision in production, data breach/unauthorized ID document exposure, payment gateway double-charge bug. Target response: < 15 minutes.
- **P2 (High):** Check-in OTP delivery degradation, front-desk dashboard offline, housekeeping queue synchronization stalled. Target response: < 1 hour.
- **P3 (Medium):** Minor UI defect, marketplace food order status sync delay. Target response: < 4 hours.
- **P4 (Low):** Minor copy or FAQ formatting bug. Target response: Next release sprint.

## 2. Emergency SOS Alert Escalation Runbook
1. **Trigger:** Guest presses emergency SOS button on mobile PWA.
2. **Immediate Alert (T = 0s):** System dispatches in-app push and high-priority SMS to on-duty front-desk staff. Target arrival: < 5 seconds.
3. **Escalation Timer (T = 120s):** If no on-duty staff member clicks `Acknowledge` within 2 minutes:
   - BullMQ escalation worker triggers automatic escalation.
   - High-priority automated SMS and phone notification dispatched to Property Manager and Escalation Contact.
   - Status updated to `ESCALATED`.
4. **Offline Fallback:** If device lacks connectivity, the PWA displays the direct national emergency number (112 in India) and property landline immediately.
