# Validation results

Validated locally on 24 September 2026.

- Backend: `mvn test package` passed all 3 test classes with zero failures/errors. The workflow test exercises multiple API scenarios; the other classes cover concurrent booking and demo order validation and repeat completion.
- Frontend: production build passes. Vite reports a bundle-size warning.
- Lint: completes without errors; existing unused-import and React warnings remain.
- Browser: Chromium exercised real trader login, marketplace, booking, demo checkout, chat send and persistence after reload, provider fleet/bookings/chat, and admin dashboard/applications/inspection/users/payments. No JavaScript page errors occurred.
- Real-time integration: authenticated cross-user STOMP message delivery passed; an administrator unrelated to the thread was rejected from its private topic. Reproduce with `node scripts/check-realtime.cjs` while the backend is running.
- HTTP: frontend on port 5173 and proxied backend on port 8081 respond successfully.
- Payments are intentionally simulated; no merchant credentials or real gateway are used.

The backend was built in a temporary Linux directory for faster filesystem access; its source was compared against the project copy, and the resulting executable JAR and test reports were copied to `backend/target/`.
