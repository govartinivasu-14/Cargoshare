# WD003 requirement assessment

The supplied project was not fully compliant: API failures silently became successful browser mocks; login role switches fabricated authentication; payment signatures had a bypass; provider inspection read the wrong endpoint; container/booking IDs and date formats did not match the backend; chat contacts were hard-coded and unsaved messages appeared sent; providers managed all visible listings; private booking/chat access needed enforcement.

| Requirement | Final implementation / status |
| --- | --- |
| Provider registration for road, rail, ship and air | Application and backend transport enums support ROAD, RAIL, SEA and AIR. Demo inventory includes all four. |
| Providers apply in app | Provider registration creates a pending application. |
| Approval based on inspection and data quality | Server requires both review attestations plus notes for approval; inspector and time are recorded. Actual inspection is a human process. |
| Trader self-registration without inspection | Immediate authenticated registration for importers/exporters. |
| Container-wise space shown to traders/providers | Shared marketplace with location, mode, schedule, CBM and price filters; own-fleet screen is separately scoped. |
| Select and book required space | Backend validates availability and deadlines and uses a database row lock to prevent overselling. |
| Online payment and gateway link | Per the updated user request: local dummy QR checkout, simulated payment success and persisted booking confirmation; no real gateway. |
| Trader-provider chat window | Persisted authenticated messages, booking participant checks, private WebSocket topics, reconnect and history refresh. |
| Real-time availability | Availability changes broadcast after database commit to container and marketplace subscriptions. |
| Secure payments | Dummy payment only: booking ownership, order binding and idempotent confirmation are enforced. No real money is processed. |
| Reliable communication | Server acknowledgment before displaying sent messages, persistent history and reconnection recovery. Single backend broker; multi-instance delivery is not configured. |

The local application implements the core workflows. Payment is intentionally simulated per the updated scope. Actual provider inspections remain a human process. Location matching is city/terminal text, not geolocation radius search.
