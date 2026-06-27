import { LicenseStatus, PaymentStatus, UserStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { sha256 } from "@/lib/security";

export async function validateAppAccess(input: {
  email: string;
  passwordValid: boolean;
  deviceId: string;
}) {
  const user = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
    include: {
      licenses: { include: { plan: true }, orderBy: { expiresAt: "desc" }, take: 1 },
      payments: { orderBy: { createdAt: "desc" }, take: 1 },
      devices: true
    }
  });

  if (!user || !input.passwordValid) {
    return { ok: false as const, code: "INVALID_CREDENTIALS", message: "Invalid email or password." };
  }
  if (!user.emailVerifiedAt) {
    return { ok: false as const, code: "EMAIL_NOT_VERIFIED", message: "Email must be verified before app access." };
  }
  if (user.status === UserStatus.BLOCKED) {
    return { ok: false as const, code: "ACCOUNT_BLOCKED", message: "Your account is blocked. Contact support." };
  }
  if (user.status !== UserStatus.APPROVED) {
    return { ok: false as const, code: "USER_NOT_APPROVED", message: "Your account is pending admin approval." };
  }

  const latestPayment = user.payments[0];
  if (!latestPayment || latestPayment.status !== PaymentStatus.APPROVED) {
    return { ok: false as const, code: "PAYMENT_NOT_APPROVED", message: "Payment is pending admin approval." };
  }

  const license = user.licenses[0];
  const now = new Date();
  if (!license || license.status !== LicenseStatus.ACTIVE || !license.expiresAt || license.expiresAt <= now) {
    return { ok: false as const, code: "LICENSE_INACTIVE", message: "No active subscription license was found." };
  }

  const deviceIdHash = await sha256(input.deviceId);
  const activeDevice = user.devices.find((device) => device.active);
  if (activeDevice && activeDevice.deviceIdHash !== deviceIdHash) {
    return {
      ok: false as const,
      code: "DEVICE_LOCKED",
      message: "This account is already active on another device. Contact admin to reset device."
    };
  }

  return { ok: true as const, user, license, deviceIdHash };
}
