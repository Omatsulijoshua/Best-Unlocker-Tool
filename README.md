# Best Unlocker Tool

Professional legal password recovery assistance platform with website-only signup, admin approval, manual payment verification, licenses, device binding, and app login enforcement.

## Safety scope

This tool only supports recovery for accounts, devices, servers, or systems the user legally owns or administers. It does not provide bypass, exploit, brute-force, spyware, credential theft, or unauthorized access features.

## Requirements covered

- Website registration only; desktop/mobile app login has no registration flow.
- New users are `PENDING` by default and must be approved by an admin.
- Payments are `PENDING` until an admin approves them.
- Admin payment approval activates a license with plan, start date, and expiry date.
- App login checks user existence, email verification, admin approval, payment approval, active license, and linked device.
- One active PC/device per account. Admin can reset the linked device.
- JWT access/refresh tokens, bcrypt password hashing, login rate limiting, sessions, activity logs, and admin action logs.
- App screen warns after 4 minutes of inactivity and locks after 5 minutes.
- Device/chipset catalog for safe MTK, SPD/Unisoc, and Snapdragon support notes, model aliases, official recovery paths, and service handoff guidance.
- Automatic phone service mode with a broom button, USB metadata detection where available, and safe owner-confirmed options.

## Local setup

Use Node.js 20+ and pnpm.

1. Install dependencies:

```bash
pnpm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Update `DATABASE_URL` for PostgreSQL, then run Prisma:

```bash
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed
```

4. Start the app:

```bash
pnpm dev
```

Demo admin defaults are controlled by `ADMIN_EMAIL` and `ADMIN_PASSWORD`.

## Website and Windows EXE

This repository now supports both:

- Website: Next.js app for signup, payments, admin approval, guides, dashboard, and API.
- Windows desktop app: Electron shell that loads the licensed app experience and can be packaged as an `.exe`.

Development:

```bash
pnpm dev:all
```

Build website only:

```bash
pnpm build:web
```

Build Windows installer and portable executable:

```bash
pnpm dist
```

Set `NEXT_PUBLIC_WEB_APP_URL` or `DESKTOP_APP_URL` to the deployed website URL before packaging a production desktop app. The desktop app keeps registration/payment on the website and uses the same backend license checks.

## App login contract

Desktop/mobile clients should call `POST /api/app/login` with:

```json
{
  "email": "user@example.com",
  "password": "password",
  "deviceId": "stable-device-id",
  "fingerprint": {
    "platform": "Windows",
    "timezone": "Africa/Lagos"
  }
}
```

If another active device is linked, the API returns:

`This account is already active on another device. Contact admin to reset device.`

## Device support scope

The `/devices` section supports MTK, SPD/Unisoc, and Snapdragon devices as a legal recovery knowledge base and model catalog. It can store brand/model aliases, chipset family, safe modes, official notes, and risk warnings.

It intentionally excludes FRP bypass, exploit loaders, unauthorized lock removal, private-key extraction, EDL exploitation, brute force, or credential theft.

## Automatic mode

The `/auto-mode` screen lets a licensed user connect a phone and press the broom button. In browsers with WebUSB support, it captures basic USB metadata and builds a safe service plan.

Available safe options:

- View device details: manufacturer, product, inferred CPU/chipset family, USB IDs, supported modes, storage-read requirements, and safe operations.
- FRP recovery: official Google/OEM account recovery and support escalation only.
- Factory reset: owner-confirmed reset preparation with backup and data-loss warnings.
- Reboot recovery: guidance or bridge-ready workflow for authorized recovery reboot.
- Reboot bootloader: guidance or bridge-ready workflow for authorized fastboot/bootloader reboot.

Native ADB/fastboot execution should be handled by a signed desktop bridge that revalidates the server license and ownership confirmation before running any allowed command.

The Electron files are in `electron/`. `native-device-bridge.cjs` is intentionally a safe stub. It is the integration point for future native diagnostics and must not add bypass, exploit, or unauthorized account-removal behavior.

## GitHub deployment checklist

Before deploying or packaging:

- Set production `DATABASE_URL`, `JWT_SECRET`, and `REFRESH_TOKEN_SECRET`.
- Run `pnpm prisma:generate`.
- Run `pnpm prisma:migrate`.
- Run `pnpm prisma:seed` to create plans, guides, device catalog entries, and the demo admin.
- Build the website with `pnpm build:web`.
- Build the Windows executable with `pnpm build:desktop` or `pnpm dist`.

Never commit `.env`, database dumps, desktop signing keys, payment secrets, or private support-ticket files.
