# CargoShare — WD003 shared container space booking

React/Vite frontend and Java 25/Spring Boot backend for small exporters, importers, logistics providers and inspection administrators.

## Run locally

Requirements: Node.js 22.12+ (or a compatible newer Node), Java 25+, Maven 3.9+.

From this directory:

```sh
npm install
npm run dev
```

In a second terminal:

```sh
cd backend
mvn spring-boot:run
```

Open http://localhost:5173. The backend uses port 8081; Vite proxies `/api` and `/ws` to it. Port 8080 was already occupied in the supplied environment. Data persists in `backend/data/` when the backend starts from its own directory.

A tested executable backend JAR is included at `backend/target/cargoshare-backend-1.0.0.jar`. The launch scripts use it when present. Rebuild it with `mvn clean package` after backend code changes.

Windows: run `start-project.bat` to open both terminals. Linux/WSL: run `./start-project.sh`.

## Deploy the frontend to Vercel

This repository includes `vercel.json` for client-side route rewrites. Deploy the `HACKWAVE` directory as a Vercel project with `npm run build` as the build command and `dist` as the output directory. Configure these Vercel environment variables:

```text
VITE_API_BASE_URL=https://your-public-backend.example.com/api
VITE_WS_URL=https://your-public-backend.example.com/ws
BACKEND_URL=https://your-public-backend.example.com
```

The Vercel `api/[...path].js` function forwards HTTP API requests to `BACKEND_URL`, including trader/provider registration and login. The Spring Boot backend must run separately on a service that supports Java and WebSockets. Configure its CORS allowed origins with the deployed Vercel URL, set `JWT_SECRET` to a private value, and use `SEED_DEMO=false` for a non-demo deployment.

## Demo accounts

All four seeded accounts use `password123`:

| Role | Email |
| --- | --- |
| Trader | trader@cargoshare.com |
| Approved provider | provider@cargoshare.com |
| Pending provider | vanguard@applicant.com |
| Administrator | admin@cargoshare.com |

Enter these credentials on the login page. Seeded bookings and payments are example records, not actual financial transactions.

## Demonstration flow

1. Self-register an importer or exporter, or log in as the demo trader.
2. Search available space by origin (nearby city/terminal), destination, transport mode, departure date and volume. Sea, rail, road and air are supported.
3. Reserve a positive CBM quantity. The backend locks the container while allocating space, preventing concurrent overbooking.
4. Generate a demo QR and complete the dummy payment, or cancel the unpaid reservation.
5. Open Chat to send persisted messages to the provider for your booking. The provider sees its traders and can reply. Private authenticated WebSocket subscriptions deliver updates; history refresh recovers missed chat messages.
6. Apply as a provider. An administrator opens Applications, records inspection and data-quality checks, adds inspection notes and approves or rejects. Only approved providers can publish/update availability.
7. Providers use Browse all container space for the shared marketplace and My Containers for their own fleet.

## Dummy QR payments

No payment credentials or real gateway are needed. Click Pay to generate a booking-specific QR code, then click **Complete payment**. The backend records a simulated successful payment and confirms the booking. Scanning the QR displays a demo reference; it cannot transfer money. Cancelling an unpaid demo reservation releases its space. Repeated completion requests do not create duplicate payments.

Log in through the login page; the header test-role switcher has been removed.

## Verification

```sh
npm run build
npm run lint
cd backend
mvn test
```

Tests cover concurrent capacity allocation, registration, inspection requirements, booking ownership, unauthorized payment access, private chat persistence, cancellation, invalid capacity, password exclusion and demo order validation and idempotent completion.

## Deployment limits

This is a local runnable project, not a completed production deployment. Use HTTPS, a private `JWT_SECRET` of at least 32 characters, restricted origins and a production database before public use. Set `SEED_DEMO=false`, remove existing demo accounts . MySQL configuration is available under `backend/src/main/resources/application-mysql.yml` and needs deployment-specific settings.

Nearby discovery currently means searching by origin city/terminal; it does not calculate GPS distance. Inspections are performed outside the app and recorded by the administrator. Reservations are held until paid or cancelled; unpaid demo reservations can be cancelled even after generating a QR. Automated reservation expiry, multi-instance message delivery remain production enhancements.

See REQUIREMENTS-AUDIT.md for the requirement assessment.
